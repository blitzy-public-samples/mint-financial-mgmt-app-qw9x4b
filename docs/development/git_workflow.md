# Mint Replica Git Workflow

This document describes the Git workflow and best practices to be followed by all developers working on the Mint Replica project. Adhering to this workflow ensures smooth collaboration, code quality, and project management.

## Branching Strategy

### Main Branches

1. **main**: The main branch containing production-ready code
2. **develop**: The development branch for integrating features

### Feature Branches

- Naming Convention: `feature/[issue-number]-brief-description`
- Description: Created for new features or non-emergency bug fixes

### Release Branches

- Naming Convention: `release/vX.Y.Z`
- Description: Created when preparing a new production release

### Hotfix Branches

- Naming Convention: `hotfix/[issue-number]-brief-description`
- Description: Created for urgent fixes to the production branch

## Workflow Steps

1. **Create a new branch**
   - Description: Create a new branch from 'develop' for your feature or bug fix
   - Command: `git checkout -b feature/[issue-number]-brief-description develop`

2. **Work on your feature**
   - Description: Make changes, commit often with descriptive messages

3. **Keep your branch updated**
   - Description: Regularly merge or rebase with the develop branch
   - Commands:
     ```
     git checkout develop
     git pull origin develop
     git checkout feature/[issue-number]-brief-description
     git merge develop
     ```

4. **Push your changes**
   - Description: Push your feature branch to the remote repository
   - Command: `git push origin feature/[issue-number]-brief-description`

5. **Create a Pull Request**
   - Description: Open a Pull Request on GitHub for code review

6. **Code Review**
   - Description: Address any comments or feedback from reviewers

7. **Merge to develop**
   - Description: Once approved, merge the feature branch into develop

## Commit Guidelines

- Message Format: `<type>(<scope>): <subject>`
- Types: feat, fix, docs, style, refactor, test, chore
- Examples:
  - `feat(auth): add multi-factor authentication`
  - `fix(api): resolve transaction sync issue`
  - `docs(readme): update installation instructions`

## Code Review Process

1. Assign at least two reviewers to your Pull Request
2. Reviewers should check for code quality, test coverage, and adherence to project standards
3. Address all comments and suggestions
4. Ensure CI/CD pipeline passes before merging

## Release Process

1. Create a release branch from develop
2. Perform final testing and bug fixes on the release branch
3. Update version numbers and changelog
4. Merge release branch to main and develop
5. Tag the release on the main branch

## Hotfix Process

1. Create a hotfix branch from main
2. Implement and test the fix
3. Merge hotfix branch to main and develop
4. Tag the new patch version on the main branch

## Related Documents

- [Development Setup](setup.md)
- [Coding Standards](coding_standards.md)

## External Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

## Pending Human Tasks

- Review and approve the Git workflow document (Critical)
- Set up branch protection rules on GitHub repository (Required)
- Create pull request template with checklist for developers (Required)
- Set up CI/CD pipeline to enforce workflow rules (Required)
- Conduct team training on the Git workflow (Optional)