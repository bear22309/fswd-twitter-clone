import React from 'react';
import { createRoot } from 'react-dom/client'; 

import './home.scss';


class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome to the Home Page!</h1>
        <p>This is a simple Home component.</p>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const homeDiv = document.createElement('div'); 
  document.body.appendChild(homeDiv);

  const root = createRoot(homeDiv);
  root.render(<Home />); 
});
