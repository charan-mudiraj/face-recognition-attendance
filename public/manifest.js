const manifest = {
  name: "My App",
  short_name: "MyApp",
  description: "abc",
  start_url: "/",
  scope: "/",
  orientation: "portrait",
  display: "standalone", // Hides browser UI
  background_color: "#ffffff", // Optional, improves loading
  theme_color: "#000000", // Optional, sets app bar color
  icons: [
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "favicon",
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "favicon",
    },
    {
      src: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
      purpose: "apple touch icon",
    },
    {
      src: "/maskable_icon.png",
      sizes: "48x48",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
};

const stringManifest = JSON.stringify(manifest);
const blob = new Blob([stringManifest], { type: "application/json" });
const manifestURL = URL.createObjectURL(blob);
document.head.querySelector("link[rel='manifest']")?.remove();

const manifestLink = document.createElement("link");
manifestLink.rel = "manifest";
manifestLink.href = manifestURL;
document.head.appendChild(manifestLink);
