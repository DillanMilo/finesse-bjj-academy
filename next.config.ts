import legacyRedirects from "./src/lib/legacy-redirects.json";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { randomUUID } from "node:crypto";

// Local browser previews can cache dev chunks whose filenames stay unchanged.
// Give each dev-server session fresh asset URLs to keep HTML and JS in sync.
const localPreviewId = `local-${randomUUID()}`;

export default function nextConfig(phase: string): NextConfig {
  return {
    ...(phase === PHASE_DEVELOPMENT_SERVER ? { deploymentId: localPreviewId } : {}),
    async redirects() {
      return [
        ...legacyRedirects,
        { source: "/contact-us", destination: "/contact", permanent: true },
        { source: "/adults-brazilian-jiu-jitsu-spring", destination: "/programs/adult-bjj", permanent: true },
        { source: "/kids-brazilian-jiu-jitsu-spring", destination: "/programs/kids-bjj", permanent: true },
        { source: "/wrestling-jiu-jitsu-spring", destination: "/programs/wrestling", permanent: true },
        { source: "/services", destination: "/#programs", permanent: true },
        { source: "/our-team", destination: "/about", permanent: true },
      ];
    },
  };
}
