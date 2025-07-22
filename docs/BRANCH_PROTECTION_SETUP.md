# GitHub Branch Protection Rules 設定指引

本指引說明如何為專案設定嚴格的分支保護規則，確保代碼品質和安全性。

## 🎯 目標

- 保護 `main` 分支免受直接推送
- 確保所有代碼都經過 PR 審查
- 強制執行品質檢查和測試
- 防止低品質代碼合併到主分支

## 🔧 設定步驟

### 1. 前往 Branch Protection 設定

1. 開啟您的 GitHub repository
2. 點擊 **Settings** 標籤
3. 左側選單選擇 **Branches**
4. 點擊 **Add rule** 或編輯現有規則

### 2. 基本規則設定

#### Branch name pattern

```
main
```

#### 保護規則設定

##### ✅ Restrict pushes that create files larger than 100 MB

防止大檔案被推送到 repository

##### ✅ Require a pull request before merging

- **Require approvals**: `1` (至少一位審查者)
- **Dismiss stale PR approvals when new commits are pushed**: ✅
- **Require review from code owners**: ✅ (如果有 CODEOWNERS 檔案)
- **Restrict pushes that create files larger than specified limit**: ✅
- **Allow specified actors to bypass required pull requests**: ❌

##### ✅ Require status checks to pass before merging

- **Require branches to be up to date before merging**: ✅

**必需的狀態檢查**:

- `SonarQube Analysis / SonarQube Scan`
- `CI / Test & Build` (如果有 CI workflow)

##### ✅ Require conversation resolution before merging

確保所有 PR 評論都已解決

##### ✅ Require signed commits

增強安全性 (可選，但推薦)

##### ✅ Require linear history

保持 Git 歷史整潔

##### ✅ Require deployments to succeed before merging

如果有部署檢查的話

### 3. 管理權限設定

#### ❌ Allow force pushes

禁止強制推送到保護分支

#### ❌ Allow deletions

禁止刪除保護分支

#### ✅ Restrict pushes that create files larger than 100 MB

防止意外推送大檔案

### 4. 建立 CODEOWNERS 檔案 (可選)

建立 `.github/CODEOWNERS` 檔案來指定代碼審查者：

```
# Global owners
* @your-username

# Frontend components
/src/components/ @frontend-team

# Backend logic
/electron/ @backend-team

# Configuration files
*.config.* @devops-team
/.github/ @devops-team

# Documentation
/docs/ @tech-writers @your-username

# Quality and testing
/scripts/ @qa-team @your-username
sonar-project.properties @qa-team @your-username
```

## 📋 完整配置範例

以下是推薦的完整 Branch Protection 配置：

```yaml
Branch protection rule for: main

General:
✅ Restrict creations
✅ Restrict pushes that create files larger than 100 MB

Pull request requirements:
✅ Require a pull request before merging
  ✅ Require approvals (1)
  ✅ Dismiss stale PR approvals when new commits are pushed
  ✅ Require review from code owners
  ❌ Restrict pushes that create files larger than specified limit
  ❌ Allow specified actors to bypass required pull requests

Status check requirements:
✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  Required status checks:
  - SonarQube Analysis / SonarQube Scan (required)
  - CI / Test & Build (required)

Additional rules:
✅ Require conversation resolution before merging
✅ Require signed commits
✅ Require linear history
❌ Require deployments to succeed before merging

Restrict pushes:
❌ Allow force pushes
❌ Allow deletions
```

## 🚀 測試保護規則

設定完成後，請測試以下情況：

### 1. 直接推送到 main (應該被阻止)

```bash
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test direct push"
git push origin main  # 這應該被拒絕
```

### 2. 建立 PR 流程 (應該正常運作)

```bash
git checkout -b test/branch-protection
echo "test" >> test.txt
git add test.txt
git commit -m "test PR flow"
git push origin test/branch-protection
# 然後在 GitHub 上建立 PR
```

### 3. 品質檢查失敗 (PR 應該被阻止合併)

建立一個故意失敗的 commit 來測試品質門檻：

```typescript
// 故意加入會失敗 linting 的代碼
const badCode = 'test'; // unused variable
```

## 📊 監控和維護

### 定期檢查

#### 每月檢查

- 審查 PR 通過率
- 檢查品質門檻設定是否適當
- 確認團隊成員權限正確

#### 季度評估

- 評估規則嚴格程度
- 收集團隊反饋
- 調整必要設定

### 常見問題解決

#### 狀態檢查不出現

1. 確認 workflow 名稱和 job 名稱正確
2. 檢查 workflow 是否在 `main` 分支上存在
3. 至少執行一次成功的 workflow

#### 審查者不足

```bash
# 解決方案：調整審查者數量或新增 CODEOWNERS
```

#### 舊 PR 無法合併

```bash
# 需要將 PR 分支更新到最新的 main
git checkout feature-branch
git fetch origin
git rebase origin/main
git push --force-with-lease origin feature-branch
```

## 🔄 逐步導入策略

如果是現有專案，建議逐步導入：

### Phase 1: 基本保護

- 要求 PR
- 至少一位審查者
- 禁止直接推送

### Phase 2: 品質檢查

- 新增 SonarQube 狀態檢查
- 新增 CI 測試檢查

### Phase 3: 嚴格化

- 要求對話解決
- 簽名提交
- 線性歷史

### Phase 4: 進階功能

- CODEOWNERS
- 部署檢查
- 自動合併條件

## 📝 團隊溝通

設定完成後，請通知團隊：

```markdown
🔒 **分支保護規則已啟用**

從現在開始：

- 不能直接推送到 main 分支
- 所有變更必須通過 PR
- PR 必須通過所有品質檢查
- 至少需要一位審查者批准

詳細資訊請參考：docs/BRANCH_PROTECTION_SETUP.md
```

## 📞 支援

如果遇到問題：

1. 檢查
   [GitHub Branch Protection 文檔](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
2. 查看專案的 `docs/DEVELOPMENT_GUIDELINES.md`
3. 聯繫專案維護者
