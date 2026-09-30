"""Path-traced product photos with Blender Cycles.
usage: python3 blender_render.py specs.json outdir [samples]
Each spec: {sku, form, accent}; label art is read from labels/<sku>.png
"""
import bpy, bmesh, math, json, sys, os, time
from mathutils import Vector

SPECS = json.load(open(sys.argv[1])); OUT = sys.argv[2]
SAMPLES = int(sys.argv[3]) if len(sys.argv) > 3 else 96
os.makedirs(OUT, exist_ok=True)

def hex2rgb(h):
    h = h.lstrip("#"); c = [int(h[i:i+2], 16)/255 for i in (0, 2, 4)]
    return tuple(((x+0.055)/1.055)**2.4 if x > 0.04045 else x/12.92 for x in c) + (1.0,)

# ---------- materials ----------
def mat(name, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    for k, v in kw.items():
        b.inputs[k].default_value = v
    return m, b

def add_noise_roughness(m, b, base, amt, scale=180.0, detail=6.0):
    """modulate roughness with fine procedural noise so highlights break up like real surfaces"""
    nt = m.node_tree
    n = nt.nodes.new("ShaderNodeTexNoise"); n.inputs["Scale"].default_value = scale; n.inputs["Detail"].default_value = detail; n.inputs["Roughness"].default_value = 0.6
    r = nt.nodes.new("ShaderNodeMapRange"); r.inputs["From Min"].default_value = 0.35; r.inputs["From Max"].default_value = 0.65
    r.inputs["To Min"].default_value = max(0.0, base-amt); r.inputs["To Max"].default_value = min(1.0, base+amt)
    nt.links.new(n.outputs["Fac"], r.inputs["Value"]); nt.links.new(r.outputs["Result"], b.inputs["Roughness"])
    return m

def add_bump(m, b, strength, scale=400.0, detail=4.0):
    nt = m.node_tree
    n = nt.nodes.new("ShaderNodeTexNoise"); n.inputs["Scale"].default_value = scale; n.inputs["Detail"].default_value = detail
    bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = strength; bp.inputs["Distance"].default_value = 0.002
    nt.links.new(n.outputs["Fac"], bp.inputs["Height"]); nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    return m

def label_mat(path):
    m, b = mat("label", **{"Roughness":0.42, "Coat Weight":0.18, "Coat Roughness":0.28, "Sheen Weight":0.25})
    t = m.node_tree.nodes.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(path)
    t.interpolation = "Cubic"; t.extension = "CLIP"
    m.node_tree.links.new(t.outputs["Color"], b.inputs["Base Color"])
    add_noise_roughness(m, b, 0.42, 0.12, scale=600, detail=4)   # paper tooth
    add_bump(m, b, 0.06, scale=900, detail=3)                     # paper fibre
    return m

def add_prints(m, b):
    """fingerprint smudges: a few soft blotches that raise roughness and coat roughness"""
    nt = m.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    v = nt.nodes.new("ShaderNodeTexVoronoi"); v.feature = "SMOOTH_F1"; v.inputs["Scale"].default_value = 2.6; v.inputs["Smoothness"].default_value = 0.8
    n = nt.nodes.new("ShaderNodeTexNoise"); n.inputs["Scale"].default_value = 60.0; n.inputs["Detail"].default_value = 9.0; n.inputs["Roughness"].default_value = 0.85
    rm = nt.nodes.new("ShaderNodeMapRange"); rm.inputs["From Min"].default_value = 0.0; rm.inputs["From Max"].default_value = 0.14
    rm.inputs["To Min"].default_value = 1.0; rm.inputs["To Max"].default_value = 0.0      # near a cell centre -> a print
    mul = nt.nodes.new("ShaderNodeMath"); mul.operation = "MULTIPLY"
    rough = nt.nodes.new("ShaderNodeMath"); rough.operation = "MULTIPLY"; rough.inputs[1].default_value = 0.16
    nt.links.new(tc.outputs["Object"], v.inputs["Vector"]); nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    nt.links.new(v.outputs["Distance"], rm.inputs["Value"]); nt.links.new(rm.outputs["Result"], mul.inputs[0]); nt.links.new(n.outputs["Fac"], mul.inputs[1])
    nt.links.new(mul.outputs["Value"], rough.inputs[0]); nt.links.new(rough.outputs["Value"], b.inputs["Roughness"])
    return m

def add_scratches(m, b, amount=0.35):
    """fine anisotropic scratches on glass/plastic: stretched noise -> bump + roughness breakup"""
    nt = m.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (1.0, 40.0, 1.0)
    n = nt.nodes.new("ShaderNodeTexNoise"); n.inputs["Scale"].default_value = 18.0; n.inputs["Detail"].default_value = 8.0; n.inputs["Roughness"].default_value = 0.75
    rm = nt.nodes.new("ShaderNodeMapRange"); rm.inputs["From Min"].default_value = 0.62; rm.inputs["From Max"].default_value = 0.7
    rm.inputs["To Min"].default_value = 0.0; rm.inputs["To Max"].default_value = 1.0
    bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = amount; bp.inputs["Distance"].default_value = 0.0006
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], n.inputs["Vector"])
    nt.links.new(n.outputs["Fac"], rm.inputs["Value"]); nt.links.new(rm.outputs["Result"], bp.inputs["Height"]); nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    return m

