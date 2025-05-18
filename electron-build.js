const { build } = require('electron-builder');
const path = require('path');

/**
 * Build configuration for Electron app
 */
build({
  config: {
    appId: 'com.scholario.app',
    productName: 'Scholario',
    directories: {
      output: 'release'
    },
    files: [
      'dist/**/*',
      'package.json'
    ],
    win: {
      target: [
        {
          target: 'nsis',
          arch: ['x64']
        }
      ],
      icon: 'src/assets/icon.ico'
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      shortcutName: 'Scholario'
    }
  }
}).then(() => {
  console.log('Build completed successfully!');
}).catch(err => {
  console.error('Error during build:', err);
  process.exit(1);
}); 