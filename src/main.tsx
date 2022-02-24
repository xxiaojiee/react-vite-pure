
/**
 *  注意：
 *  为保证组件的自定义样式优先级最高，防止被第三方组件样式覆盖
 *  必须保证App 组件最后引入，先引入第三方组件样式
 */

import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import '/@/design/index.less';
import 'virtual:windi-utilities.css';
// 注册 icon 精灵图
import 'virtual:svg-icons-register';

import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


ReactDOM.render(<App />, document.getElementById('app'));
