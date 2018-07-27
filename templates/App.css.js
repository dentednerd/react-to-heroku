module.exports = `
@import url('https://fonts.googleapis.com/css?family=Grand+Hotel|Roboto+Mono');

.App {
  text-align: center;
}

.App h1 {
  font-face: 'Grand Hotel', cursive;
  font-weight: lighter;
}

.App-logo {
  animation: App-logo-spin infinite 20s linear;
  height: 80px;
}

.App-header {
  background-color: hotpink;
  height: 150px;
  padding: 20px;
  color: white;
}

.App-title {
  font-size: 1.5em;
}

.App-intro {
  font-size: large;
  font-face: 'Roboto Mono', monospace;
}

@keyframes App-logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
