// Builds docs/figma/built-screens.html: four phone screens rebuilt from the app's own drawing code and map data,
// for html_to_figma. Run from the scenely folder:  node scripts/build-figma-screens.js
const fs = require("fs");
const path = require("path");
const ts = require(path.resolve("node_modules/typescript"));

const OUT = path.resolve("docs/figma/built-screens.html");
const tsx = fs.readFileSync("src/components/CafeScene.tsx", "utf8");
const pick = (re) => { const m = tsx.match(re); if (!m) throw new Error("missing " + re); return m[0]; };
const looks = pick(/const LOOKS = \{[\s\S]*?\n\};/);
const fn = (name) => pick(new RegExp(`function ${name}\\([\\s\\S]*?\\n\\}\\n`));
const src = `${looks}\n${fn("drawPerson")}\n${fn("drawSupermarkt")}\n${fn("drawCheckout")}\nmodule.exports = { drawPerson, drawSupermarkt, drawCheckout };`;
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 } }).outputText;

// Minimal stand-ins for src/components/shapes.tsx that emit absolutely positioned divs.
const r = (tl, tr = tl, br = tl, bl = tl) => ({ borderTopLeftRadius: tl, borderTopRightRadius: tr, borderBottomRightRadius: br, borderBottomLeftRadius: bl });
const rot = (deg) => ({ transform: [{ rotate: `${deg}deg` }] });
const CSS = { borderTopLeftRadius: "border-top-left-radius", borderTopRightRadius: "border-top-right-radius", borderBottomRightRadius: "border-bottom-right-radius", borderBottomLeftRadius: "border-bottom-left-radius", borderWidth: "border-width", borderColor: "border-color", opacity: "opacity", transformOrigin: "transform-origin", borderTopWidth: "border-top-width", borderBottomWidth: "border-bottom-width" };
class Canvas {
  constructor() { this.out = []; }
  box(x, y, w, h, c, extra = {}) {
    const st = [`position:absolute`, `left:${x}px`, `top:${y}px`, `width:${w}px`, `height:${h}px`, `background:${c}`, `box-sizing:border-box`];
    let hasBorder = false;
    for (const [k, v] of Object.entries(extra)) {
      if (k === "transform") st.push(`transform:${v.map((t) => Object.entries(t).map(([a, b]) => `${a}(${b})`).join(" ")).join(" ")}`);
      else if (CSS[k]) { st.push(`${CSS[k]}:${typeof v === "number" && !/opacity/.test(k) ? v + "px" : v}`); if (/border.*Width/.test(k)) hasBorder = true; }
    }
    if (hasBorder) st.push("border-style:solid");
    this.out.push(`<div style="${st.join(";")}"></div>`);
  }
}
const mod = { exports: {} };
new Function("module", "exports", "Canvas", "r", "rot", "CAFE_WIDTH", "CAFE_HEIGHT", js)(mod, mod.exports, Canvas, r, rot, 350, 290);
const { drawPerson, drawSupermarkt, drawCheckout } = mod.exports;

function checkout(person, mood, happy) {
  const room = new Canvas(); drawSupermarkt(room);
  const who = new Canvas(); drawPerson(who, person, mood, false);
  const counter = new Canvas(); drawCheckout(counter, { bag: happy, sparkle: happy });
  return `<div style="position:relative;width:350px;height:290px;overflow:hidden;background:#F4E6D6;border-radius:18px">${room.out.join("")}<div style="position:absolute;left:118px;top:42px;width:120px;height:190px">${who.out.join("")}</div>${counter.out.join("")}</div>`;
}

