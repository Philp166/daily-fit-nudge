# Interfit (mobile)

Flutter app for Interfit — plan and track interval workouts. Same functionality as the web app, built for RuStore and App Store.

## Requirements

- Flutter 3.x
- Dart 3.x
- Android SDK (API 21+)
- Xcode (for iOS)

## Run locally

```sh
cd mobile
flutter pub get
flutter run
```

Select a device or emulator when prompted.

## Build for stores

### Android (RuStore / Google Play)

1. Configure signing: create a keystore and set `android/key.properties` and `signingConfigs` in `android/app/build.gradle.kts` (see [Flutter docs](https://docs.flutter.dev/deployment/android#signing-the-app)).
2. Build AAB:
   ```sh
   flutter build appbundle
   ```
3. Output: `build/app/outputs/bundle/release/app-release.aab`.
4. For RuStore: check [RuStore publishing requirements](https://www.rustore.ru/help/rustore/publishing_apps). Upload the AAB and fill in store listing (description, screenshots, privacy policy if needed).

### iOS (App Store)

1. Open `ios/Runner.xcworkspace` in Xcode.
2. Select the Runner target → Signing & Capabilities: choose your Team and provisioning profile.
3. Build:
   ```sh
   flutter build ios
   ```
4. Archive and upload via Xcode (Product → Archive) or App Store Connect.
5. In App Store Connect: set category (e.g. Health & Fitness), description, screenshots, privacy policy URL.

## Project structure

- `lib/core/` — models, services (storage, calories)
- `lib/data/` — exercises catalog, preset workouts
- `lib/providers/` — UserProvider (state)
- `lib/features/` — onboarding, home (dashboard), timer, workouts, constructor, profile

## Package / Bundle IDs

- Android: `ru.interfit.app`
- iOS: `ru.interfit.app`

Version is set in `pubspec.yaml` (`version: 1.0.0+1`). Use `--build-name` and `--build-number` with `flutter build` to override.
