import { createFileRoute } from "@tanstack/react-router";

// Public proxy for the LinkedIn feed the frontend polls at
// /api/public/linkedin-feed. Forwards to the Express + Supabase backend
// (single source of truth: the `linkedin_feed` table) and degrades to a
// harmless empty payload if the backend is unreachable, instead of
// throwing during SSR.
//
// NOTE: this MUST use createFileRoute(...).server.handlers.GET - the same
// convention as ../journal.ts. An earlier version of this file used
// createAPIFileRoute from "@tanstack/react-start/api", which does not
// exist in the installed @tanstack/react-start version. That made the
// router's file-based codegen silently drop this route entirely (it never
// appeared in routeTree.gen.ts), so every request to
// /api/public/linkedin-feed 404'd and the LinkedIn chapter never received
// live data.
const API_BASE = process.env.VITE_API_URL || "http://localhost:5000/api";

async function fetchFeed() {
  try {
    const res = await fetch(`${API_BASE}/linkedin-feed`, {
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/public/linkedin-feed")({
  server: {
    handlers: {
      GET: async () => {
        const data = await fetchFeed();
        return Response.json(
          { success: true, data },
          {
            headers: {
              "cache-control": "public, max-age=60, stale-while-revalidate=600",
            },
          },
        );
      },
    },
  },
});
