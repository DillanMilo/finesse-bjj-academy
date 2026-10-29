import { pageMetadata, staticPages } from "@/lib/seo";
import ProgramDetail from "@/components/sections/ProgramDetail";

const seoPage = staticPages.find(([path]) => path === "/programs/personalized-options")!;
export const metadata = pageMetadata(seoPage[0], seoPage[1], seoPage[2]);

export default function PersonalizedOptionsPage() {
  return <ProgramDetail variant="personalized" />;
}