def glass_shadow_fix(m):
    """glass casts a light, tinted shadow instead of a black one: shadow rays see a transparent shader"""
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]; out = nt.nodes["Material Output"]
    lp = nt.nodes.new("ShaderNodeLightPath"); tr = nt.nodes.new("ShaderNodeBsdfTransparent"); tr.inputs[0].default_value = (0.9, 0.93, 0.92, 1)
    mx = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lp.outputs["Is Shadow Ray"], mx.inputs["Fac"]); nt.links.new(b.outputs["BSDF"], mx.inputs[1]); nt.links.new(tr.outputs["BSDF"], mx.inputs[2])
    nt.links.new(mx.outputs["Shader"], out.inputs["Surface"])
    return m

def materials(accent):
    return {
      "glass": glass_shadow_fix((lambda mb: add_prints(add_scratches(mb[0], mb[1], 0.25), mb[1]))(mat("glass", **{"Base Color":(0.985,0.995,0.99,1), "Transmission Weight":1.0, "Roughness":0.0, "IOR":1.5}))),
      "amber": glass_shadow_fix((lambda mb: add_prints(mb[0], mb[1]))(mat("amber", **{"Base Color":(0.42,0.13,0.025,1), "Transmission Weight":1.0, "Roughness":0.02, "IOR":1.5}))),
      "hdpe":  (lambda mb: add_bump(add_noise_roughness(mb[0], mb[1], 0.46, 0.14, scale=140), mb[1], 0.05, scale=220))(mat("hdpe",  **{"Base Color":(0.86,0.865,0.87,1), "Roughness":0.46, "Subsurface Weight":0.35, "Subsurface Scale":0.02, "Coat Weight":0.06, "Coat Roughness":0.35})),
      "black": (lambda mb: add_noise_roughness(mb[0], mb[1], 0.36, 0.1, scale=160))(mat("black", **{"Base Color":(0.012,0.013,0.015,1), "Roughness":0.36, "Coat Weight":0.3, "Coat Roughness":0.2})),
      "rubber":mat("rubber",**{"Base Color":(0.05,0.05,0.055,1), "Roughness":0.62})[0],
      "stopper":mat("stopper",**{"Base Color":(0.16,0.165,0.17,1), "Roughness":0.55})[0],
      "alu":   (lambda mb: add_bump(add_noise_roughness(mb[0], mb[1], 0.24, 0.1, scale=90, detail=8), mb[1], 0.12, scale=60, detail=5))(mat("alu",   **{"Base Color":(0.76,0.78,0.81,1), "Metallic":1.0, "Roughness":0.24, "Anisotropic":0.7})),
      "flip":  (lambda mb: add_noise_roughness(mb[0], mb[1], 0.3, 0.08, scale=200))(mat("flip",  **{"Base Color":hex2rgb(accent), "Roughness":0.3, "Coat Weight":0.5, "Coat Roughness":0.12})),
      "cake":  (lambda mb: add_bump(mb[0], mb[1], 0.9, scale=70, detail=8))(mat("cake",  **{"Base Color":(0.94,0.935,0.91,1), "Roughness":0.95, "Subsurface Weight":0.5, "Subsurface Scale":0.04})),
      "table": (lambda mb: add_noise_roughness(mb[0], mb[1], 0.09, 0.04, scale=12, detail=5))(mat("table", **{"Base Color":(0.93,0.935,0.94,1), "Roughness":0.09, "Coat Weight":1.0, "Coat Roughness":0.04, "Specular IOR Level":0.6})),
      "sweep": (lambda mb: add_bump(mb[0], mb[1], 0.03, scale=300, detail=3))(mat("sweep", **{"Base Color":(0.80,0.815,0.835,1), "Roughness":0.9})),
    }

