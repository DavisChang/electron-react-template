## 📋 Pull Request Checklist

請在提交 PR 前確保完成以下檢查：

### 🔍 程式碼品質
- [ ] 執行過 `npm run quality:check` 並全部通過
- [ ] SonarQube Quality Gate 通過 (會在 PR 中自動顯示)
- [ ] 測試覆蓋率達到 80% 以上
- [ ] 沒有 ESLint 錯誤或警告
- [ ] TypeScript 編譯無錯誤

### 🧪 測試
- [ ] 新增功能有對應的單元測試
- [ ] 所有現有測試仍然通過
- [ ] 如有 UI 更改，已進行手動測試
- [ ] E2E 測試通過 (如適用)

### 📝 程式碼審查
- [ ] 程式碼符合專案風格指南
- [ ] 函數和類別有適當的 JSDoc 註解
- [ ] 複雜邏輯有清晰的註釋說明
- [ ] 沒有 console.log 或除錯程式碼

### 🔒 安全性
- [ ] 沒有硬編碼的密鑰或敏感資訊
- [ ] 外部依賴已經過安全檢查
- [ ] 用戶輸入有適當的驗證和清理

## 📖 變更說明

### 🎯 變更類型
請選擇適用的類型：
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Code style/formatting changes
- [ ] ♻️ Code refactoring
- [ ] ⚡ Performance improvements
- [ ] 🔧 Configuration changes

### 📝 變更描述
請詳細描述您的變更：

<!-- 描述您做了什麼，為什麼這樣做，以及如何測試 -->

### 🔗 相關議題
Closes #(issue number)

### 📸 截圖 (如適用)
<!-- 如果有 UI 變更，請提供前後對比截圖 -->

### 🧪 測試計劃
描述您如何測試這些變更：

<!-- 包括手動測試步驟和自動化測試說明 -->

### 📋 部署注意事項
- [ ] 需要資料庫遷移
- [ ] 需要環境變數更新
- [ ] 需要特殊部署步驟
- [ ] 無特殊部署需求

---

## 📊 品質報告
SonarQube 分析結果將在此 PR 中自動顯示。請確保：
- ✅ Quality Gate: PASSED
- ✅ Coverage: ≥ 80%
- ✅ Duplications: ≤ 3%
- ✅ Maintainability: A
- ✅ Reliability: A
- ✅ Security: A 