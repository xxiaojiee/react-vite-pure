import React, { useState, useEffect, useLayoutEffect } from 'react';
import logo from '/@/assets/logo.svg';
import './App.css';

const Home = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You click ${count}`;
    return () => {
      document.title = 'remove';
    };
  }, [count]);
  useLayoutEffect(() => {
    document.title = `You click ${count}`;
    return () => {
      document.title += '!!!';
    };
  }, [count]);
  return (
    <div className="home" css={{ color: 'red' }}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Hello Vite + React!</p>
          <p>
            <button onClick={() => setCount((preCount) => preCount + 1)}>count is: {count}</button>
          </p>
          <p>
            Edit <code>App.tsx</code> and save to test HMR updates.
          </p>
          <p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            {' | '}
            <a
              className="App-link"
              href="https://vitejs.dev/guide/features.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vite Docs
            </a>
          </p>
        </header>
      </div>
    </div>
  );
};

export default Home;
