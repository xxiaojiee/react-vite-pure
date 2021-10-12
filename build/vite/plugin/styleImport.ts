/**
 *  按需引入组件库样式.
 * https://github.com/anncwb/vite-plugin-style-import
 */

import styleImport from 'vite-plugin-style-import';

export function configStyleImportPlugin() {
  const stylePlugin = styleImport({
    libs: [
      {
        libraryName: 'antd',
        esModule: true,
        resolveStyle: (names) => {
          return `antd/es/${names}/style/index`;
        },
      },
    ]
  });
  return stylePlugin;
}
