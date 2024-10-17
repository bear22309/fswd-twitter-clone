import React from 'react';
import { createRoot } from 'react-dom/client';
import { safeCredentials, handleErrors } from '../utils/fetchHelper';  

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
    
    const url = isSignup ? '/api/users' : '/api/sessions';
    const bodyData = isSignup
      ? { user: { email, username, password } }
      : { user: { username, password } };       
    
    fetch(url, safeCredentials({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    }))
      .then(handleErrors)
      .then(data => {
        if (data.success) {
          alert(isSignup ? 'Signup successful!' : 'Login successful!');
          window.location.href = '/tweets';
        } else {
          alert('Error: ' + (data.message || 'Unknown error occurred'));
        }
      })
      .catch(error => {
        alert('Error occurred: ' + error.message);
      });
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
      content: '',
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchTweets();
  }
  
  fetchTweets = () => {
    fetch('/api/tweets')
      .then(handleErrors)
      .then(data => {
        this.setState({ tweets: data.tweets || [], loading: false });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  postTweet = (event) => {
    event.preventDefault();
    const { content } = this.state;
    fetch('/api/tweets', safeCredentials({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet: { content } }),
    }))
      .then(handleErrors)
      .then(data => {
        if (data.success) {
          this.fetchTweets();
          this.setState({ content: '' });
        }
      })
      .catch(error => {
        alert('Error posting tweet: ' + error.message);
      });
  };

  handleInputChange = (event) => {
    this.setState({ content: event.target.value });
  };

  deleteTweet = (tweetId) => {
    fetch(`/api/tweets/${tweetId}`, safeCredentials({ method: 'DELETE' }))
      .then(handleErrors)
      .then(data => {
        if (data.success) {
          this.fetchTweets();
        }
      })
      .catch(error => {
        alert('Error deleting tweet: ' + error.message);
      });
  };

  logout = () => {
    fetch('/api/sessions', safeCredentials({ method: 'DELETE' }))
      .then(handleErrors)
      .then(data => {
        if (data.success) {
          window.location.href = '/';
        }
      })
      .catch(error => {
        alert('Error logging out: ' + error.message);
      });
  };

  render() {
    const { tweets, content, loading, error } = this.state;
    if (loading) return <p>Loading tweets...</p>;
    if (error) return <p>Error loading tweets: {error.message}</p>;
    return (
      <div>
        <h1>Tweet Feed</h1>
        <button onClick={this.logout}>Logout</button>
        <form onSubmit={this.postTweet}>
          <textarea
            placeholder="What's happening?"
            value={content}
            onChange={this.handleInputChange}
          />
          <button type="submit">Post Tweet</button>
        </form>
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

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchUserTweets();
  }

  fetchUserTweets = () => {
    const username = window.location.pathname.split('/')[1]; 
    fetch(`/api/users/${username}/tweets`)
      .then(handleErrors)
      .then(data => {
        this.setState({ tweets: data.tweets || [], loading: false });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  render() {
    const { tweets, loading, error } = this.state;
    if (loading) return <p>Loading tweets...</p>;
    if (error) return <p>Error loading tweets: {error.message}</p>;

    return (
      <div>
        <h1>{window.location.pathname.split('/')[1]}'s Tweets</h1>
        <ul>
          {tweets.map(tweet => (
            <li key={tweet.id}>
              <p>{tweet.content}</p>
              <p><em>{new Date(tweet.created_at).toLocaleString()}</em></p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const appDiv = document.getElementById('app') || document.createElement('div');
  appDiv.id = 'app';
  if (!document.getElementById('app')) document.body.appendChild(appDiv);

  const pathname = window.location.pathname;
  let renderComponent;

  if (pathname === '/tweets') {
    renderComponent = <TweetFeed />;
  } else if (pathname.startsWith('/')) {
    renderComponent = <UserProfile />;
  } else {
    renderComponent = <LoginSignup />;
  }

  const root = createRoot(appDiv);
  root.render(renderComponent);
});

const channels = require.context('.', true, /_channel\.js$/);
channels.keys().forEach(channels);
