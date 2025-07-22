# TypeScript/JavaScript 編程標準

本文檔定義了專案中 TypeScript 和 JavaScript 代碼的編寫標準和最佳實踐。

## 🎯 核心原則

### 1. 類型安全優先

- **嚴格禁用 `any` 類型**
- **明確的函數返回類型**
- **優先使用 union types 而非 any**
- **利用 TypeScript 的類型推導**

### 2. 代碼可讀性

- **清晰的命名約定**
- **適當的註釋和文檔**
- **邏輯分組和結構化**
- **避免過度複雜的代碼**

### 3. 維護性和擴展性

- **單一職責原則**
- **依賴注入和解耦**
- **可測試的代碼設計**
- **一致的錯誤處理**

## 📝 TypeScript 規範

### 1. 類型定義

#### ✅ 良好實踐

```typescript
// 明確的接口定義
interface User {
  readonly id: string;
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
}

// 使用泛型增強類型安全
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// 使用 union types
type Theme = 'light' | 'dark' | 'auto';
type ButtonSize = 'sm' | 'md' | 'lg';
```

#### ❌ 避免的做法

```typescript
// 避免使用 any
function processData(data: any): any {
  return data;
}

// 避免隱式 any
function handleEvent(event) {
  console.log(event);
}

// 避免過度使用 non-null assertion
const user = getUser()!.name!.toUpperCase();
```

### 2. 函數和方法

#### ✅ 良好實踐

```typescript
// 明確的參數和返回類型
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

// 使用 readonly 參數防止意外修改
function processUsers(users: readonly User[]): UserSummary[] {
  return users.map(user => ({
    id: user.id,
    displayName: user.name,
    isActive: true,
  }));
}

// 函數重載提供更好的類型推導
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'button'): HTMLButtonElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}
```

### 3. React 組件規範

#### ✅ 良好實踐

```typescript
// 明確的 Props 接口
interface ButtonProps {
  /** 按鈕文字內容 */
  children: React.ReactNode;
  /** 按鈕變體樣式 */
  variant?: 'primary' | 'secondary' | 'danger';
  /** 按鈕尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 點擊事件處理器 */
  onClick?: () => void;
  /** 額外的 CSS 類名 */
  className?: string;
}

// 使用 React.FC 和泛型
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        { 'btn-disabled': disabled },
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// 自定義 Hook 的類型定義
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
```

### 4. 錯誤處理

#### ✅ 良好實踐

```typescript
// 自定義錯誤類型
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 類型安全的錯誤處理
type Result<T, E = Error> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<Result<T, ApiError>> {
  try {
    const data = await apiCall();
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error };
    }
    return {
      success: false,
      error: new ApiError(error instanceof Error ? error.message : 'Unknown error', 500, 'unknown'),
    };
  }
}
```

## 🎨 代碼風格規範

### 1. 命名約定

```typescript
// 變數和函數：camelCase
const userCount = 10;
const isAuthenticated = true;
function calculateTotal(): number {
  /* ... */
}

// 常數：UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// 類型和接口：PascalCase
interface UserProfile {
  /* ... */
}
type ApiResponse<T> = {
  /* ... */
};

// 組件：PascalCase
const UserCard: React.FC<UserCardProps> = () => {
  /* ... */
};

// 枚舉：PascalCase
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}
```

### 2. 文件組織

```typescript
// 文件頂部：imports
import React, { useState, useEffect } from 'react';
import { User, ApiResponse } from '@/types';
import { api } from '@/lib/api';
import { cn } from '@/utils/cn';

// 類型定義
interface ComponentProps {
  // ...
}

// 常數
const DEFAULT_OPTIONS = {
  // ...
};

// 主要邏輯
const Component: React.FC<ComponentProps> = () => {
  // ...
};

// 默認導出
export default Component;

// 命名導出（如果需要）
export { type ComponentProps };
```

### 3. 註釋和文檔

