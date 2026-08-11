import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import faviconNewDark from "../assets/favicon-light.svg";
import faviconNewLight from "../assets/favicon-dark.svg";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Manikanta R | MBA Candidate | Business Analytics | AI Research | Portfolio" },
      { name: "description", content: "Official portfolio of Manikanta R, MBA candidate specializing in Business Analytics, AI Research, Human Resources, Research Publications, and Data Analytics. Based in Bengaluru, India." },
      { name: "keywords", content: "Manikanta R, Business Analytics, HR Analytics, AI Research, MBA Bangalore, Research Papers, Data Analytics, SQL, Power BI, Python" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Manikanta R | MBA · Business Analytics · AI Research" },
      { property: "og:description", content: "Official portfolio of Manikanta R — MBA candidate in HR & Business Analytics. Research, projects, certifications." },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "https://manikantar.in" },
      { property: "og:image", content: "https://manikantar.in/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Manikanta R | MBA · Business Analytics · AI Research" },
      { name: "twitter:description", content: "Official portfolio. MBA candidate in HR & Business Analytics. Research, projects, certifications." },
      { name: "twitter:image", content: "https://manikantar.in/og-image.jpg" },
      { name: "twitter:description", content: "Official portfolio. MBA candidate in HR & Business Analytics." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: faviconNewDark, media: "(prefers-color-scheme: light)" },
      { rel: "icon", type: "image/svg+xml", href: faviconNewLight, media: "(prefers-color-scheme: dark)" },
      { rel: "canonical", href: "https://manikantar.in" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([{ "@context":"https://schema.org","@type":"Person","name":"Manikanta R","url":"https://manikantar.in","jobTitle":"MBA Candidate - HR & Business Analytics","knowsAbout":["HR Analytics","Business Analytics","AI Research","People Analytics","Data Analytics","SQL","Power BI","Python"],"sameAs":["https://www.linkedin.com/in/manikanta894/","https://github.com/Manikanta894/Manikanta894","https://orcid.org/0009-0005-2576-8731"]},{ "@context":"https://schema.org","@type":"WebSite","name":"Manikanta R Portfolio","url":"https://manikantar.in" }]) }} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BLJJFPF9F7" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-BLJJFPF9F7');` }} />
      </head>

      <body>
        {children}
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}