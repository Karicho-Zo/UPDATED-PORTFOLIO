# Google Search Console setup for Isaac Karicho's portfolio

Production URL: https://karicho-isaac.vercel.app/

## Changes included
- Improved description and indexing metadata
- Canonical URL and Open Graph/Twitter metadata
- Person structured data
- `public/robots.txt` that allows crawling
- `public/sitemap.xml` for the single-page portfolio

## Deploy
1. Replace the source files in your project/repository with these updated files (or copy the changed files: `index.html` and the `public/` folder).
2. Commit and push to the GitHub repository connected to Vercel, or deploy using your current Vercel workflow.
3. Confirm these URLs load after deployment:
   - https://karicho-isaac.vercel.app/robots.txt
   - https://karicho-isaac.vercel.app/sitemap.xml

Vite copies files from `public/` into the production output root.

## Verify Google Search Console
1. Open https://search.google.com/search-console/
2. Add a property using **URL prefix** and enter `https://karicho-isaac.vercel.app/`.
3. Select **HTML tag** verification and copy the exact tag Google provides.
4. Add that unique tag inside the `<head>` of `index.html` where the comment says `Google Search Console`.
5. Deploy again, confirm the tag is present in the live page source, then click **Verify** in Search Console.
6. In Search Console > **Sitemaps**, submit `sitemap.xml`.
7. In **URL inspection**, inspect `https://karicho-isaac.vercel.app/` and click **Request indexing**.

## Important
- The Google verification tag is unique to your Search Console property and account, so it has intentionally not been fabricated or inserted.
- Sitemap submission and a request for indexing do not guarantee that Google will index the site or how quickly it will appear.
- This portfolio is a single-page site, so its sections (`#about`, `#projects`, etc.) do not need separate sitemap entries.
- The canonical URL assumes `https://karicho-isaac.vercel.app/` is the preferred production address.
