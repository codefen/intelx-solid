# codefend-user

*Installation:*

1) git clone https://github.com/codefen/codefend-user
2) npm install
3) npm start

### *Run with Tauri*
*Dependencies: https://www.rust-lang.org/*

```
npm run tauri dev
```

### *Compile tauri*

```
npm run tauri build
```

### *Create priv and pub key for signing the Tauri app*

```
npm run tauri signer generate -- -w ~/.tauri/codefend.key
```
