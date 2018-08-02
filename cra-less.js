#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const scripts = `
  "start": "cross-env NODE_ENV=development webpack-dev-server -d",
  "build": "cross-env NODE_ENV=production webpack -p",
  "test": "jest"
`;
const jestConfig = `
  "license": "ISC",
  "jest": {
    "moduleFileExtensions": [
      "js",
      "jsx"
    ],
    "moduleDirectories": [
      "node_modules"
    ],
    "setupFiles": [
      "<rootDir>/src/tests/setup.js"
    ],
    "moduleNameMapper": {
      "\\\\.(css|styl|less|sass|scss)$": "identity-obj-proxy"
    },
    "transform": {
      "^.+\\\\.js$": "babel-jest",
      "^.+\\\\.jsx$": "babel-jest",
      "\\\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/tests/__mock__/fileTransformer.js"
    }
  }
`;
const cssData = `@import url('https://fonts.googleapis.com/css?family=Grand+Hotel|Roboto+Mono');

*, body {
  margin: 0;
  padding: 0;
}

.App {
  text-align: center;
  font-family: 'Roboto Mono', monospace;
}

.App .header {
  background-image: linear-gradient(to left, #828dac 0%, #ffead8 100%);
  height: 50vh;
  color: white;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}

.App header h1 {
  font-family: 'Grand Hotel', cursive;
  font-weight: lighter;
  font-size: 64px;
}

.App .intro {
  height: 50vh;
  color: #828dac;
  font-size: 1.5em;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}`;
const gitignoreData = `node_modules/
package-lock.json
.idea/
.vscode/
build
.DS_Store
*.tgz
my-app*
template/src/__tests__/__snapshots__/
lerna-debug.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
/.changelog
`;
const topLevelFiles = ['README.md', 'webpack.config.js', '.eslintrc', '.babelrc'];
const srcFiles = ['index.js', 'App.jsx', 'index.html', 'registerServiceWorker.js'];

const createApp = () => {
  console.log('[1/6] Setting up file structure...'.cyan);
  return new Promise((resolve) => {
    if (appName) {
      exec(`mkdir ${appName} && cd ${appName} && npm init -f && mkdir public && mkdir build && mkdir src && cd src && mkdir tests`, () => {
        resolve(true);
      });
    } else {
      console.log('\nProvide an app name in the following format: '.red);
      console.log('\nreact-to-heroku ', 'app-name\n'.cyan);
      resolve(false);
    }
  });
};

const createFiles = () => {
  console.log('[2/6] Creating files...'.cyan);
  return new Promise((resolve) => {
    for (let i = 0; i < topLevelFiles.length; i += 1) {
      fs
        .createReadStream(path.join(__dirname, `./templates/${topLevelFiles[i]}`))
        .pipe(fs.createWriteStream(`${appName}/${topLevelFiles[i]}`));
    }
    for (let i = 0; i < srcFiles.length; i += 1) {
      fs
        .createReadStream(path.join(__dirname, `./templates/${srcFiles[i]}`))
        .pipe(fs.createWriteStream(`${appName}/src/${srcFiles[i]}`));
    }
    fs.writeFile(`${appName}/src/index.css`, cssData, (err) => {
      if (err) {
        console.log('ERROR writing index.css');
      } else {
        resolve();
      }
    });
    fs.writeFile(`${appName}/.gitignore`, gitignoreData, (err) => {
      if (err) {
        console.log('ERROR writing .gitignore');
      } else {
        resolve();
      }
    });
    fs.readFile(`${appName}/package.json`, (err, file) => {
      if (err) throw err;
      const data = file
        .toString()
        .replace('"test": "echo \\"Error: no test specified\\" && exit 1"', scripts)
        .replace('"license": "ISC"', jestConfig);
      fs.writeFile(`${appName}/package.json`, data, err2 => err2 || true);
      resolve();
    });
    resolve();
  });
};

const installDependencies = () => {
  console.log('[3/6] Installing dependencies with Yarn...'.cyan);
  return new Promise((resolve) => {
    exec(`cd ${appName} && yarn add react react-dom react-helmet react-router-dom fs-extra prop-types && yarn add --dev babel-core babel-eslint babel-jest babel-loader babel-plugin-transform-es2015-modules-commonjs babel-plugin-transform-object-rest-spread babel-preset-env babel-preset-react cross-env css-loader enzyme enzyme-adapter-react-16 eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react file-loader html-webpack-plugin identity-obj-proxy jest react-hot-loader style-loader url-loader webpack webpack-cli webpack-dev-server`, () => {
      resolve();
    });
  });
};

await createFiles();
await installDependencies();