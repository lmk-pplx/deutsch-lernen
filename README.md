# Deutsch Lernen

A German language learning Android app built with React Native (Expo). Designed for A1-A2 level learners.

## Features

### Vocabulary Sets
- 12 pre-built vocabulary sets with 10-14 words each, grouped by topic and CEFR difficulty level (A1.1, A1.2, A2.1)
- Three view modes per set: **List**, **Flashcards**, and **Quiz**
- Each word includes German, English translation, example sentence, and phonetic pronunciation
- Filter sets by difficulty level

### Progress Tracking
- Streak counter tracking consecutive days of activity
- 30-day activity calendar heatmap
- Statistics: words learned, quizzes completed, average quiz score, longest streak

### Speaking Practice
- 8 real-world conversation scenarios (café, directions, doctor, apartment, etc.)
- Three difficulty modes: Easy (full text), Medium (partially hidden), Hard (fully hidden)
- Toggle which speaker role to practice
- Optional English translations

### Custom Vocabulary
- Create your own vocabulary sets with custom name, topic, and difficulty
- Add words with German text, English translation, example sentence, and pronunciation
- Custom sets support all three view modes (list, flashcards, quiz)
- Edit and delete custom sets and words

## Getting the APK

The APK is built automatically via GitHub Actions on every push to main. To download:

1. Go to the [Actions tab](../../actions) and click the latest successful workflow run
2. Download the `deutsch-lernen-debug` artifact
3. Or check [Releases](../../releases) for the latest APK

### Build locally

```bash
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

## Development

```bash
npm install
npx expo start
```

## Tech Stack

- React Native + Expo (SDK 55)
- expo-router for navigation
- AsyncStorage for local data persistence
- TypeScript
