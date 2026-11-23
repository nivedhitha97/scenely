import type { FigureLook } from "@/components/avatar/looks";

/**
 * The intro's drawings, as SVG on a 390 × 600 stage (the storyboard's frame). Each shot is split
 * into layers so the parts that move (the plane, the sails, the train, the boat) can be animated
 * on their own. Outlines are the map's brown, #4A3426.
 */

/** A small seeded random generator, so the tulip field is the same on every phone. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Rows of tulips running into the distance: small and packed at the back, big with stems in front. */
function tulipField(): string {
  const rand = seeded(7);
  const between = (a: number, b: number) => a + (b - a) * rand();
  const rows: [number, string, string][] = [
    [398, "#E0603F", "#B8432A"],
    [408, "#F6D776", "#D9B23F"],
    [420, "#E8738A", "#C24E66"],
    [434, "#B57EDC", "#8E58B8"],
    [452, "#FFF4E0", "#D9C9A8"],
    [474, "#E0603F", "#B8432A"],
    [502, "#F6D776", "#D9B23F"],
    [536, "#E8738A", "#C24E66"],
    [578, "#F29B62", "#C9703A"],
  ];
  const f = (n: number) => n.toFixed(1);
  const out: string[] = ['<rect x="0" y="372" width="390" height="228" fill="#86A94A"/>'];
  for (const [y0, colour, dark] of rows) {
    const yAt = (x: number) => y0 - (x * 0.022 * (y0 - 380)) / 30;
    const s = 1.4 + (y0 - 392) * 0.07;
    const th = s * 1.5;
    out.push(
      `<path d="M0 ${f(y0 + th * 0.9)} L390 ${f(yAt(390) + th * 0.9)} L390 ${f(yAt(390) + th * 1.6)} L0 ${f(y0 + th * 1.6)} Z" fill="#7A5E3E" opacity="0.55"/>`,
      `<path d="M0 ${f(y0 - th * 0.2)} L390 ${f(yAt(390) - th * 0.2)} L390 ${f(yAt(390) + th)} L0 ${f(y0 + th)} Z" fill="#4F7F2E"/>`,
    );
    const step = s * 1.55;
    const heads: string[] = [];
    for (let x = between(0, step); x < 392; x += step * between(0.85, 1.15)) {
      const y = yAt(x) + between(-0.25, 0.25) * s;
      const sc = s * between(0.9, 1.1);
      if (s > 4) {
        out.push(
          `<path d="M${f(x)} ${f(y)} v${f(sc * 1.1)}" stroke="#3E6B24" stroke-width="${f(Math.max(1, sc * 0.18))}"/>`,
          `<path d="M${f(x)} ${f(y + sc * 1.1)} q${f(-sc * 0.6)} ${f(-sc * 0.4)} ${f(-sc * 0.5)} ${f(-sc)} q${f(sc * 0.4)} ${f(sc * 0.3)} ${f(sc * 0.5)} ${f(sc)}" fill="#5E9A38"/>`,
        );
      }
      heads.push(
        `<path transform="translate(${f(x)} ${f(y)}) scale(${sc.toFixed(2)})" d="M-0.62 -0.9 L-0.3 -0.45 L0 -1 L0.3 -0.45 L0.62 -0.9 Q0.7 0.1 0 0.15 Q-0.7 0.1 -0.62 -0.9Z"/>`,
      );
    }
    const outline = s > 3 ? ` stroke="${dark}" stroke-width="0.12"` : "";
    out.push(`<g fill="${colour}"${outline}>${heads.join("")}</g>`);
  }
  return out.join("");
}

