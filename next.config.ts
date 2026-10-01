import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { randomUUID } from "node:crypto";

// Local browser previews can cache dev chunks whose filenames stay unchanged.
// Give each dev-server session fresh asset URLs to keep HTML and JS in sync.
const localPreviewId = `local-${randomUUID()}`;

export default function nextConfig(phase: string): NextConfig {
  return phase === PHASE_DEVELOPMENT_SERVER
    ? { deploymentId: localPreviewId }
    : {};
}
