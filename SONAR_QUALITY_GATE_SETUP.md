# SonarCloud Quality Gate 設定指南 - 10% 覆蓋率

## 🎯 目標：將新程式碼覆蓋率設定為 10%

### 📋 設定步驟 (在 SonarCloud Web 介面)

#### 1. 創建自訂 Quality Gate

1. 登入 [SonarCloud](https://sonarcloud.io)
2. 進入您的專案：`DavisChang_electron-react-template`
3. 點擊 **Administration** → **Quality Gates**
4. 點擊 **Create** 建立新的 Quality Gate
5. 命名為：`Development-10-Coverage`

#### 2. 設定寬鬆條件 (10% 覆蓋率)

在新建的 Quality Gate 中設定以下條件：

```bash
✅ 基本品質要求 (必要)
- New Bugs: is greater than 0 → FAIL
- New Vulnerabilities: is greater than 0 → FAIL
- New Security Hotspots Reviewed: is less than 100% → FAIL

✅ 寬鬆設定 (開發友好)
- Coverage on New Code: is less than 10.0% → FAIL  ⭐ 主要調整
- Duplicated Lines (%) on New Code: is greater than 5.0% → FAIL
- Maintainability Rating on New Code: is worse than B → FAIL
```

#### 3. 套用到專案

1. 在 Quality Gate 設定頁面
2. 找到 `Development-10-Coverage`
3. 點擊 **Projects** 分頁
4. 新增您的專案：`electron-react-template`

#### 4. 設定為預設 (可選)

在 Organization Settings 中可以將此 Quality Gate 設為預設

### 🔧 本地配置已完成

在 `sonar-project.properties` 中已經設定：

- ✅ 寬鬆的規則排除 (開發階段友好)
- ✅ 適當的複雜度閾值 (15/500/6)
- ✅ 正確的新程式碼基準分支 (main)
- ✅ Quality Gate 等待設定

### 🚀 快速設定選項 (API 方式)

如果您偏好使用 API，可以執行：

```bash
# 使用 SonarCloud API 創建自訂 Quality Gate
curl -X POST \
  "https://sonarcloud.io/api/qualitygates/create" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "name=Development-10-Coverage"

# 添加覆蓋率條件 (10%)
curl -X POST \
  "https://sonarcloud.io/api/qualitygates/create_condition" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "gateId=YOUR_GATE_ID&metric=new_coverage&op=LT&error=10"
```

### 📊 預期結果

設定完成後，您的 CI/CD 流程會：

- ✅ 允許新程式碼覆蓋率低於 80% 但高於 10%
- ✅ 仍然阻止新的 Bug 和安全漏洞
- ✅ 允許適量的程式碼重複和複雜度
- ✅ 專注於最重要的品質指標

### 🔄 驗證設定

運行以下指令驗證：

```bash
npm run quality:check --no-cleanup
```

Quality Gate 應該能夠通過！🎉
