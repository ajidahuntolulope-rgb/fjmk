import os
from PIL import Image
import numpy as np

DL = r"C:\Users\User\Downloads"

def find_white_text_rows(src, thresh=235, min_frac=0.004):
    """Find rows with a high concentration of near-white pixels (rendered text)."""
    p = os.path.join(DL, src)
    im = Image.open(p).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    W, H = im.size
    # near-white AND low saturation (text is pure white; highlights usually warmer)
    mx = a.max(axis=2); mn = a.min(axis=2)
    white = (mn > thresh) & ((mx - mn) < 18)
    frac = white.mean(axis=1)
    rows = np.where(frac > min_frac)[0]
    print(f"\n{src}  ({W}x{H})")
    if len(rows) == 0:
        print("   no white-text rows detected")
        return
    # group contiguous runs
    runs = []
    s = rows[0]; prev = rows[0]
    for r in rows[1:]:
        if r - prev > 6:
            runs.append((s, prev)); s = r
        prev = r
    runs.append((s, prev))
    for (a0, b0) in runs:
        print(f"   rows {a0:5d}-{b0:5d}   = {a0/H:.3f} - {b0/H:.3f} of height   (peak {frac[a0:b0+1].max():.3f})")

for f in ["ElevenLabs_image_gpt-image-2-5-sunburst_use amara to gi_2026-09-30T21_17_52.png",
          "ElevenLabs_image_gpt-image-2_Create an or..._2026-10-02T17_01_55.png",
          "ElevenLabs_image_gpt-image-2_Street-style..._2026-09-24T20_35_11.png"]:
    find_white_text_rows(f)
