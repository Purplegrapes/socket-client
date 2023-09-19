module.exports = {
  // ...
  // devServer: { /* ... */ },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    /* ... */
    console.log(devServerConfig)
    return devServerConfig;
  },
};