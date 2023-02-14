const PROXY_CONFIG = [
  {
    context: ['/dashboard'],
    target: 'https://accounts.google.com',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug'
  }
];

module.exports = PROXY_CONFIG;