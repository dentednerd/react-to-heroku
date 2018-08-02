module.exports = `import React from 'react';
import { Helmet } from 'react-helmet';

const App = () => {
  return (
    <main className="App">
      <Helmet>
        <title>
          React-to-Heroku
        </title>
        <meta name="description" content="React app created with react-to-heroku" />
      </Helmet>
      <header className="header">
        <p>
          Thanks for using
        </p>
        <h1>
          react-to-heroku
        </h1>
      </header>
      <div className="intro">
        <p>
          npm install -g react-to-heroku
          <br />
          react-to-heroku your-app
        </p>
      </div>
    </main>
  );
};

export default App;
`;
