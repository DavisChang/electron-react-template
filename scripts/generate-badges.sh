#!/bin/bash

# Generate Quality Badges Script
# This script generates status badges for the README

set -e

echo "🏆 Generating quality badges..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Extract project information
PROJECT_NAME=$(grep '"name"' package.json | cut -d'"' -f4)
PROJECT_VERSION=$(grep '"version"' package.json | cut -d'"' -f4)
REPO_NAME="DavisChang/electron-react-template"

print_step "Generating badges for $PROJECT_NAME v$PROJECT_VERSION"

# Create badges directory
mkdir -p docs/badges

# Generate badge URLs
cat > docs/badges/README_BADGES.md << EOF
# Quality Control Badges

Add these badges to your README.md to showcase your project's quality standards:

## Status Badges

### Build & CI
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/$REPO_NAME/sonar.yml?branch=main&label=SonarQube%20Analysis&style=for-the-badge)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/$REPO_NAME/ci.yml?branch=main&label=CI%20Build&style=for-the-badge)

### Code Quality
![SonarCloud Quality Gate](https://img.shields.io/sonar/quality_gate/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)
![SonarCloud Coverage](https://img.shields.io/sonar/coverage/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)
![SonarCloud Maintainability Rating](https://img.shields.io/sonar/maintainability_rating/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)
![SonarCloud Reliability Rating](https://img.shields.io/sonar/reliability_rating/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)
![SonarCloud Security Rating](https://img.shields.io/sonar/security_rating/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)

### Technology Stack
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

### Testing
![Testing Library](https://img.shields.io/badge/Testing%20Library-E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)

## Copy-Paste Ready Badges

### For README.md Header

\`\`\`markdown
[![SonarCloud Quality Gate](https://img.shields.io/sonar/quality_gate/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![SonarCloud Coverage](https://img.shields.io/sonar/coverage/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/$REPO_NAME/sonar.yml?branch=main&label=Build&style=for-the-badge)](https://github.com/$REPO_NAME/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://www.electronjs.org/)
\`\`\`

### Quality Metrics Section

\`\`\`markdown
## 📊 Quality Metrics

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=alert_status)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=coverage)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=sqale_rating)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=reliability_rating)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=security_rating)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=sqale_index)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=DavisChang_electron-react-template&metric=duplicated_lines_density)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
\`\`\`

### Compact Version

\`\`\`markdown
![Quality](https://img.shields.io/badge/Quality-Enterprise%20Grade-brightgreen?style=flat-square)
![Coverage](https://img.shields.io/badge/Coverage-80%25%2B-brightgreen?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square)
![Linting](https://img.shields.io/badge/ESLint-Enforced-purple?style=flat-square)
![Testing](https://img.shields.io/badge/Testing-Vitest%20%7C%20Playwright-green?style=flat-square)
\`\`\`

## Custom Badge Examples

### Project Specific
- ![Version](https://img.shields.io/badge/Version-$PROJECT_VERSION-blue?style=flat-square)
- ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
- ![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey?style=flat-square)

### Quality Standards
- ![Code Style](https://img.shields.io/badge/Code%20Style-Prettier-ff69b4?style=flat-square)
- ![Git Hooks](https://img.shields.io/badge/Git%20Hooks-Pre--commit%20%7C%20Pre--push-orange?style=flat-square)
- ![Documentation](https://img.shields.io/badge/Documentation-Complete-success?style=flat-square)

## Usage Instructions

1. Copy the desired badge markdown from above
2. Paste it into your README.md file
3. The badges will automatically update based on your project's status
4. For SonarCloud badges, ensure your project is public or configured for badge access

## Badge Customization

- Change \`style=for-the-badge\` to \`style=flat-square\` for a more compact look
- Replace colors by changing the color parameter (e.g., \`brightgreen\`, \`blue\`, \`red\`)
- Add custom badges using the format: \`![Label](https://img.shields.io/badge/Label-Message-Color)\`

---

*Generated by generate-badges.sh - Quality Control System*
EOF

print_success "Badge documentation generated: docs/badges/README_BADGES.md"

# Generate a simple badge status check
print_step "Checking badge status..."

# Test if SonarCloud badges are accessible
SONAR_PROJECT="DavisChang_electron-react-template"
BADGE_URLS=(
    "https://sonarcloud.io/api/project_badges/measure?project=$SONAR_PROJECT&metric=alert_status"
    "https://sonarcloud.io/api/project_badges/measure?project=$SONAR_PROJECT&metric=coverage"
    "https://sonarcloud.io/api/project_badges/measure?project=$SONAR_PROJECT&metric=sqale_rating"
)

echo ""
echo "🔗 Badge URLs Status:"
for url in "${BADGE_URLS[@]}"; do
    if curl -s --head "$url" | head -n 1 | grep -q "200 OK"; then
        print_success "Badge accessible: $(echo $url | sed 's/.*metric=//g')"
    else
        echo "⚠️  Badge may not be ready: $(echo $url | sed 's/.*metric=//g')"
    fi
done

echo ""
print_success "Quality badges generated successfully!"
echo ""
echo "📋 Next steps:"
echo "  1. Review badge options: cat docs/badges/README_BADGES.md"
echo "  2. Copy desired badges to your README.md"
echo "  3. Commit and push to see live badges"
echo "  4. Verify badges display correctly on GitHub"

# Create a sample README section
cat > docs/badges/SAMPLE_README_SECTION.md << EOF
# Sample README Section with Quality Badges

Add this section to your README.md:

\`\`\`markdown
# 🏆 Electron React Template

[![SonarCloud Quality Gate](https://img.shields.io/sonar/quality_gate/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![SonarCloud Coverage](https://img.shields.io/sonar/coverage/DavisChang_electron-react-template?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://www.electronjs.org/)

> Enterprise-grade Electron application template with comprehensive quality control system.

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
\`\`\`
EOF

echo "📄 Sample README section created: docs/badges/SAMPLE_README_SECTION.md" 