const svg = (body: string, viewBox = "0 0 390 600") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`;

/* ---------- 1 · De landing ---------- */

export const LANDING_SKY = svg(`
<rect width="390" height="600" fill="#CFE6F0"/>
<g fill="#FFFFFF"><ellipse cx="70" cy="110" rx="40" ry="13"/><ellipse cx="95" cy="102" rx="24" ry="12"/><ellipse cx="300" cy="80" rx="46" ry="14"/><ellipse cx="326" cy="72" rx="26" ry="12"/><ellipse cx="250" cy="230" rx="34" ry="10"/></g>`);

export const LANDING_PLANE = svg(`
<path d="M-120 60 C 0 140, 140 190, 230 222" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>
<g transform="translate(250 228) rotate(14)">
<path d="M-70 -6 h120 q22 0 30 10 q-8 10 -30 10 h-120 q-10 0 -10 -10 q0 -10 10 -10 z" fill="#FFFFFF" stroke="#4A3426" stroke-width="2.5"/>
<path d="M-72 -6 l-14 -26 h16 l22 26 z" fill="#F29B62" stroke="#4A3426" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M-20 4 l-30 34 h18 l40 -34 z" fill="#E9E4DA" stroke="#4A3426" stroke-width="2.5" stroke-linejoin="round"/>
<rect x="-60" y="2" width="104" height="5" fill="#3D8279"/>
<g fill="#8FB5D0" stroke="#4A3426" stroke-width="1"><circle cx="-44" cy="-1" r="3"/><circle cx="-32" cy="-1" r="3"/><circle cx="-20" cy="-1" r="3"/><circle cx="-8" cy="-1" r="3"/><circle cx="4" cy="-1" r="3"/><circle cx="16" cy="-1" r="3"/><circle cx="28" cy="-1" r="3"/></g>
<path d="M58 -4 q10 2 14 8 h-12 z" fill="#8FB5D0" stroke="#4A3426" stroke-width="1.5"/>
</g>`);

export const LANDING_GROUND = svg(`
<rect x="0" y="360" width="390" height="240" fill="#9DBB67"/>
<path d="M0 360 C 100 350, 260 366, 390 356 V 372 H 0 Z" fill="#9DBB67"/>
${tulipField()}
<path d="M0 386 C 140 380, 260 384, 390 378" fill="none" stroke="#6CB2DC" stroke-width="7"/>
<g fill="#7DAE48" stroke="#4E6B2E" stroke-width="1.5"><circle cx="30" cy="356" r="10"/><circle cx="48" cy="352" r="12"/><circle cx="66" cy="356" r="9"/><circle cx="150" cy="354" r="9"/><circle cx="166" cy="351" r="11"/></g>
<g transform="translate(300 380)">
<path d="M-14 0 L-9 -64 H9 L14 0 Z" fill="#9C7A5E" stroke="#4A3426" stroke-width="2.5"/>
<path d="M-11 -64 h22 l-11 -12 z" fill="#5E4636" stroke="#4A3426" stroke-width="2"/>
<rect x="-5" y="-18" width="10" height="18" fill="#5A3E2B"/>
</g>`);

/** The windmill's sails around their hub, which sits at (300, 316) on the stage. */
export const SAILS_HUB = { x: 300, y: 316, size: 112 };
export const LANDING_SAILS = svg(
  `<g stroke="#4A3426" stroke-width="2">
<rect x="-4" y="-54" width="8" height="52" fill="#F4EBD3"/><rect x="-4" y="2" width="8" height="52" fill="#F4EBD3"/><rect x="-54" y="-4" width="52" height="8" fill="#F4EBD3"/><rect x="2" y="-4" width="52" height="8" fill="#F4EBD3"/>
<circle cx="0" cy="0" r="5" fill="#5E4636"/></g>`,
  "-56 -56 112 112",
);

/* ---------- 2 · Welkom in Nederland ---------- */

/** The arrivals hall. `sky` is the colour seen through the big windows. */
export const airportHall = (sky: string) =>
  svg(`
