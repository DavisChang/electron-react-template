# 📦 Electron Builder - macOS Code Signing & Notarization Guide

---

## 🧰 Prerequisites

1. **macOS system** (for code signing and notarization)
2. **Apple Developer Account** (paid)
3. **Tools installed**:
   ```bash
   xcode-select --install
   brew install node
   npm install -g electron-builder
   ```
4. **Certificates and Info Required**:
   - Developer ID Application: `Developer ID Application: Your Name (TEAMID)`
   - Apple ID
   - TEAM_ID (found in your Apple Developer account)
   - App-specific password for notarization ([create here](https://support.apple.com/en-us/HT204397))

---

## 📁 Project Structure Example

```
my-app/
├── dist/
├── node_modules/
├── public/
├── src/
│   └── main.ts (Electron main process)
├── package.json
├── electron-builder.yml
└── certs/
    └── developer_id.p12
```

---

## ⚙️ electron-builder.yml

```yaml
appId: com.yourcompany.myapp
productName: MyApp
mac:
  target:
    - dmg
    - zip
  hardenedRuntime: true
  entitlements: build/entitlements.mac.plist
  entitlementsInherit: build/entitlements.mac.plist
  gatekeeperAssess: false
  category: public.app-category.utilities
  notarize: true
  identity: "Developer ID Application: Your Name (TEAMID)"
  type: distribution
files:
  - "dist/"
  - "build/"
  - "!node_modules/"
dmg:
  sign: true
afterSign: build/notarize.js
```

---

## 📄 build/entitlements.mac.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.cs.disable-library-validation</key>
  <true/>
  <key>com.apple.security.cs.allow-dyld-environment-variables</key>
  <true/>
</dict>
</plist>
```

---

## 🔐 Import Developer ID Certificate

```bash
security create-keychain -p "" build.keychain
security import certs/developer_id.p12 -k build.keychain -P "YOUR_PASSWORD" -T /usr/bin/codesign
security list-keychains -s build.keychain login.keychain
security default-keychain -s build.keychain
security unlock-keychain -p "" build.keychain
security set-keychain-settings build.keychain
```

---

## 📝 build/notarize.js

```js
require("dotenv").config();
const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { appOutDir, electronPlatformName } = context;
  if (electronPlatformName !== "darwin") return;

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: "com.yourcompany.myapp",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  });
};
```

Set your environment variables:

```bash
export APPLE_ID="your@apple.com"
export APPLE_APP_SPECIFIC_PASSWORD="xxxx-xxxx-xxxx-xxxx"
export APPLE_TEAM_ID="ABCDE12345"
```

---

## 🧪 Build and Notarize Locally

```bash
npm run dist
# or
electron-builder --mac --publish never
```

---

## 📦 GitHub Actions CI/CD Example

```yaml
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Import Code Signing Certificate
        run: |
          echo "$CERTIFICATE_P12" | base64 --decode > certificate.p12
          security create-keychain -p "" build.keychain
          security import certificate.p12 -k build.keychain -P "" -T /usr/bin/codesign
          security list-keychains -s build.keychain
          security unlock-keychain -p "" build.keychain
          security set-keychain-settings build.keychain
        env:
          CERTIFICATE_P12: ${{ secrets.APPLE_CERTIFICATE_P12 }}

      - name: Build and Sign App
        run: npm run dist
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
```

---

## ✅ Verify Signature

```bash
spctl --assess --type execute dist/mac/MyApp.app
codesign --verify --deep --strict --verbose=2 dist/mac/MyApp.app
```

---

## 📌 Summary

This guide helps you:
- Configure `electron-builder` with macOS-specific signing options
- Automatically sign and notarize your `.app` with Apple
- Set up a CI/CD flow for consistent releases

Need help customizing this for your specific CI runner or provisioning setup? Let me know!
