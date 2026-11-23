#!/usr/bin/env python3
"""
Draws the Scenely app icon and launch-screen mark, and renders them to PNG with macOS's
built-in sips (no extra tools; it keeps transparency). The mark: a speech bubble holding three canal houses above
a strip of canal, on the blueprint's coral.

Run from the scenely folder:  python3 scripts/build-icons.py
Writes assets/images/{icon,android-icon-foreground,android-icon-background,android-icon-monochrome,splash-icon,favicon}.png
and the SVG sources in assets/icon/.
"""
import os
import shutil
import subprocess
import tempfile

CORAL = "#F29B62"
INK = "#4A3426"
OUT = "assets/images"
SRC = "assets/icon"


def houses(stroke=True):
    s = f' stroke="{INK}" stroke-width="12" stroke-linejoin="round"' if stroke else ""
    win = lambda x, y: f'<rect x="{x}" y="{y}" width="30" height="40" rx="4" fill="#FBF4E8"{s.replace("12", "8")}/>'
    return f"""
  <path d="M300 600 V460 h20 v-24 h20 v-24 h40 v24 h20 v24 h20 V600 Z" fill="#A65E46"{s}/>
  {win(322, 480)}{win(368, 480)}{win(322, 540)}{win(368, 540)}
  <path d="M452 600 V420 q60 -90 120 0 V600 Z" fill="#E8C35B"{s}/>
  {win(474, 440)}{win(520, 440)}{win(474, 520)}{win(520, 520)}
  <path d="M604 600 V470 h30 v-40 h60 v40 h30 V600 Z" fill="#3D8279"{s}/>
  {win(626, 490)}{win(672, 490)}{win(626, 550)}{win(672, 550)}
  <rect x="262" y="604" width="500" height="44" rx="22" fill="#6CB2DC"/>"""


BUBBLE_D = "M332 230 H692 a120 120 0 0 1 120 120 V600 a120 120 0 0 1 -120 120 H460 L300 840 L340 720 H332 a120 120 0 0 1 -120 -120 V350 a120 120 0 0 1 120 -120 Z"


def bubble(fill="#FFFFFF"):
    return f'<path d="{BUBBLE_D}" fill="{fill}"/>'


def mark(scale=1.0, mono=False):
    """The bubble and houses centred in a 1024 box, scaled about the centre."""
    inner = bubble("#FFFFFF") if mono else bubble() + houses()
    if mono:
        # Single-colour version (Android themed icons): one even-odd path, so the houses are holes
        # in the bubble and their windows are filled again.
        rr = lambda x, y, w, h, r: f"M{x + r} {y} h{w - 2 * r} a{r} {r} 0 0 1 {r} {r} v{h - 2 * r} a{r} {r} 0 0 1 -{r} {r} h-{w - 2 * r} a{r} {r} 0 0 1 -{r} -{r} v-{h - 2 * r} a{r} {r} 0 0 1 {r} -{r} Z"
        windows = [(322, 480), (368, 480), (322, 540), (368, 540), (474, 440), (520, 440), (474, 520), (520, 520), (626, 490), (672, 490), (626, 550), (672, 550)]
        d = " ".join([
            BUBBLE_D,
            "M300 600 V460 h20 v-24 h20 v-24 h40 v24 h20 v24 h20 V600 Z",
            "M452 600 V420 q60 -90 120 0 V600 Z",
            "M604 600 V470 h30 v-40 h60 v40 h30 V600 Z",
            rr(262, 610, 500, 36, 18),
            *[rr(x, y, 30, 40, 4) for x, y in windows],
        ])
        inner = f'<path d="{d}" fill="#FFFFFF" fill-rule="evenodd"/>'
    t = f"translate({512 - 512 * scale} {512 - 512 * scale}) scale({scale})"
    return f'<g transform="{t}">{inner}</g>'


def svg(body, bg=None):
    rect = f'<rect width="1024" height="1024" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">{rect}{body}</svg>'


FILES = {
    # iOS and the store: full square, no transparency (iOS rounds the corners itself).
    "icon": (svg(mark(0.92), CORAL), True),
    # Android adaptive icon: the mark inside the 66% safe zone, on a coral layer.
    "android-icon-foreground": (svg(mark(0.62)), False),
    "android-icon-background": (svg("", CORAL), True),
    "android-icon-monochrome": (svg(mark(0.62, mono=True)), False),
    # Launch screen mark, shown centred on the cream (or dark) background.
    "splash-icon": (svg(mark(0.95)), False),
}


def render(svg_text, png_path, opaque):
    with tempfile.TemporaryDirectory() as tmp:
        src = os.path.join(tmp, "x.svg")
        open(src, "w").write(svg_text)
        out = os.path.join(tmp, "x.png")
        subprocess.run(["sips", "-s", "format", "png", src, "--out", out], check=True, capture_output=True)
        if opaque:
            # Drop the alpha channel: App Store icons must be fully opaque.
            jpg = os.path.join(tmp, "x.jpg")
            subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "100", out, "--out", jpg], check=True, capture_output=True)
            subprocess.run(["sips", "-s", "format", "png", jpg, "--out", out], check=True, capture_output=True)
        shutil.copy(out, png_path)


os.makedirs(SRC, exist_ok=True)
for name, (text, opaque) in FILES.items():
    open(os.path.join(SRC, f"{name}.svg"), "w").write(text)
    render(text, os.path.join(OUT, f"{name}.png"), opaque)
    print("wrote", f"{OUT}/{name}.png")
shutil.copy(os.path.join(OUT, "icon.png"), os.path.join(OUT, "favicon.png"))
subprocess.run(["sips", "-Z", "48", os.path.join(OUT, "favicon.png")], check=True, capture_output=True)
print("wrote", f"{OUT}/favicon.png")
