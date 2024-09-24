import React from 'react';
import { createRoot } from 'react-dom/client';

class LoginSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
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
    const { email, username, password, isSignup } = this.state;
    
    const url = isSignup ? '/api/users' : '/api/sessions'; // Update URLs for login and signup

    const bodyData = isSignup
      ? { user: { email, username, password } } // Signup requires email
      : { user: { username, password } }; // Login only requires username and password
    
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert(isSignup ? 'Signup successful!' : 'Login successful!');
          window.location.href = '/tweets'; 
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
    const { email, username, password, isSignup } = this.state;
    return (
      <div>
        <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
        <form onSubmit={this.handleSubmit}>
          {isSignup && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={this.handleChange}
            />
          )}
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

class TweetFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: [], 
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchTweets();
  }

  fetchTweets = () => {
    fetch('/api/tweets')
      .then(response => response.json())
      .then(data => this.setState({ tweets: data, loading: false }))
      .catch(error => this.setState({ error, loading: false }));
  };

  deleteTweet = (tweetId) => {
    fetch(`/api/tweets/${tweetId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.fetchTweets(); 
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  logout = () => {
    fetch('/api/sessions', {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/'; 
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  render() {
    const { tweets, loading, error } = this.state;

    if (loading) return <p>Loading tweets...</p>;
    if (error) return <p>Error loading tweets: {error.message}</p>;

    return (
      <div>
        <h1>Tweet Feed</h1>
        <button onClick={this.logout}>Logout</button>
        <ul>
          {tweets.map(tweet => (
            <li key={tweet.id}>
              <p><strong>{tweet.username}</strong></p>
              <p>{tweet.content}</p>
              <p><em>{new Date(tweet.created_at).toLocaleString()}</em></p>
              <button onClick={() => this.deleteTweet(tweet.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const appDiv = document.createElement('div');
  appDiv.id = 'app';
  document.body.appendChild(appDiv);

  const renderComponent = window.location.pathname === '/tweets' ? <TweetFeed /> : <LoginSignup />;
  
  const root = createRoot(appDiv);
  root.render(renderComponent);
});

const channels = require.context('.', true, /_channel\.js$/);
channels.keys().forEach(channels);