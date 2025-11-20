# Contributing

When contributing to this repository, please first discuss the change you wish to make via a GitHub issue.

## Development Environment Setup

### Prerequisites
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
- [Docker](https://docs.docker.com/engine/install/)

### Setup
1. Fork the repository
2. Clone your fork locally
3. Run `yarn` to install dependencies
4. Run `docker-compose up` to start the MongoDB database and seed it with test data
5. Run `yarn dev` to start the development server

The test data is not persisted between restarts. Create a Docker volume if you wish for this to be the case.

### Branching
- We use the [GitHub Flow](https://www.gitkraken.com/learn/git/best-practices/git-branch-strategy#github-flow-considerations) branching strategy.
- Use `feature/feature-name` as your branch name.
- Non-feature branches are allowed, but please give a clear name to your branch such as `hotfix/fix-bug`

## Pull Request Process
1. Squash all your commits into a single commit before pushing your branch
2. Give a clear overview of your changes in the commit message
3. When opening a PR, give a clear overview of what your changes are and why
4. Wait for review and approval