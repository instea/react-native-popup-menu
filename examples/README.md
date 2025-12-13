# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Start the app

   ```bash
   yarn expo start
   ```

  When using WSL, you might need to use tunnel

   ```bash
  yarn expo start --tunnel
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Publish update

### Prerequisites

```
# expo
npm install -g eas-cli
eas login
```

### Building

Update the version in `app.json`

```
{
  "expo": {
    "version": "1.1.0",
  }
}
```

```
eas build --platform android --profile production
```

You might need to configure project on your machine (use/download existing keystore)

Then submit the application

```
eas submit --platform android
```

Then you can go to the google play console and publish the release.