<rect width="390" height="600" fill="#F3EEE4"/>
<rect x="0" y="0" width="390" height="40" fill="#E2DACB"/>
<g fill="#FFFDF4" stroke="#D7CDBB" stroke-width="1"><rect x="40" y="16" width="70" height="8" rx="4"/><rect x="160" y="16" width="70" height="8" rx="4"/><rect x="280" y="16" width="70" height="8" rx="4"/></g>
<rect x="0" y="40" width="390" height="300" fill="${sky}"/>
<path d="M230 210 l50 -30 h40 l-60 40 z" fill="#FFFFFF" stroke="#4A3426" stroke-width="2"/>
<path d="M316 180 l12 -24 h12 l-8 24 z" fill="#F29B62" stroke="#4A3426" stroke-width="2"/>
<rect x="0" y="300" width="390" height="40" fill="#9DBB67" opacity="0.6"/>
<g stroke="#7E8C8A" stroke-width="6"><path d="M0 40 V340 M98 40 V340 M196 40 V340 M294 40 V340 M390 40 V340 M0 190 H390"/></g>
<rect x="0" y="340" width="390" height="260" fill="#E9E4DA"/>
<g stroke="#D9D1C2" stroke-width="2"><path d="M0 400 H390 M0 470 H390 M0 550 H390 M60 340 L20 600 M150 340 L130 600 M240 340 L250 600 M330 340 L370 600"/></g>
<g transform="translate(70 470)" opacity="0.85">
<rect x="-12" y="-80" width="24" height="44" rx="9" fill="#7FA6C2"/><circle cx="0" cy="-92" r="10" fill="#C99673"/><path d="M-6 -36 v36 M6 -36 v36" stroke="#4A5A60" stroke-width="6" stroke-linecap="round"/>
<rect x="16" y="-26" width="22" height="26" rx="4" fill="#5E7E9A"/>
</g>
<g transform="translate(330 460)" opacity="0.85">
<rect x="-12" y="-80" width="24" height="44" rx="9" fill="#D98C7A"/><circle cx="0" cy="-92" r="10" fill="#E8B996"/><path d="M-12 -98 a12 12 0 0 1 24 0 z" fill="#B07A4A"/><path d="M-6 -36 v36 M6 -36 v36" stroke="#4A4A48" stroke-width="6" stroke-linecap="round"/>
</g>`);

/** The sign hangs from two cables; it swings in around the top of the cables, (195, 40). */
export const SIGN_PIVOT = { x: 195, y: 40 };
export const AIRPORT_SIGN = svg(`
<g transform="translate(195 180)">
<path d="M-70 -140 V-40 M70 -140 V-40" stroke="#4A3426" stroke-width="3"/>
<rect x="-150" y="-40" width="300" height="96" rx="14" fill="#2F5D57" stroke="#4A3426" stroke-width="3"/>
<text x="0" y="0" text-anchor="middle" font-family="Nunito_900Black" font-weight="900" font-size="30" fill="#FFF8EF">Welkom in</text>
<text x="0" y="36" text-anchor="middle" font-family="Nunito_900Black" font-weight="900" font-size="30" fill="#EACB78">Nederland</text>
<g transform="translate(118 -12)" fill="none" stroke="#FFF8EF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M-8 0 h16 M2 -7 l7 7 -7 7"/></g>
<g transform="translate(-120 -10)" fill="#EACB78"><path d="M-6 6 C -6 -2 6 -2 6 6 Z"/><rect x="-1" y="6" width="2" height="8"/></g>
</g>`);

/** The learner's suitcase, 26 × 34, wheels at the bottom. */
export const SUITCASE = svg(
  `<path d="M8 6 v-5 h10 v5" fill="none" stroke="#4A3426" stroke-width="2"/>
<rect x="1" y="6" width="24" height="24" rx="4" fill="#F29B62" stroke="#4A3426" stroke-width="1.6"/>
<path d="M9 8 v20 M17 8 v20" stroke="#D97C42" stroke-width="1.5"/>
<circle cx="6" cy="31" r="2.5" fill="#2E2E2E"/><circle cx="20" cy="31" r="2.5" fill="#2E2E2E"/>`,
  "0 0 26 34",
);

/* ---------- 3 · Met de trein ---------- */

export const TRAIN_SKY = svg(`
<rect width="390" height="600" fill="#CFE6F0"/>
<g fill="#FFFFFF"><ellipse cx="300" cy="120" rx="40" ry="12"/><ellipse cx="322" cy="112" rx="22" ry="11"/><ellipse cx="80" cy="160" rx="30" ry="9"/></g>`);

/** Canal houses behind the bridge. Drawn wider than the stage so they can drift (parallax). */
export const TRAIN_HOUSES = svg(
  `<g stroke="#4A3426" stroke-width="2.5" stroke-linejoin="round">
