# Git Workflow

## Overview
The **Git Workflow** document outlines the branch management and code integration strategy for the **CrimeGPT** project. We utilize a modified **Trunk-Based Development** approach to support rapid iteration during the hackathon phase, transitioning to a stricter GitFlow model for production deployment.

---

## 1. Branch Naming Conventions

All branches must follow a specific naming convention to ensure clarity and easy integration with issue tracking systems.

- **Feature:** `feat/<issue-number>-<short-description>` (e.g., `feat/12-rag-pipeline`)
- **Bugfix:** `bug/<issue-number>-<short-description>` (e.g., `bug/45-fix-neo4j-timeout`)
- **Chore:** `chore/<short-description>` (e.g., `chore/update-dependencies`)
- **Documentation:** `docs/<short-description>` (e.g., `docs/update-architecture`)

## 2. Branch Architecture

### 2.1. The Main Branches
- `main`: The production branch. Code here is actively deployed to the Live Catalyst environment. **Direct commits to `main` are strictly forbidden.**
- `develop`: The integration branch. Features are merged here first. Deploys to the Staging Catalyst environment.

### 2.2. The Workflow
1. **Branch Creation:** Developer pulls the latest `develop` and creates a new `feat/` branch.
2. **Local Development:** Developer works locally, making frequent, small commits.
3. **Pull Request (PR):** When the feature is complete, the developer opens a PR targeting `develop`.
4. **Code Review:** Another developer (or an automated AI reviewer) must review the PR.
5. **CI Checks:** Automated tests (Linting, Unit Tests) run via GitHub Actions.
6. **Merge:** Once approved and CI passes, the PR is "Squash and Merged" into `develop`.

## 3. Commit Message Standards

Commit messages must follow the **Conventional Commits** specification. This allows for automated generation of changelogs.

**Format:** `<type>(<scope>): <subject>`

**Allowed Types:**
- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or correcting existing tests.

**Examples:**
- `feat(api): implement hybrid search endpoint`
- `fix(ui): resolve overflow issue on network graph`

## 4. Handling Merge Conflicts
If a developer's feature branch falls behind `develop` and conflicts arise:
1. Do not use `git merge develop` into your feature branch (it creates messy merge commits).
2. Use `git rebase develop`. This rewrites your local commits on top of the latest `develop` changes, keeping the git history linear and clean.
