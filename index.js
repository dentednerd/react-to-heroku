#!/usr/bin/env node

let shell = require('shelljs')
let colors = require('colors')
let fs = require('fs')
let templates = require('./templates/templates.js')

let appName = process.argv[2]
let appDirectory = `${process.cwd()}/${appName}`

const createReactApp = () => {
  return new Promise(resolve=>{
    if(appName){
      shell.exec(`create-react-app ${appName}`, () => {
        console.log(`${appName} app created`)
        resolve(true)
      })
    }else{
      console.log("\nNo app name was provided.".red)
      console.log("\nProvide an app name in the following format: ")
      console.log("\nreact-to-heroku ", "app-name\n".cyan)
        resolve(false)
    }
  })
}

const cdIntoNewApp = () => {
  return new Promise(resolve=>{
    shell.exec(`cd ${appName}`, ()=>{resolve()})
  })
}

const installPackages = () => {
  return new Promise(resolve=>{
    console.log("\nInstalling packages...\n".cyan)
    shell.exec(`npm install --save redux react-router react-redux redux-thunk react-router-dom`, () => {
      console.log("\nFinished installing packages\n".green)
      resolve()
    })
  })
}

const updateTemplates = () => {
  return new Promise(resolve=>{
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

const gitInit = () => {
  return new Promise(resolve=>{
    console.log("\nInitialising Git...\n".cyan)
    shell.exec(`git init`, () => {
      console.log("\nGit initialised\n".green)
      resolve()
    })
    Promise.all(promises).then(()=>{resolve()})
  })
}

const createHeroku = () => {
  return new Promise(resolve=>{
    console.log("\nCreating app in Heroku...\n".cyan)
    shell.exec(`heroku create -b https://github.com/heroku/heroku-buildpack-static.git`, () => {
      console.log("\nHeroku app created\n".green)
      resolve()
    })
    Promise.all(promises).then(()=>{resolve()})
  })
}

const updateFiles = () => {
  return new Promise(resolve=>{
    shell.exec(`echo '{ "root": "build/" }' > static.json && sed '/build/d' .gitignore > .gitignore.new && mv .gitignore.new .gitignore`, () => {
      resolve()
    })
    Promise.all(promises).then(()=>{resolve()})
  })
}

const firstBuild = () => {
  return new Promise(resolve=>{
    console.log("\nStarting first build...\n".cyan)
    shell.exec(`npm run build`, () => {
      console.log("\nApp built successfully\n".green)
      resolve()
    })
    Promise.all(promises).then(()=>{resolve()})
  })
}


const deployToHeroku = () => {
  return new Promise(resolve=>{
    console.log("\nDeploying to Heroku...\n".cyan)
    shell.exec(`git add . && git commit -m "initial commit" && git push heroku master && heroku open`, () => {
      console.log("\nSuccessfully deployed\n".green)
      resolve()
    })
    Promise.all(promises).then(()=>{resolve()})
  })
}

const run = async () => {
  let craSuccess = await createReactApp()
  if(!craSuccess){
    console.log('Couldn\'t create this app in React.'.red)
    return false;
  }
  await cdIntoNewApp()
  await installPackages()
  await updateTemplates()
  await gitInit()
  let herokuSuccess = await createHeroku()
  if (!herokuSuccess){
    console.log('Couldn\'t create this app in Heroku. Try again with a different project name.'.red)
    return false;
  }
  await updateFiles()
  await firstBuild()
  await deployToHeroku()
  console.log("All done")
}
run() 