# ---------- geometry ----------
def lathe(name, prof, material, steps=144, rib=0.0, rib_rows=None, smooth=True):
    """prof: list of (r, z) from bottom to top. rib>0 knurls rows in rib_rows."""
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    rings = []
    for i, (r, z) in enumerate(prof):
        if r < 1e-6:
            rings.append([bm.verts.new((0, 0, z))]); continue
        ring = []
        for j in range(steps):
            a = 2*math.pi*j/steps
            f = 1.0 - (rib if (rib_rows and i in rib_rows and j % 2) else 0.0)
            ring.append(bm.verts.new((r*f*math.sin(a), -r*f*math.cos(a), z)))
        rings.append(ring)
    for i in range(len(rings)-1):
        A, B = rings[i], rings[i+1]
        for j in range(steps):
            j2 = (j+1) % steps
            if len(A) == 1 and len(B) == 1: continue
            if len(A) == 1: bm.faces.new((A[0], B[j2], B[j]))
            elif len(B) == 1: bm.faces.new((A[j], A[j2], B[0]))
            else: bm.faces.new((A[j], A[j2], B[j2], B[j]))
    bm.normal_update(); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob)
    if smooth:
        for p in me.polygons: p.use_smooth = True
    ob.data.materials.append(material)
    return ob

def rounded(r, h, rb, n=8):
    p = [(0, 0)]
    for i in range(n+1):
        a = -math.pi/2 + i*(math.pi/2)/n
        p.append((r - rb + rb*math.cos(a), rb + rb*math.sin(a)))
    p.append((r, h))
    return p

def shoulder(p, r, h, neck, top, n=10):
    for i in range(1, n+1):
        t = i/n
        p.append((r + (neck - r)*(1 - math.cos(t*math.pi/2)), h + (top - h)*math.sin(t*math.pi/2)))
    return p

def shell(name, outer, material, thick):
    ob = lathe(name, outer, material)
    s = ob.modifiers.new("solid", "SOLIDIFY"); s.thickness = thick; s.offset = -1; s.use_even_offset = True
    return ob

def label(name, r, z0, z1, arc, material, steps=160):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    uv = bm.loops.layers.uv.new()
    cols = []
    for j in range(steps+1):
        a = -arc/2 + arc*j/steps
        cols.append((bm.verts.new((r*math.sin(a), -r*math.cos(a), z0)), bm.verts.new((r*math.sin(a), -r*math.cos(a), z1)), j/steps))
    for j in range(steps):
        (a0, a1, u0), (b0, b1, u1) = cols[j], cols[j+1]
        f = bm.faces.new((a0, b0, b1, a1))
        for loop, (u, v) in zip(f.loops, ((u0, 0), (u1, 0), (u1, 1), (u0, 1))):
            loop[uv].uv = (u, v)
    bm.normal_update(); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(ob)
    for p in me.polygons: p.use_smooth = True
    ob.data.materials.append(material)
    s = ob.modifiers.new("solid", "SOLIDIFY"); s.thickness = 0.004; s.offset = 1
    # edge lift: displace the outermost columns outward slightly
    vg = ob.vertex_groups.new(name="edge")
    n = len(ob.data.vertices); idx = list(range(n))
    for i, v in enumerate(ob.data.vertices):
        col = i // 2; t = col/steps
        wgt = max(0.0, (abs(t-0.5)-0.44)/0.06)
        if wgt > 0: vg.add([i], wgt, "REPLACE")
    d = ob.modifiers.new("lift", "DISPLACE"); d.direction = "NORMAL"; d.strength = 0.02; d.mid_level = 0.0; d.vertex_group = "edge"
    return ob

