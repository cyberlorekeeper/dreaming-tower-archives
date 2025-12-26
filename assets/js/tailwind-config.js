// /assets/js/tailwind-config.js
tailwind.config = {
 safelist: [
    "bg-deep-space",
    "bg-abyss",
    "bg-rift",
    "text-stardust",
    "text-silver",
    "font-body",
    "font-display",
    "border-rift",
    "hover:text-stardust",
    "hover:bg-abyss"
  ],
  theme: {
    extend: {
      colors: {
        "deep-space": "#0A141B",
        "abyss": "#0F2230",
        "rift": "#143545",
        "nebula": "#1E6175",
        "glow": "#35C6E0",
        "stardust": "#CFE5EF",
        indigo: "#4B5DFF",
        violet: "#7C4DFF",
        ember: "#F0B429",
        fog: "#E9EDF2",
        silver: "#C9D1D9",
        parchment: "#F7F4EF",
        aether: "#0B0F14",
        runic: "#1A2430"
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["Source Sans 3", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glow: "0 0 0 2px rgba(53,198,224,.15), 0 10px 28px rgba(0,0,0,.25)",
        card: "0 6px 18px rgba(0,0,0,.12)"
      }
    }
  }
};
