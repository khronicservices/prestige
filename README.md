# Prestige website

A static, five-page website ready for GitHub Pages. No Node.js server, npm install, database, or build step is required.

## Publish on GitHub Pages

1. Extract prestige-github-website.zip on your computer.
2. Create a GitHub repository for the website. A public repository works with GitHub Free.
3. Upload the CONTENTS of the extracted ZIP to the repository root, including the assets folder. index.html must be directly at the top level; do not upload only the ZIP.
4. Commit the files to the main branch.
5. Open repository Settings > Pages.
6. Under Build and deployment, select Deploy from a branch.
7. Select main and /(root), then Save.
8. Wait for the Pages deployment to finish. Settings > Pages will display the live website URL. Relative links in this package work under a repository subpath such as https://YOURNAME.github.io/prestige-website/.

Official GitHub instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Included pages

- index.html: Prestige artwork, quick links, about section, community link.
- partners.html: five partner cards. Khronic Services is first with its banner and PRESTIGE15 copy button; four clearly labeled placeholder spaces follow.
- roster.html: five numbered player cards, social handle text, and two configurable link buttons each. Placeholder links stay disabled until you add real URLs.
- foundation.html: the three supplied foundation members, handles, and responsibilities.
- contact.html: contact form posting to https://formspree.io/f/xwlooeak and a mail link to fearprsggs@gmail.com.

Every page includes an animated navigation drawer and the supplied footer destinations with icons. The transparent Prestige mark is used for the branding and favicon. Layouts adapt to mobile, keyboard users can use the native modal navigation, and reduced-motion preferences disable animations.

## Edit partners, roster, and images

### Option A: Edit the configuration file

Open site-data.js and edit the partners and roster arrays. Partner fields are name, description, code, and image. Roster fields are name, handle, image, link1Label, link1, link2Label, and link2. Use full https:// URLs for roster links. The first partner is always rendered as the featured card.

Placeholder images are in assets/partner-2.svg through partner-5.svg and assets/roster-1.svg through roster-5.svg. Add your own images to assets/ and update the image path in site-data.js (for example assets/player-jane.png). Commit the updated file and new images to publish.

### Option B: Use the browser editor

1. On Partners or Roster, select Customize cards.
2. Choose a card and edit its fields. Upload an optional PNG, JPG, or WebP image.
3. Select Save preview. This changes only your browser's preview, not the public website.
4. Select Export site-data.js. This downloads a configuration file with your changes and optimized uploaded images included.
5. Replace site-data.js in your GitHub repository with the exported file and commit it. GitHub Pages will deploy the change.

GitHub Pages cannot accept persistent image uploads by itself. The editor does not write into your repository or modify other visitors' screens. It saves previews in this browser's storage; use Reset local previews to see the current published configuration after you update it. The export includes BOTH partner and roster changes saved in that browser. Keep exports as backups. Images uploaded through the editor are embedded in the exported configuration, so no extra asset upload is needed for those images.

## Edit other content

Edit the relevant .html page to change page text, foundation members, contact details, or footer links. Shared colors, hover effects, spacing, and animation settings are in styles.css. Interactions and the contact form are in app.js. Google Fonts supplies Barlow Condensed and DM Sans; the site has local system-font fallbacks if Google Fonts is unavailable.

The original Prestige banner, portrait art, Khronic banner, and transparent mark are included in assets/. Keep filenames and letter case consistent: GitHub Pages paths are case-sensitive.

## Contact form

The form is configured with the supplied Formspree endpoint. Ensure that endpoint belongs to an active form in your Formspree account and that the recipient address and allowed domains are configured as you want. The site displays sending, success, and failure states and retains entered text on a failed submission. It includes a honeypot field. With JavaScript disabled it submits directly to Formspree.

## Validation

Browser checks covered all five pages, missing images, desktop and 390px mobile layouts, navigation drawer opening/closing, sponsor code clipboard behavior, five partner cards, five roster cards and ten link controls, card editing and local persistence, uploaded image previews, configuration export/reset, and the contact-form success flow with the network request intercepted (no real message sent). JavaScript syntax checks passed. A live GitHub Pages deployment and real Formspree delivery were not performed.
