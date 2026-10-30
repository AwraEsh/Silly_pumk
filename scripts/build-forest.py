"""Rebuild the forest's static SVG. The website itself only needs the finished SVG.

The trees share a growth rule, but not a silhouette. A fixed seed lets us move a
branch without accidentally growing an entirely different forest.
"""
from pathlib import Path
import math
import random

rng = random.Random(31)
parts = []

def add(markup):
    parts.append(markup)

def branch(x, y, length, angle, thickness, depth, color):
    bend = rng.uniform(-0.3, 0.3)
    tip_x = x + math.cos(angle) * length
    tip_y = y + math.sin(angle) * length
    control_x = x + math.cos(angle + bend) * length * 0.58
    control_y = y + math.sin(angle + bend) * length * 0.58
    add(f'<path d="M{x:.1f} {y:.1f}Q{control_x:.1f} {control_y:.1f} {tip_x:.1f} {tip_y:.1f}" stroke="{color}" stroke-width="{thickness:.1f}" stroke-linecap="round"/>')
    if depth:
        branch(tip_x, tip_y, length * rng.uniform(.57, .75), angle + rng.uniform(-.32, .27), thickness * .57, depth - 1, color)
        direction = rng.choice([-1, 1])
        branch(tip_x, tip_y, length * rng.uniform(.37, .62), angle + direction * rng.uniform(.44, .92), thickness * .39, depth - 1, color)

add('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1536 1024" fill="none">
<defs>
  <linearGradient id="sky" x2="0" y2="1"><stop stop-color="#080e14"/><stop offset=".58" stop-color="#182b30"/><stop offset="1" stop-color="#0a1316"/></linearGradient>
  <radialGradient id="moonlight"><stop stop-color="#839d9c" stop-opacity=".18"/><stop offset="1" stop-color="#839d9c" stop-opacity="0"/></radialGradient>
  <radialGradient id="lamplight"><stop stop-color="#d39a55" stop-opacity=".25"/><stop offset="1" stop-color="#d39a55" stop-opacity="0"/></radialGradient>
  <radialGradient id="mist"><stop stop-color="#769591" stop-opacity=".13"/><stop offset="1" stop-color="#769591" stop-opacity="0"/></radialGradient>
  <linearGradient id="flame" x2="0" y2="1"><stop stop-color="#f4d8a0"/><stop offset="1" stop-color="#b87537"/></linearGradient>
</defs>
<g id="art" fill="none">
<path fill="url(#sky)" d="M0 0h1536v1024H0z"/>
<ellipse cx="1135" cy="340" rx="400" ry="420" fill="url(#moonlight)"/>
<circle cx="1130" cy="218" r="57" fill="#b7c5b9"/>
<path d="M1152 166a57 57 0 0 1-69 85 57 57 0 0 0 69-85Z" fill="#8caba3"/>
<g fill="#90aba3" opacity=".4"><circle cx="1114" cy="195" r="9"/><circle cx="1144" cy="233" r="12"/><circle cx="1106" cy="225" r="5"/></g>
<!-- Distant trunks disappear into the clearing; the front trees close around it. -->''')
for layer, color, count in [(0, '#20383b', 27), (1, '#14292c', 19), (2, '#0d1d22', 12)]:
    for i in range(count):
        x = rng.uniform(0, 1536)
        if layer == 2 and 840 < x < 1250:
            continue
        base = rng.uniform(735, 900) + layer * 25
        height = rng.uniform(300, 650)
        width = rng.uniform(4, 10) + layer * 3
        lean = rng.uniform(-75, 75)
        add(f'<path d="M{x-width:.1f} {base:.1f}Q{x+lean:.1f} {base-height*.5:.1f} {x+lean:.1f} {base-height:.1f}Q{x+lean+width*.4:.1f} {base-height*.5:.1f} {x+width:.1f} {base:.1f}Z" fill="{color}"/>')
        for side in [-1, 1]:
            branch(x + lean * .55, base - height * rng.uniform(.4,.7), rng.uniform(65,140), -math.pi / 2 + side * rng.uniform(.35,.9), width*.47, 3, color)
add('''<path d="M0 864q290-88 600-10t510-33q220-66 426 2v201H0Z" fill="#0d1b1c"/>
<!-- The narrowing path is the invitation: it ends at the only warm light. -->
<path d="M1029 742q-40 77 47 114t-184 168h437q-285-128-223-173t-37-109Z" fill="#243531"/>
<path d="M1046 747q-17 91 52 112t-102 165h208q-166-114-109-158t-32-119Z" fill="#2b3b33" opacity=".6"/>
<ellipse cx="1090" cy="856" rx="390" ry="58" fill="url(#mist)"/>
<ellipse cx="850" cy="728" rx="400" ry="57" fill="url(#mist)"/>
<ellipse cx="1290" cy="630" rx="280" ry="45" fill="url(#mist)"/>
''')
# A few large trees supply the composition. Their roots and bent trunks are drawn
# explicitly, so the forest has a shape rather than just a random scattering.
add('''<g fill="#071013" stroke="#071013" stroke-linejoin="round">
<path d="M1432 1024q-35-145-16-301t-29-274q-47-91-42-228L1310 0h91l-5 211q-21 150 28 242 65 120 45 263t67 308Z"/>
<path d="M1396 474q-75-80-117-190t-116-174q91 51 136 154t104 128Z"/>
<path d="M1363 269q103-83 173-209v68q-58 98-162 187Z"/>
<path d="M1422 759q-10 159-82 241l87-43 26 67h83l-51-117Z"/>
<path d="M161 1024q60-170 31-331T140 428Q113 272 152 0H80Q64 222 94 415t42 284Q162 870 65 1024Z"/>
<path d="M124 399Q211 283 303 243t189-131Q373 193 291 213T118 334Z"/>
<path d="M178 714Q94 647 0 677v-32q106-16 172 24Z"/>
<path d="m110 949-81 75h161l31-63-44 20Z"/>
<path d="M646 1000q74-123 45-315t-26-341Q651 191 716 0h-47q-57 183-53 353t36 331q29 190-64 340Z"/>
<path d="M658 442q58-146 143-205t127-147q-15 81-112 165t-153 230Z"/>
<path d="M641 272Q546 180 520 45q6 118 113 281Z"/>
</g>''')
for x, y, length, angle, thickness, depth in [
    (1383,355,165,-2.5,15,5),(1322,260,145,-2.1,12,5),
    (1403,456,160,-.72,16,5),(1360,195,170,-.9,12,4),
    (1218,178,140,-2.7,8,4),(129,367,145,-.55,14,5),
    (216,280,155,-.28,9,4),(97,244,125,-2.3,10,4),
    (659,455,132,-.93,12,4),(750,290,140,-.4,8,4),
    (638,274,130,-2.3,9,4),(710,138,150,-.65,9,4)]:
    branch(x,y,length,angle,thickness,depth,'#071013')
add('''<!-- Cold mist catches between the trunks. The clearing stays empty. -->
<ellipse cx="1030" cy="790" rx="500" ry="75" fill="url(#mist)"/>
<ellipse cx="730" cy="900" rx="550" ry="65" fill="url(#mist)"/>
<path d="M0 1012q300-103 610-7t926-13v32H0Z" fill="#070f11"/>
</g></svg>''')
Path('assets/forest.svg').write_text('\n'.join(parts) + '\n')
print(f'Forest rebuilt: {len(parts)} shapes, {Path("assets/forest.svg").stat().st_size:,} bytes')
