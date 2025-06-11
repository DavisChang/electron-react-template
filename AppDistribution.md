# 🛠️ macOS App Distribution: Code Signing, Notarization, Stapling

This document explains the complete lifecycle of preparing a macOS application for secure distribution, covering the three essential steps:

1. **Code Signing**
2. **Notarization**
3. **Stapling**

---

## 🛠️ 1. Code Signing

### ✅ What is it?

Code Signing ensures that your application comes from a known developer and hasn't been modified after signing. It's done using a Developer ID certificate issued by Apple.

### ✅ Why is it important?

* Required by macOS Gatekeeper to allow execution.
* Helps users verify authenticity and integrity.

### ✅ How to do it

Use Apple Developer ID Application certificate (`.p12`) to sign `.app`, `.dmg`, `.zip`, or `.pkg` files.

#### Example:

```bash
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: Your Name (TEAMID)" \
  YourApp.app
```

---

## 📋 2. Notarization

### ✅ What is it?

Notarization is Apple's automated security scan for macOS software distributed outside the App Store. Once approved, Apple issues a "notarization ticket."

### ✅ Why is it important?

* Mandatory for macOS Catalina (10.15) and later.
* Gatekeeper blocks unsigned or un-notarized apps.

### ✅ How to do it

Use `xcrun notarytool` to upload your signed `.dmg` or `.zip` to Apple.

#### Example:

```bash
xcrun notarytool submit dist/MyApp.dmg \
  --apple-id "your@email.com" \
  --password "app-specific-password" \
  --team-id "ABCDE12345" \
  --wait
```

---

## 📌 3. Stapling

### ✅ What is it?

Stapling embeds the notarization ticket into the app binary. This makes the app verifiable offline by Gatekeeper.

### ✅ Why is it important?

* Without stapling, macOS will require internet to verify the app.
* Prevents install failure in offline scenarios.

### ✅ How to do it

Use `xcrun stapler` on the notarized `.app` or `.dmg`.

#### Example:

```bash
xcrun stapler staple dist/MyApp.dmg
```

---

## 🔹 Complete Flow Chart

```text
[.app/.dmg source]
    ↓  Code Signing (Developer ID Application)
[Signed binary]
    ↓  Notarization (submit to Apple)
[Approved by Apple]
    ↓  Stapling (embed ticket)
[Final binary ready for offline use]
    ↓  Distribute (App Store or External)
```

---

## 🚀 Distribution Options & Requirements

| Distribution Channel | Notarization Required                | Notes                                                                    |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------ |
| **Mac App Store**    | ✅ Yes (Handled by Apple)             | Use Xcode to submit. Stapling not required.                              |
| **External Website** | ✅ Yes (You must notarize and staple) | Required for `.dmg`, `.zip`, `.pkg` shared outside the App Store         |
| **Internal Testing** | ⚠️ Optional                          | Explain how to allow un-notarized apps manually. Not for public release. |

---

## 🌍 User Experience by Stage

| Stage                 | Can User Install?          | macOS Behavior           | Security Risk |
| --------------------- | -------------------------- | ------------------------ | ------------- |
| 🔴 Unsigned           | ❌ No                       | Gatekeeper blocks        | High          |
| 🟨 Signed Only        | ⚠️ Maybe (manual override) | Gatekeeper warns         | Medium        |
| 🔸 Notarized Only     | ✅ Yes (online)             | Gatekeeper checks online | Low           |
| ✅ Notarized + Stapled | ✅ Yes (offline OK)         | No warning               | Safe          |

---

## 📂 Keychain & Signing in CI (macOS)

Example setup to use Developer ID certificate in GitHub Actions:

```bash
# Decode .p12 cert
base64 --decode <<< "$APPLE_DEVELOPER_CERTIFICATES_P12_BASE64" > dev_id.p12

# Create and unlock keychain
security create-keychain -p "" build.keychain
security set-keychain-settings -lut 7200 ~/Library/Keychains/build.keychain
security unlock-keychain -p "" ~/Library/Keychains/build.keychain

# Import certificate
security import dev_id.p12 -k ~/Library/Keychains/build.keychain -P "" -T /usr/bin/codesign

# Set key access
security set-key-partition-list -S apple-tool:,apple: -s -k "" ~/Library/Keychains/build.keychain

# Set default keychain
security list-keychains -s ~/Library/Keychains/build.keychain
security default-keychain -s ~/Library/Keychains/build.keychain
```

---

## 🔗 References

* GitHub Example: [macos-code-signing-example](https://github.com/omkarcloud/macos-code-signing-example)
* Apple Docs:

  * [Code Signing Guide](https://developer.apple.com/support/code-signing/)
  * [Notarizing macOS Software Before Distribution](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)

* Code Signing in [Electron Builder](https://www.electron.build/) 
  * [Electron Builder - macOS Code Signing & Notarization Guide](./ElectronBuilder.md)
