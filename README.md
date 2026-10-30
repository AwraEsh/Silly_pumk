# Happy Halloween

A quiet, web-native Halloween artwork: a dark forest, one carved pumpkin, **Happy Halloween**, and **From Silly Arash**. Nothing to open or switch on.

The forest and pumpkin are SVG. The lettering uses locally bundled fonts. One slow CSS mist layer respects reduced-motion preferences. There is no JavaScript, audio, Canvas, framework, analytics, or remote asset request.

## Local preview

```sh
python3 -m http.server 8089 --bind 127.0.0.1
```

Open [the preview](http://127.0.0.1:8089/). Serve over HTTP; external SVG references can be restricted on file URLs.

## GitHub Pages

Upload `index.html`, `styles.css`, `.nojekyll`, and the entire `assets/` directory to your repository. In **Settings → Pages**, choose **Deploy from a branch**, your branch, and **/ (root)**. No build command is needed. All paths are relative, including under a repository subpath.

Repository: [AwraEsh/Silly_pumk](https://github.com/AwraEsh/Silly_pumk).

Website: [Happy Halloween](https://awraesh.github.io/Silly_pumk/).

## Editing

- `index.html`: the two lines of copy and pumpkin.
- `styles.css`: centered composition, typography, responsive sizing, darkness, and mist.
- `assets/pumpkin.svg`: hand-built pumpkin contours and carved light.
- `assets/forest.svg`: the finished vector forest.
- `scripts/build-forest.py`: optional standard-library Python source for rebuilding the forest with a fixed seed. It is not needed on the deployed page.

The small **Silly Arash** credit links to [@Silly_Arash](https://t.me/Silly_Arash), without adding extra visible text. UnifrakturMaguntia and Cormorant Garamond are bundled with their SIL Open Font License files in `assets/fonts/`.

Verification screenshots and measurements are in `docs/verification/`. Actual-phone and Safari testing remain open.
