#!/usr/bin/env node

const fs = require('fs');
// const path = require('path');
const { exec } = require('child_process');
const colors = require('colors');
const templates = require('./templates/templates.js');


const appName = process.argv[2];
const appNumber = Math.floor(Math.random() * 100000);

const createApp = () => {
  console.log(`[1/6] Creating app ${appName}...`.cyan);
  return new Promise((resolve) => {
    if (appName) {
      exec(`create-react-app ${appName}`, () => {
        resolve(true);
      });
    } else {
      resolve(false);
    }
  });
};

const installPackages = () => {
  console.log('[2/6] Installing dependencies with Yarn...'.cyan);
  return new Promise((resolve) => {
    exec(`cd ${appName} && yarn add react-router-dom react-helmet`, () => {
      resolve();
    });
  });
};

const updateTemplates = () => {
  console.log('[3/6] Updating default templates...'.cyan);
  return new Promise(((resolve) => {
    const promises = [];
    Object.keys(templates).forEach((fileName, i) => {
      promises[i] = new Promise((res) => {
        fs.writeFile(`${appName}/src/${fileName}`, templates[fileName], (err) => {
          if (err) { return console.log(err); }
          res();
        });
      });
    });
    Promise.all(promises).then(() => { resolve(); });
  }));
};

const gitInit = () => {
  console.log('[4/6] Initialising Git and Heroku...'.cyan);
  return new Promise((resolve) => {
    exec(`cd ${appName} && echo '{ "root": "build/" }' > static.json && sed '/build/d' .gitignore > .gitignore.new && mv .gitignore.new .gitignore && git init && heroku create ${appName}-${appNumber} -b https://github.com/heroku/heroku-buildpack-static.git && git remote add heroku https://git.heroku.com/${appName}-${appNumber}.git`, () => {
      resolve();
    });
  });
};

const firstBuild = () => {
  console.log('[5/6] Starting first Webpack build...'.cyan);
  return new Promise((resolve) => {
    exec(`cd ${appName} && yarn build`, () => {
      resolve();
    });
  });
};


const deployToHeroku = () => {
  console.log('[6/6] Deploying to Heroku...'.cyan);
  return new Promise((resolve) => {
    exec(`cd ${appName} && git add . && git commit -m 'initial commit' && git push heroku master && heroku open`, () => {
      resolve();
    });
  });
};

const run = async () => {
  const createSuccess = await createApp();
  if (!createSuccess) {
    console.log('Couldn\'t create this app.'.red);
    console.log('Provide an app name in the following format: '.cyan);
    console.log('\ncreate-react-redux-router-app ', 'app-name'.cyan);
    return false;
  }
  await installPackages();
  await updateTemplates();
  await gitInit();
  await firstBuild();
  await deployToHeroku();
  return (
    console.log(`\nCongratulations! ${appName} is set up and deployed!\nhttps://${appName}-${appNumber}.herokuapp.com\n\nNext steps:\ncd ${appName}\nyarn start\n`.cyan)
  );
};

run();
