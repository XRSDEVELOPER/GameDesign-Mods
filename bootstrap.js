window.__EXT_BOOT_VERSION = "1.0.0 (Beta)";

const GAME_MODS = {
  explorer: "https://xrsdeveloper.github.io/GameDesign-Mods/games/Explorer-Mod.js"
};

function detectGameFromUrl() {
  const url = location.href.toLowerCase();
  if (url.includes("explorer")) return "explorer";
  return null;
}

(async function bootstrap() {
  try {
    const game = detectGameFromUrl();
    if (!game) {
      console.warn("⚠️ Geen bekende game gedetecteerd:", location.href);
      return;
    }

    const REMOTE_URL = GAME_MODS[game];
    console.log(`🎮 Game gedetecteerd: ${game}, mod wordt geladen: ${REMOTE_URL}`);

    const res = await fetch(REMOTE_URL, { cache: "no-store" });
    const text = await res.text();

    const remoteVersion = (text.match(/__EXT_MOD_VERSION\s*=\s*["']([^"']+)["']/) || [])[1];
    const cachedVersion = localStorage.getItem(`__ext_mod_version_${game}`);
    const cachedScript  = localStorage.getItem(`__ext_mod_script_${game}`);

    if (!remoteVersion) {
      console.warn("⚠️ Remote script mist version marker.");
      if (cachedScript) return runScript(cachedScript);
      return runScript(text);
    }

    if (remoteVersion !== cachedVersion) {
      alert(`⚡ Nieuwe mod update voor ${game} geïnstalleerd!\nNu draaiend v${remoteVersion}`);
      console.log(`⚡ Updating ${game} mod to v${remoteVersion}`);

      localStorage.setItem(`__ext_mod_version_${game}`, remoteVersion);
      localStorage.setItem(`__ext_mod_script_${game}`, text);
      runScript(text);
    } else {
      console.log(`✅ Up to date ${game} (v${cachedVersion})`);
      runScript(cachedScript || text);
    }
  } catch (err) {
    console.error("❌ Kon remote script niet laden", err);
    const game = detectGameFromUrl();
    if (game) {
      const fallback = localStorage.getItem(`__ext_mod_script_${game}`);
      if (fallback) runScript(fallback);
    }
  }

  function runScript(code) {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const s = document.createElement("script");
    s.src = url;
    s.dataset.extLoader = "true";
    s.onload = () => URL.revokeObjectURL(url);
    document.documentElement.appendChild(s);
  }
})();
