"""Laboratory bench still life for the storefront banner. Reuses materials/lights from blender_render.py.
usage: python3 lab_render.py out.png [samples] [width] [height]"""
import sys, os, math, json
OUTFILE = sys.argv[1]; SAMPLES = int(sys.argv[2]) if len(sys.argv) > 2 else 64
WIDTH = int(sys.argv[3]) if len(sys.argv) > 3 else 1600; HEIGHT = int(sys.argv[4]) if len(sys.argv) > 4 else 720
json.dump([], open("/tmp/_empty.json", "w"))
sys.argv = ["blender_render.py", "/tmp/_empty.json", "/tmp/_labout", str(SAMPLES)]
src = open("blender_render.py").read().split("for spec in SPECS:")[0]
exec(src)   # bpy, bmesh, mat, lathe, shell, area, materials, setup_render, hex2rgb ...
import random; random.seed(3)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.render.filepath = OUTFILE
M = materials("#3b82a0")

def liquid_mat(name, rgb, ior=1.333):
    m, b = mat(name, **{"Base Color":rgb, "Transmission Weight":1.0, "Roughness":0.0, "IOR":ior})
    return glass_shadow_fix(m)
LIQ = {"blue": liquid_mat("lq_blue", (0.30, 0.62, 0.90, 1)), "teal": liquid_mat("lq_teal", (0.38, 0.80, 0.70, 1)),
       "clear": liquid_mat("lq_clear", (0.95, 0.97, 0.97, 1)), "amber": liquid_mat("lq_amber", (0.85, 0.52, 0.16, 1)),
       "violet": liquid_mat("lq_violet", (0.58, 0.48, 0.90, 1))}
WHITE = (lambda mb: add_noise_roughness(mb[0], mb[1], 0.5, 0.1, scale=120))(mat("white_plastic", **{"Base Color":(0.90, 0.91, 0.92, 1), "Roughness":0.5}))
DARK = (lambda mb: add_noise_roughness(mb[0], mb[1], 0.4, 0.1, scale=160))(mat("dark_plastic", **{"Base Color":(0.03, 0.032, 0.036, 1), "Roughness":0.4, "Coat Weight":0.25, "Coat Roughness":0.25}))
STEEL = (lambda mb: add_noise_roughness(mb[0], mb[1], 0.3, 0.1, scale=80, detail=8))(mat("steel", **{"Base Color":(0.72, 0.73, 0.75, 1), "Metallic":1.0, "Roughness":0.3, "Anisotropic":0.5}))
BLUETIP = mat("bluetip", **{"Base Color":hex2rgb("#2f6fb3"), "Roughness":0.35, "Coat Weight":0.3})[0]
BENCH = (lambda mb: add_noise_roughness(mb[0], mb[1], 0.18, 0.06, scale=10, detail=5))(mat("bench", **{"Base Color":(0.90, 0.905, 0.91, 1), "Roughness":0.18, "Coat Weight":0.8, "Coat Roughness":0.08}))

def place(ob, x, y, rz=0.0):
    ob.location.x += x; ob.location.y += y; ob.rotation_euler.z = math.radians(rz); return ob

def erlenmeyer(x, y, scale=1.0, liq="blue", fill=0.38):
    R, H = 0.95*scale, 2.6*scale
    prof = [(0, 0), (R*0.9, 0), (R, 0.08*scale), (R, 0.2*scale)]
    for k in range(1, 11):
        t = k/10; prof.append((R - (R - 0.26*scale)*t, 0.2*scale + 1.5*scale*t))
    prof += [(0.26*scale, H - 0.25*scale), (0.3*scale, H - 0.12*scale), (0.3*scale, H)]
    g = shell("flask", prof, M["glass"], 0.03*scale)
    lp = [(0, 0.03), (R*0.88, 0.03), (R*0.96, 0.1*scale), (R*0.96, 0.2*scale)]
    for k in range(1, 11):
        t = k/10; z = 0.2*scale + 1.5*scale*t
        if z > H*fill: break
        lp.append(((R - (R - 0.26*scale)*t)*0.96, z))
    lp.append((0, lp[-1][1]))
    l = lathe("liq", lp, LIQ[liq]); place(g, x, y); place(l, x, y); return g

