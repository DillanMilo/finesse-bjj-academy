# Finesse BJJ Academy

Marketing site for Finesse BJJ Academy in Spring, Texas, built with Next.js and deployed on Vercel.

## Local development

Use Node.js 22, then install and run the app:

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
npm audit
```

## Vercel

Protected production alias: <https://finesse-bjj-academy.vercel.app>

For external client review, create or copy a deployment-scoped Shareable Link from the Vercel deployment's **Share** panel. Do not commit its `_vercel_share` token.

The Vercel CLI version is pinned in the npm scripts without adding its CLI-only dependency tree to the application lockfile.

```bash
npm run vercel:link -- --yes --project finesse-private-8k4q2m
npm run vercel:pull
npm run vercel:build
npm run deploy:preview
npm run deploy:production
```

Local Vercel linkage and pulled environment files live under `.vercel/` and are intentionally ignored by Git.
