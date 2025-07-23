# Git Hooks 分層檢查工作流程

## 🎯 **設計理念：分層檢查策略**

採用 **快速 commit + 完整 push** 的分層檢查策略，平衡開發效率與代碼品質。

## ⚡ **Pre-commit Hook (快速檢查)**

### 🎯 **目的**

- 確保基本代碼品質
- 不阻礙開發速度
- 鼓勵頻繁 commit

### 📋 **檢查項目**

```bash
✅ ESLint 代碼風格檢查
✅ TypeScript 類型檢查
✅ 快速單元測試 (不包含覆蓋率)
```

### ⏱️ **預期執行時間**

- **目標**: < 30 秒
- **適合**: 頻繁 commit 的開發場景

### 💡 **何時觸發**

```bash
git commit -m "your message"
# 自動執行快速檢查
```

---

## 🔍 **Pre-push Hook (完整檢查)**

### 🎯 **目的**

- 確保分享的代碼符合所有品質標準
- 運行耗時但重要的檢查
- 保護遠端分支品質

### 📋 **檢查項目**

```bash
✅ 完整品質檢查 (包含覆蓋率)
✅ SonarQube 分析
✅ 代碼複雜度檢查
✅ 安全漏洞掃描
✅ E2E 測試 (僅限 main 分支)
```

### ⏱️ **預期執行時間**

- **一般分支**: 2-3 分鐘
- **Main 分支**: 3-5 分鐘 (包含 E2E)

### 💡 **何時觸發**

```bash
git push origin feature-branch
# 自動執行完整檢查

git push origin main
# 執行完整檢查 + E2E 測試
```

---

## 🚀 **開發工作流程**

### 1️⃣ **日常開發**

```bash
# 快速迭代開發
git add .
git commit -m "wip: implement feature X"  # ⚡ 快速檢查 (~30s)
git commit -m "fix: handle edge case"     # ⚡ 快速檢查 (~30s)
git commit -m "feat: complete feature X" # ⚡ 快速檢查 (~30s)
```

### 2️⃣ **分享代碼**

```bash
# 推送到 feature 分支
git push origin feature/my-feature  # 🔍 完整檢查 (~2-3min)

# 或推送到 main 分支
git push origin main                # 🔍 完整檢查 + E2E (~3-5min)
```

---

## 🎭 **不同場景的策略**

### 🧪 **實驗性開發**

```bash
# 可以快速 commit 實驗代碼
git commit -m "experiment: try new approach"  # ⚡ 基本檢查
# 不用擔心完整檢查拖慢節奏
```

### ✨ **功能完成**

```bash
# 完成功能後推送
git push origin feature/complete-feature  # 🔍 確保品質
```

### 🛡️ **保護主分支**

```bash
# 推送到 main 時最嚴格檢查
git push origin main  # 🔍 完整檢查 + E2E 測試
```

---

## 📊 **檢查對比表**

| 階段                | ESLint | 類型檢查 | 單元測試 | 覆蓋率檢查 | SonarQube | E2E 測試 | 執行時間 |
| ------------------- | ------ | -------- | -------- | ---------- | --------- | -------- | -------- |
| **Pre-commit**      | ✅     | ✅       | ✅       | ❌         | ❌        | ❌       | ~30s     |
| **Pre-push (一般)** | ✅     | ✅       | ✅       | ✅         | ✅        | ❌       | ~2-3min  |
| **Pre-push (main)** | ✅     | ✅       | ✅       | ✅         | ✅        | ✅       | ~3-5min  |

---

## 🛠️ **手動控制選項**

### 跳過 Pre-commit 檢查

```bash
git commit --no-verify -m "urgent fix"
# ⚠️ 不推薦，但緊急情況可用
```

### 跳過 Pre-push 檢查

```bash
git push --no-verify origin feature-branch
# ⚠️ 強烈不推薦，會繞過品質檢查
```

### 手動執行完整檢查

```bash
npm run quality:check     # 本地執行完整檢查
npm run quality:full      # 包含 E2E 的完整檢查
```

---

## ✅ **優勢總結**

### 🚀 **開發效率**

- commit 時快速反饋 (30秒內)
- 不阻礙實驗性開發
- 鼓勵頻繁 commit 好習慣

### 🛡️ **品質保證**

- push 前確保完整品質檢查
- 遠端分支始終保持高品質
- 分層防線避免品質問題

### 🎯 **平衡最佳化**

- 關鍵檢查在 commit 時執行
- 耗時檢查在 push 時執行
- 最嚴格檢查保護 main 分支

---

## 🔧 **自訂設定**

如果您想調整檢查策略，可以修改：

- **Pre-commit**: `.githooks/pre-commit`
- **Pre-push**: `.githooks/pre-push`
- **品質腳本**: `scripts/quality-check.sh`

記得在修改後重新設定 Git hooks：

```bash
chmod +x .githooks/*
git config core.hooksPath .githooks
```

---

## 🎉 **結論**

這個分層檢查策略讓您能夠：

- ⚡ **快速開發**: commit 時不被拖慢
- 🛡️ **確保品質**: push 時完整驗證
- 🎯 **靈活應對**: 不同分支不同策略

**最佳實踐**: 頻繁 commit 本地開發，完整檢查後再 push！
