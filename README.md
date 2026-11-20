# Cashvio marketing, merchant documentation and receipts

This application is one component of the Cashvio project. It contains the public marketing site, paired English/Arabic merchant guides and isolated digital receipt pages.

## Start development

Use the Node version in [.node-version](.node-version) and Yarn Classic pinned in [package.json](package.json). Preserve the existing `yarn.lock`; do not add another lockfile.

```sh
yarn install --frozen-lockfile
yarn dev
```

Development is at `http://localhost:3005`. Localized marketing pages live under `src/app/[locale]/`; English URLs have no prefix and Arabic uses `/ar`. Merchant docs live in `content/docs/` as paired `.mdx` and `.ar.mdx` files. Receipt pages use the isolated `src/app/(export)/` group.

next-intl owns locale resolution and internal rewrites. The middleware preserves a permanent direct `/en` canonical redirect only when next-intl actually returns a redirect response. Do not add eager `/en` redirects in middleware or `next.config.ts`: they also redirect internal rewrites and create a loop. Comparison-route protections remain in Next configuration.

## Work on one Cashvio task

Read [AGENTS.md](AGENTS.md) and the relevant skills. In the full workspace, start from `cashvio-workflow/PROJECT-WORKFLOW.md` and maintain one shared task under `cashvio-workflow/tasks/`. Marketing/docs/receipt work contributes to the same feature agreement and acceptance decision as backend, portal, admin, storefront and infrastructure work.

## Verification

```sh
yarn quality:foundations
yarn lint
yarn type-check
yarn content:check
yarn docs:check
yarn verify:ci
```

`type-check` runs Next route type generation, explicit Fumadocs collection generation, then TypeScript. The install hook also generates collections; verification does not depend on warm build output. `verify:ci` combines foundation hygiene with lint, types, content, documentation ordering and the production build. Relevant browser/SEO/bilingual acceptance remains part of the project task. Foundation hygiene checks filenames and toolchain entry points, not credential contents or production security.

After a build, `yarn test:lifecycle:browser` starts an owned loopback production server and checks the documented locale redirects, en/ar hydration, public auth hints, theme preferences, mobile drawer and a controlled Chatwoot stub. It blocks external browser resources, requires an installed Playwright Chromium, and reports missing prerequisites without claiming a pass. This is not live authentication or Chatwoot provider evidence.

## Operational boundaries

Screenshot seed/clone scripts mutate data and use credentials. They are not tests and require their own authorized sandbox scope. Keep local `.env` and `.pi/` state out of Git. Privately review and rotate any credential confirmed exposed in existing history; ignore rules do not remediate past commits.

Receipt URLs currently use a public order-UUID capability link. The optional store header is context, not authentication. Fetching is request-deduplicated with `cache: "no-store"`; do not infer a token-authenticated endpoint from old guidance.

Build output runs as a Next server. `yarn start` uses the configured production `PORT` or explicit `-p`; the development port does not configure production. Verify actual deployment headers/cache behavior through the release plan.
