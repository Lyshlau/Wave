import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexProvider({ children }: { children: ReactNode }) {
  if (!convexClient) {
    return <>{children}</>;
  }
  return (
    <BaseConvexProvider client={convexClient}>{children}</BaseConvexProvider>
  );
}
