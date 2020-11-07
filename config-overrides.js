const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: 'src/index.tsx',
    template: 'public/index.html',
    outPath: '/index.html'
  },
  {
    entry: 'src/create.tsx',
    template: 'public/create.html',
    outPath: '/create.html'
  }
]);

module.exports = {
  webpack: function (config, env) {
    multipleEntry.addMultiEntry(config);
    return config;
  }
};