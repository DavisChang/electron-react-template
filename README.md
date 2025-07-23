# 🏆 Electron React Template

[![SonarCloud Quality Gate](https://img.shields.io/sonar/quality_gate/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![SonarCloud Coverage](https://img.shields.io/sonar/coverage/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://www.electronjs.org/)

> **Enterprise-grade Electron application template with comprehensive quality control system.**

An advanced Electron application template featuring React, TypeScript, and a complete quality
assurance framework designed for professional development teams.

## 📊 Quality Standards

This project maintains enterprise-level quality standards with:

- ✅ **80%+ Test Coverage** - Comprehensive unit and E2E testing
- ✅ **Zero `any` Types** - Strict TypeScript configuration
- ✅ **ESLint Strict Rules** - Advanced code quality enforcement
- ✅ **SonarCloud Integration** - Continuous quality monitoring
- ✅ **Git Hooks Protection** - Pre-commit and pre-push quality gates
- ✅ **Automated CI/CD** - GitHub Actions with quality checks

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=alert_status)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=coverage)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=sqale_rating)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=reliability_rating)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=security_rating)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)

## 🚀 Quick Start

### For New Developers

```bash
# Complete setup for new team members
npm run setup:new-dev
```

### For Existing Developers

```bash
# Install dependencies and setup quality controls
npm run setup:dev

# Start development
npm run dev
```

## 🛠️ Development

### Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Quality Control
npm run quality:check    # Quick quality check
npm run quality:full     # Comprehensive quality check
npm run analyze          # Detailed code analysis report
npm run format           # Format code with Prettier
npm run lint:fix         # Fix ESLint issues automatically

# Testing
npm run test:unit        # Run unit tests
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run end-to-end tests

# Utilities
npm run badges           # Generate quality badges
npm run setup:hooks      # Setup Git hooks
npm run fix:e2e          # Fix E2E test environment issues
```

## 📁 Project Structure

```
electron-react-template/
├── 📂 src/              # React frontend source
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── 📂 electron/         # Electron main process
│   ├── main.ts          # Main process entry
│   ├── preload.ts       # Preload scripts
│   └── lib/             # Electron utilities
├── 📂 docs/             # Documentation
│   ├── QUALITY_CONTROL_SYSTEM_OVERVIEW.md
│   ├── DEVELOPMENT_GUIDELINES.md
│   └── TYPESCRIPT_CODING_STANDARDS.md
├── 📂 scripts/          # Development scripts
│   ├── quality-check.sh  # Quality validation
│   ├── analyze-code.sh   # Code analysis
│   └── setup-new-dev.sh  # New developer onboarding
└── 📂 .github/          # GitHub configuration
    ├── workflows/       # CI/CD workflows
    └── PULL_REQUEST_TEMPLATE.md
```

## 🔧 Quality Control System

This template includes a comprehensive quality control system:

### 🎯 Code Quality Gates

- **Pre-commit hooks**: Prevent commits with quality issues
- **Pre-push hooks**: Block pushing to main with failing tests
- **PR validation**: Automated quality checks on pull requests
- **SonarCloud analysis**: Continuous code quality monitoring

### 📊 Quality Metrics

- **Test Coverage**: Minimum 80% required
- **Code Complexity**: Maximum 10 per function
- **Type Safety**: Zero `any` types allowed
- **ESLint Rules**: Strict enforcement with custom configuration

### 🚦 Development Workflow

1. Create feature branch
2. Develop with real-time quality feedback
3. Pre-commit hooks validate changes
4. Push triggers CI/CD pipeline
5. SonarCloud analysis on PR
6. Code review with quality metrics
7. Automated deployment on merge

## 📖 Documentation

- 📋 [Quality Control System Overview](docs/QUALITY_CONTROL_SYSTEM_OVERVIEW.md)
- 🛠️ [Development Guidelines](docs/DEVELOPMENT_GUIDELINES.md)
- 📝 [TypeScript Coding Standards](docs/TYPESCRIPT_CODING_STANDARDS.md)
- ☁️ [SonarQube Setup Guide](docs/SONARQUBE_SETUP.md)
- 🔒 [Branch Protection Setup](docs/BRANCH_PROTECTION_SETUP.md)

## 🧪 Testing Strategy

### Unit Testing

- **Framework**: Vitest with React Testing Library
- **Coverage**: 80%+ requirement with detailed reporting
- **Mocking**: Comprehensive mock utilities

### E2E Testing

- **Framework**: Playwright for cross-browser testing
- **Scenarios**: Critical user journeys
- **CI Integration**: Automated on PR and main branch

### Quality Testing

- **Static Analysis**: ESLint with TypeScript strict rules
- **Type Checking**: Comprehensive TypeScript validation
- **Security**: Dependency vulnerability scanning

## 🎨 Code Standards

### TypeScript Configuration

- **Strict Mode**: Enabled with zero `any` tolerance
- **Explicit Types**: Required for all function returns
- **Modern ES**: Latest ECMAScript features
- **Path Mapping**: Clean import paths

### Code Style

- **Prettier**: Automated formatting
- **ESLint**: Advanced linting rules
- **Conventions**: Consistent naming and structure
- **Documentation**: JSDoc for all public APIs

## 🌟 Features

### Core Features

- ⚡ **Fast Development**: Vite-powered with HMR
- 🔒 **Type Safety**: Strict TypeScript configuration
- 🎨 **Modern UI**: Tailwind CSS with component system
- 📱 **Responsive**: Mobile-first design approach

### Quality Features

- 🛡️ **Quality Gates**: Automated quality enforcement
- 📊 **Metrics Dashboard**: Real-time quality insights
- 🔄 **CI/CD Pipeline**: Automated testing and deployment
- 📝 **Documentation**: Comprehensive development guides

### Developer Experience

- 🚀 **Quick Setup**: One-command environment setup
- 🔧 **VS Code Integration**: Optimized editor configuration
- 🎯 **Debugging**: Advanced debugging tools
- 📋 **Templates**: PR and issue templates

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

Install browsers for the first run:

```sh
npx playwright install
```

When testing on CI, must build the project first:

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 🤝 Contributing

1. **Setup**: Run `npm run setup:new-dev` for complete onboarding
2. **Standards**: Follow [Development Guidelines](docs/DEVELOPMENT_GUIDELINES.md)
3. **Quality**: Ensure all quality checks pass
4. **Review**: Submit PR using provided template
5. **Documentation**: Update docs for new features

## 📞 Support

- 📚 **Documentation**: Check the `docs/` directory
- 🐛 **Issues**: Use GitHub issues for bug reports
- 💡 **Features**: Submit feature requests via issues
- 📊 **Quality**: Monitor
  [SonarCloud Dashboard](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🎯 Why This Template?

This template goes beyond basic Electron + React setups by providing:

- **Enterprise-Ready**: Production-quality standards and practices
- **Quality-First**: Comprehensive quality control from day one
- **Team-Focused**: Designed for collaborative development
- **Well-Documented**: Extensive guides and best practices
- **Continuously Improved**: Regular updates with latest practices

Perfect for teams who want to build high-quality Electron applications with confidence! 🚀

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) +
  [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) +
  [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) +
  [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
