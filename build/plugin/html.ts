/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import type { Plugin } from 'vite';

import html from 'vite-plugin-html';

import pkg from '../../package.json';
import { GLOB_CONFIG_FILE_NAME } from '../constant';

interface ViteEnv {
  VITE_GLOB_APP_TITLE: string,
  VITE_PUBLIC_PATH: string,
  VITE_USE_IMAGEMIN?: boolean,
  VITE_USE_MOCK: boolean,
  VITE_LEGACY?: boolean,
  VITE_BUILD_COMPRESS?: string,
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean,
}


export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env;

  const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`;

  const getAppConfigFileSrc = () => {
    return `${path || '/'}${GLOB_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`;
  };

  const htmlPlugin: Plugin[] = html({
    minify: isBuild,
    inject: {
      // 将数据注入 ejs 模板
      injectData: {
        title: VITE_GLOB_APP_TITLE,
      },
      // 嵌入生成的 app.config.js 文件
      tags: isBuild
        ? [
          {
            tag: 'script',
            attrs: {
              src: getAppConfigFileSrc(),
            },
          },
        ]
        : [],
    },
  });
  return htmlPlugin;
}
