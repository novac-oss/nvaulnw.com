# N VaulNW Studio Website

Static website for N VaulNW — a global product studio building mobile apps, casual games, utility tools, and ad-monetized products for Google Play and the App Store.

- **Live site:** https://nvaulnw.com
- **Sitemap:** https://nvaulnw.com/sitemap.xml
- **Privacy:** https://nvaulnw.com/privacy/
- **Terms:** https://nvaulnw.com/terms/
- **Contact:** yangkamiai@outlook.com

## Stack

- Pure HTML5 + CSS3 + vanilla JS. No build step, no frameworks, no external fonts.
- All icons / logo / illustrations are inline-referenced SVGs.
- Hosting: GitHub Pages, custom domain `nvaulnw.com`, HTTPS enforced.

## File layout

```
/
  index.html                # meta-refresh + JS redirect → /home/
  404.html
  robots.txt
  sitemap.xml
  app-ads.txt               # required for ad networks
  CNAME                     # nvaulnw.com
  favicon.svg
  home/      index.html
  services/  index.html
  contact/   index.html
  privacy/   index.html
  terms/     index.html
  css/       main.css, animations.css, responsive.css
  js/        main.js, animations.js, components.js
  images/    logo.svg, favicon.svg, icons/, animals/, hero/, bg/
  content/   source markdown for the marketing/legal copy
```

## Local preview

```bash
# from the project root
python -m http.server 8080
# then visit http://localhost:8080/home/
```

## Editing the copy

The source of truth for all marketing and legal copy is in `content/*.md`.
Edits there are intended to be re-pasted into the corresponding HTML pages by a developer before commit.

## License

© 2026 N VaulNW Studio. All rights reserved.