<path d="M10 330 V230 h8 v-10 h8 v-10 h20 v10 h8 v10 h8 V330 Z" fill="#A65E46"/>
<path d="M70 330 V215 q30 -40 60 0 V330 Z" fill="#E8C35B"/>
<path d="M130 330 V240 h14 v-22 h32 v22 h14 V330 Z" fill="#3F6156"/>
<path d="M190 330 V225 l35 -30 l35 30 V330 Z" fill="#D98C7A"/>
<path d="M260 330 V235 h10 v-12 h10 v-12 h20 v12 h10 v12 h10 V330 Z" fill="#C9974B"/>
<path d="M320 330 V220 q35 -40 70 0 V330 Z" fill="#5E7E9A"/>
<path d="M390 330 V232 h10 v-12 h10 v-12 h22 v12 h10 v12 h10 V330 Z" fill="#A65E46"/>
</g>
<g fill="#FBF4E8" stroke="#4A3426" stroke-width="1.5">
<rect x="22" y="240" width="12" height="16"/><rect x="40" y="240" width="12" height="16"/><rect x="22" y="276" width="12" height="16"/><rect x="40" y="276" width="12" height="16"/>
<rect x="84" y="232" width="12" height="16"/><rect x="104" y="232" width="12" height="16"/><rect x="84" y="270" width="12" height="16"/><rect x="104" y="270" width="12" height="16"/>
<rect x="144" y="250" width="12" height="16"/><rect x="164" y="250" width="12" height="16"/><rect x="144" y="286" width="12" height="16"/><rect x="164" y="286" width="12" height="16"/>
<rect x="204" y="240" width="12" height="16"/><rect x="234" y="240" width="12" height="16"/><rect x="204" y="278" width="12" height="16"/><rect x="234" y="278" width="12" height="16"/>
<rect x="274" y="246" width="12" height="16"/><rect x="294" y="246" width="12" height="16"/><rect x="274" y="282" width="12" height="16"/><rect x="294" y="282" width="12" height="16"/>
<rect x="336" y="236" width="12" height="16"/><rect x="360" y="236" width="12" height="16"/><rect x="336" y="274" width="12" height="16"/><rect x="360" y="274" width="12" height="16"/>
<rect x="404" y="242" width="12" height="16"/><rect x="420" y="242" width="12" height="16"/><rect x="404" y="278" width="12" height="16"/><rect x="420" y="278" width="12" height="16"/>
</g>
<rect x="0" y="330" width="450" height="22" fill="#D9CBB6"/>`,
  "0 0 450 600",
);
export const TRAIN_HOUSES_WIDTH = 450;

export const TRAIN_BRIDGE = svg(`
<rect x="0" y="352" width="390" height="18" fill="#7E6A5A"/>
<g fill="#9C8676" stroke="#4A3426" stroke-width="2">
<path d="M20 370 h60 v60 q-30 -30 -60 0 z"/>
<path d="M160 370 h70 v60 q-35 -34 -70 0 z"/>
<path d="M310 370 h60 v60 q-30 -30 -60 0 z"/>
</g>
<rect x="0" y="430" width="390" height="170" fill="#6CB2DC"/>
<g fill="none" stroke="#A9D4EC" stroke-width="3" stroke-linecap="round"><path d="M30 470 q10 -5 20 0 q10 5 20 0"/><path d="M200 500 q10 -5 20 0 q10 5 20 0"/><path d="M300 460 q10 -5 20 0"/></g>
<g transform="translate(110 520)"><path d="M0 0 h90 l-10 18 h-70 z" fill="#3D8279" stroke="#4A3426" stroke-width="2"/><rect x="18" y="-16" width="50" height="16" rx="3" fill="#F4EBD3" stroke="#4A3426" stroke-width="1.5"/></g>`);

/** The learner's head and waving arm in a train window, in their own skin, hair and top colours. */
function windowHead(look: FigureLook): string {
  const hair =
    look.hairStyle === "curly"
      ? `<g fill="${look.hair}"><circle cx="-5" cy="-15" r="4"/><circle cx="0" cy="-18" r="4.2"/><circle cx="6" cy="-15" r="4"/></g>`
      : look.hairStyle === "long"
        ? `<path d="M-8 -9 q-1 -10 8 -10 q9 0 8 10 v8 h-3 v-8 q-5 -3 -10 0 v8 h-3 z" fill="${look.hair}"/>`
        : `<path d="M-7.5 -11 q0 -9 7.5 -9 q7.5 0 7.5 9 q-4 -3 -7.5 -3 q-3.5 0 -7.5 3z" fill="${look.hair}"/>${look.hairStyle === "bun" ? `<circle cx="0" cy="-21" r="3.5" fill="${look.hair}"/>` : ""}`;
  return `<g transform="translate(183 326)">
