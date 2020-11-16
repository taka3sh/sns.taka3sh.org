const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/index.tsx',
    template: 'public/index.html',
    outPath: '/index.html',
  },
  {
    entry: 'src/create.tsx',
    template: 'public/create.html',
    outPath: '/create.html',
  },
]);

module.exports = {
  webpack(config, env) {
    multipleEntry.addMultiEntry(config);
    if (process.env.CONTEXT === 'production') {
      config.resolve.alias['./constants/development'] = './constants/production';
    }
    return config;
  },
};
