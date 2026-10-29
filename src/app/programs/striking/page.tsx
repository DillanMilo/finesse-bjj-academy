import { pageMetadata, staticPages } from "@/lib/seo";
import StrikingProgram from "@/components/sections/StrikingProgram";

const seoPage = staticPages.find(([path]) => path === "/programs/striking")!;
export const metadata = pageMetadata(seoPage[0], seoPage[1], seoPage[2]);

export default function StrikingPage() {
  return <StrikingProgram />;
}