def beaker(x, y, scale=1.0, liq="clear", fill=0.45):
    R, H = 0.8*scale, 1.9*scale
    g = shell("beaker", [(0, 0), (R*0.92, 0), (R, 0.06*scale), (R, H*0.93), (R*1.04, H)], M["glass"], 0.028*scale)
    l = lathe("liq", [(0, 0.03), (R*0.96, 0.03), (R*0.96, H*fill), (0, H*fill)], LIQ[liq]); place(g, x, y); place(l, x, y); return g

def volumetric(x, y, scale=1.0, liq="teal"):
    R, H = 0.85*scale, 3.3*scale
    prof = [(0, 0), (R*0.75, 0), (R, 0.3*scale)]
    for k in range(1, 9):
        a = k/8*math.pi/2; prof.append((R*math.cos(a)*0.98 + 0.17*scale*math.sin(a), 0.3*scale + R*math.sin(a)*1.05))
    prof += [(0.17*scale, H - 0.1*scale), (0.2*scale, H)]
    g = shell("vflask", prof, M["glass"], 0.03*scale)
    lp = [(0, 0.03), (R*0.72, 0.03), (R*0.96, 0.3*scale)]
    for k in range(1, 6):
        a = k/8*math.pi/2; lp.append(((R*math.cos(a)*0.98 + 0.17*scale*math.sin(a))*0.96, 0.3*scale + R*math.sin(a)*1.05))
    lp.append((0, lp[-1][1]))
    l = lathe("liq", lp, LIQ[liq])
    st = lathe("stopper", [(0, H-0.05*scale), (0.22*scale, H-0.05*scale), (0.26*scale, H+0.25*scale), (0.34*scale, H+0.45*scale), (0, H+0.45*scale)], WHITE, steps=64)
    for o in (g, l, st): place(o, x, y)
    return g

def tube_rack(x, y, rz, n=6, tints=("blue","teal","clear","violet","amber","clear"), fills=(0.5,0.6,0.35,0.55,0.45,0.65)):
    pitch = 0.42; w = pitch*n + 0.3
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.11)); base = bpy.context.active_object; base.scale = (w, 0.7, 0.22); base.data.materials.append(WHITE)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.25)); top = bpy.context.active_object; top.scale = (w, 0.7, 0.14); top.data.materials.append(WHITE)
    for o in (base, top):
        bv = o.modifiers.new("bevel", "BEVEL"); bv.width = 0.02; bv.segments = 3
    for s in (-1, 1):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(s*(w/2-0.08), 0, 0.68)); p = bpy.context.active_object; p.scale = (0.12, 0.6, 1.2); p.data.materials.append(WHITE)
        place(p, x, y, rz); p.location = (x + math.cos(math.radians(rz))*s*(w/2-0.08), y + math.sin(math.radians(rz))*s*(w/2-0.08), 0.68)
    place(base, x, y, rz); place(top, x, y, rz)
    for i in range(n):
        off = (i - (n-1)/2)*pitch
        tx, ty = x + math.cos(math.radians(rz))*off, y + math.sin(math.radians(rz))*off
        r, h = 0.15, 2.3
        g = shell("tube", [(0, 0.3), (r*0.5, 0.3), (r*0.9, 0.36), (r, 0.5), (r, h-0.05), (r*1.08, h)], M["glass"], 0.018)
        g.location = (tx, ty, 0)
        l = lathe("liq", [(0, 0.33), (r*0.85, 0.33), (r*0.96, 0.5), (r*0.96, 0.3 + (h-0.3)*fills[i]), (0, 0.3 + (h-0.3)*fills[i])], LIQ[tints[i]])
        l.location = (tx, ty, 0)

def pipette(x, y, rz):
    body = lathe("pip", [(0, 0), (0.06, 0), (0.06, 1.6), (0.11, 1.9), (0.13, 3.2), (0.17, 3.6), (0.17, 4.0), (0.13, 4.2), (0, 4.2)], WHITE, steps=48)
    tip = lathe("tip", [(0, -0.9), (0.02, -0.9), (0.07, 0.05), (0, 0.05)], BLUETIP, steps=32)
    btn = lathe("btn", [(0, 4.2), (0.09, 4.2), (0.09, 4.5), (0, 4.5)], BLUETIP, steps=32)
    for o in (body, tip, btn):
        o.rotation_euler = (math.radians(90), 0, math.radians(rz)); o.location = (x, y, 0.17)
        o.location.z = 0.17

