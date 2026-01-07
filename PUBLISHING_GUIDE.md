
# 2048STACK Android Publishing Guide

## 1. AndroidManifest.xml (CRITICAL)
Path: `android/app/src/main/AndroidManifest.xml`

Inside the `<application>` tag, you MUST add your AdMob App ID or the app will crash:

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
```

## 2. App Versioning
Path: `android/app/build.gradle`

Increment these for every release:
```gradle
defaultConfig {
    versionCode 1 // Increment this (2, 3, 4...)
    versionName "1.0.0" // User visible version
}
```

## 3. ProGuard Rules (Recommended)
Path: `android/app/proguard-rules.pro`

Add these to prevent the physics engine (Matter.js) and Capacitor from being mangled:
```pro
-keep class com.getcapacitor.** { *; }
-keep  class com.google.android.gms.ads.** { *; }
```

## 4. Build Commands
1. `npm run build`
2. `npx cap sync android`
3. Open Android Studio: `npx cap open android`
4. In Android Studio: `Build > Generate Signed Bundle / APK`
