# Scenely

Learn a language by living it. Scenely drops you into short, real-life scenes, such as ordering a coffee, told only in the language you are learning. There are no translations: meaning comes from pictures, animation, repetition and your choices.

The first language is **Dutch (nl-NL)**. The app is built so that more languages can be added as data and themes, without engine changes.

## Status

| Milestone | State |
|---|---|
| Setup (Expo, TypeScript, expo-router, dependencies) | ✅ Done |
| Engine: types, pure reducer, progress and unlock rules, scene validation, tests | ✅ Done |
| Café scenes as data (customer and barista versions) | ✅ Done |
| Scene screen in the v7 design (Dutch café, dialog card, answer cards, progress dashes, Dutch speech) | ✅ Done |
| Map of the Netherlands, avatar picker, avatar walks to the next place, saved progress | ✅ Done |
| Speaking exercise ("Zeg het hardop") after each right answer | ✅ Done |
| Feedback (Lottie, sounds) | ⏳ Next |
| Progress screens (done, badges, options) | Planned |
| Polish (accessibility, reduce motion) | Planned |

Designs are in Figma (page "✅ v7 · Screens + speaking + UI flow"). The app follows the Visual design blueprint: one palette and the Nunito font for every language.

## Run it

Requirements: Node 20+ and the Expo Go app on your phone.

```bash
npm install
npx expo start
```

Scan the QR code with your phone's camera (iOS) or with Expo Go (Android).

**Speaking exercises need a development build.** They use `expo-speech-recognition`, which Expo Go doesn't contain. In Expo Go the app still runs; it just doesn't offer "Zeg het hardop". To try speaking on a phone, build the app once on your machine (or with EAS) and use that instead of Expo Go. In a desktop browser (Chrome), speaking works on the web version too.

```bash
npx expo run:ios      # or: npx expo run:android
```

On first launch you pick an avatar, then land on the map at the café. Tap **Speel als klant** to play. Progress is saved on the device, so **Barista** opens after Klant. Finishing both café roles makes your avatar walk to the next place. In development, long-press a locked role to open it anyway.

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
│   ├── index.tsx        # map ("Kaart"): places, avatar, walk to the next place
│   ├── avatar.tsx       # "Kies je avatar"
│   └── scene/[id].tsx   # scene player; saves the completion
├── components/          # ScenePlayer, CafeScene, AnswerCard, SpeakPanel, MicPermission, Button, Icon, shapes
│   ├── avatar/          # Figure (full-body person drawn from shapes), avatar looks
│   └── map/             # NlTownMap illustration, place labels and sheet, walking avatar
├── engine/              # pure logic: no UI, speech or storage
│   ├── types.ts         # Scene, Turn, Choice
│   ├── reducer.ts       # scene playback state machine
│   ├── selectors.ts     # question for a turn, tulip counts
│   ├── progress.ts      # unlock order, badges, tulip rating
│   ├── places.ts        # place status, where the avatar stands, when to walk
│   ├── speaking.ts      # compares what was said with the sentence, word by word
│   ├── validate.ts      # catches broken scene data
│   └── __tests__/
├── hooks/
│   ├── useGame.tsx      # saved progress and avatar, shared by all screens
│   ├── useScene.ts      # wires the reducer to speech and timing
│   ├── useSpeaking.ts   # one "say it out loud" attempt
│   └── useVoice.ts      # finds the device voice for a language
├── services/
│   ├── speech.ts        # expo-speech wrapper: nl-NL voice, normal and slow rate
│   ├── listening.ts     # expo-speech-recognition wrapper (skipped where unavailable)
│   └── storage.ts       # AsyncStorage: progress per language, avatar
├── scenes/
│   ├── index.ts         # unlock order per language
│   └── nl/              # Dutch scenes, one file per scene, and places.ts (the map's places)
└── themes/
    ├── types.ts         # colour and font tokens every language theme provides
    └── nl.ts            # Nederland theme
