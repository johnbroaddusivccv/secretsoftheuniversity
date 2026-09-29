import asyncio, base64, json, sys, os
from playwright.async_api import async_playwright
specs=json.load(open(sys.argv[1])); os.makedirs("labels", exist_ok=True)
# label aspect (arc length / height) per form, must match blender geometry
ASPECT={"vial":(0.852*3.14159*1.35)/(2.35-0.6),"dropper":(1.062*3.14159*1.25)/(2.05-0.5),"nasal":(0.962*3.14159*1.25)/(2.35-0.45),"caps":(1.312*3.14159*1.25)/(2.55-0.45),"powder":(1.732*3.14159*1.1)/(1.72-0.32)}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        await pg.goto("http://localhost:8790/render.html"); await pg.wait_for_function("window.ready===true", timeout=60000)
        await pg.evaluate("Promise.all(['600','700','800'].map(w=>document.fonts.load(w+' 40px Inter')))"); await pg.wait_for_timeout(500)
        for s in specs:
            f=f"labels/{s['sku']}.png"
            if os.path.exists(f): continue
            a=ASPECT[s["form"]]
            url=await pg.evaluate("([s,a])=>{ const t=window.__label(s,a,1); return t.image.toDataURL('image/png'); }", [s,a])
            open(f,"wb").write(base64.b64decode(url.split(",")[1]))
        await b.close()
asyncio.run(main())
