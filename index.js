#!/usr/bin/env node
const thisFile = require('./templates/App.css');

let shell = require('shelljs')
let colors = require('colors')
let fs = require('fs')
let templates = require('./templates/templates.js')

let appName = process.argv[2]
let appDirectory = `${process.cwd()}/${appName}`
let appNumber = Math.floor(Math.random() * 100000);

const installTools = () => {
  return new Promise(resolve=>{
    console.log("\n[1/10] Installing create-react-app and heroku...\n".cyan)
    shell.exec(`npm install -g create-react-app heroku`, () => {
      resolve()
    })
  })
}

const createReactApp = () => {
  return new Promise(resolve=>{
    if(appName){
      console.log("\n[2/10] Running create-react-app with your chosen app name...\n".cyan)
      shell.exec(`create-react-app ${appName}`, () => {
        console.log(`${appName} app created in ${appDirectory}`)
        resolve(true)
      })
    }else{
      console.log("\nProvide an app name in the following format: ".red)
      console.log("\nreact-to-heroku ", "app-name\n".cyan)
        resolve(false)
    }
  })
}

const installPackages = () => {
  return new Promise(resolve=>{
    console.log("\n[3/10] Installing packages with npm...\n".cyan)
    shell.exec(`cd ${appName} && npm install --save redux react-router react-redux redux-thunk react-router-dom`, () => {
      resolve()
    })
  })
}

const updateTemplates = () => {
  return new Promise(resolve=>{
    console.log("\n[4/10] Updating templates...\n".cyan)
    let promises = []
    Object.keys(templates).forEach((fileName, i)=>{
      promises[i] = new Promise(res=>{
        fs.writeFile(`${appDirectory}/src/${fileName}`, templates[fileName], function(err) {
            if(err) { return console.log(err) }
            res()
        })
      })
    })
    Promise.all(promises).then(()=>{resolve()})
  })
}

const updateCSS = () => {
  return new Promise(resolve=>{
    console.log("\n[5/10] Updating CSS...\n".cyan)
    shell.exec(`cd ${appName}/src && rm -rf App.css`)
    fs.writeFile(`${appDirectory}/src/App.css`, thisFile, (err) => {
      if (err) {
        console.log('ERROR writing App.css');
      } else {
        console.log('App.css successfully created');
        resolve()
      }
    })
  })
}

const gitInit = () => {
  return new Promise(resolve=>{
    console.log("\n[6/10] Initialising Git...\n".cyan)
    shell.exec(`cd ${appName} && git init`, () => {
      resolve()
    })
  })
}

const createHeroku = () => {
  return new Promise(resolve=>{
    console.log("\n[7/10] Creating app in Heroku...\n".cyan)
    shell.exec(`cd ${appName} && heroku create ${appName}-${appNumber} -b https://github.com/heroku/heroku-buildpack-static.git`, () => {
      resolve(true)
    })
  })
}

const updateFiles = () => {
  return new Promise(resolve=>{
    console.log("\n[8/10] Updating file structure...\n".cyan)
    shell.exec(`cd ${appName} && echo '{ "root": "build/" }' > static.json && sed '/build/d' .gitignore > .gitignore.new && mv .gitignore.new .gitignore`, () => {
      resolve()
    })
  })
}

const firstBuild = () => {
  return new Promise(resolve=>{
    console.log("\n[9/10] Starting first webpack build...\n".cyan)
    shell.exec(`cd ${appName} && npm run build`, () => {
      resolve()
    })
  })
}


const deployToHeroku = () => {
  return new Promise(resolve=>{
    console.log("\n[10/10] Deploying to Heroku...\n".cyan)
    shell.exec(`cd ${appName} && git add . && git commit -m "initial commit" && git push heroku master && heroku open`, () => {
      resolve()
    })
  })
}

const run = async () => {
  // await installTools()
  let craSuccess = await createReactApp()
  if(!craSuccess){
    console.log('Couldn\'t create this app in React.'.red)
    return false;
  }
  await installPackages()
  await updateTemplates()
  await updateCSS()
  await gitInit()
  await createHeroku()
  await updateFiles()
  await firstBuild()
  await deployToHeroku()
  console.log(`Congratulations! ${appName} is set up and deployed!`)
}

run()