<circle cx="0" cy="-10" r="7.5" fill="${look.skin}" stroke="#4A3426" stroke-width="1"/>${hair}
<path d="M-8 4 q8 -8 16 0" fill="${look.top}"/>
<path d="M8 -2 l8 -14" stroke="${look.top}" stroke-width="4" stroke-linecap="round"/>
<circle cx="16" cy="-17" r="2.6" fill="${look.skin}"/></g>`;
}

export const trainCar = (look: FigureLook) =>
  svg(`
<g stroke="#4A3426" stroke-width="2.5">
<path d="M-10 300 h360 q34 0 40 30 v22 h-400 z" fill="#F4EBD3"/>
<rect x="-10" y="332" width="400" height="8" fill="#3D8279" stroke="none"/>
<path d="M118 300 v52 M248 300 v52" fill="none"/>
</g>
<g fill="#8FB5D0" stroke="#4A3426" stroke-width="1.5">
<rect x="6" y="308" width="30" height="20" rx="3"/><rect x="46" y="308" width="30" height="20" rx="3"/><rect x="132" y="308" width="30" height="20" rx="3"/><rect x="204" y="308" width="30" height="20" rx="3"/><rect x="262" y="308" width="30" height="20" rx="3"/><rect x="302" y="308" width="30" height="20" rx="3"/>
<path d="M352 308 h14 q14 2 18 20 h-32 z"/>
</g>
<rect x="168" y="306" width="30" height="24" rx="3" fill="#CFE6F0" stroke="#4A3426" stroke-width="1.5"/>
${windowHead(look)}
<g fill="#2E2E2E"><circle cx="40" cy="356" r="7"/><circle cx="90" cy="356" r="7"/><circle cx="170" cy="356" r="7"/><circle cx="220" cy="356" r="7"/><circle cx="300" cy="356" r="7"/><circle cx="350" cy="356" r="7"/></g>`);

/* ---------- 4 · Op de fiets ---------- */

export const CANAL_STREET = svg(`
<rect width="390" height="600" fill="#CFE6F0"/>
<g fill="#FFFFFF"><ellipse cx="80" cy="130" rx="38" ry="12"/><ellipse cx="102" cy="122" rx="22" ry="11"/></g>
<g stroke="#4A3426" stroke-width="2.5" stroke-linejoin="round">
<path d="M0 360 V200 h12 v-14 h12 v-14 h28 v14 h12 v14 h12 V360 Z" fill="#3F6156"/>
<path d="M88 360 V180 q36 -48 72 0 V360 Z" fill="#D98C7A"/>
<path d="M160 360 V210 l42 -36 l42 36 V360 Z" fill="#E8C35B"/>
<path d="M244 360 V196 h12 v-14 h12 v-14 h30 v14 h12 v14 h12 V360 Z" fill="#A65E46"/>
<path d="M322 360 V190 q34 -44 68 0 V360 Z" fill="#7FA6C2"/>
</g>
<g fill="#FBF4E8" stroke="#4A3426" stroke-width="1.5">
<rect x="14" y="214" width="16" height="22"/><rect x="44" y="214" width="16" height="22"/><rect x="14" y="262" width="16" height="22"/><rect x="44" y="262" width="16" height="22"/>
<rect x="104" y="200" width="16" height="22"/><rect x="128" y="200" width="16" height="22"/><rect x="104" y="250" width="16" height="22"/><rect x="128" y="250" width="16" height="22"/>
<rect x="176" y="222" width="16" height="22"/><rect x="212" y="222" width="16" height="22"/><rect x="176" y="270" width="16" height="22"/><rect x="212" y="270" width="16" height="22"/>
<rect x="260" y="210" width="16" height="22"/><rect x="290" y="210" width="16" height="22"/><rect x="260" y="258" width="16" height="22"/><rect x="290" y="258" width="16" height="22"/>
<rect x="336" y="210" width="16" height="22"/><rect x="362" y="210" width="16" height="22"/><rect x="336" y="258" width="16" height="22"/><rect x="362" y="258" width="16" height="22"/>
</g>
<g fill="#5A3E2B"><rect x="28" y="326" width="18" height="34"/><rect x="116" y="326" width="18" height="34"/><rect x="194" y="326" width="18" height="34"/><rect x="276" y="326" width="18" height="34"/><rect x="348" y="326" width="18" height="34"/></g>
<rect x="0" y="360" width="390" height="80" fill="#EADBB9"/>
<g fill="none" stroke-width="2.2">
<circle cx="40" cy="372" r="9" stroke="#2E2E2E"/><circle cx="62" cy="372" r="9" stroke="#2E2E2E"/><path d="M40 372 h10 l6 -12 l6 12 M50 372 l-4 -14" stroke="#B5523B"/>
<circle cx="80" cy="372" r="9" stroke="#2E2E2E"/><circle cx="102" cy="372" r="9" stroke="#2E2E2E"/><path d="M80 372 h10 l6 -12 l6 12 M90 372 l-4 -14" stroke="#3D8279"/>
</g>
<path d="M30 382 h84" stroke="#7E6A5A" stroke-width="3"/>
<g fill="#7DAE48" stroke="#4E6B2E" stroke-width="1.5"><circle cx="350" cy="350" r="14"/><circle cx="366" cy="344" r="12"/><circle cx="358" cy="334" r="12"/></g>
<rect x="356" y="350" width="5" height="20" fill="#7A5432"/>
<rect x="0" y="440" width="390" height="160" fill="#6CB2DC"/>
<rect x="0" y="440" width="390" height="8" fill="#4A8DB8"/>
<g fill="none" stroke="#A9D4EC" stroke-width="3" stroke-linecap="round"><path d="M40 490 q10 -5 20 0 q10 5 20 0"/><path d="M260 520 q10 -5 20 0 q10 5 20 0"/></g>`);

export const CANAL_BOAT = svg(
  `<g transform="translate(250 470)"><path d="M0 0 h96 l-12 20 h-74 z" fill="#C46E4E" stroke="#4A3426" stroke-width="2"/><rect x="20" y="-16" width="52" height="16" rx="3" fill="#F4EBD3" stroke="#4A3426" stroke-width="1.5"/></g>`,
);

/* ---------- 5 · Je verhaal begint ---------- */

export const CAFE_STREET = svg(`
<rect width="390" height="600" fill="#CFE6F0"/>
<g fill="#FFFFFF"><ellipse cx="310" cy="96" rx="40" ry="12"/><ellipse cx="334" cy="88" rx="22" ry="11"/></g>
<g stroke="#4A3426" stroke-width="2.5" stroke-linejoin="round">
<path d="M-10 470 V170 h20 v-16 h14 v-16 h40 v16 h14 v16 h22 V470 Z" fill="#3F6156"/>
<path d="M100 470 V140 l90 -70 l90 70 V470 Z" fill="#C9974B"/>
<path d="M280 470 V160 q60 -70 120 0 V470 Z" fill="#D98C7A"/>
</g>
<g fill="#FBF4E8" stroke="#4A3426" stroke-width="1.5">
<rect x="10" y="190" width="20" height="28"/><rect x="50" y="190" width="20" height="28"/><rect x="10" y="250" width="20" height="28"/><rect x="50" y="250" width="20" height="28"/>
<rect x="130" y="150" width="22" height="30"/><rect x="178" y="150" width="22" height="30"/><rect x="226" y="150" width="22" height="30"/>
<rect x="130" y="212" width="22" height="30"/><rect x="178" y="212" width="22" height="30"/><rect x="226" y="212" width="22" height="30"/>
<rect x="306" y="190" width="20" height="28"/><rect x="350" y="190" width="20" height="28"/><rect x="306" y="250" width="20" height="28"/><rect x="350" y="250" width="20" height="28"/>
</g>
<circle cx="190" cy="112" r="9" fill="#FBF4E8" stroke="#4A3426" stroke-width="1.5"/>
<rect x="104" y="296" width="172" height="34" rx="6" fill="#2F5D57" stroke="#4A3426" stroke-width="2.5"/>
<text x="190" y="320" text-anchor="middle" font-family="Nunito_900Black" font-weight="900" font-size="19" fill="#FFF8EF">Koffiebar</text>
<path d="M96 334 h188 l14 36 h-216 z" fill="#FFF8EF" stroke="#4A3426" stroke-width="2.5" stroke-linejoin="round"/>
<g fill="#E0603F"><path d="M100 334 h22 l-2 36 h-27 z"/><path d="M144 334 h22 l3 36 h-27 z"/><path d="M188 334 h22 l8 36 h-27 z"/><path d="M232 334 h22 l13 36 h-27 z"/></g>
<path d="M82 370 q12 10 24 0 q12 10 24 0 q12 10 24 0 q12 10 24 0 q12 10 24 0 q12 10 24 0 q12 10 24 0 q12 10 24 0 q12 10 24 0" fill="#FFF8EF" stroke="#4A3426" stroke-width="2"/>
<rect x="118" y="388" width="62" height="82" rx="4" fill="#F6D776" stroke="#4A3426" stroke-width="2"/>
<path d="M149 388 v82 M118 428 h62" stroke="#4A3426" stroke-width="1.5" fill="none"/>
<g fill="#C46E4E"><circle cx="134" cy="418" r="5"/><circle cx="164" cy="418" r="5"/></g>
<rect x="204" y="384" width="54" height="86" rx="27" fill="#5A3E2B" stroke="#4A3426" stroke-width="2.5"/>
<rect x="210" y="392" width="42" height="40" rx="21" fill="#F6D776" opacity="0.85"/>
<circle cx="246" cy="430" r="3" fill="#E8C25A"/>
<g transform="translate(300 450)">
<path d="M0 20 V-6 h30 v26" fill="none" stroke="#4A3426" stroke-width="2.5"/>
<rect x="-4" y="-34" width="38" height="30" rx="3" fill="#2E3440" stroke="#4A3426" stroke-width="2"/>
<text x="15" y="-20" text-anchor="middle" font-family="Caveat_700Bold" font-size="11" fill="#FFF8EF">koffie</text>
<text x="15" y="-8" text-anchor="middle" font-family="Caveat_700Bold" font-size="11" fill="#EACB78">thee</text>
</g>
<g transform="translate(30 440)">
<path d="M0 30 l6 -30 h28 l6 30 z" fill="#C46E4E" stroke="#4A3426" stroke-width="2"/>
<g fill="#7DAE48" stroke="#4E6B2E" stroke-width="1.5"><circle cx="12" cy="-6" r="8"/><circle cx="28" cy="-6" r="8"/><circle cx="20" cy="-14" r="9"/></g>
<circle cx="12" cy="-10" r="3.5" fill="#E8738A"/><circle cx="26" cy="-14" r="3.5" fill="#E0603F"/><circle cx="20" cy="-4" r="3.5" fill="#F6D776"/>
</g>
<rect x="0" y="470" width="390" height="130" fill="#EADBB9"/>
<g stroke="#D9C9A4" stroke-width="2"><path d="M0 510 H390 M0 556 H390 M50 470 v40 M140 470 v40 M230 470 v40 M320 470 v40 M95 510 v46 M185 510 v46 M275 510 v46 M365 510 v46"/></g>`);
