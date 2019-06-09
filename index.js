#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');
const colors = require('colors');
const templates = require('./templates/templates.js');

const appName = process.argv[2];
const appNumber = Math.floor(Math.random() * 100000);

const createApp = () => {
  console.log(colors.cyan(`[1/6] Creating app ${appName}...`));
  exec(`npx create-react-app ${appName}`, (err) => {
    if (err) {
      console.log(colors.red('Couldn\'t create this app.'), colors.cyan('Provide an app name in the following format: '), colors.yellow('react-to-heroku my-app'));
      return colors.red(err);
    } else {
      console.log(colors.cyan('[2/6] Installing dependencies with Yarn...'));
      exec(`cd ${appName} && yarn add react-router-dom react-helmet`, () => {
        console.log(colors.cyan('[3/6] Updating default templates...'));
        return new Promise((resolve) => {
          const promises = [];
          Object.keys(templates).forEach((fileName, i) => {
            promises[i] = new Promise((resolve) => {
              fs.writeFile(`${appName}/src/${fileName}`, templates[fileName], (err) => {
                if (err) { return console.log(err); }
                resolve();
              });
            });
          });
          Promise.all(promises).then(() => {
            console.log(colors.cyan('[4/6] Initialising Git and Heroku...'));
            exec(`cd ${appName} && echo '{ "root": "build/" }' > static.json && sed '/build/d' .gitignore > .gitignore.new && mv .gitignore.new .gitignore && git init && heroku create ${appName}-${appNumber} -b https://github.com/heroku/heroku-buildpack-static.git && git remote add heroku https://git.heroku.com/${appName}-${appNumber}.git`, () => {
              console.log(colors.cyan('[5/6] Starting first Webpack build...'));
              exec(`cd ${appName} && yarn build`, () => {
                console.log(colors.cyan('[6/6] Deploying to Heroku...'));
                exec(`cd ${appName} && git add . && git commit -m 'initial commit' && git push heroku master && heroku open`, () => {
                  console.log(colors.yellow(`\nSetup complete!\n\n${appName}`), colors.cyan(`is deployed at`), colors.yellow(`https://${appName}-${appNumber}.herokuapp.com\n`), colors.cyan(`\nNext steps:`), colors.yellow(`\ncd ${appName}\nyarn start\n`));
                });
              });
            });
          });
        });
      });
    }
  });
};

createApp();
