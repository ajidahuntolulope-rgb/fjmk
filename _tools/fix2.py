import os
from PIL import Image
import numpy as np

DL = r"C:\Users\User\Downloads"
OUT = r"C:\Users\User\hermes-work\fjmk\assets\img"

def crop_save(name, src, box, max_w, q=86):
    p = os.path.join(DL, src)
    im = Image.open(p).convert("RGB")
    W, H = im.size
    l, t, r, b = box
    im = im.crop((int(l*W), int(t*H), int(r*W), int(b*H)))
    if im.width > max_w:
        h = int(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    dst = os.path.join(OUT, name)
    im.save(dst, "WEBP", quality=q, method=6)
    print(f"{name:32s} {im.size[0]}x{im.size[1]} {os.path.getsize(dst)//1024}KB")

def check(name):
    p = os.path.join(OUT, name)
    a = np.asarray(Image.open(p).convert("RGB")).astype(np.int16)
    mx = a.max(axis=2); mn = a.min(axis=2)
    white = (mn > 235) & ((mx - mn) < 18)
    frac = white.mean(axis=1)
    bad = (frac > 0.004).sum()
    print(f"   -> {name}: {bad} rows with white-text signature (0 = clean)")

# HERO: text at 0.487-0.505. Crop above it -> head + torso editorial crop.
crop_save("hero-walk.webp",
          "ElevenLabs_image_gpt-image-2-5-sunburst_use amara to gi_2026-09-30T21_17_52.png",
          (0, 0, 1, 0.47), 1000)

# TERRACOTTA: keep well above the bottom text band.
crop_save("texture-terracotta.webp",
          "ElevenLabs_image_gpt-image-2_Create an or..._2026-10-02T17_01_55.png",
          (0, 0, 1, 0.50), 1600)

print()
for n in ["hero-walk.webp","texture-terracotta.webp","editorial-street.webp",
          "still-life.webp","portrait-bw.webp","pattern-grid.webp","stationery.webp"]:
    if os.path.exists(os.path.join(OUT, n)):
        check(n)
