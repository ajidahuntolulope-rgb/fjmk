import os
from PIL import Image, ImageOps

DL = r"C:\Users\User\Downloads"
OUT = r"C:\Users\User\hermes-work\fjmk\assets\img"
os.makedirs(OUT, exist_ok=True)

def save(name, src, box=None, max_w=1800, q=84, fmt="WEBP"):
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
    im.save(dst, fmt, quality=q, method=6)
    print(f"{name:34s} {im.size[0]}x{im.size[1]}  {os.path.getsize(dst)//1024}KB")

# 1. HERO — walking woman, cream shirt + terracotta trousers.
#    Baked-in caption sits across the lower-centre; crop the bottom off.
save("hero-walk.webp", "ElevenLabs_image_gpt-image-2-5-sunburst_use amara to gi_2026-09-30T21_17_52.png",
     box=(0, 0, 1, 0.76), max_w=1100)

# 2. Street style — cream cardigan, shutter, overcast. Secondary editorial.
save("editorial-street.webp", "ElevenLabs_image_gpt-image-2_Street-style..._2026-09-24T20_35_11.png",
     max_w=1200)

# 3. Warm architectural still life — plaster, doorway, linen, brass. Wide section band.
save("still-life.webp", "ElevenLabs_image_recraft-v4-1-flash_Prompt_ Create _2026-10-08T12_41_18.webp",
     max_w=1800)

# 4. B&W portrait — turtleneck, hard light. Founder / team portrait.
save("portrait-bw.webp", "ElevenLabs_image_gpt-image-2_a high resol..._2026-09-27T11_12_15.png",
     box=(0.08, 0.06, 0.92, 0.94), max_w=900)

# 5. Terracotta linen texture — crop the lower third (baked-in brand text).
save("texture-terracotta.webp", "Gemini_Generated_Image_eclaoxeclaoxecla.jpg",
     box=(0, 0, 1, 0.60), max_w=1600)

print("\n--- verify text removal on hero + texture ---")
