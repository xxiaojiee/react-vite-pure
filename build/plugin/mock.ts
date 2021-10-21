/**
 * Mock plugin for development and production.
 * https://github.com/anncwb/vite-plugin-mock
 */
import { viteMockServe } from 'vite-plugin-mock';

export function configMockPlugin(isBuild: boolean) {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    localEnabled: !isBuild,  // 开发打包开关
    prodEnabled: isBuild,  // 生产打包开关
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
    logger: false, //是否在控制台显示请求日志
    supportTs: false //打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件
  });
}
