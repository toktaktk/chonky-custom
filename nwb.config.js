module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'Chonky',
      externals: {
        react: 'React'
      }
    }
  }
}
