from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os
from pathlib import Path

root=Path(__file__).resolve().parent.parent
out=root/'docs'/'assets'/'maria-anime-logo.gif'
out.parent.mkdir(parents=True,exist_ok=True)
W,H=540,210
fontpaths=['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf']
fontfile=next((x for x in fontpaths if os.path.exists(x)),None)
def F(size):return ImageFont.truetype(fontfile,size) if fontfile else ImageFont.load_default()
frames=[]
for t in range(10):
    im=Image.new('RGBA',(W,H))
    px=im.load()
    for y in range(H):
        f=y/H
        for x in range(W):
            c=min(1,max(0,x/W))
            px[x,y]=(int(31+53*c+23*f),int(22+19*c+11*f),int(65+52*c+29*f),255)
    d=ImageDraw.Draw(im,'RGBA')
    # Soft illuminated anime-inspired Tokyo-night gradient and decorative lights
    for ix in range(8):
        x=65+ix*65
        y=18+int(7*math.sin(t*.5+ix))
        d.ellipse((x-5,y-5,x+5,y+5),fill=(255,220,161,150),outline=(250,230,180,90),width=1)
    # Moon and glow
    d.ellipse((460,12,523,75),fill=(245,223,255,65))
    d.ellipse((468,20,515,67),fill=(255,234,245,205))
    d.ellipse((486,29,497,40),fill=(216,179,231,100))
    # Anime girl: hair silhouette and shoulders
    d.ellipse((20,17,182,205),fill=(23,17,50,255))
    d.polygon([(27,176),(16,208),(177,208),(151,163),(130,145),(58,148)],fill=(35,22,57,255))
    # Floral kimono
    d.polygon([(8,208),(40,151),(76,162),(97,184),(117,161),(160,163),(191,208)],fill=(88,32,86,255))
    d.line([(80,163),(104,204)],fill=(250,161,212,220),width=9)
    # face and blush
    d.ellipse((51,48,152,163),fill=(255,207,197,255))
    d.ellipse((57,121,82,138),fill=(245,119,151,90))
    d.ellipse((128,121,149,138),fill=(245,119,151,90))
    # hair fringe
    d.pieslice((39,25,161,119),180,345,fill=(21,17,49,255))
    d.polygon([(46,57),(60,102),(73,64),(85,98),(105,56),(121,87),(147,50),(149,25)],fill=(25,20,54,255))
    d.arc((38,22,163,151),200,310,fill=(138,91,170,200),width=3)
    # expressive anime eyes; wink on one frame
    d.ellipse((69,103,90,122),fill='white')
    d.ellipse((114,103,135,122),fill='white')
    if t in (3,4):
        d.arc((68,107,92,120),190,350,fill=(38,24,71,255),width=4)
    else:
        d.ellipse((76,104,86,119),fill=(115,60,171,255))
        d.ellipse((78,104,82,109),fill=(255,255,255,255))
    d.ellipse((120,104,130,119),fill=(115,60,171,255))
    d.ellipse((122,104,126,109),fill=(255,255,255,255))
    d.arc((95,132,117,143),10,170,fill=(152,62,104,255),width=3)
    # sakura ornaments
    for j,(xx,yy) in enumerate([(39,52),(54,40),(44,70),(162,184),(30,190)]):
        ang=t*.13+j
        X=xx+math.sin(ang)*2; Y=yy+math.cos(ang)*2
        for a in range(5):
            theta=a*math.tau/5
            cx=X+6*math.cos(theta);cy=Y+6*math.sin(theta)
            d.ellipse((cx-6,cy-6,cx+6,cy+6),fill=(255,161,206,245))
        d.ellipse((X-3,Y-3,X+3,Y+3),fill=(255,235,124,255))
    # neon name shadow glow: text stays consistent across all frames
    text='Maria SM'
    glow=Image.new('RGBA',(W,H))
    gd=ImageDraw.Draw(glow,'RGBA')
    gd.text((201,47),text,font=F(61),fill=(255,57,170,230),stroke_width=2,stroke_fill=(255,70,194,180))
    glow=glow.filter(ImageFilter.GaussianBlur(8))
    im=Image.alpha_composite(im,glow)
    d=ImageDraw.Draw(im,'RGBA')
    d.text((198,44),text,font=F(61),fill=(255,231,246,255),stroke_width=2,stroke_fill=(213,88,177,255))
    d.text((204,122),'SHOPPING  ·  STORIES  ·  SOUL',font=F(19),fill=(252,231,243,245))
    d.line((205,160,514,160),fill=(250,141,203,180),width=2)
    # glimmer, animated falling petals
    for j in range(7):
        x=207+((j*53+t*11)%304)
        y=5+((j*34+t*17)%192)
        radius=3+(j%3)
        d.ellipse((x-radius,y-radius,x+radius,y+radius),fill=(255,183,218,150+(j%3)*25))
        if j%2==0:
            d.line((x-8,y,x+8,y),fill=(255,222,241,180),width=1)
            d.line((x,y-8,x,y+8),fill=(255,222,241,180),width=1)
    frames.append(im.convert('RGB').quantize(colors=96,method=Image.Quantize.FASTOCTREE))
frames[0].save(out,save_all=True,append_images=frames[1:],duration=170,loop=0,optimize=True,disposal=2)
print('Generated animated Maria SM logo:',out,out.stat().st_size,'bytes',len(frames),'frames')
