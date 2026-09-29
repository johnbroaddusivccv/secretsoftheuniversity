"""Build a synthetic studio HDRI: dark studio with softboxes, a large window, and floor bounce.
Written as EXR so Cycles reflects real-looking light shapes in glass and metal."""
import math, numpy as np, sys
W, H = 2048, 1024
img = np.zeros((H, W, 4), dtype=np.float32)
img[..., 3] = 1.0
# base: dark grey studio, slightly lighter floor
for y in range(H):
    v = y / H
    base = 0.22 + 0.30 * (v ** 1.4)          # brighter toward bottom (floor bounce)
    img[y, :, :3] = (base * 0.95, base * 0.98, base * 1.06)

def rect(u0, u1, v0, v1, power, color=(1, 1, 1), soft=0.02):
    """add a soft-edged rectangle light in equirect coords (u,v in 0..1)"""
    x0, x1, y0, y1 = int(u0*W), int(u1*W), int(v0*H), int(v1*H)
    sx, sy = max(1, int(soft*W)), max(1, int(soft*H))
    xs = np.arange(W); ys = np.arange(H)
    fx = np.clip(np.minimum(xs - x0, x1 - xs) / sx, 0, 1)
    fy = np.clip(np.minimum(ys - y0, y1 - ys) / sy, 0, 1)
    m = np.outer(fy, fx)
    # slight falloff inside the softbox (diffuser hotspot)
    cx, cy = (x0+x1)/2, (y0+y1)/2
    gx = np.exp(-((xs-cx)/((x1-x0)*0.6))**2); gy = np.exp(-((ys-cy)/((y1-y0)*0.6))**2)
    g = 0.65 + 0.35*np.outer(gy, gx)
    for c in range(3):
        img[..., c] += m * g * power * color[c]

# camera looks along -Y in the scene; in equirect, u=0.5 is +Y... Blender: u=0.5 -> -Y? We tune by eye:
# key softbox: front-left, above
rect(0.19, 0.31, 0.16, 0.38, 14.0, (1.0, 0.97, 0.93), soft=0.015)
# big window/fill: front-right, wide and dim, cooler
rect(0.60, 0.86, 0.14, 0.50, 3.2, (0.92, 0.96, 1.0), soft=0.03)
# strip lights: tall thin, left and right, behind the product -> glass edges
rect(0.045, 0.075, 0.12, 0.62, 9.0, (1.0, 1.0, 1.0), soft=0.008)
rect(0.925, 0.955, 0.12, 0.62, 9.0, (1.0, 1.0, 1.0), soft=0.008)
# top light / ceiling panel
rect(0.35, 0.65, 0.02, 0.10, 4.0, (1.0, 0.99, 0.97), soft=0.02)
# rim / hair light behind
rect(0.46, 0.54, 0.20, 0.34, 6.0, (0.93, 0.96, 1.0), soft=0.012)
# subtle reflector card low front (fills the base of glass)
rect(0.30, 0.70, 0.62, 0.86, 2.2, (1.0, 0.99, 0.98), soft=0.04)

out = sys.argv[1]
import OpenEXR, Imath
hdr = OpenEXR.Header(W, H); ft = Imath.PixelType(Imath.PixelType.FLOAT)
hdr["channels"] = {c: Imath.Channel(ft) for c in "RGB"}
f = OpenEXR.OutputFile(out, hdr)
f.writePixels({c: img[..., i].astype(np.float32).tobytes() for i, c in enumerate("RGB")}); f.close()
print("wrote", out)
