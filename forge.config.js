const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    executableName: 'scholario',
    appCopyright: 'Copyright © 2023',
    icon: path.resolve(__dirname, 'src/assets/icon')
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'scholario',
        authors: 'Yasser MBAREK',
        description: 'Offline educational center administration suite'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32']
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // Vite main process configuration
        build: [
          {
            entry: 'main/main.ts',
            config: 'vite.main.config.js',
          }
        ],
        // Vite renderer process configuration
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.js',
          }
        ]
      }
    }
  ]
}; 