import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'org.juzama.bolsaempleo',
  appName: 'Bolsa de Empleo JUZAMA',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body,
      style: KeyboardStyle.Dark,
      resizeOnFullScreen: true
    }
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
