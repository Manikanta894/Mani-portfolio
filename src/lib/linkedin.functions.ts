import { createServerFn } from "@tanstack/react-start";

export type LinkedInProfile = {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  locale?: { country?: string; language?: string };
};

export type LinkedInResult =
  | { ok: true; profile: LinkedInProfile; fetchedAt: string }
  | { ok: false; error: string };

export type LinkedInPost = {
  id: string;
  text: string;
  createdAt: number | null;
  permalink: string;
};

export type LinkedInPostsResult =
  | { ok: true; posts: LinkedInPost[]; fetchedAt: string }
  | {
      ok: false;
      reason: "not_configured" | "partner_access_required" | "unknown";
      error: string;
    };

const GATEWAY = "https://connector-gateway.lovable.dev/linkedin";
// LinkedIn rolls versions monthly; this is the version we send for /rest calls.
// If it goes stale the API responds 426 NONEXISTENT_VERSION — bump this constant.
const LINKEDIN_VERSION = "202509";

function gatewayHeaders(lovableKey: string, linkedInKey: string, withVersion = false) {
  const h: Record<string, string> = {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": linkedInKey,
  };
  if (withVersion) {
    h["LinkedIn-Version"] = LINKEDIN_VERSION;
    h["X-Restli-Protocol-Version"] = "2.0.0";
  }
  return h;
}

export const getLinkedInProfile = createServerFn({ method: "GET" }).handler(
  async (): Promise<LinkedInResult> => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const linkedInKey = process.env.LINKEDIN_API_KEY;
    if (!lovableKey || !linkedInKey) {
      return { ok: false, error: "LinkedIn connector is not configured." };
    }

    try {
      const res = await fetch(`${GATEWAY}/v2/userinfo`, {
        headers: gatewayHeaders(lovableKey, linkedInKey),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        return {
          ok: false,
          error: `LinkedIn API ${res.status}: ${body.slice(0, 200)}`,
        };
      }
      const profile = (await res.json()) as LinkedInProfile;
      return { ok: true, profile, fetchedAt: new Date().toISOString() };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  },
);

/**
 * Fetch the connected member's own posts.
 *
 * Reading posts authored by a member requires LinkedIn's Community Management
 * API, which is gated by the LinkedIn Partner Program — the standard
 * `w_member_social` scope only authorizes *publishing*. Until partner access
 * is granted the gateway returns 403 ACCESS_DENIED; we surface that
 * explicitly so the UI can be honest instead of faking content.
 */
export const getLinkedInPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<LinkedInPostsResult> => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const linkedInKey = process.env.LINKEDIN_API_KEY;
    if (!lovableKey || !linkedInKey) {
      return {
        ok: false,
        reason: "not_configured",
        error: "LinkedIn connector is not configured.",
      };
    }

    // Resolve the author URN from /v2/userinfo (sub == member id).
    let sub: string;
    try {
      const me = await fetch(`${GATEWAY}/v2/userinfo`, {
        headers: gatewayHeaders(lovableKey, linkedInKey),
      });
      if (!me.ok) {
        const body = await me.text().catch(() => "");
        return {
          ok: false,
          reason: "unknown",
          error: `userinfo ${me.status}: ${body.slice(0, 200)}`,
        };
      }
      sub = ((await me.json()) as LinkedInProfile).sub;
    } catch (err) {
      return {
        ok: false,
        reason: "unknown",
        error: err instanceof Error ? err.message : "userinfo failed",
      };
    }

    const authorUrn = `urn:li:person:${sub}`;
    const url =
      `${GATEWAY}/rest/posts?q=author` +
      `&author=${encodeURIComponent(authorUrn)}&count=10&sortBy=LAST_MODIFIED`;

    try {
      const res = await fetch(url, {
        headers: gatewayHeaders(lovableKey, linkedInKey, true),
      });

      if (res.status === 403) {
        return {
          ok: false,
          reason: "partner_access_required",
          error:
            "Reading LinkedIn posts requires the Community Management API (LinkedIn Partner Program). The granted w_member_social scope only allows publishing.",
        };
      }

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        return {
          ok: false,
          reason: "unknown",
          error: `posts ${res.status}: ${body.slice(0, 200)}`,
        };
      }

      const json = (await res.json()) as {
        elements?: Array<{
          id: string;
          commentary?: string;
          createdAt?: number;
          publishedAt?: number;
        }>;
      };

      const posts: LinkedInPost[] = (json.elements ?? []).map((el) => ({
        id: el.id,
        text: (el.commentary ?? "").trim(),
        createdAt: el.publishedAt ?? el.createdAt ?? null,
        permalink: `https://www.linkedin.com/feed/update/${encodeURIComponent(el.id)}/`,
      }));

      return { ok: true, posts, fetchedAt: new Date().toISOString() };
    } catch (err) {
      return {
        ok: false,
        reason: "unknown",
        error: err instanceof Error ? err.message : "posts fetch failed",
      };
    }
  },
);