// ---- map data from the app ----
const data = fs.readFileSync("src/components/map/amsterdamMapData.ts", "utf8");
const xml = JSON.parse(data.match(/export const AMSTERDAM_XML = (".*");/)[1]);
const route = [...data.matchAll(/\{ x: ([\d.-]+), y: ([\d.-]+) \}/g)].map((m) => ({ x: +m[1], y: +m[2] }));
const placesSrc = fs.readFileSync("src/scenes/nl/places.ts", "utf8");
const places = [...placesSrc.matchAll(/id: "([a-z]+)", title: "([^"]+)".*?door: \{ x: (\d+), y: (\d+) \}, label: \{ x: (\d+), y: (\d+) \}/g)].map((m) => ({ id: m[1], title: m[2], door: { x: +m[3], y: +m[4] }, label: { x: +m[5], y: +m[6] } }));

const FONT = "font-family:Nunito,sans-serif";
const look = { skin: "#8C5A3C", hair: "#2E3440", top: "#E8C25A", bottom: "#3E5A64" };
const cyclist = (flip = false) => `<svg width="68" height="90" viewBox="-34 -84 68 90" xmlns="http://www.w3.org/2000/svg"${flip ? ' style="transform:scaleX(-1)"' : ""}><ellipse cx="0" cy="1" rx="30" ry="4" fill="#4A3426" opacity="0.18"/><path d="M-10 -34 L2 -22 L6 -14" fill="none" stroke="${look.bottom}" stroke-width="5" stroke-linecap="round" opacity="0.7"/><circle cx="-17" cy="-12" r="12" fill="none" stroke="#2E2E2E" stroke-width="2.6"/><circle cx="17" cy="-12" r="12" fill="none" stroke="#2E2E2E" stroke-width="2.6"/><path d="M-17 -12 L-4 -12 L4 -28 L17 -12 M-4 -12 L-9 -32 M4 -28 L13 -34" fill="none" stroke="#3E6E8E" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M-14 -33 h9" stroke="#2E2E2E" stroke-width="3" stroke-linecap="round"/><rect x="15" y="-33" width="15" height="10" rx="2" fill="#C69A5B" stroke="#4A3426" stroke-width="1.2"/><circle cx="19" cy="-35" r="3" fill="#E85D5D"/><circle cx="24" cy="-36" r="3" fill="#F6D776"/><circle cx="28" cy="-34" r="2.6" fill="#E8738A"/><path d="M-10 -34 L-1 -18 L-4 -10" fill="none" stroke="${look.bottom}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M-9 -34 L-3 -58" stroke="#4A3426" stroke-width="13" stroke-linecap="round"/><path d="M-9 -34 L-3 -58" stroke="${look.top}" stroke-width="10.5" stroke-linecap="round"/><path d="M-3 -52 L12 -38" stroke="${look.top}" stroke-width="4.5" stroke-linecap="round"/><circle cx="-1" cy="-67" r="8.5" fill="${look.skin}" stroke="#4A3426" stroke-width="1.2"/><g fill="${look.hair}"><circle cx="-7" cy="-72" r="4.5"/><circle cx="-1" cy="-76" r="4.8"/><circle cx="6" cy="-73" r="4.5"/><circle cx="-9" cy="-66" r="4"/></g><circle cx="3.5" cy="-68" r="1" fill="#4A3426"/></svg>`;
const parked = `<svg width="108" height="90" viewBox="-34 -84 108 90" xmlns="http://www.w3.org/2000/svg"><circle cx="-17" cy="-12" r="12" fill="none" stroke="#2E2E2E" stroke-width="2.6"/><circle cx="17" cy="-12" r="12" fill="none" stroke="#2E2E2E" stroke-width="2.6"/><path d="M-17 -12 L-4 -12 L4 -28 L17 -12 M-4 -12 L-9 -32 M4 -28 L13 -34" fill="none" stroke="#3E6E8E" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="15" y="-33" width="15" height="10" rx="2" fill="#C69A5B" stroke="#4A3426"/><circle cx="19" cy="-35" r="3" fill="#E85D5D"/><circle cx="24" cy="-36" r="3" fill="#F6D776"/><path d="M48 0 v-22 M56 0 v-22" stroke="${look.bottom}" stroke-width="5" stroke-linecap="round"/><rect x="43" y="-50" width="18" height="30" rx="7" fill="${look.top}" stroke="#4A3426"/><circle cx="52" cy="-58" r="8.5" fill="${look.skin}" stroke="#4A3426"/><g fill="${look.hair}"><circle cx="46" cy="-63" r="4.5"/><circle cx="52" cy="-67" r="4.8"/><circle cx="59" cy="-64" r="4.5"/></g></svg>`;