def cap(name, r, z0, z1, material, ribs=True):
    prof = [(0, z0), (r*0.97, z0), (r, z0+0.02), (r, z1-0.05), (r*0.975, z1-0.005), (r*0.93, z1), (0, z1)]
    return lathe(name, prof, material, steps=180 if ribs else 144, rib=0.018 if ribs else 0, rib_rows={2, 3})

# ---------- containers (units ≈ cm, z up) ----------
def build_vial(M, L):
    v = shell("vial", shoulder(rounded(0.84, 2.7, 0.12), 0.84, 2.7, 0.5, 3.18) + [(0.5, 3.24), (0.56, 3.26), (0.56, 3.3)], M["glass"], 0.055)
    v.modifiers["solid"].thickness_clamp = 0; v.modifiers["solid"].use_rim = True
    v.visible_shadow = True
    lathe("punt", [(0, 0.02), (0.6, 0.02), (0.72, 0.05), (0.76, 0.2), (0.62, 0.22), (0.0, 0.28)], M["glass"])
    ck = lathe("cake", [(0, 0.28), (0.74, 0.28), (0.755, 0.56), (0.70, 0.62), (0.4, 0.64), (0, 0.65)], M["cake"], steps=96)
    d = ck.modifiers.new("disp", "DISPLACE"); tx = bpy.data.textures.new("cakeN", "CLOUDS"); tx.noise_scale = 0.12; tx.noise_depth = 3
    d.texture = tx; d.strength = 0.06; d.mid_level = 0.5
    for sx in (-1, 1):   # mold seams
        bpy.ops.mesh.primitive_cube_add(size=1, location=(sx*0.845, 0, 1.45)); sm = bpy.context.active_object
        sm.scale = (0.006, 0.012, 2.7); sm.data.materials.append(M["glass"]); sm.name = "seam"
        for pg in sm.data.polygons: pg.use_smooth = True
    lathe("stopper", [(0, 3.05), (0.44, 3.05), (0.46, 3.3), (0, 3.3)], M["stopper"])
    lathe("crimp", [(0, 3.12), (0.52, 3.12), (0.62, 3.16), (0.645, 3.22), (0.645, 3.5), (0.61, 3.54), (0, 3.54)], M["alu"], steps=160, rib=0.012, rib_rows={3, 4})
    lathe("flip", [(0, 3.53), (0.57, 3.53), (0.61, 3.56), (0.615, 3.74), (0.59, 3.79), (0.5, 3.8), (0.47, 3.77), (0.44, 3.71), (0.0, 3.72)], M["flip"])
    lb = label("label", 0.852, 0.6, 2.35, math.pi*1.35, L)
    hz, hb = mat("haze", **{"Base Color":(1,1,1,1), "Roughness":0.55, "Alpha":0.09}); hz.blend_method = "BLEND"
    for z0, z1 in ((0.56, 0.6), (2.35, 2.39)):
        h_ = lathe("haze", [(0.853, z0), (0.853, z1)], hz, steps=160); h_.visible_shadow = False
    return 3.8, 0.84

def build_dropper(M, L):
    shell("bottle", shoulder(rounded(1.05, 2.45, 0.2), 1.05, 2.45, 0.44, 3.0) + [(0.44, 3.1), (0, 3.1)], M["amber"], 0.07)
    cap("cap", 0.62, 2.95, 3.72, M["black"])
    lathe("bulb", [(0, 3.7), (0.36, 3.7), (0.4, 3.85), (0.37, 4.2), (0.34, 4.48), (0.25, 4.7), (0.12, 4.78), (0, 4.8)], M["rubber"])
    label("label", 1.062, 0.5, 2.05, math.pi*1.25, L)
    return 4.8, 1.05

