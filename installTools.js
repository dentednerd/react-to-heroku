
const installTools = () => {
  console.log('[1/?] Installing tools...'.cyan);
  return new Promise((resolve) => {
    exec('npm install -g create-react-app heroku', () => {
      resolve();
    });
  });
};