function label(p, state, ox, oy) {
  const left = p.label.x + ox, top = p.label.y + oy;
  const lock = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6F7775" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
  const tick = `<span style="width:22px;height:22px;border-radius:11px;background:#3D8279;display:inline-flex;align-items:center;justify-content:center"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>`;
  const here = state === "here";
  const icon = state === "done" ? tick : state === "locked" ? lock : "";
  return `<div style="position:absolute;left:${left - 110}px;top:${top}px;width:220px;display:flex;justify-content:center"><div style="display:flex;align-items:center;gap:6px;height:36px;padding:0 12px;border-radius:18px;background:${here ? "#FCE9DC" : "#FFFDF7"};border:${here ? "2.4px solid #2E2A26" : "1.8px solid #4A3426"};box-sizing:border-box">${icon}<span style="font-family:Caveat,cursive;font-weight:700;font-size:22px;color:${state === "locked" ? "#4E5655" : "#2E2A26"}">${p.title}</span></div></div>`;
}

function mapScreen({ name, ox, oy, states, extra, hud, sheet }) {
  return `<div class="screen" data-name="${name}" style="position:relative;width:390px;height:844px;overflow:hidden;background:#F3E4C4;${FONT};color:#293B3A">
<div style="position:absolute;left:${ox}px;top:${oy}px;width:1200px;height:800px">${xml}</div>
${extra}
${places.map((p) => label(p, states[p.id] || "locked", ox, oy)).join("\n")}
${hud}
${sheet}
</div>`;
}

const hudHallo = `<div style="position:absolute;left:16px;right:16px;top:58px;height:56px;border-radius:16px;background:rgba(255,253,248,0.96);display:flex;align-items:center;padding:0 14px;gap:10px;box-shadow:0 2px 10px rgba(41,59,58,.10)"><div style="flex:1"><div style="font-weight:800;font-size:17px">Hallo!</div><div style="font-weight:800;font-size:12px;color:#8B9290">2 van 8 plekken ontdekt</div></div><div style="width:42px;height:42px;border-radius:21px;background:#FCE9DC;border:2px solid #F29B62;box-sizing:border-box"></div></div>`;
const sheetSuper = `<div style="position:absolute;left:0;right:0;bottom:0;background:#FFF8EF;border-radius:24px 24px 0 0;box-shadow:0 -4px 20px rgba(41,59,58,.10);padding:12px 20px 34px;display:flex;flex-direction:column;gap:14px">
<div style="align-self:center;width:36px;height:5px;border-radius:3px;background:#E2D7C8"></div>
<div style="display:flex;gap:14px;align-items:center"><div style="width:56px;height:56px;border-radius:16px;background:#FCE9DC;display:flex;align-items:center;justify-content:center"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97C42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 11 4-7M19 11l-4-7M2 11h20l-1.5 8a2 2 0 0 1-2 1.6h-13a2 2 0 0 1-2-1.6Z"/></svg></div>
<div><div style="font-weight:800;font-size:12px;letter-spacing:1px;color:#D97C42">HIER BEN JE</div><div style="font-weight:800;font-size:22px">Supermarkt</div><div style="font-weight:600;font-size:14px;color:#8B9290">Boodschappen doen en afrekenen.</div></div></div>
<div style="display:flex;gap:10px"><div style="flex:1;border:1.5px solid #EFE4D6;border-radius:14px;padding:10px 14px;background:#fff"><div style="font-weight:800;font-size:16px">✓ Klant</div><div style="font-weight:600;font-size:13px;color:#8B9290">Alles zit in de tas!</div></div><div style="flex:1;border:2px solid #F29B62;border-radius:14px;padding:10px 14px;background:#fff"><div style="font-weight:800;font-size:16px">Kassa</div><div style="font-weight:600;font-size:13px;color:#8B9290">Volgende</div></div></div>
<div style="height:52px;border-radius:14px;background:#F29B62;color:#fff;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center">Speel als kassa</div></div>`;

