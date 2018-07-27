
const fs = require('fs');
const thisFile = require('./templates/App.css');

fs.writeFile('./src/App.css', thisFile, (err) => {
  if (err) {
    console.log('ERROR writing App.css');
  } else {
    console.log('App.css successfully created');
  }
});
