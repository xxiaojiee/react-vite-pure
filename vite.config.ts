import type { UserConfig, ConfigEnv } from 'vite';

import path from "path";
// import fs from 'fs';
import { loadEnv } from 'vite'

import moment from 'moment';
import { wrapperEnv } from './build/utils';
import { createProxy } from './build/vite/proxy';
import { OUTPUT_DIR } from './build/constant';
import { createVitePlugins } from './build/vite/plugin';
import pkg from './package.json';

const { dependencies, devDependencies, name, version } = pkg;


const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: moment().format('YYYY-MM-DD HH:mm:ss'),
};

function pathResolve(dir: string) {
  return path.resolve(process.cwd(), '.', dir);
}

// command, mode  conmmand:例 { mode: 'development', command: 'serve' }
// mode serve 时默认 'development'，build 时默认 'production'
export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 返回 Node.js 进程的当前工作目录，例D:\Private\react-vite-app
  const root = process.cwd();

  // 获取环境变量
  const env = loadEnv(mode, root);

  // 读取并格式化所有环境变量，并配置文件到process.env
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

  const isBuild = command === 'build';

  return {
    // 开发或生产环境服务的 公共基础路径
    base: VITE_PUBLIC_PATH,
    root,
    server: {
      // https: true,
      // open: '/table/manage',
      host: true,
      port: VITE_PORT,  // 默认3000
      proxy: createProxy(VITE_PROXY),
      // proxy: {
      //   // 正则写法： '^/api/.*'
      //   '/api': {
      //     target: 'http://jsonplaceholder.typicode.com/',
      //     changeOrigin: true,
      //     rewrite: (paths) => paths.replace(/^\/api/, ''),
      //   },
      // },
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    // 项目使用的vite插件。 数量大，因此需要单独提取和管理
    plugins: createVitePlugins(viteEnv, isBuild),

    // 指定传递给 CSS 预处理器的选项
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // 重写 less 变量，定制样式
          modifyVars: {},
        },
      }
    },
    resolve: {
      alias: [
        // {
        //   find: /^@\//,
        //   replacement: `${path.resolve(__dirname, "src")}/`,
        // },
        { find: /^~/, replacement: '' },
        // { find: /^loadash/, replacement: 'lodash-es' },
        {
          find: /\/@\//,
          replacement: `${pathResolve('src')}/`,
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: `${pathResolve('types')}/`,
        },
      ],
    },
    build: {
      // 设置最终构建的浏览器兼容目标
      target: 'es2015',
      // 指定输出路径（相对于 项目根目录).
      outDir: OUTPUT_DIR,
      terserOptions: {
        compress: {
          keep_infinity: true, // 通过true以防止Infinity被压缩为1/0
          // 传递true以放弃对console.*函数的调用
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      // 启用/禁用 brotli 压缩大小报告
      brotliSize: false,
      // chunk 大小警告的限制
      chunkSizeWarningLimit: 1500,
    },
  }
}
