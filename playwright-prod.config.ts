import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options'
//npx playwright test --config=playwright-prod.config.ts
require('dotenv').config();

//Global section
export default defineConfig <TestOptions>({
  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: 'http://localhost:4200/'
  },
  //Project section
  projects: [
    {
      name: 'chromium',
    },
  ]
});
