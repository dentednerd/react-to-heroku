module.exports = `@import url('https://fonts.googleapis.com/css?family=Grand+Hotel|Roboto+Mono');

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
}
`;