def build_nasal(M, L):
    lathe("bottle", shoulder(rounded(0.95, 2.55, 0.18), 0.95, 2.55, 0.58, 2.95) + [(0.58, 3.0), (0, 3.0)], M["hdpe"])
    cap("collar", 0.66, 2.95, 3.38, M["black"], ribs=False)
    lathe("nozzle", [(0, 3.36), (0.5, 3.36), (0.5, 3.46), (0.3, 3.52), (0.22, 3.9), (0.17, 4.45), (0.12, 4.66), (0.05, 4.72), (0, 4.72)], M["hdpe"])
    label("label", 0.962, 0.45, 2.35, math.pi*1.25, L)
    return 4.72, 0.95

def build_caps(M, L):
    lathe("bottle", shoulder(rounded(1.3, 2.8, 0.26), 1.3, 2.8, 1.02, 3.08) + [(1.02, 3.12), (0, 3.12)], M["hdpe"])
    cap("cap", 1.1, 3.02, 3.82, M["black"])
    label("label", 1.312, 0.45, 2.55, math.pi*1.25, L)
    return 3.82, 1.3

def build_powder(M, L):
    lathe("jar", shoulder(rounded(1.72, 1.95, 0.24), 1.72, 1.95, 1.62, 2.05) + [(1.62, 2.08), (0, 2.08)], M["hdpe"])
    cap("cap", 1.72, 2.0, 2.72, M["black"])
    label("label", 1.732, 0.32, 1.72, math.pi*1.1, L)
    return 2.72, 1.72

BUILD = {"vial": build_vial, "dropper": build_dropper, "nasal": build_nasal, "caps": build_caps, "powder": build_powder}

# ---------- studio ----------
def area(name, loc, size, power, color=(1, 1, 1), shape="RECTANGLE", size_y=None, target=(0, 0, 1.6)):
    d = bpy.data.lights.new(name, "AREA"); d.energy = power; d.color = color; d.shape = shape
    d.size = size;
    if size_y: d.size_y = size_y
    ob = bpy.data.objects.new(name, d); bpy.context.collection.objects.link(ob); ob.location = loc
    direction = Vector(target) - Vector(loc); ob.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return ob

