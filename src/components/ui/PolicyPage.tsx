import Link from "next/link";
export default function PolicyPage({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#0A0A0A] px-4 pb-24 pt-32 sm:px-6"><article className="mx-auto max-w-3xl text-zinc-300 leading-relaxed">
    <Link href="/" className="text-sm text-red-500 underline underline-offset-4">Back to Finesse BJJ</Link>
    <h1 className="mt-8 mb-8 font-headline text-5xl text-white">{title}</h1>
    <div className="space-y-6 [&_h2]:font-headline [&_h2]:text-3xl [&_h2]:text-white [&_a]:underline [&_a]:underline-offset-4">{children}</div>
  </article></main>;
}
