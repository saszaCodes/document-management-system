# Document Management System

[![Coverage Status](https://coveralls.io/repos/github/tepeszCodes/document-management-system/badge.svg?branch=chore/setup-ci-and-cd)](https://coveralls.io/github/tepeszCodes/document-management-system?branch=chore/setup-ci-and-cd) [![tepeszCodes](https://circleci.com/gh/tepeszCodes/document-management-system.svg?style=shield)](https://app.circleci.com/pipelines/github/tepeszCodes/document-management-system)

### Overview of the project
This project is a barebones document management system, built for learning purposes. The project is designed to run in Node.js environment and uses Express.js framework. Recommended package manager for the project is npm.

Check out API reference [here](https://dms-express.herokuapp.com/api-docs).

### Features
(new features will be added to the list when they are merged to the main branch)

### How to install development version
To install the project on your machina, pull the files from the repo and run `yarn install` or `npm install`, depending on which package manager you use, while in the project directory. To run the project in dev mode, run `npm run dev` script.

### Deployment
To create production version, run `npm run build` script when in the project directory. Build files ready for deployment will be put into `build` folder in the project directory.
(deploymnet info for Heroku server will be added when appropriate scripts are included in the `package.json` file)