def microscope(x, y, rz):
    objs = []
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.18)); b = bpy.context.active_object; b.scale = (2.2, 1.6, 0.36); objs.append(b)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.55, 0.3, 1.9)); arm = bpy.context.active_object; arm.scale = (0.5, 0.5, 3.4); arm.rotation_euler.y = math.radians(-12); objs.append(arm)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.2, 0, 1.3)); stage = bpy.context.active_object; stage.scale = (1.6, 1.4, 0.12); objs.append(stage)
    head = lathe("mhead", [(0, 0), (0.42, 0), (0.42, 0.7), (0.3, 0.9), (0, 0.9)], DARK, steps=64); head.location = (-0.2, 0, 2.6); objs.append(head)
    for i, a in enumerate((-30, 30, 90)):
        ob = lathe("obj", [(0, 0), (0.1, 0), (0.1, 0.55), (0.07, 0.6), (0, 0.6)], STEEL, steps=32)
        ob.rotation_euler = (math.radians(20), 0, math.radians(a)); ob.location = (-0.2 + 0.25*math.sin(math.radians(a)), -0.25*math.cos(math.radians(a)), 2.55 - 0.6); objs.append(ob)
    eye = lathe("eye", [(0, 0), (0.16, 0), (0.16, 0.9), (0.2, 1.0), (0, 1.0)], DARK, steps=48); eye.rotation_euler = (math.radians(-55), 0, 0); eye.location = (-0.2, -0.3, 3.3); objs.append(eye)
    for o in objs:
        if not o.data.materials: o.data.materials.append(DARK)
        bv = o.modifiers.new("bevel", "BEVEL"); bv.width = 0.03; bv.segments = 3
        # rotate around pivot
        px, py = o.location.x, o.location.y; c, s = math.cos(math.radians(rz)), math.sin(math.radians(rz))
        o.location.x, o.location.y = x + px*c - py*s, y + px*s + py*c; o.rotation_euler.z += math.radians(rz)

def bottle(x, y, rz, h=3.4, r=0.6, body=M["amber"], capm=None):
    g = shell("bottle", [(0, 0), (r*0.9, 0), (r, 0.1), (r, h*0.72), (r*0.45, h*0.86), (r*0.42, h)], body, 0.035)
    c = lathe("bcap", [(0, h-0.05), (r*0.5, h-0.05), (r*0.5, h+0.45), (0, h+0.45)], capm or DARK, steps=64, rib=0.02, rib_rows=[1, 2])
    for o in (g, c): o.location = (x, y, 0); o.rotation_euler.z = math.radians(rz)

# ---------- scene ----------
# bench: long white epoxy slab; wall behind with a glass splash panel
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -0.6)); tb = bpy.context.active_object; tb.scale = (80, 40, 1.2); tb.name = "table"; tb.data.materials.append(BENCH)
bv = tb.modifiers.new("bevel", "BEVEL"); bv.width = 0.03; bv.segments = 4
WALL = (lambda mb: add_bump(mb[0], mb[1], 0.04, scale=400, detail=3))(mat("wall", **{"Base Color":(0.80, 0.82, 0.845, 1), "Roughness":0.85}))
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 19.0, 15)); wall = bpy.context.active_object; wall.scale = (120, 0.5, 40); wall.name = "sweep"; wall.data.materials.append(WALL)
# wall gradient like the studio sweep
nt = WALL.node_tree; bsdf = nt.nodes["Principled BSDF"]
tc = nt.nodes.new("ShaderNodeTexCoord"); sep = nt.nodes.new("ShaderNodeSeparateXYZ"); mr = nt.nodes.new("ShaderNodeMapRange")
mr.inputs["From Min"].default_value = -0.5; mr.inputs["From Max"].default_value = 0.5; mr.inputs["To Min"].default_value = 1.0; mr.inputs["To Max"].default_value = 0.45
mixc = nt.nodes.new("ShaderNodeMix"); mixc.data_type = "RGBA"; mixc.inputs[6].default_value = (0.42, 0.45, 0.50, 1); mixc.inputs[7].default_value = (0.84, 0.855, 0.875, 1)
nt.links.new(tc.outputs["Object"], sep.inputs["Vector"]); nt.links.new(sep.outputs["Z"], mr.inputs["Value"]); nt.links.new(mr.outputs["Result"], mixc.inputs["Factor"]); nt.links.new(mixc.outputs[2], bsdf.inputs["Base Color"])
# a dark reagent shelf line far back (out of focus) with bottles
for i, (bx, bm_, bh) in enumerate([(-11.5, M["amber"], 3.2), (-7.6, M["glass"], 2.6), (-2.2, M["amber"], 3.4), (2.5, M["glass"], 3.0), (8.8, M["amber"], 3.1), (12.4, M["glass"], 2.8)]):
    bottle(bx, 15.4, random.uniform(-20, 20), h=bh, r=0.55 + random.uniform(-0.08, 0.1), body=bm_)
    for o in bpy.context.selected_objects: pass
