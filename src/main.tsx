import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// 注册 icon 精灵图
import 'virtual:svg-icons-register';

import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import '/@/design/index.less';
import 'virtual:windi-utilities.css';

import './index.less';

ReactDOM.render(<App />, document.getElementById('app'));
