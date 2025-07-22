# SonarQube Coverage Setup

This project is configured to use SonarQube Cloud for code quality analysis and test coverage
reporting.

## Configuration Files

- `sonar-project.properties` - Main SonarQube configuration
- `.github/workflows/sonar.yml` - GitHub Actions workflow for SonarQube analysis
- `.github/workflows/ci.yml` - General CI workflow

## Setup Instructions

### 1. SonarQube Cloud Account

1. Go to [SonarCloud](https://sonarcloud.io/)
2. Sign up using your GitHub account
3. Create a new organization (or use existing)
4. Import your repository

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these repository secrets:

```
SONAR_TOKEN=your_sonarcloud_token
SONAR_HOST_URL=https://sonarcloud.io
```

To get your SonarCloud token:

1. Go to SonarCloud → My Account → Security
2. Generate a new token
3. Copy the token value

### 3. Update Project Configuration

Update `sonar-project.properties` with your project details:

```properties
sonar.projectKey=your-organization_your-repository-name
sonar.organization=your-organization-name
```

## Usage

### Local Development

```bash
# Run tests with coverage
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### GitHub Actions

The workflows will automatically run on:

- Push to `main` or `develop` branches
- Pull requests

### SonarQube Reports

After successful analysis, you can view reports at:

- SonarCloud dashboard: https://sonarcloud.io/projects
- Coverage metrics, code smells, bugs, and security issues

## Coverage Configuration

The project uses Vitest for testing with LCOV coverage reports:

- Coverage reports: `coverage/lcov.info`
- HTML reports: `coverage/lcov-report/index.html`
- Exclusions: Build files, dependencies, config files

## Troubleshooting

### Common Issues

1. **SonarQube Quality Gate Failed**
   - Check coverage thresholds
   - Review code quality issues in SonarCloud

2. **Authentication Issues**
   - Verify `SONAR_TOKEN` is correct
   - Ensure `SONAR_HOST_URL` is set

3. **Coverage Not Showing**
   - Ensure tests are running: `npm run test:coverage`
   - Check `coverage/lcov.info` exists
   - Verify `sonar.javascript.lcov.reportPaths` path

## Scripts Available

| Script                  | Description                    |
| ----------------------- | ------------------------------ |
| `npm run test:coverage` | Run tests with coverage        |
| `npm run sonar:scan`    | Run SonarQube analysis locally |
| `npm run test:sonar`    | Run tests + SonarQube analysis |
