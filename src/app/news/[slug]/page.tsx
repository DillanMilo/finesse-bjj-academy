import { pageMetadata, SITE_URL } from "@/lib/seo";
import ArrowIcon from "@/components/ui/ArrowIcon";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostTrialCTA from "@/components/sections/PostTrialCTA";
import { formatPostDate, getPost, posts } from "@/lib/posts";
export const dynamicParams = false;
export function generateStaticParams() { return posts.map(post => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug: string}> }) {
  const post = getPost((await params).slug);
  if (!post) return {};
  const metadata = pageMetadata(`/news/${post.slug}`, post.title, post.excerpt);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: post.date, images: [{ url: post.image, alt: post.imageAlt }] } };
}
function Block({ text }: { text: string }) {
  if (text.startsWith("## ")) return <h2 className="mt-12 mb-4 font-headline text-3xl sm:text-4xl italic tracking-tighter text-white">{text.slice(3)}</h2>;
  if (text.startsWith("- ")) return <ul className="my-6 space-y-3">{text.split("\n").map(item => <li key={item} className="flex gap-3 text-zinc-300"><span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-[#CC1122]" />{item.slice(2)}</li>)}</ul>;
  return <p className="my-5 text-lg leading-relaxed text-zinc-300">{text}</p>;
}
export default async function PostPage({ params }: { params: Promise<{slug: string}> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const jsonLd = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, datePublished: post.date, mainEntityOfPage: `${SITE_URL}/news/${post.slug}`, image: new URL(post.image, SITE_URL).href, author: { "@type": "Organization", name: "Finesse BJJ Academy" }, publisher: { "@type": "Organization", name: "Finesse BJJ Academy" } };
  return <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24 px-4 sm:px-6 md:px-8">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <article className="mx-auto max-w-3xl">
      <Link href="/news" className="font-headline text-xs tracking-widest text-[#CC1122]"><ArrowIcon direction="left" className="h-4 w-4" /> ALL POSTS</Link>
      <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-headline tracking-widest text-zinc-500"><span className="px-3 py-1 text-[#CC1122] border border-[#CC1122]/30 bg-[#CC1122]/5 uppercase">{post.category}</span><time dateTime={post.date}>{formatPostDate(post.date).toUpperCase()}</time><span>{post.readMinutes} MIN READ</span></div>
      <h1 className="mt-5 font-headline text-4xl sm:text-5xl md:text-6xl italic tracking-tighter text-white leading-[0.95]">{post.title}</h1>
      <p className="mt-6 font-serif text-xl italic text-[#E6BDB9]">{post.excerpt}</p>
      <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-white/10"><Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" /><div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#CC1122] to-transparent" /></div>
      <div className="mt-10">{post.body.map(text => <Block key={text} text={text} />)}</div>
      <PostTrialCTA />
    </article>
  </main>;
}
