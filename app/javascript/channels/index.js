// Load all the channels within this directory and all subdirectories.
// Channel files must be named *_channel.js.
// Import React and ReactDOM

import { createRoot } from 'react-dom/client'; 

const HelloWorld = () => <h1>Hello, World!</h1>;

document.addEventListener('DOMContentLoaded', () => {

  const appDiv = document.createElement('div');
  appDiv.id = 'app'; 
  document.body.appendChild(appDiv);

  
  const root = createRoot(appDiv);
  root.render(<HelloWorld />);
});


const channels = require.context('.', true, /_channel\.js$/);
channels.keys().forEach(channels);
