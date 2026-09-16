ANEEMA - app package
====================

This folder turns ANEEMA into a real installable app with its own icon, its own
window and no browser bars.

WHAT IS IN HERE
---------------
  index.html              the app launcher (loads ANEEMA full screen)
  app.js                  launcher logic + install handling
  styles.css              launcher theme (matches ANEEMA)
  config.js               >>> the only file you ever need to edit <<<
  manifest.webmanifest    app name, colours, icons (what makes it installable)
  sw.js                   service worker - caches the launcher so it opens instantly
  icons/                  the app icon in every size a phone asks for


PART 1 - INSTALL IT IN 10 SECONDS (no hosting, no downloads)
------------------------------------------------------------
1. On your phone, open ANEEMA in a normal browser (Chrome on Android,
   Safari on iPhone - NOT the browser inside Instagram/TikTok/Facebook).
   The address is:

       https://perchance.org/wtoh93knhl

   or the direct app address:

       https://b23b9ecabf3debddbd276dd98bdc2fc6.perchance.org/wtoh93knhl

2. Tap the three-dot menu (Android) or the Share button (iPhone).
3. Choose "Install app" / "Add to Home Screen".
4. Done. ANEEMA now sits on your home screen with its own icon and opens
   full screen.

That installs from ANEEMA itself, so this zip is not needed for it. It is here
because you asked for a downloadable package.


PART 2 - HOST THIS FOLDER AS YOUR OWN STANDALONE APP
----------------------------------------------------
To install from THIS folder instead, it has to be served over the web (a phone
cannot install a page opened straight from a zip). Any free static host works:

  - Netlify Drop   https://app.netlify.com/drop   (drag the folder in - easiest)
  - Cloudflare Pages, Vercel, GitHub Pages, or any web host you already have

Upload the CONTENTS of this folder (not the zip), then open the address it gives
you on your phone and use "Install app" / "Add to Home Screen".


PART 3 - IF YOU EVER RENAME THE GENERATOR
-----------------------------------------
Open config.js and update these two lines. Only the name on the end changes;
the long hex part stays the same:

    APP_URL:  "https://b23b9ecabf3debddbd276dd98bdc2fc6.perchance.org/wtoh93knhl"
    PAGE_URL: "https://perchance.org/wtoh93knhl"


NOTES
-----
- Everything you chat about stays on your own device. There is no account.
- 18+ uncensored content. Keep it away from anyone under 18.
- The icon is icons/icon-512.png (or app-icon.svg, the vector original).
  Save it to your phone if you want to use it as a shortcut or wallpaper.
