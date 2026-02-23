import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import "~/lib/i18n";
import "~/styles/app.css";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "HistoryMap – Interactive Historical World Map",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-stone-950 text-stone-100 overflow-hidden">
        <QueryClientProvider client={queryClient}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen text-stone-400">
                Loading…
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