def studio(M, h, w):
    # glossy white acrylic tabletop: a thick slab the product sits on, reflects it
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -20, -0.6)); tb = bpy.context.active_object
    tb.scale = (60, 60, 1.2); tb.name = "table"; tb.data.materials.append(M["table"])
    bv = tb.modifiers.new("bevel", "BEVEL"); bv.width = 0.03; bv.segments = 4
    # paper sweep rising behind the table with a soft curve, so the horizon is a gradient not a line
    me = bpy.data.meshes.new("sweep"); bm = bmesh.new(); rows = []
    R = 14.0
    yz = [(9.5, 0.0)]
    for k in range(0, 25):
        t = k/24; a = t*math.pi/2
        yz.append((9.5 + R*math.sin(a), R - R*math.cos(a)))
    yz.append((9.5 + R, 60))
    for (y, z) in yz:
        rows.append((bm.verts.new((-60, y, z)), bm.verts.new((60, y, z))))
    for i in range(len(rows)-1):
        r0, r1 = rows[i], rows[i+1]; bm.faces.new((r0[0], r0[1], r1[1], r1[0]))
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new("sweep", me); bpy.context.collection.objects.link(ob)
    for pg in me.polygons: pg.use_smooth = True
    ob.location.z = -0.001; ob.data.materials.append(M["sweep"])
    # gradient on the sweep: brighter near the table, darker up high (light falls off from the key)
    sm = M["sweep"]; nt = sm.node_tree; bsdf = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord"); sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    mr = nt.nodes.new("ShaderNodeMapRange"); mr.inputs["From Min"].default_value = 0.0; mr.inputs["From Max"].default_value = 22.0
    mr.inputs["To Min"].default_value = 1.0; mr.inputs["To Max"].default_value = 0.55
    mixc = nt.nodes.new("ShaderNodeMix"); mixc.data_type = "RGBA"; mixc.inputs[6].default_value = (0.5, 0.52, 0.55, 1); mixc.inputs[7].default_value = (0.86, 0.87, 0.89, 1)
    nt.links.new(tc.outputs["Object"], sep.inputs["Vector"]); nt.links.new(sep.outputs["Z"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], mixc.inputs["Factor"]); nt.links.new(mixc.outputs[2], bsdf.inputs["Base Color"])
    # turn the product a few degrees, as a stylist would
    for o in bpy.context.collection.objects:
        if o.type == "MESH" and o.name not in ("sweep", "table"): o.rotation_euler.z = math.radians(-9)
    import random as _r; _r.seed((hash(str(bpy.context.scene.render.filepath)) & 0xffff) + int(os.environ.get("JITTER_SEED", "0")))
    for o in bpy.context.collection.objects:
        if o.name.startswith("label"):
            o.rotation_euler.x += math.radians(_r.uniform(-0.6, 0.6)); o.rotation_euler.z += math.radians(_r.uniform(-2.5, 2.5))
        if o.name in ("flip", "cap", "collar"):
            o.rotation_euler.x += math.radians(_r.uniform(-0.8, 0.8)); o.rotation_euler.y += math.radians(_r.uniform(-0.8, 0.8))
            o.location.x += _r.uniform(-0.012, 0.012); o.location.y += _r.uniform(-0.012, 0.012)
        if o.name == "cake":
            o.rotation_euler.x += math.radians(_r.uniform(-2.0, 2.0)); o.location.z += _r.uniform(-0.02, 0.03)
    # studio dust: a few tiny specks floating just off the glass/label (caught by the strobe)
    import random; random.seed(int(os.environ.get("DUST_SEED","7")))
    dm = mat("dust", **{"Base Color":(1,1,1,1), "Roughness":0.4})[0]
    for _ in range(14):
        ang = random.uniform(-1.1, 1.1); rr = w*1.02
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=random.uniform(0.004, 0.009), location=(rr*math.sin(ang), -rr*math.cos(ang), random.uniform(0.3, h*0.85)))
        d = bpy.context.active_object; d.name = "dust"; d.data.materials.append(dm)
    # lights: big key softbox, strip lights for glass edges, rim, top
    # physical key + kicker for crisp shadow shaping; the HDRI supplies everything else (softboxes, window, strips)
    area("key", (-6.5, -7.5, 7.0), 4.5, 720, size_y=5.5, color=(1.0, 0.965, 0.925))
    area("stripL", (-4.4, 2.8, 2.2), 0.45, 520, size_y=7.0, target=(0, 0, 1.8))
    area("stripR", (4.4, 2.8, 2.2), 0.45, 520, size_y=7.0, target=(0, 0, 1.8))
    area("cake", (0, -5.5, 0.5), 2.5, 110, size_y=1.0, color=(1.0, 0.99, 0.97), target=(0, 0, 0.35))
    world = bpy.data.worlds.new("w"); world.use_nodes = True; wn = world.node_tree
    env = wn.nodes.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load(os.path.abspath("studio.exr"))
    mp = wn.nodes.new("ShaderNodeMapping"); tc = wn.nodes.new("ShaderNodeTexCoord")
    mp.inputs["Rotation"].default_value = (0, 0, math.radians(90))     # bring the key softbox to front-left
    wn.links.new(tc.outputs["Generated"], mp.inputs["Vector"]); wn.links.new(mp.outputs["Vector"], env.inputs["Vector"])
    bg = wn.nodes["Background"]; wn.links.new(env.outputs["Color"], bg.inputs["Color"]); bg.inputs["Strength"].default_value = 1.15
    bpy.context.scene.world = world

    # camera
    cam = bpy.data.cameras.new("cam"); cam.lens = 100; cam.sensor_width = 36
    cam.dof.use_dof = True; cam.dof.aperture_fstop = 2.8; cam.dof.aperture_blades = 11; cam.dof.aperture_rotation = math.radians(15)
    ob = bpy.data.objects.new("cam", cam); bpy.context.collection.objects.link(ob)
    span = max(h + 1.5, w*4.2, 4.6)
    dist = (span/2) / math.tan(math.atan(18/100)) * 1.0
    cz = h*0.42
    ob.location = (0.3, -dist, cz + dist*0.085)
    tgt = Vector((0, 0, cz - 0.04))
    ob.rotation_euler = (tgt - ob.location).to_track_quat("-Z", "Y").to_euler()
    cam.dof.focus_distance = (tgt - ob.location).length - w*0.92   # focus on the label face
    bpy.context.scene.camera = ob