// Screen 1: the map, standing at the supermarket.
const s = places.find((p) => p.id === "supermarkt");
const ox1 = -275, oy1 = -60;
const map1 = mapScreen({
  name: "10a Kaart · Amsterdam",
  ox: ox1, oy: oy1,
  states: { koffiebar: "done", supermarkt: "here" },
  extra: `<div style="position:absolute;left:${s.door.x + 34 - 34 + ox1}px;top:${s.door.y + 8 - 84 + oy1}px">${parked}</div>`,
  hud: hudHallo,
  sheet: sheetSuper,
});

// Screen 2: cycling from the supermarket to the market.
const ox2 = -470, oy2 = -60;
const leg = route.slice(24, 73);
const mid = leg[22];
const legPath = leg.map((p, i) => `${i ? "L" : "M"}${p.x + ox2} ${p.y + oy2}`).join(" ");
const map2 = mapScreen({
  name: "10b Kaart · op de fiets",
  ox: ox2, oy: oy2,
  states: { koffiebar: "done", supermarkt: "done" },
  extra: `<svg style="position:absolute;left:0;top:0" width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg"><path d="${legPath}" stroke="#E0603F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.85"/></svg><div style="position:absolute;left:${mid.x + ox2 - 34}px;top:${mid.y + oy2 - 84}px">${cyclist()}</div>`,
  hud: `<div style="position:absolute;left:16px;right:16px;top:58px;height:56px;border-radius:16px;background:rgba(255,253,248,0.96);display:flex;align-items:center;padding:0 14px;gap:10px;box-shadow:0 2px 10px rgba(41,59,58,.10)"><div style="width:30px;height:30px;border-radius:15px;background:#E4F0E9;display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D8279" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div><div style="flex:1"><div style="font-weight:800;font-size:17px">Supermarkt voltooid</div><div style="font-weight:800;font-size:12px;color:#8B9290">Op de fiets naar op de markt…</div></div><div style="font-weight:800;font-size:13px;color:#D97C42">Overslaan</div></div>`,
  sheet: "",
});

