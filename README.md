# clubspot-sdk

[![APLv2][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

[Clubspot](https://theclubspot.com/) is a SaaS product for managing Golf and Sailing clubs. It uses [Parse](https://parseplatform.org/)
application framework. This package is a community-supported, TypeScript SDK for Clubspot, utilizing the Parse
JavaScript SDK.

## Getting Started

This project is intended to be used with the latest Active LTS release of [Node.js][nodejs].

### Clone repository

To clone the repository, use the following commands:

```sh
git clone https://github.com/ungood/clubspot-sdk
cd clubspot-sdk
npm install
```


## Available Scripts

- `clean` - remove coverage data, cache and transpiled files,
- `prebuild` - lint source files and tests before building,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `prettier` - reformat files,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests
- `test:coverage` - run test and print out test coverage


[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[license]: https://github.com/ungood/clubspot-sdk/blob/main/LICENSE
[gha-badge]: https://github.com/ungood/clubspot-sdk/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/ungood/clubspot-sdk/actions/workflows/nodejs.yml