def setup_render():
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"
    sc.cycles.samples = SAMPLES; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.012
    sc.cycles.use_denoising = True; sc.cycles.denoiser = "OPENIMAGEDENOISE"; sc.cycles.denoising_prefilter = "ACCURATE"; sc.cycles.denoising_input_passes = "RGB_ALBEDO_NORMAL"
    sc.cycles.max_bounces = 14; sc.cycles.transmission_bounces = 16; sc.cycles.glossy_bounces = 8; sc.cycles.transparent_max_bounces = 16
    sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 1.0
    sc.render.resolution_x = sc.render.resolution_y = 720; sc.render.resolution_percentage = 100
    sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Punchy"
    sc.view_settings.exposure = 0.35
    sc.render.image_settings.file_format = "PNG"
    sc.cycles.film_exposure = 1.0
    sc.use_nodes = True; nt = sc.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    rl = nt.nodes.new("CompositorNodeRLayers"); out = nt.nodes.new("CompositorNodeComposite")
    lens = nt.nodes.new("CompositorNodeLensdist"); lens.use_fit = True; lens.inputs["Dispersion"].default_value = 0.01; lens.inputs["Distortion"].default_value = -0.012
    # sensor colour: lift shadows a touch cool, warm the highlights (studio strobe look)
    cb = nt.nodes.new("CompositorNodeColorBalance"); cb.correction_method = "LIFT_GAMMA_GAIN"
    cb.lift = (0.985, 0.99, 1.01); cb.gamma = (1.0, 1.0, 1.0); cb.gain = (1.02, 1.01, 0.99)
    glare = nt.nodes.new("CompositorNodeGlare"); glare.glare_type = "FOG_GLOW"; glare.mix = -0.86; glare.threshold = 1.1; glare.size = 7
    # vignette: elliptical mask multiplied into the image
    ell = nt.nodes.new("CompositorNodeEllipseMask"); ell.width = 1.55; ell.height = 1.55
    blur = nt.nodes.new("CompositorNodeBlur"); blur.filter_type = "GAUSS"; blur.size_x = blur.size_y = 260; blur.use_relative = False
    vmap = nt.nodes.new("CompositorNodeMapRange"); vmap.inputs["From Min"].default_value = 0; vmap.inputs["From Max"].default_value = 1
    vmap.inputs["To Min"].default_value = 0.92; vmap.inputs["To Max"].default_value = 1.0
    mix = nt.nodes.new("CompositorNodeMixRGB"); mix.blend_type = "MULTIPLY"; mix.inputs["Fac"].default_value = 1.0
    # grain
    noise = nt.nodes.new("CompositorNodeTexture"); ntex = bpy.data.textures.new("grain", "NOISE"); noise.texture = ntex
    gmix = nt.nodes.new("CompositorNodeMixRGB"); gmix.blend_type = "SOFT_LIGHT"; gmix.inputs["Fac"].default_value = 0.03
    nt.links.new(rl.outputs["Image"], glare.inputs["Image"]); nt.links.new(glare.outputs["Image"], cb.inputs["Image"]); nt.links.new(cb.outputs["Image"], lens.inputs["Image"])
    nt.links.new(ell.outputs["Mask"], blur.inputs["Image"]); nt.links.new(blur.outputs["Image"], vmap.inputs["Value"])
    nt.links.new(lens.outputs["Image"], mix.inputs[1]); nt.links.new(vmap.outputs["Value"], mix.inputs[2])
    nt.links.new(mix.outputs["Image"], gmix.inputs[1]); nt.links.new(noise.outputs["Color"], gmix.inputs[2])
    nt.links.new(gmix.outputs["Image"], out.inputs["Image"])
    sc.render.threads_mode = "AUTO"

for spec in SPECS:
    out = os.path.join(OUT, spec["sku"] + ".png")
    if os.path.exists(out): continue
    t0 = time.time()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    setup_render()
    bpy.context.scene.render.filepath = out
    M = materials(spec["accent"])
    L = label_mat(os.path.abspath(f"labels/{spec['sku']}.png"))
    h, w = BUILD[spec["form"]](M, L)
    studio(M, h, w)
    bpy.context.scene.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print(f"{spec['sku']} {time.time()-t0:.1f}s", flush=True)
