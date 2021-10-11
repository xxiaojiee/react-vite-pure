/**
 *  Introduces component library styles on demand.
 * https://github.com/anncwb/vite-plugin-style-import
 */

import styleImport from 'vite-plugin-style-import';

export function configStyleImportPlugin(isBuild: boolean) {
  if (!isBuild) return [];
  const pwaPlugin = styleImport({
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
  return pwaPlugin;
}