````typescript
/**
 * 計算購物車總價，包含稅費和折扣
 * @param items - 購物車項目列表
 * @param taxRate - 稅率（例如：0.08 表示 8%）
 * @param discountCode - 可選的折扣碼
 * @returns 包含詳細計算結果的對象
 * @throws {Error} 當稅率為負數時拋出錯誤
 * @example
 * ```typescript
 * const total = calculateCartTotal(
 *   [{ price: 100, quantity: 2 }],
 *   0.08,
 *   'SAVE10'
 * );
 * console.log(total.finalAmount); // 預期輸出取決於折扣邏輯
 * ```
 */
function calculateCartTotal(
  items: readonly CartItem[],
  taxRate: number,
  discountCode?: string
): CartCalculationResult {
  if (taxRate < 0) {
    throw new Error('Tax rate cannot be negative');
  }

  // 計算小計
  const subtotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // 應用折扣
  const discount = discountCode ? calculateDiscount(subtotal, discountCode) : 0;

  // 計算稅費
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * taxRate;

  return {
    subtotal,
    discount,
    tax,
    finalAmount: taxableAmount + tax,
  };
}
````

## 🔧 ESLint 規則配置

我們的 ESLint 配置強制執行以下規則：

### 1. TypeScript 嚴格規則

- `@typescript-eslint/no-explicit-any`: 禁用 any 類型
- `@typescript-eslint/explicit-function-return-type`: 要求明確函數返回類型
- `@typescript-eslint/no-non-null-assertion`: 禁用非空斷言
- `@typescript-eslint/prefer-nullish-coalescing`: 優先使用空值合併運算符

### 2. 代碼複雜度限制

- `complexity`: 最大圈複雜度 10
- `max-depth`: 最大嵌套深度 4
- `max-lines`: 每個文件最多 300 行
- `max-lines-per-function`: 每個函數最多 50 行

### 3. React 特定規則

- `react/jsx-key`: 要求在列表中使用 key
- `react/no-unused-prop-types`: 禁用未使用的 prop types
- `react-hooks/exhaustive-deps`: 檢查 useEffect 依賴

## 📊 SonarQube 品質門檻

### TypeScript/JavaScript 特定指標

- **圈複雜度**: ≤ 10 per function
- **參數數量**: ≤ 4 per function
- **文件長度**: ≤ 300 lines
- **重複代碼**: ≤ 3%
- **認知複雜度**: ≤ 15 per function

## 🚨 常見問題和解決方案

### 1. TypeScript 編譯錯誤

```bash
# 檢查類型錯誤
npm run typecheck:web
npm run typecheck:node

# 修復常見問題
# - 缺少類型定義：npm install @types/package-name
# - 路徑解析問題：檢查 tsconfig.json 的 paths 配置
```

### 2. ESLint 錯誤

```bash
# 自動修復可修復的規則
npm run lint -- --fix

# 檢查特定文件
npx eslint src/components/Button.tsx
```

### 3. SonarQube 問題

- **圈複雜度過高**: 將複雜函數拆分成更小的函數
- **重複代碼**: 提取共同邏輯到工具函數
- **未使用的變數**: 使用 \_ 前綴或移除不需要的變數

## 📚 學習資源

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### 代碼品質

- [Clean Code TypeScript](https://github.com/labs42io/clean-code-typescript)
- [SonarQube TypeScript Rules](https://rules.sonarsource.com/typescript)
- [ESLint Rules](https://eslint.org/docs/rules/)

## ⚡ 快速檢查清單

開發新功能時，請確保：

- [ ] 所有函數都有明確的類型定義
- [ ] 沒有使用 `any` 類型
- [ ] 組件 Props 有完整的接口定義
- [ ] 錯誤處理適當且類型安全
- [ ] 代碼複雜度在合理範圍內
- [ ] 有必要的註釋和文檔
- [ ] 通過所有 ESLint 檢查
- [ ] 通過 TypeScript 編譯檢查
