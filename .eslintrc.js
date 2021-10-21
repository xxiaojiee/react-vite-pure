module.exports = {
  extends: [
    'eslint-config-zerod/typescript/react',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  rules: {
    'react/no-danger': 0, // 关闭对 dangerouslySetInnerHTML 参数使用的报错
  },
};
