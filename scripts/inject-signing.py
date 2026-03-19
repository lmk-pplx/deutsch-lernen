"""Inject release signing config into the Expo-generated build.gradle."""

import sys

GRADLE_FILE = "android/app/build.gradle"

SIGNING_CONFIG = """
    signingConfigs {
        release {
            storeFile file("release.keystore")
            storePassword "android"
            keyAlias "release"
            keyPassword "android"
        }
    }
"""

with open(GRADLE_FILE, "r") as f:
    content = f.read()

# Insert signingConfigs right after first "android {"
content = content.replace("android {", "android {\n" + SIGNING_CONFIG, 1)

# Add signingConfig to release buildType
if "release {" in content and "signingConfig" not in content:
    content = content.replace(
        "release {",
        "release {\n            signingConfig signingConfigs.release",
        1,
    )
elif "buildTypes {" in content and "release {" not in content:
    content = content.replace(
        "buildTypes {",
        (
            "buildTypes {\n"
            "        release {\n"
            "            signingConfig signingConfigs.release\n"
            '            minifyEnabled false\n'
            '            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"\n'
            "        }"
        ),
        1,
    )

with open(GRADLE_FILE, "w") as f:
    f.write(content)

print("Signing config injected into", GRADLE_FILE)
