import type { Config } from 'tailwindcss';
import preset from '@hieu-asia/config/tailwind';

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    './index.html',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
