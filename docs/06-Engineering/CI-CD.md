# CI/CD Pipeline (Continuous Integration / Continuous Deployment)

## Overview
The **CI/CD Pipeline** document details how code moves from a developer's local machine to the **Zoho Catalyst** production environment automatically, safely, and reliably. Manual deployments are error-prone and are strictly prohibited in the CrimeGPT lifecycle.

---

## 1. Tooling Selection
- **CI/CD Runner:** GitHub Actions (or GitLab CI).
- **Deployment Target:** Zoho Catalyst CLI (`catalyst deploy`).
- **Frontend Target:** Vercel (for Next.js) or Catalyst Web Hosting.

## 2. The Continuous Integration (CI) Workflow

This pipeline runs automatically every time a developer opens or updates a Pull Request against the `develop` or `main` branches. It acts as the gatekeeper.

```yaml
# Conceptual GitHub Actions Flow
stages:
  - lint
  - security_scan
  - test_unit
  - build
```

1. **Linting & Formatting:** Runs `npm run lint` and `prettier --check`. If code formatting violates the Coding Standards, the pipeline fails.
2. **Security Scan:** Runs `trufflehog` to check for leaked API keys in the commit history.
3. **Unit Testing:** Runs `npm test` (Jest) and `pytest`. If any test fails, the pipeline halts.
4. **Build Verification:** Runs `next build` to ensure the frontend compiles without TypeScript errors.

*Requirement:* A Pull Request cannot be merged until all CI checks pass with a green status.

## 3. The Continuous Deployment (CD) Workflow

Once a PR is merged, the CD pipeline takes over to push the code to the live servers.

### 3.1. Staging Deployment (Triggered by merge to `develop`)
1. Checks out the `develop` branch.
2. Authenticates with the Catalyst CLI using a staging token (`CATALYST_TOKEN_STAGING` stored in GitHub Secrets).
3. Executes `catalyst deploy --only functions,client` to push the code to the Catalyst Development environment.
4. Developers and QA can now test the live API endpoints on the staging URL.

### 3.2. Production Deployment (Triggered by merge to `main`)
1. Checks out the `main` branch.
2. **Approval Gate:** Requires a manual click approval from a Lead Engineer or DevOps Manager in the GitHub Actions UI before proceeding.
3. Authenticates with Catalyst using the production token (`CATALYST_TOKEN_PROD`).
4. Executes `catalyst deploy` to the Live Data Center.
5. Sends a notification to the engineering Slack/Teams channel: *"Production deployment successful. Version v1.2.0 is live."*

## 4. Rollback Strategy
If a critical bug makes it into production (e.g., the chat interface crashes for all users):
- **Immediate Action:** A Lead Engineer triggers the "Revert Deployment" GitHub Action.
- **Process:** This action checks out the previous stable git tag (e.g., `v1.1.9`) and forcefully runs the Catalyst deployment script, overwriting the broken functions in production within minutes.
- **Post-Mortem:** The team investigates *why* the CI pipeline failed to catch the bug and adds a new test to prevent future occurrences.
