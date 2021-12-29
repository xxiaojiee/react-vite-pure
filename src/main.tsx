import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'virtual:windi.css'

// 注册 icon 精灵图
import 'virtual:svg-icons-register';
import './index.less';

ReactDOM.render(<App />, document.getElementById('app'));
