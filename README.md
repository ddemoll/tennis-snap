# Tennis Snap

<p align="center">
  <img src="https://lh3.googleusercontent.com/2SKKyar2ip7r90ljp5tRZmyb7lInJ8AjK1I7PnQZuFQq-dNEl_s3NlR5SlcyS5WYprQ=s360-rw" alt="TennisSnap" title="TennisSnap">
</p>

### Available for iOS on the [App Store](https://itunes.apple.com/us/app/tennis-snap/id1198847937) and Android on the [Google Play Store](https://play.google.com/store/apps/details?id=com.ustaplayer)

![Sreenshots](screenshots/iphone_screenshots.png?raw=true)

Tennis Snap is a USTA team management app for captains and league players.

## App Features

* View schedule, scores, lineups.
* Push notifications to notify users of upcoming matches and request availability.
* Captain login to set lineup positions.
* Syncs all USTA teams in one schedule.
* Google/Apple Maps integration.
* View opponent record and NTRP rating.
* Track flight standings in real-time.

[![React Native][react_native-badge]][react_native-url]
[![iOS Platform][ios_platform-badge]][ios_platform-url]
[![Xcode][xcode-badge]][xcode-url]
[![Android Platform][android_platform-badge]][android_platform-url]
[![Android Studio][android_studio-badge]][android_studio-url]

## Project Architecture

`app` folder contains client react-native app. `setup.js` in the entry point.

### Actions

Contains all redux actions

### Reducers

Reducers specify how the application's state changes in response to actions sent to the store.

### Containers

Containers are full screens and render corresponding sub-components. Provide the data and behavior to other container components. Are often stateful, as they tend to serve as data sources and call redux actions.

### Components

Components are concerned with how things look and have no dependency on redux. Don’t specify how the data is loaded or mutated.

### Navigation

Navigation components reside here.

* `NavigationDrawer.js` - loads in the initial screen and creates menu for to access each screen

### Themes

Styling themes used throughout the app styles.

### Lib

External modules used by the application such as the AdMob library and API class.

### Images

Contains actual images (usually png) used in the application.

---

Backend (not shown) runs on AWS - API Gateway, Lambda, DynamoDB

[react_native-badge]: https://img.shields.io/badge/React%20Native-0.57.4-blue.svg?style=flat
[react_native-url]: https://facebook.github.io/react-native/
[ios_platform-badge]: https://img.shields.io/badge/iOS-10.0+-lightgrey.svg
[ios_platform-url]: https://developer.apple.com/
[xcode-badge]: https://img.shields.io/badge/Xcode-10.1+-lightgrey.svg
[xcode-url]: https://developer.apple.com/xcode/
[android_platform-badge]: https://img.shields.io/badge/Android-4.1+-green.svg
[android_platform-url]: https://developer.android.com/index.html
[android_studio-badge]: https://img.shields.io/badge/Android%20Studio-3.2.1+-green.svg
[android_studio-url]: https://developer.android.com/studio/install
