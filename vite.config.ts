// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // IMPORTANT: this project is deployed on Vercel (per project stack), but the
  // shared Lovable config defaults Nitro's build target to "cloudflare-module"
  // (it only falls back to that default when no preset is set — confirmed by
  // `npx vite build` emitting .output/server/wrangler.json). Vercel cannot run
  // a Cloudflare Workers bundle, which is why production showed
  // "This page didn't load" — the deployed artifact was the wrong shape for
  // the host. Setting an explicit preset here makes Nitro emit Vercel's
  // Build Output API v3 format (.vercel/output) instead.
  nitro: {
    preset: "vercel",
  },
});