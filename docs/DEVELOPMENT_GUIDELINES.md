# 開發指引與最佳實踐

本文檔定義了專案的開發標準、工作流程和最佳實踐。

## 🚀 快速開始

### 初始設定
```bash
# 1. 安裝依賴
npm install

# 2. 設定 Git hooks（品質檢查）
chmod +x scripts/setup-hooks.sh
./scripts/setup-hooks.sh

# 3. 驗證設定
npm run quality:check
```

## 📋 開發工作流程

### 1. 功能開發流程
```bash
# 1. 建立功能分支
git checkout -b feature/your-feature-name

# 2. 開發前檢查
npm run quality:check

# 3. 開發過程中持續檢查
npm run test:unit --watch

# 4. 完成後全面檢查
npm run quality:full

# 5. 提交變更
git add .
git commit -m "feat: your feature description"

# 6. 推送並建立 PR
git push origin feature/your-feature-name
```

### 2. Commit 訊息規範
使用 [Conventional Commits](https://conventionalcommits.org/) 格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### 類型 (type)
- `feat`: 新功能
- `fix`: 錯誤修復
- `docs`: 文檔更新
- `style`: 代碼格式（不影響代碼運行的變動）
- `refactor`: 重構（既不是新增功能，也不是修復錯誤的代碼變動）
- `perf`: 性能優化
- `test`: 測試相關
- `chore`: 建構過程或輔助工具的變動

#### 範例
```bash
feat(auth): add user login functionality
fix(ui): resolve button alignment issue
docs: update installation guide
refactor: extract common utility functions
```

## 🧪 測試策略

### 1. 測試層級
- **單元測試**: 函數、組件邏輯
- **整合測試**: 組件間互動
- **E2E 測試**: 完整用戶流程

### 2. 測試覆蓋率要求
- **最低要求**: 80%
- **新代碼要求**: 85%
- **關鍵功能**: 95%

### 3. 測試最佳實踐
```typescript
// ✅ 良好的測試
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when valid id provided', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: '123', name: 'John' };
      mockUserRepository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });
  });
});
```

## 🎨 程式碼品質標準

### 1. TypeScript 規範
```typescript
// ✅ 良好的 TypeScript 代碼
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  // 函數實現
}

// ❌ 避免使用 any
function processData(data: any): any {
  return data;
}

// ✅ 使用具體類型
function processUserData(data: UserData): ProcessedUserData {
  return transformUser(data);
}
```

### 2. React 組件規範
```tsx
// ✅ 良好的 React 組件
interface ButtonProps {
  /** 按鈕文字 */
  children: React.ReactNode;
  /** 按鈕變體 */
  variant?: 'primary' | 'secondary' | 'danger';
  /** 點擊事件處理器 */
  onClick?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={cn('btn', `btn-${variant}`)}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};
```

### 3. 檔案結構規範
```
src/
├── components/           # 可重用組件
│   ├── ui/              # 基礎 UI 組件
│   ├── forms/           # 表單組件
│   └── layout/          # 版面組件
├── pages/               # 頁面組件
├── hooks/               # 自定義 hooks
├── utils/               # 工具函數
├── types/               # TypeScript 類型定義
├── constants/           # 常數
└── tests/               # 測試檔案
    ├── __mocks__/       # Mock 檔案
    └── fixtures/        # 測試資料
```

## 🔍 程式碼審查準則

### 1. 審查檢查清單
#### 功能性
- [ ] 代碼是否符合需求？
- [ ] 邊界情況是否處理？
- [ ] 錯誤處理是否適當？

#### 可讀性
- [ ] 代碼是否易於理解？
- [ ] 變數和函數命名是否清晰？
- [ ] 註釋是否有助於理解？

#### 可維護性
- [ ] 代碼是否遵循 DRY 原則？
- [ ] 是否有適當的抽象？
- [ ] 依賴關係是否清晰？

#### 性能
- [ ] 是否有不必要的計算？
- [ ] 記憶體使用是否合理？
- [ ] 是否有潛在的性能瓶頸？

### 2. 審查流程
1. **自我審查**: 提交 PR 前先自己檢查
2. **自動檢查**: SonarQube 自動分析
3. **同儕審查**: 至少一位團隊成員審查
4. **品質門檻**: 所有檢查通過後才能合併

## 🛠️ 開發工具配置

### 1. VS Code 推薦擴充功能
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "vitest.explorer",
    "SonarSource.sonarlint-vscode"
  ]
}
```

### 2. VS Code 設定
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

## 📊 品質指標監控

### 1. 關鍵指標
- **代碼覆蓋率**: 目標 ≥ 80%
- **重複代碼**: 目標 ≤ 3%
- **圈複雜度**: 每個函數 ≤ 10
- **技術債務比率**: ≤ 5%

### 2. 監控工具
- **SonarCloud**: 代碼品質分析
- **GitHub Actions**: CI/CD 流程
- **Vitest**: 測試覆蓋率
- **ESLint**: 代碼風格檢查

## 🔒 安全最佳實踐

### 1. 敏感資料處理
```typescript
// ❌ 不要硬編碼敏感資料
const API_KEY = 'sk-1234567890abcdef';

// ✅ 使用環境變數
const API_KEY = process.env.VITE_API_KEY;

// ✅ 運行時檢查
if (!API_KEY) {
  throw new Error('Missing required environment variable: VITE_API_KEY');
}
```

### 2. 輸入驗證
```typescript
// ✅ 使用 schema 驗證
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

function createUser(input: unknown) {
  const userData = UserSchema.parse(input);
  // 安全處理驗證後的資料
}
```

## 📝 文檔撰寫規範

### 1. JSDoc 註釋
```typescript
/**
 * 計算兩個數字的和
 * @param a - 第一個數字
 * @param b - 第二個數字
 * @returns 兩數之和
 * @example
 * ```typescript
 * const result = add(2, 3); // 5
 * ```
 */
function add(a: number, b: number): number {
  return a + b;
}
```

### 2. README 結構
- 專案簡介
- 安裝指引
- 使用方法
- API 文檔
- 貢獻指引
- 授權資訊

## 🚨 故障排除

### 常見問題與解決方案

#### SonarQube 分析失敗
```bash
# 檢查 token 是否正確設定
echo $SONAR_TOKEN

# 檢查組織名稱
cat sonar-project.properties | grep organization

# 重新執行分析
npm run sonar:scan
```

#### 測試覆蓋率不足
```bash
# 查看詳細覆蓋率報告
npm run test:coverage
open coverage/lcov-report/index.html

# 找出未覆蓋的檔案
npm run test:coverage -- --reporter=verbose
```

## 📞 支援與資源

### 內部資源
- 專案 Wiki: [連結]
- 技術討論: [Slack/Teams 頻道]
- Code Review 指南: `docs/CODE_REVIEW_GUIDE.md`

### 外部資源
- [SonarQube 文檔](https://docs.sonarcloud.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)
- [Vitest 文檔](https://vitest.dev/) 