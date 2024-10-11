import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    /* Maximum time one test can run for. */
    outputDir: './test-results',
    timeout: 30 * 1000,
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:3000',
        testIdAttribute: 'test-id',
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        screenshot: 'only-on-failure',
        trace: 'on-first-retry'
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 2000, height: 1000 }
            }
        }
        /* Test against branded browsers. */
        /* { */
        /*     name: 'Google Chrome', */
        /*     use: { */
        /*         ...devices['Desktop Chrome'], */
        /*         channel: 'chrome', */
        /*         viewport: { width: 1280, height: 720 } */
        /*     } */
        /* }, */
        /* { */
        /*     name: 'firefox', */
        /*     use: { ...devices['Desktop Firefox'] } */
        /* }, */
        /* { */
        /*     name: 'webkit', */
        /*     use: { ...devices['Desktop Safari'] } */
        /* } */
    ],

    webServer: {
        command: 'npm run preview',
        url: 'http://localhost:3000',
        reuseExistingServer: true
    }
});
