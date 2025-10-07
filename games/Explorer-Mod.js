window.__EXT_MOD_VERSION = "1.0.0 (Beta)";

(function () {
  if (window.__EXT_MOD_MENU_LOADED) return;
  window.__EXT_MOD_MENU_LOADED = true;

  window.__EXT_MOD_MENU_STATE = window.__EXT_MOD_MENU_STATE || {
    originalResources: null,
    resourcesCheatOn: false,
    originalHeroesUnlocked: null,
    originalShowHeroSelect: null,
    heroesCheatOn: false,
    bombCheatOn: false,
    forceRevealVisual: false,
  };
  const state = window.__EXT_MOD_MENU_STATE;

  // ======================
  // STYLES
  // ======================
  const style = document.createElement("style");
  style.textContent = `
    @keyframes hueRotate { from { filter: hue-rotate(0deg); } to { filter: hue-rotate(360deg); } }
    @keyframes rgbText { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
    @keyframes marqueeLoop { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }

    /* Circle */
    #ext-rgb-circle {
      position: fixed; top: 12px; left: 12px;
      width: 36px; height: 36px; border-radius: 50%;
      cursor: pointer; background: #ff004d;
      animation: hueRotate 5s linear infinite;
      z-index: 9999999; display: flex;
      align-items: center; justify-content: center;
      color: #fff; font-weight: bold; user-select: none;
    }

    /* Menu */
    #ext-modmenu {
      display: none; opacity: 0; transition: opacity 0.2s ease;
      position: fixed; top: 12px; left: 12px; width: 320px;
      background: rgba(14,14,16,0.98); color: #fff;
      font-family: Inter, Arial, sans-serif;
      border: 3px solid #ff004d; border-radius: 14px;
      animation: hueRotate 8s linear infinite;
      z-index: 9999999; padding: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    }

    #ext-modmenu h2 {
      margin: 0 0 10px; font-size: 16px;
      text-align: center; font-weight: 700;
      color: transparent;
      background: linear-gradient(90deg, red, orange, yellow, lime, cyan, blue, violet, red);
      background-size: 400%; background-clip: text; -webkit-background-clip: text;
      animation: rgbText 6s linear infinite;
    }

    .ext-marquee { width: 100%; overflow: hidden; position: relative; height: 20px; line-height: 20px; margin-bottom: 10px; }
    .ext-marquee-content {
      display: inline-block; white-space: nowrap; padding-right: 50px;
      font-size: 13px; font-weight: 500;
      animation: marqueeLoop 12s linear infinite, rgbText 6s linear infinite;
      color: transparent;
      background: linear-gradient(90deg, red, orange, yellow, lime, cyan, blue, violet, red);
      background-size: 400%; background-clip: text; -webkit-background-clip: text;
    }

    #ext-modmenu .closeBtn {
      position: absolute; top: 8px; right: 8px;
      background: transparent; border: none; font-size: 18px;
      cursor: pointer; padding: 4px 8px; border-radius: 6px; font-weight: bold;
      color: transparent;
      background: linear-gradient(90deg, red, orange, yellow, lime, cyan, blue, violet, red);
      background-size: 400%; background-clip: text; -webkit-background-clip: text;
      animation: rgbText 6s linear infinite;
    }

    .ext-row {
      display:flex; align-items:flex-start; flex-direction:column;
      margin:10px 0; gap:10px;
      border-bottom:1px solid rgba(255,255,255,0.1);
      padding-bottom:8px;
    }
    .ext-row:last-child {
      border-bottom: none;
    }

    .ext-row-header {
      display:flex; align-items:center; justify-content:space-between;
      gap:10px; width:100%;
    }

    .ext-label {
      flex:1;
      font-size:13px; opacity:0.95;
      background: linear-gradient(90deg, red, orange, yellow, lime, cyan, blue, violet, red);
      background-size: 400%; -webkit-background-clip: text; color: transparent;
      animation: rgbText 6s linear infinite;
    }

    /* Arrow */
    .ext-arrow {
      width:20px;
      text-align:center;
      cursor: pointer;
      font-size: 14px;
      user-select: none;
      transition: transform 0.25s ease;
    }
    .ext-row.open .ext-arrow { transform: rotate(180deg); }

    /* Switch */
    .ext-switch { --w:46px; --h:28px; --pad:3px;
      width:var(--w); height:var(--h); background:#222; border-radius:30px;
      position:relative; cursor:pointer; transition: background .18s ease; flex:0 0 auto;
    }
    .ext-switch input { display:none; }
    .ext-switch .knob {
      position:absolute; top:var(--pad); left:var(--pad);
      width: calc(var(--h) - var(--pad)*2); height: calc(var(--h) - var(--pad)*2);
      border-radius:50%; background:#fff;
      transition: transform .18s, background .18s;
    }
    .ext-switch.on { background: linear-gradient(90deg,#00ff88,#3b82f6); }
    .ext-switch.on .knob { transform: translateX(calc(var(--w) - var(--h))); }

    /* Description animation + RGB */
    .ext-description {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      font-size: 12px;
      line-height: 1.3;
      margin-top: 4px;
      transition: max-height 0.3s ease, opacity 0.3s ease;

      background: linear-gradient(90deg, red, orange, yellow, lime, cyan, blue, violet, red);
      background-size: 400%;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: rgbText 6s linear infinite;
    }
    .ext-row.open .ext-description {
      max-height: 200px;
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  // ======================
  // MAIN ELEMENTS
  // ======================
  const circle = document.createElement("div");
  circle.id = "ext-rgb-circle";
  circle.title = "Open Mod Menu";
  circle.innerHTML = "⚙";
  document.documentElement.appendChild(circle);

  const menu = document.createElement("div");
  menu.id = "ext-modmenu";
  menu.innerHTML = `
    <button class="closeBtn">✕</button>
    <h2>XRSDEV Mods</h2>
    <div class="ext-marquee"><div class="ext-marquee-content">The Explorer • 1.0.0 (Beta) • Alsjeblieft! Doe wat je wilt • Veel plezier!</div></div>

    <!-- Unlimited Resources -->
    <div class="ext-row">
      <div class="ext-row-header">
        <div class="ext-label">Oneindig Resources</div>
        <div class="ext-arrow">▼</div>
        <label class="ext-switch" id="switch-coins"><input type="checkbox" id="toggle-coins"><span class="knob"></span></label>
      </div>
      <div class="ext-description">Geeft je 999.999 van elke resource. Bouw en upgrade zonder limieten.</div>
    </div>

    <!-- Unlock All Heroes -->
    <div class="ext-row">
      <div class="ext-row-header">
        <div class="ext-label">Unlock Alle Helden</div>
        <div class="ext-arrow">▼</div>
        <label class="ext-switch" id="switch-heroes"><input type="checkbox" id="toggle-heroes"><span class="knob"></span></label>
      </div>
      <div class="ext-description">Ontgrendelt alle 5 helden! Alleen te gebruiken bij de held selectie scherm!</div>
    </div>

    <!-- Obelisk Bomb -->
    <div class="ext-row">
      <div class="ext-row-header">
        <div class="ext-label">Bomb (Press B)</div>
        <div class="ext-arrow">▼</div>
        <label class="ext-switch" id="switch-bomb"><input type="checkbox" id="toggle-bomb"><span class="knob"></span></label>
      </div>
      <div class="ext-description">Druk op <b>B</b> om direct een krachtige bom te droppen. Te vaak bom gebruiken in een keer kan problemen veroorzaken!</div>
    </div>

    <!-- Unlock Map Lite -->
    <div class="ext-row">
      <div class="ext-row-header">
        <div class="ext-label">Unlock Map Lite (anti-lag)</div>
        <div class="ext-arrow">▼</div>
        <label class="ext-switch" id="switch-litemap"><input type="checkbox" id="toggle-litemap"><span class="knob"></span></label>
      </div>
      <div class="ext-description">Zie de hele kaart! Te lang aanzetten kan problemen veroorzaken!</div>
    </div>
  `;
  document.documentElement.appendChild(menu);

  // ======================
  // HELPERS
  // ======================
  function setSwitch(wrapper, checked) {
    if (checked) wrapper.classList.add("on"); else wrapper.classList.remove("on");
    const input = wrapper.querySelector("input");
    if (input) input.checked = checked;
  }

  function updateHeroToggleState() {
    const heroesSwitch = menu.querySelector("#switch-heroes");
    const heroesInput = menu.querySelector("#toggle-heroes");
    if (window.game && window.game.showHeroSelect === false) {
      heroesSwitch.style.pointerEvents = "none"; heroesSwitch.style.opacity = "0.4"; heroesInput.disabled = true;
    } else {
      heroesSwitch.style.pointerEvents = ""; heroesSwitch.style.opacity = "1"; heroesInput.disabled = false;
    }
  }

  // Circle <-> Menu toggle
  circle.addEventListener("click", () => {
    circle.style.display = "none"; menu.style.display = "block";
    requestAnimationFrame(() => { menu.style.opacity = "1"; updateHeroToggleState(); });
  });
  menu.querySelector(".closeBtn").addEventListener("click", () => {
    menu.style.opacity = "0";
    setTimeout(() => { menu.style.display = "none"; circle.style.display = "flex"; }, 200);
  });

  // ====================================
  // CHEAT LISTENERS
  // ====================================
  const coinsSwitch = menu.querySelector("#switch-coins");
  const coinsInput = menu.querySelector("#toggle-coins");
  coinsSwitch.addEventListener("click", () => {
    const enabled = !coinsInput.checked; setSwitch(coinsSwitch, enabled);
    if (enabled) {
      if (!state.originalResources && window.game) {
        state.originalResources = { r1: game.resource1, r2: game.resource2, r3: game.resource3, r4: game.resource4 };
      }
      if (window.game) game.resource1 = game.resource2 = game.resource3 = game.resource4 = 999999;
      state.resourcesCheatOn = true;
    } else {
      if (window.game && state.originalResources) {
        game.resource1 = state.originalResources.r1;
        game.resource2 = state.originalResources.r2;
        game.resource3 = state.originalResources.r3;
        game.resource4 = state.originalResources.r4;
        state.originalResources = null;
      }
      state.resourcesCheatOn = false;
    }
  });

  const heroesSwitch = menu.querySelector("#switch-heroes");
  const heroesInput = menu.querySelector("#toggle-heroes");
  heroesSwitch.addEventListener("click", () => {
    const enabled = !heroesInput.checked; setSwitch(heroesSwitch, enabled);
    if (enabled) {
      if (state.originalHeroesUnlocked == null && window.game) {
        state.originalHeroesUnlocked = game.heroesUnlocked;
        state.originalShowHeroSelect = game.showHeroSelect;
      }
      if (window.game) { game.heroesUnlocked = 5; game.showHeroSelect = true; }
      state.heroesCheatOn = true;
    } else {
      if (window.game) {
        if (state.originalHeroesUnlocked != null) game.heroesUnlocked = state.originalHeroesUnlocked;
        if (state.originalShowHeroSelect != null) game.showHeroSelect = state.originalShowHeroSelect;
      }
      state.heroesCheatOn = false;
    }
    updateHeroToggleState();
  });

  // Obelisk Bomb
  let bombHandler = null;
  const bombSwitch = menu.querySelector("#switch-bomb");
  const bombInput = menu.querySelector("#toggle-bomb");
  bombSwitch.addEventListener("click", () => {
    const enabled = !bombInput.checked; setSwitch(bombSwitch, enabled);
    if (enabled) {
      if (!bombHandler) {
        bombHandler = function(e) {
          if (e.key && e.key.toLowerCase() === "b") {
            e.preventDefault(); e.stopImmediatePropagation();
            if (typeof defenseDropDownNow === "function") {
              try { defenseDropDownNow(); } catch(err) {}
            } else if (typeof defenseDropDown === "function") {
              try { defenseDropDown(); } catch(err) {}
            }
          }
        };
        document.addEventListener("keydown", bombHandler, true);
      }
      state.bombCheatOn = true;
    } else {
      if (bombHandler) { document.removeEventListener("keydown", bombHandler, true); bombHandler = null; }
      state.bombCheatOn = false;
    }
  });

  // ========================
  // Unlock Map Lite (map hack)
  // ========================
  function installTileAccessors(){
    if(typeof tile === "undefined") return;
    for(let i = 1; i <= 15; i++){
      if(!tile[i]) continue;
      for(let j = 1; j <= 15; j++){
        if(!tile[i][j]) continue;
        if(tile[i][j].__ext_hasAccessor) continue;
        try {
          tile[i][j]._orig_discovered = !!tile[i][j].discovered;
        } catch(e) {
          tile[i][j]._orig_discovered = false;
        }
        Object.defineProperty(tile[i][j], "discovered", {
          configurable: true,
          enumerable: true,
          get: function(){ return state.forceRevealVisual ? true : this._orig_discovered; },
          set: function(v){ this._orig_discovered = !!v; }
        });
        tile[i][j].__ext_hasAccessor = true;
      }
    }
  }

  function setVisualReveal(on){
    state.forceRevealVisual = !!on;
    installTileAccessors();
    try { if(typeof click === "function") click(0,0); } catch(e) {}
  }

  const liteWrapper = menu.querySelector("#switch-litemap");
  const liteInput   = menu.querySelector("#toggle-litemap");
  liteWrapper.addEventListener("click", function(ev){
    ev.preventDefault(); ev.stopImmediatePropagation(); ev.stopPropagation();
    const enabling = !liteInput.checked;
    if(enabling){
      setVisualReveal(true);
      setSwitch(liteWrapper, true);
    } else {
      setVisualReveal(false);
      setSwitch(liteWrapper, false);
    }
  }, true);

  // Toggle arrow dropdowns
  menu.querySelectorAll(".ext-row .ext-arrow").forEach(arrow => {
    arrow.addEventListener("click", e => {
      const row = e.target.closest(".ext-row");
      row.classList.toggle("open");
    });
  });

  setInterval(updateHeroToggleState, 1000);
})();
