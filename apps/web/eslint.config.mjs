// Wave 60.46.a — Storybook 10 flat config plugin for *.stories.* lint rules.
// See https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import preset from '@hieu-asia/config/eslint-flat';

export default [...preset, ...storybook.configs['flat/recommended']];
