# The Daily Globe — Wednesday 25 November 2026

[![make.fun · news-image-20261125](https://make.fun/badge/news-image-20261125.svg)](https://make.fun/bounty/news-image-20261125?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)
[![rank](https://make.fun/badge/news-image-20261125/Loireweast/news-image-20261125-entry/rank.svg)](https://make.fun/bounty/news-image-20261125/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)
[![reward](https://make.fun/badge/news-image-20261125/Loireweast/news-image-20261125-entry/reward.svg)](https://make.fun/bounty/news-image-20261125?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)

The world of Wednesday 25 November 2026 in one page — a newspaper front page summing up the day's news.

Built for the [make.fun news-image-20261125 bounty](https://make.fun/bounty/news-image-20261125) ("Sum up 25 November's world news in one image", $100 in USDC).

## What's on the front page

- **Lead story:** two oil tankers struck naval mines and caught fire in the Strait of Hormuz, as the Gulf war widened to the Houthi attack on Saudi Arabia's Ras Tanura refinery.
- **Also covered:** Ukraine's strikes on two Russian refineries and five warplanes at Savasleyka; the Israeli strike that killed Hamas security chief Mohammad Abu al-Ouf in Gaza; Huawei convicted on 10 of 12 counts in Brooklyn; the chip rout versus Dell's record $54.9bn quarter; Shenzhou-24 carrying Pakistan's first astronaut to Tiangong; leaked data putting Russian war dead at 490,334.
- **Ticker along the bottom:** the Cairo tanker fire, the Australia–Solomon Islands treaty, Sudan drone strikes, the Bangladesh garment pay rise, the Nigeria meth seizure, the birthright citizenship ruling, and Pope Leo XIV on COP31.

Every fact on the page was checked live against Reuters, AP, BBC News, Just Security and Aviation Week reporting dated 25 November 2026.

## How it works

`main.ts` (Node 22, stdlib only) copies the pre-rendered `entry.png` to `$MAKEFUN_OUTPUT_DIR/entry.png` (default `/output`). The front page itself lives in `tools/scene.html` and was rendered to `entry.png` with headless Chrome (`tools/render.mjs`, DevTools pipe).

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Requires Node 22.
