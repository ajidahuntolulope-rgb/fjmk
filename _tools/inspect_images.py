import os, shutil, sys

DL = r"C:\Users\User\Downloads"
OUT = r"C:\Users\User\hermes-work\fjmk\assets"
os.makedirs(OUT, exist_ok=True)

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("NO PIL")

files = [f for f in os.listdir(DL) if f.lower().endswith(('.png','.jpg','.jpeg','.webp'))]
for f in sorted(files):
    p = os.path.join(DL, f)
    if HAS_PIL:
        try:
            with Image.open(p) as im:
                print(f"{f}\n    {im.size} {im.mode} {os.path.getsize(p)//1024}KB")
        except Exception as e:
            print(f"{f}  ERR {e}")
    else:
        print(f"{f}  {os.path.getsize(p)//1024}KB")
