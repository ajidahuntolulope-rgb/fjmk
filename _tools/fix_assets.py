import os
from PIL import Image

DL = r"C:\Users\User\Downloads"
OUT = r"C:\Users\User\hermes-work\fjmk\assets\img"
os.makedirs(OUT, exist_ok=True)

def save(name, src, box=None, max_w=1800, q=84):
    p = os.path.join(DL, src)
    im = Image.open(p).convert("RGB")
    W, H = im.size
    if box:
        l, t, r, b = box
        im = im.crop((int(l*W), int(t*H), int(r*W), int(b*H)))
    if im.width > max_w:
        h = int(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    dst = os.path.join(OUT, name)
    im.save(dst, "WEBP", quality=q, method=6)
    print(f"{name:34s} {im.size[0]}x{im.size[1]}  {os.path.getsize(dst)//1024}KB")

# HERO — walking woman. Baked caption "choose cama." sits low-centre.
# Crop harder: keep head -> upper legs, lose the caption band.
save("hero-walk.webp", "ElevenLabs_image_gpt-image-2-5-sunburst_use amara to gi_2026-09-30T21_17_52.png",
     box=(0, 0, 1, 0.56), max_w=1100)

# TERRACOTTA LINEN — correct source (bottle-shadow + "vera" text lives in bottom third)
save("texture-terracotta.webp", "ElevenLabs_image_gpt-image-2_Create an or..._2026-10-02T17_01_55.png",
     box=(0, 0, 1, 0.55), max_w=1600)

# GRID MOTIF — the 2x2 cell matrix. Perfect brand pattern tile.
save("pattern-grid.webp", "Gemini_Generated_Image_eclaoxeclaoxecla.jpg",
     max_w=1600)

# STATIONERY flat-lay — brass plate, black boxes, ledger sheets. Proof/process section.
save("stationery.webp", "Gemini_Generated_Image_7u9xds7u9xds7u9x.jpg",
     max_w=1600)

print("\ndone")
