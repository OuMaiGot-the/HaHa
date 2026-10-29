# Deployment registry

Public deployments are tracked in:

```text
config/deployments.json
```

The registry is the repository-owned record of public app routes. Publication eligibility is determined by automated repository validation and configured deployment checks; package status remains metadata.

## List deployments

From the repository root:

```powershell
python -m app_generator deployments
```

The command does not require `project.local.toml`, Google Drive credentials, coordinator access, or a browser. It compares the tracked registry with generated packages under:

```text
content/chapter-*/section-*/package.json
```

and prints:

- app label;
- whether the referenced package exists in the checkout;
- whether the registry marks the app deployed;
- public URL.

Generated packages that are not represented in the registry are appended automatically with `DEPLOYED = no` and URL `-`. This prevents a newly generated section from being hidden merely because deployment metadata has not been added yet.

## Registry entry

Each deployment has the form:

```json
{
  "appId": "section-8-2",
  "label": "Section 8.2",
  "packagePath": "content/chapter-8/section-8-2/package.json",
  "deploymentRepository": "tlyoon/section-8-1-learning-app",
  "publicUrl": "https://tlyoon.github.io/section-8-1-learning-app/section-8-2/",
  "deployed": true
}
```

Optional `variant` text may distinguish multiple routes backed by the same section package, such as historical and regenerated review variants.

New automatic review deployments also record optional `packageSha256`, the SHA-256 of the exact `package.json` bundled for Pages. Older records without it remain readable, but an auto worker treats them as insufficient proof that its current package reached Pages. The Drive success event also records the public PR/URL/digest for cross-PC reconciliation.

## Automatic public deployment

This project's enabled policy uses `tlyoon/section-8-1-learning-app` and routes a section as `section-{section_slug}/` (for example, `9.1` is `section-9-1/`). Workers build only the minimal static bundle, open/reuse a deterministic package-digest branch and PR in that public repository, and merge it automatically. Source PDFs, Drive marker data, run state, raw model responses, credentials, and source manifests never enter that repository. Automated validation and configured deployment checks are the publication gate; manual review is optional.

### Direct links to activities

Every rendered activity has a stable deep link using its package activity ID:

```text
https://<pages-route>/?activity=<activity-id>
```

For example, `.../section-9-5/?activity=act-int-mod-1` opens that exact interactive activity rather than starting at Activity 1. The player updates the `activity` query parameter as the learner advances, preserves unrelated query parameters and URL fragments, and falls back safely to the first activity if an unknown ID is supplied.

## Maintenance rule

When a public route is created, changed, or removed, update `config/deployments.json` in the same source-repository PR that records/authorizes that deployment. Keep only public, non-secret deployment metadata in the registry.

A deployment entry records operational publication state. Content quality remains governed by the automated validation and provenance checks in the generation pipeline; optional manual review remains separate.

## HaHa catalog release

The current HaHa M4 catalog is hosted publicly with Sites:
https://haha-physics-learning-m4.hazygiant2048.chatgpt.site

- Application source: `OuMaiGot-the/HaHa`, M4 merged in `4b9735e`.
- Initial M4 built application revision: `94a8bc4af14bb3b0ef68e8b8780386b94a367f89`.
- Sites project: `appgprj_6ae2f8d4150481918a021bf9fc861205`.
- Initial M4 saved version: `appgprj_6ae2f8d4150481918a021bf9fc861205~appgver_7e4413a32e7c819187cadce27040dd2e`.
- Initial M4 Site source commit: `3f7f4ee075d3f99d43e6239f349be5744f327fe6`.

Sites contains a static build of the repository app, not a separate implementation.
For updates, build with `python scripts/build_catalog_release.py preview`, reuse
the same Sites project and its source repository, replace the deployment's `dist/`
with the validated static build, and save/deploy that exact pushed source version.
Use the Sites source workflow and retain `.openai/hosting.json` in its checkout.
Do not create a second Site for later releases or copy credentials into this repo.
GitHub source changes do not automatically publish to Sites.

All progress remains device-local. A different host has a different browser
storage origin, so earlier-host progress does not automatically migrate.

The `gh-pages` branch remains a separately published static artifact, not proof
of a live website. The GitHub Pages workflow remains manual because automatic
site creation was denied by GitHub's integration permissions. Enable Pages at
repository level before running that optional workflow. Vercel publication is
also optional and still requires its configured team authorization and CI
credential. Neither blocked host is required for the working Sites deployment.

### Initial integrated study hub release — 29 October 2026

The same public Site now serves the physics study hub from
[PR #2](https://github.com/OuMaiGot-the/HaHa/pull/2), merged at
`41288ebe21040b71bef2791f9cc959a39cf30f99`.
The Site source commit is `e358f2ee87362a3621e0f7190c780577ad28f96a`,
saved as version 2 (`appgprj_6ae2f8d4150481918a021bf9fc861205~appgver_8c78028a9144819190cc9cc21e86f94b`).
The unchanged origin and activity/progress IDs preserve existing device-local
learning evidence. [The comparison](INTEGRATED_STUDY_HUB.md) records feature
selection, provenance and verification. The original AddMath Site is untouched.
