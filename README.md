# The Daily Globe — Wednesday 25 November 2026

A make.fun `news-image-20261125` entry: one newspaper front page summing up the
world news of Wednesday 25 November 2026.

- **Lead:** two oil tankers hit naval mines and caught fire in the Strait of Hormuz,
  as the Gulf war widened to the Houthi attack on Saudi Arabia's Ras Tanura refinery.
- **Also inside:** Ukraine's strikes on two Russian refineries and five warplanes at
  Savasleyka; the Israeli strike that killed Hamas security chief Mohammad Abu al-Ouf
  in Gaza; Huawei convicted on 10 of 12 counts in Brooklyn; the chip rout vs Dell's
  record $54.9bn quarter; Shenzhou-24 carrying Pakistan's first astronaut to Tiangong;
  leaked data putting Russian war dead at 490,334.
- **Ticker:** Cairo tanker fire, Australia–Solomon Islands treaty, Sudan drone strikes,
  Bangladesh garment pay rise, Nigeria meth seizure, the birthright citizenship ruling,
  and Pope Leo XIV on COP31.

## How it works

`main.ts` (Node 22, stdlib only) copies the pre-rendered `entry.png` to
`$MAKEFUN_OUTPUT_DIR/entry.png` (default `/output`). The page itself lives in
`tools/scene.html` and was rendered to `entry.png` with headless Chrome
(`tools/render.mjs`, DevTools pipe).

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Every fact on the page was verified live against Reuters, AP, BBC News,
Just Security and Aviation Week reporting dated 25 November 2026.
