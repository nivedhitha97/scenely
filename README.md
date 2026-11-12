# Scenely

Learn a language by living it. Scenely drops you into short, real-life scenes, such as ordering a coffee, told only in the language you are learning. There are no translations: meaning comes from pictures, animation, repetition and your choices.

The first language is **Dutch (nl-NL)**. The app is built so that more languages can be added as data and themes, without engine changes.

## Status

| Milestone | State |
|---|---|
| Setup (Expo, TypeScript, expo-router, dependencies) | ✅ Done |
| Engine: types, pure reducer, progress and unlock rules, scene validation, tests | ✅ Done |
| Café scenes as data (customer and barista versions) | ✅ Done |
| Scene screen (speech bubbles, stickers, speech) | ⏳ Next |
| Feedback (Lottie, shake, sounds) | Planned |
| Progress screens (map, done, passport, options) | Planned |
| Polish (accessibility, reduce motion) | Planned |

Designs are in Figma (page "Final screens · Nederland (v5)").

## Run it

Requirements: Node 20+ and the Expo Go app on your phone.

```bash
npm install
npx expo start
```

Scan the QR code with your phone's camera (iOS) or with Expo Go (Android).

**Dutch voice:** the app speaks with a Netherlands Dutch (`nl-NL`) voice. If no Dutch voice is installed, install one in your phone's settings:
- iOS: Settings → Accessibility → Spoken Content → Voices → Dutch → choose a Netherlands voice (Enhanced or Premium sounds best).
- Android: Settings → System → Languages → Text-to-speech output → Install voice data → Dutch (Netherlands).

## Checks

```bash
npm test            # Jest unit tests
npm run typecheck   # TypeScript strict mode
npx expo lint       # ESLint
```

## Project layout

```
src/
├── app/                 # expo-router screens (every file is a route)
├── engine/              # pure logic: no UI, speech or storage
│   ├── types.ts         # Scene, Turn, Choice
│   ├── reducer.ts       # scene playback state machine
│   ├── progress.ts      # unlock order, badges, tulip rating
│   ├── validate.ts      # catches broken scene data
│   └── __tests__/
├── scenes/
│   ├── index.ts         # unlock order per language
│   └── nl/              # Dutch scenes, one file per scene
└── themes/
    ├── types.ts         # tokens every language theme provides
    └── nl.ts            # Nederland theme
```

## How a scene works

A scene is a map of **turns**, starting from `start`:

- `npc`: the other character says a line (spoken, shown in a speech bubble), then moves to `next`.
- `player`: the learner picks a sticker. A correct choice moves to its `next`; a wrong one shows feedback and the learner tries again. More than one choice can be correct.
- `end`: the final line. Reaching it completes the scene.

The reducer (`src/engine/reducer.ts`) is a pure state machine with four actions: `START`, `CHOOSE`, `NEXT` and `RESTART`. Every choice is counted per turn and used for the tulip rating (3 = all first time).

## Add a scene

1. Create `src/scenes/nl/<scene-id>.ts` exporting a `Scene` (copy `koffiebar-klant.ts` as a starting point).
2. Add it to `scenesNl` in `src/scenes/index.ts`. Its position in that list is its unlock position.
3. Run `npm test`. The scene-data test runs `validateScene` on every scene and reports broken links, turns without a correct answer, and scenes whose end can't be reached.

**Content rules:** 4–8 turns, one goal, short A1–A2 sentences, one register per scene (formal `u` or informal `je`), no straight quotes (use “ ” and ’). Split a scenario into one scene per role only when the roles have different goals (customer vs barista). Friends or neighbours get one scene.

**Register in the café scenes:** both versions use formal `u`, because a café is a service setting.

## Add a language (later)

1. Add a theme in `src/themes/<lang>.ts` that implements `Theme`.
2. Add scenes under `src/scenes/<lang>/` with `language` set to the right BCP 47 code.
3. Speech picks a voice from each scene's `language`.

## Credits and licences

Only free assets with clear licences (CC0 or MIT). Each asset's source will be listed here when it is added.
