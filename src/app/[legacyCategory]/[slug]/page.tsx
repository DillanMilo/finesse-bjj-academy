import { createElement, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLegacyPost, indexableLegacyPosts, type ArchiveNode } from "@/lib/legacy-posts";
import { pageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import { CONTACT } from "@/lib/constants";
import { formatPostDate } from "@/lib/posts";

export const dynamicParams = false;
export function generateStaticParams() {
  return indexableLegacyPosts.map(post => ({ legacyCategory: post.category, slug: post.slug }));
}
type Props = { params: Promise<{ legacyCategory: string; slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { legacyCategory, slug } = await params;
  const post = getLegacyPost(legacyCategory, slug);
  if (!post) return {};
  const metadata = pageMetadata(post.path, post.title, post.description);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: post.published, modifiedTime: post.modified } };
}
const safeTags = new Set(["p", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "strong", "b", "em", "i", "br"]);
function Content({ nodes }: { nodes: (ArchiveNode | string)[] }) {
  return nodes.map((node, index) => {
    if (typeof node === "string") return <Fragment key={index}>{node}</Fragment>;
    const children = <Content nodes={node.children} />;
    if (node.tag === "img" && node.src?.startsWith("/legacy-media/")) {
      return <Image key={index} src={node.src} alt={node.alt ?? ""} width={node.width || 1024} height={node.height || 768} sizes="(min-width: 768px) 768px, 100vw" className="my-8 h-auto max-w-full" />;
    }
    if (node.tag === "video" && node.src?.startsWith("/legacy-media/")) {
      return <video key={index} controls preload="none" className="my-8 w-full"><source src={node.src} /><a href={node.src}>Open the original archive video</a></video>;
    }
    if (node.tag === "video") return <p key={index} className="text-sm text-zinc-500">The original video from this historical post is no longer available.</p>;
    if (node.tag === "a" && node.href && /^(https?:\/\/|mailto:|tel:|\/(?!\/))/.test(node.href)) {
      return <a key={index} href={node.href} className="underline underline-offset-4">{children}</a>;
    }
    if (node.tag === "table") return <div key={index} className="my-8 overflow-x-auto"><table className="w-full border-collapse text-left">{children}</table></div>;
    if (!safeTags.has(node.tag)) return <Fragment key={index}>{children}</Fragment>;
    return createElement(node.tag, { key: index }, node.tag === "br" ? undefined : children);
  });
}
export default async function LegacyArticle({ params }: Props) {
  const { legacyCategory, slug } = await params;
  const post = getLegacyPost(legacyCategory, slug);
  if (!post) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, datePublished: post.published, dateModified: post.modified, mainEntityOfPage: `${SITE_URL}${post.path}`, author: { "@type": "Organization", name: SITE_NAME }, publisher: { "@id": `${SITE_URL}/#academy` } };
  return <main className="min-h-screen bg-[#0A0A0A] px-4 pb-24 pt-32 sm:px-6 md:px-8">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <article className="mx-auto max-w-3xl">
      <Link href="/news/archive" className="font-headline text-sm tracking-widest text-[#CC1122]">ARTICLE ARCHIVE</Link>
      <p className="mt-8 text-sm text-zinc-500">Originally published <time dateTime={post.published}>{formatPostDate(post.published)}</time></p>
      <h1 className="mt-5 font-headline text-4xl italic leading-tight tracking-tighter text-white sm:text-5xl">{post.title}</h1>
      <aside className="my-8 border-l-2 border-[#CC1122] bg-white/5 p-5 text-sm leading-relaxed text-zinc-300">
        From the academy archive. Offers, class details, and references in older articles may have changed. Our current location is {CONTACT.address}. Check the <Link href="/schedule" className="underline">current schedule</Link> or <Link href="/contact" className="underline">contact the team</Link> for current arrangements.
      </aside>
      <div className="text-lg leading-relaxed text-zinc-300 [&_p]:my-5 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-headline [&_h2]:text-3xl [&_h2]:text-white [&_h3]:mt-8 [&_h3]:font-headline [&_h3]:text-2xl [&_h3]:text-white [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_td]:border [&_td]:border-white/15 [&_td]:p-3 [&_th]:border [&_th]:border-white/15 [&_th]:p-3 [&_blockquote]:border-l-2 [&_blockquote]:border-[#CC1122] [&_blockquote]:pl-5"><Content nodes={post.body} /></div>
      <Link href="/news" className="mt-12 inline-block font-headline text-lg text-[#CC1122]">READ THE LATEST ACADEMY NEWS</Link>
    </article>
  </main>;
}
