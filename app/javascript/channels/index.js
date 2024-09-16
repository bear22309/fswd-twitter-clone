// Load all the channels within this directory and all subdirectories.
// Channel files must be named *_channel.js.
// Import React and ReactDOM
// Load all the channels within this directory and all subdirectories.
// Channel files must be named *_channel.js.

import React from 'react';
import { createRoot } from 'react-dom/client';


class LoginSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isSignup: false, 
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password, isSignup } = this.state;

    
    const url = isSignup ? '/api/signup' : '/api/login';
    
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Login/Signup successful!');
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  toggleSignup = () => {
    this.setState(prevState => ({ isSignup: !prevState.isSignup }));
  };

  render() {
    const { username, password, isSignup } = this.state;
    return (
      <div>
        <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={this.handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.handleChange}
          />
          <button type="submit">{isSignup ? 'Sign Up' : 'Log In'}</button>
        </form>
        <button onClick={this.toggleSignup}>
          {isSignup ? 'Switch to Login' : 'Switch to Signup'}
        </button>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const appDiv = document.createElement('div');
  appDiv.id = 'app';
  document.body.appendChild(appDiv);

  const root = createRoot(appDiv);
  root.render(<LoginSignup />);
});

const channels = require.context('.', true, /_channel\.js$/);
channels.keys().forEach(channels);