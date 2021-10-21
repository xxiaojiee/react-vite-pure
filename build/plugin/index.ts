import type { Plugin } from 'vite';

import reactRefresh from '@vitejs/plugin-react-refresh'
import legacy from '@vitejs/plugin-legacy';

import { configHtmlPlugin } from './html';
// import { configPwaConfig } from './pwa';
import { configMockPlugin } from './mock';
// import { configCompressPlugin } from './compress';
import { configStyleImportPlugin } from './styleImport';
// import { configVisualizerConfig } from './visualizer';
// import { configImageminPlugin } from './imagemin';
// import { configWindiCssPlugin } from './windicss';
import { configSvgIconsPlugin } from './svgSprite';

interface ViteEnv {
  VITE_GLOB_APP_TITLE: string,
  VITE_PUBLIC_PATH: string,
  VITE_USE_IMAGEMIN?: boolean,
  VITE_USE_MOCK: boolean,
  VITE_LEGACY?: boolean,
  VITE_BUILD_COMPRESS?: 'gzip' | 'brotli' | 'none',
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean,
}

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_USE_IMAGEMIN,
    VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv;

  const vitePlugins: (Plugin | Plugin[])[] = [];

  // 支持热更新
  !isBuild && vitePlugins.push(reactRefresh());

  //兼容旧浏览器。legacy 插件会自动额外生成一个针对旧浏览器的包，并且在 html 中插入根据浏览器 ESM 支持来选择性加载对应包的代码
  VITE_LEGACY && isBuild && vitePlugins.push(legacy());

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild));

  // vite-plugin-windicss
  // vitePlugins.push(configWindiCssPlugin());

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));


  /**
   * vite-plugin-style-import
   * 按需导入组件库样式
   * 由于vite本身已按需导入了组件库，因此仅样式不是按需导入的，因此只需按需导入样式即可。
   */
  vitePlugins.push(configStyleImportPlugin());

  // rollup-plugin-visualizer
  // vitePlugins.push(configVisualizerConfig());

  // 以下插件仅适用于生产环境
  if (isBuild) {
    //vite-plugin-imagemin
    // VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());

    // rollup-plugin-gzip
    // vitePlugins.push(
    //   configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
    // );

    // vite-plugin-pwa
    // vitePlugins.push(configPwaConfig(viteEnv));
  }

  return vitePlugins;
}
