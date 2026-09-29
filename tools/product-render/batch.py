import asyncio, base64, json, io, os
from PIL import Image
from playwright.async_api import async_playwright
specs=json.load(open("specs.json"))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
        pg=await b.new_page(viewport={"width":1024,"height":1024})
        await pg.goto("http://localhost:8790/render.html"); await pg.wait_for_function("window.ready===true", timeout=60000)
        for i,s in enumerate(specs):
            dst=f"out/{s['sku']}.webp"
            if os.path.exists(dst): continue
            url=await pg.evaluate("s=>renderProduct(s)", s)
            im=Image.open(io.BytesIO(base64.b64decode(url.split(",")[1]))).convert("RGB").resize((800,800), Image.LANCZOS)
            im.save(dst, "WEBP", quality=84, method=6)
            print(i+1, s["sku"], flush=True)
        await b.close()
asyncio.run(main())