# move the last-added bottles up onto the shelf
for o in bpy.context.collection.objects:
    if o.name.startswith("bottle") or o.name.startswith("bcap"):
        pass

# foreground / midground glassware
erlenmeyer(-3.4, 1.2, 1.15, "blue", 0.36)
beaker(-0.9, 0.2, 1.0, "clear", 0.42)
beaker(1.3, 2.4, 0.78, "amber", 0.5)
volumetric(3.6, 0.9, 0.95, "teal")
tube_rack(6.3, 3.2, -14)
pipette(-1.2, -1.9, 70)
microscope(-7.4, 5.6, 25)
bottle(-6.4, 1.6, 12, h=2.3, r=0.48, body=M["amber"])
bottle(9.9, 0.6, -8, h=3.3, r=0.6, body=M["glass"], capm=WHITE)
# a few small vials on the bench right (plain)
for i, (vx, vy) in enumerate([(5.2, -0.9), (5.9, -0.6), (5.45, -0.2)]):
    g = shell("svial", [(0, 0), (0.27, 0), (0.3, 0.06), (0.3, 0.95), (0.22, 1.05), (0.2, 1.2)], M["glass"], 0.025); g.location = (vx, vy, 0)
    c = lathe("scap", [(0, 1.1), (0.26, 1.1), (0.26, 1.3), (0, 1.3)], M["alu"], steps=48); c.location = (vx, vy, 0)
    f = lathe("sflip", [(0, 1.3), (0.24, 1.3), (0.24, 1.38), (0, 1.38)], M["flip"], steps=48); f.location = (vx, vy, 0)

# lights + world (studio HDRI)
area("key", (-9.0, -9.0, 10.0), 7.0, 2600, size_y=8.0, color=(1.0, 0.965, 0.925), target=(0, 1, 1.4))
area("fill", (10.0, -8.0, 6.0), 6.0, 700, size_y=6.0, color=(0.93, 0.96, 1.0), target=(0, 1, 1.2))
area("rim", (2.0, 7.0, 7.0), 1.0, 1400, size_y=12.0, target=(0, 1, 1.5))
world = bpy.data.worlds.new("w"); world.use_nodes = True; wn = world.node_tree
env = wn.nodes.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load(os.path.abspath("studio.exr"))
mp = wn.nodes.new("ShaderNodeMapping"); tcw = wn.nodes.new("ShaderNodeTexCoord"); mp.inputs["Rotation"].default_value = (0, 0, math.radians(90))
wn.links.new(tcw.outputs["Generated"], mp.inputs["Vector"]); wn.links.new(mp.outputs["Vector"], env.inputs["Vector"])
bg = wn.nodes["Background"]; wn.links.new(env.outputs["Color"], bg.inputs["Color"]); bg.inputs["Strength"].default_value = 0.9
bpy.context.scene.world = world

# camera: 50mm, slightly above bench, looking across it
cam = bpy.data.cameras.new("cam"); cam.lens = 50; cam.sensor_width = 36
cam.dof.use_dof = True; cam.dof.aperture_fstop = 2.2; cam.dof.aperture_blades = 11
ob = bpy.data.objects.new("cam", cam); bpy.context.collection.objects.link(ob)
ob.location = (0.8, -19.0, 3.6); tgt = Vector((0.4, 1.2, 1.45))
ob.rotation_euler = (tgt - ob.location).to_track_quat("-Z", "Y").to_euler()
cam.dof.focus_distance = (Vector((-0.9, 0.2, 1.0)) - ob.location).length
bpy.context.scene.camera = ob

setup_render()
sc = bpy.context.scene; sc.render.resolution_x = WIDTH; sc.render.resolution_y = HEIGHT
sc.view_settings.exposure = 0.25
sc.render.filepath = OUTFILE
t = time.time(); bpy.ops.render.render(write_still=True); print("rendered", OUTFILE, round(time.time()-t, 1), "s")
