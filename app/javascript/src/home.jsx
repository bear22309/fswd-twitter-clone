import React from 'react';
import { createRoot } from 'react-dom/client'; 

import './home.scss';

const Home = () => (
  <h1>Home page react is working</h1>
);

document.addEventListener('DOMContentLoaded', () => {
  const homeDiv = document.createElement('div'); 
  document.body.appendChild(homeDiv);


  const root = createRoot(homeDiv);
  root.render(<Home />);
});

