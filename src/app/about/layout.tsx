import { pageMetadata, staticPages } from "@/lib/seo";
const page = staticPages.find(([path]) => path === "/about")!;
export const metadata = pageMetadata(page[0], page[1], page[2]);
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
