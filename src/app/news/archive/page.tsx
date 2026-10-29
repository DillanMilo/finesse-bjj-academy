import Link from "next/link";
import { indexableLegacyPosts } from "@/lib/legacy-posts";
import { pageMetadata } from "@/lib/seo";
import { formatPostDate } from "@/lib/posts";
export const metadata = pageMetadata("/news/archive", "Article Archive", "Earlier articles and academy updates from Finesse BJJ. Visit the current schedule and contact pages for today's training information.");
export default function ArticleArchive() {
  return <main className="min-h-screen bg-[#0A0A0A] px-4 pb-24 pt-32 sm:px-6"><section className="mx-auto max-w-3xl">
    <Link href="/news" className="font-headline text-sm text-[#CC1122]">LATEST ACADEMY NEWS</Link>
    <h1 className="mt-8 font-headline text-5xl text-white">Article Archive</h1>
    <p className="mt-5 text-zinc-400">Earlier articles from the academy. Offers and class details in older posts may have changed. Check our current schedule or contact the team before making arrangements.</p>
    <ul className="mt-10 divide-y divide-white/10">{indexableLegacyPosts.map(post => <li key={post.path} className="py-6"><time dateTime={post.published} className="text-xs text-zinc-500">{formatPostDate(post.published)}</time><Link href={post.path} className="mt-2 block font-headline text-2xl text-white hover:text-red-500">{post.title}</Link></li>)}</ul>
  </section></main>;
}
