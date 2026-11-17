# FireRed & LeafGreen 3DS

**Version 0.1.0**: an early release, more improvements are on the way.

Pokémon FireRed and LeafGreen for the Nintendo 3DS with both screens: the game on top, and on the touch screen your party, bag, map, an Emerald-style battle menu and quick settings.

**Build it in your browser from your own ROM: https://larsarvid27.github.io/firered-leafgreen-3ds/**

## What you need

- A 3DS with custom firmware and the Homebrew Launcher (or a 3DS emulator).
- Your own clean dump of one of these cartridges, **version 1.0**:

| Game | Code | SHA-1 |
|---|---|---|
| Pokémon FireRed (USA) v1.0 | BPRE, revision 0 | `41cb23d8dccc8ebd7c649cd8fbb58eeace6e2fdc` |
| Pokémon LeafGreen (USA) v1.0 | BPGE, revision 0 | `574fa542ffebb14be69902d1d36f1ec0a4afd71e` |

Version 1.1 (Rev 1), other languages, hacks and patched dumps do not work. The page checks your file and tells you what it is.

## How it works

The page runs the builder in your browser. Your ROM is read into memory there, the game data is rebuilt from it, and you download one ZIP to extract to the root of your SD card. Nothing about your ROM is uploaded anywhere. This repository holds the page and the game program only; it contains no ROM and no game data.

## Support

FireRed & LeafGreen 3DS is free. If you'd like to support it: **[ko-fi.com/larsarvid](https://ko-fi.com/larsarvid)** ☕

## Credits and licence

Based on [Emerald 3DS](https://github.com/ZallaxDev/emerald-3ds) by Zallax and the [pret/pokefirered](https://github.com/pret/pokefirered) decompilation. Released under CC BY-NC-SA 4.0 (non-commercial). Pokémon is © Nintendo, Creatures Inc. and GAME FREAK inc. This project is not affiliated with or endorsed by them. No ROMs are provided.