```

## How the scene screen behaves

- Top bar: back, the scenario title with one gold dash per answered question, and the role.
- The café sits in a frame; the other person's line is in a card below it, spoken with the best installed `nl-NL` voice (rate 0.9). **Luister opnieuw** repeats it; **Langzaam** plays it at rate 0.75.
- The answers appear with the question. A right answer turns teal with a tick ("Goed zo!"), the barista smiles and a coffee appears; **Verder** moves on. A wrong answer turns peach and shakes, the barista looks puzzled and repeats the question slowly, and the learner tries again.
- If no `nl-NL` voice is installed, the card asks the learner to install one; the text still shows.
- With the phone's reduce-motion setting on, the shake becomes a small offset.

## How speaking works

- After a right answer the learner can tap **Zeg het hardop**, or **Verder zonder spreken** to skip. It's never required.
- The first time, a screen explains why the microphone is needed; **Microfoon aanzetten** opens the system permission dialog, **Liever alleen luisteren** skips.
- On the speaking screen the learner can hear the sentence (**Voorbeeld**, **Langzaam**), then taps the microphone. Words turn teal as they are recognised (`nl-NL`, on the phone where the device supports it; nothing is saved).
- **Goed verstaan**: every word was heard. **Bijna**: the first missed word is underlined and can be played slowly; tap any word to hear it. **Probeer opnieuw** or **Verder**.
- Matching (`src/engine/speaking.ts`) ignores case, accents and punctuation, needs the words in order, and forgives one wrong letter in words of 4+ letters (two in 8+). Amounts like €2,50 match "2,50".

## How the map works

- Every place on the map is a scenario; its scenes (one per role) are listed in `src/scenes/nl/places.ts`, in walking order. A place with no scenes yet shows **Binnenkort**.
- A place is **open** when one of its scenes can be played, **done** when all are completed. The avatar stands at the first place that isn't done.
- When a completion finishes a place for the first time, the map plays the walk: a dotted route appears, the avatar walks there (about 2.5 s, legs swapping each step), and the new place's card opens marked **NIEUW**. **Overslaan** skips it; with the phone's reduce-motion setting on, the avatar moves there at once.
- Progress is saved per language (`scenely/v1/progress/<lang>`); the avatar is shared (`scenely/v1/avatar`).

## How a scene works

A scene is a map of **turns**, starting from `start`:

- `npc`: the other character says a line (spoken, shown in a speech bubble), then moves to `next`.
- `player`: the learner picks a sticker. A correct choice moves to its `next`; a wrong one shows feedback and the learner tries again. More than one choice can be correct.
- `end`: the final line. Reaching it completes the scene.

The reducer (`src/engine/reducer.ts`) is a pure state machine with four actions: `START`, `CHOOSE`, `NEXT` and `RESTART`. Every choice is counted per turn and used for the tulip rating (3 = all first time).

## Add a scene

1. Create `src/scenes/nl/<scene-id>.ts` exporting a `Scene` (copy `koffiebar-klant.ts` as a starting point).
2. Add it to `scenesNl` in `src/scenes/index.ts`. Its position in that list is its unlock position.
3. Add its id to the right place's `sceneIds` in `src/scenes/nl/places.ts`.
4. Run `npm test`. The scene-data test runs `validateScene` on every scene and reports broken links, turns without a correct answer, and scenes whose end can't be reached.

**Content rules:** 4–8 turns, one goal, short A1–A2 sentences, one register per scene (formal `u` or informal `je`), no straight quotes (use “ ” and ’). Split a scenario into one scene per role only when the roles have different goals (customer vs barista). Friends or neighbours get one scene.

**Register in the café scenes:** both versions use formal `u`, because a café is a service setting.

## Add a language (later)

1. Add a theme in `src/themes/<lang>.ts` that implements `Theme`.
2. Add scenes under `src/scenes/<lang>/` with `language` set to the right BCP 47 code.
3. Speech picks a voice from each scene's `language`.

## Credits and licences

Only free assets with clear licences (CC0, MIT or OFL). Each asset's source is listed here.

| Asset | Source | Licence |
|---|---|---|
| Icons (`src/components/Icon.tsx`) | Drawn in the style of [Lucide](https://lucide.dev), some paths adapted from it | MIT |
| Font: Nunito | Google Fonts, via `@expo-google-fonts/nunito` | SIL Open Font License 1.1 |
| Café, characters, tulips, map, avatars | Drawn in code for this project | Original to this project |

Packages added beyond the original plan (approved): `react-native-svg` for icons and shapes, and `@expo-google-fonts/nunito` for the blueprint font. (`@expo-google-fonts/bricolage-grotesque`, `dm-sans` and `caveat` were for the v5 design and are no longer used.)
