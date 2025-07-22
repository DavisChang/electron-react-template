# SonarQube 嚴謹品質控制指南

本文檔詳細說明如何配置 SonarQube 以維持高品質的程式碼標準。

## 🎯 品質目標設定

### 核心指標

- **Coverage**: ≥ 80% (新代碼 ≥ 85%)
- **Duplicated Lines**: ≤ 3%
- **Maintainability Rating**: A 級
- **Reliability Rating**: A 級
- **Security Rating**: A 級

### 品質門檻 (Quality Gates)

- **Bugs**: 0 個新 bugs
- **Vulnerabilities**: 0 個新安全漏洞
- **Security Hotspots**: 100% 審查
- **Code Smells**: ≤ 10 個新的 code smells
- **Technical Debt**: ≤ 5% 新增技術債

## 🔧 SonarCloud 配置

### 1. Quality Gate 設定

#### 新代碼條件 (推薦)

```
Coverage on New Code: ≥ 85%
Duplicated Lines on New Code: ≤ 3%
Maintainability Rating on New Code: A
Reliability Rating on New Code: A
Security Rating on New Code: A
Security Hotspots Reviewed on New Code: 100%
```

#### 整體代碼條件

```
Coverage: ≥ 80%
Duplicated Lines: ≤ 3%
Lines to Cover: > 0 (確保有測試)
```

### 2. 規則配置

#### TypeScript/JavaScript 規則集

- **基礎規則**: Sonar way (TypeScript)
- **額外規則**:
  - 禁用 `any` 類型
  - 強制 explicit return types
  - 要求 JSDoc 註解
  - 限制函數複雜度 ≤ 10
  - 限制檔案長度 ≤ 500 行

#### React 特定規則

- 要求 PropTypes 或 TypeScript interfaces
- 禁用未使用的 props
- 要求 key prop 在 lists 中
- 限制 component 複雜度

### 3. Coverage 配置詳細設定

#### 排除檔案

```properties
# Test files
sonar.coverage.exclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx

# Configuration files
sonar.coverage.exclusions=**/*.config.*,**/vite.config.ts,**/playwright.config.ts

# Build and distribution files
sonar.coverage.exclusions=**/dist/**,**/build/**,**/dist-electron/**

# Type definitions
sonar.coverage.exclusions=**/*.d.ts

# Mock files
sonar.coverage.exclusions=**/mocks/**,**/__mocks__/**
```

## 🚀 CI/CD 整合策略

### 1. GitHub Actions 工作流程

#### Pull Request 檢查

- 每個 PR 必須通過 Quality Gate
- 自動註解 SonarQube 結果到 PR
- 阻止合併如果品質檢查失敗

#### Branch Protection Rules

```yaml
required_status_checks:
  - SonarQube Analysis
  - CI Tests
  - Type Checking
  - Linting
```

### 2. 品質檢查階段

#### Pre-commit 檢查

```bash
# 本地檢查
npm run lint
npm run typecheck:web
npm run typecheck:node
npm run test:unit
```

#### CI 檢查順序

1. **靜態分析**: ESLint + TypeScript
2. **單元測試**: Coverage 生成
3. **SonarQube 分析**: 品質評估
4. **Quality Gate**: 最終檢查

## 📊 品質監控與報告

### 1. 儀表板監控

#### 關鍵指標追蹤

- **新代碼品質趨勢**
- **Technical Debt 比率**
- **Coverage 變化**
- **安全漏洞趨勢**

#### 定期檢查 (建議每週)

- Quality Gate 通過率
- 最高優先級問題
- 技術債務熱點
- Coverage gaps

### 2. 團隊流程

#### Code Review 標準

- SonarQube 問題必須解決
- Coverage 不得降低
- 新增的 Cognitive Complexity 要合理
- Security Hotspots 需要審查

#### 技術債務管理

- 每 Sprint 分配時間修復技術債務
- 優先修復 Blocker 和 Critical 問題
- 定期重構高複雜度代碼

## 🛠️ 進階配置

### 1. 自定義規則

#### 專案特定規則

```xml
<!-- 在 SonarQube 中配置 -->
<rule>
  <key>typescript:S1192</key>
  <priority>MAJOR</priority>
  <parameters>
    <parameter>
      <key>threshold</key>
      <value>5</value>
    </parameter>
  </parameters>
</rule>
```

#### 禁用不適用規則

```properties
# sonar-project.properties
sonar.issue.ignore.multicriteria=e1,e2
sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S1128
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.test.ts
```

### 2. 客製化 Quality Profile

#### 建立團隊專用 Profile

1. 複製 "Sonar way TypeScript"
2. 調整規則嚴格程度
3. 新增團隊特定規則
4. 設定為預設 Profile

## 🔄 持續改進流程

### 1. 定期評估

#### 每月檢查

- Quality Gate 設定是否適當
- Coverage 目標是否合理
- 規則配置是否有效

#### 季度調整

- 根據團隊成熟度調整標準
- 新增新技術的規則
- 更新品質目標

### 2. 團隊教育

#### SonarQube 培訓

- 新成員 onboarding
- 規則解釋和最佳實踐
- Quality Gate 理念推廣

#### 知識分享

- 定期分享品質改進案例
- 討論技術債務解決方案
- Code review 最佳實踐

## 📋 實施檢查清單

### Phase 1: 基礎設定 ✅

- [x] SonarCloud 專案建立
- [x] CI/CD 整合
- [x] 基本 Quality Gate

### Phase 2: 嚴格化配置

- [ ] 自定義 Quality Gate
- [ ] 規則配置優化
- [ ] Coverage 目標設定
- [ ] PR blocking 啟用

### Phase 3: 監控與優化

- [ ] 儀表板設定
- [ ] 警報配置
- [ ] 團隊流程建立
- [ ] 定期評估機制

### Phase 4: 文化建立

- [ ] 團隊培訓
- [ ] 最佳實踐推廣
- [ ] 持續改進流程
- [ ] 知識分享機制

## 🎯 成功指標

### 短期目標 (1-3 個月)

- Quality Gate 通過率 > 95%
- 新代碼 Coverage > 85%
- Critical/Blocker 問題 < 5 個

### 長期目標 (3-6 個月)

- 整體 Coverage > 80%
- Technical Debt ratio < 5%
- 零安全漏洞
- A 級品質評等維持

## 📖 參考資源

- [SonarQube Quality Gates](https://docs.sonarcloud.io/improving-the-analysis/quality-gates/)
- [TypeScript Rules](https://rules.sonarsource.com/typescript)
- [Coverage Best Practices](https://docs.sonarcloud.io/enriching-the-analysis/test-coverage/)
- [Clean Code 原則](https://www.sonarsource.com/resources/white-papers/clean-code/)