// Screens 3 and 4: the supermarket scene, choosing and answered right ("Zeg het mee").
const icon = (d) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  bag: '<path d="M5 8h14l-1 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  bread: '<path d="M5 11a4 4 0 0 1 2-7.5h10A4 4 0 0 1 19 11v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"/>',
  vol: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  snail: '<path d="M2 18h13a5 5 0 0 0 0-10 4 4 0 0 0-4 4 2 2 0 0 0 4 0"/><path d="M18 8l1.5-3M15 7l-.5-3"/>',
  tick: '<path d="M20 6 9 17l-5-5"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
};
function sceneScreen({ name, happy }) {
  const tints = ["#FCE9DC", "#F7EDCF", "#EFE6DE"];
  const answers = [["Nee, dank u. Ik heb een tas.", "bag"], ["Ja, graag. Eén tas, alstublieft.", "bag"], ["Ik heb honger.", "bread"]];
  const card = ([text, ic], i) => {
    const right = happy && i === 0;
    const dim = happy && i !== 0;
    return `<div style="display:flex;align-items:center;gap:14px;min-height:70px;padding:9px 14px 9px 10px;border-radius:18px;box-sizing:border-box;background:${right ? "#E4F0E9" : "#fff"};border:${right ? "2.5px solid #3D8279" : "1.5px solid #EFE4D6"};opacity:${dim ? 0.55 : 1}"><div style="width:48px;height:48px;border-radius:12px;background:${right ? "#fff" : tints[i]};color:${right ? "#3D8279" : "#9C6B3F"};display:flex;align-items:center;justify-content:center">${icon(I[ic])}</div><div style="flex:1;font-weight:800;font-size:17px">${text}</div>${right ? `<div style="width:30px;height:30px;border-radius:15px;background:#3D8279;color:#fff;display:flex;align-items:center;justify-content:center">${icon(I.tick)}</div>` : ""}</div>`;
  };
  const prompt = happy
    ? `<div style="display:flex;align-items:center;gap:8px"><div style="flex:1;font-weight:800;font-size:15px;color:#3D8279">Goed zo! Zeg het mee.</div><div style="width:44px;height:44px;border-radius:22px;background:#E4F0E9;color:#3D8279;display:flex;align-items:center;justify-content:center">${icon(I.vol)}</div><div style="width:44px;height:44px;border-radius:22px;background:#E4F0E9;color:#3D8279;display:flex;align-items:center;justify-content:center">${icon(I.snail)}</div></div>`
    : `<div style="font-weight:800;font-size:15px">Kies je antwoord</div>`;
  return `<div class="screen" data-name="${name}" style="position:relative;width:390px;height:844px;overflow:hidden;background:#FFF8EF;${FONT};color:#293B3A">
<div style="position:absolute;left:20px;right:20px;top:56px;display:flex;align-items:center;gap:10px"><div style="width:44px;height:44px;border-radius:22px;background:#fff;box-shadow:0 2px 8px rgba(41,59,58,.08);display:flex;align-items:center;justify-content:center">${icon(I.back)}</div><div style="flex:1;display:flex;flex-direction:column;align-items:center"><div style="font-weight:800;font-size:17px">Supermarkt</div><div style="display:flex;gap:6px;margin-top:5px">${[0, 1, 2, 3].map((i) => `<div style="width:22px;height:6px;border-radius:3px;background:${happy && i < 2 ? "#EACB78" : "#E8DDCF"}"></div>`).join("")}</div></div><div style="height:30px;padding:0 12px;border-radius:15px;background:#FCE9DC;color:#D97C42;font-weight:800;font-size:13px;display:flex;align-items:center">Klant</div></div>
<div style="position:absolute;left:12px;top:116px;width:366px;height:306px;border-radius:26px;background:#EFE3D3;padding:8px;box-sizing:border-box">${checkout("kassa", happy ? "happy" : "talk", happy)}</div>
<div style="position:absolute;left:20px;right:20px;top:372px;background:#fff;border-radius:22px;padding:16px 18px;box-shadow:0 6px 18px rgba(41,59,58,.08)"><div style="font-weight:800;font-size:12px;letter-spacing:1px;color:#8B9290">KASSAMEDEWERKER</div><div style="font-weight:800;font-size:22px;margin:4px 0 12px">Heeft u een tas nodig?</div><div style="display:flex;gap:10px"><div style="display:flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:12px;background:#F5EFE6;font-weight:800;font-size:14px">${icon(I.vol)}Luister opnieuw</div><div style="display:flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:12px;background:#F5EFE6;font-weight:800;font-size:14px">${icon(I.snail)}Langzaam</div></div></div>
<div style="position:absolute;left:20px;right:20px;top:520px;display:flex;flex-direction:column;gap:10px">${prompt}${answers.map(card).join("")}</div>
${happy ? `<div style="position:absolute;left:20px;right:20px;bottom:34px;height:52px;border-radius:14px;background:#F29B62;color:#fff;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center">Verder</div>` : ""}
</div>`;
}

const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>Scenely · built screens</title>
<style>body{margin:0;background:#E9E4DA}.row{display:flex;gap:60px;padding:40px;width:max-content}.screen{flex-shrink:0}</style></head><body><div class="row">
${map1}
${map2}
${sceneScreen({ name: "11a Supermarkt – choose", happy: false })}
${sceneScreen({ name: "11b Supermarkt – correct · Zeg het mee", happy: true })}
</div></body></html>`;
fs.writeFileSync(OUT, html);
console.log("wrote", OUT, Math.round(html.length / 1024) + " KB", "places", places.length, "route", route.length);
