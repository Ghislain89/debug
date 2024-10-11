---
title: 'How to fix viewport issues in Playwright'
description: 'Why I do what I do'
pubDate: '2024-10-11'
heroImage: '/synthwave-dude.png'
tags: ['playwright']
---

### TL;DR

When running Playwright tests in CI, make sure to set the viewport level to 100%
by setting a default viewport in the Playwright config.

```js
{
    name: 'Google Chrome',
    use: {
         ...devices['Desktop Chrome'],
         channel: 'chrome',
         viewport: { width: 1280, height: 720 }
    }
}
```

### The problem

While I was creating this website, I had this weird problem running my
Playwright tests. Running the tests locally, everything worked fine. But when I
ran the tests on Github Actions, the tests failed only for Chrome based
browsers.

Running the the same type of test in Cypress, I had no problems at all. So I
started to investigate the problem.

### The investigation

Here is a part of my test:

```js
const nav = page.getByRole('navigation');
const blogLink = nav.getByRole('link', { name: /blog/i });
await blogLink.click();
```

This code is supposed to click on a link in the navigation bar. Running the test
in CI, the Playwright log informed that the test failed because the element was
outside of the viewport

```text
Error: locator.click: Test timeout of 30000ms exceeded.

    Call log:
      - waiting for getByRole('navigation').getByRole('link', { name: /blog/i })
      -   locator resolved to <a href="/blog" data-astro-cid-3ef6ksr2="" data-astro-cid-eimmu3lg=""
            data-astro-source-loc="13:74" data-astro-source-file="/home/runner/work/www.joelgrimberg.nl/www.joelgrimberg.nl/src/components/HeaderLink.astro"> Blog </a>
      - attempting click action
      -   waiting for element to be visible, enabled and stable
      -   element is visible, enabled and stable
      -   scrolling into view if needed
      -   done scrolling
      -   element is outside of the viewport
      - retrying click action, attempt #1
```

Zooming in (yes yes, pun intended) on this error message, Playwright already
gave a hint to the solution, but I was not ready to receive it yet. So I created
the same test in Cypress and ran it in CI. The test passed without any problems:

```js
cy.findByRole('navigation').findByRole('link', { name: /blog/i }).click();
```

So, I started investigating the Playwright Trace.<br>**As a Cypress ambassador,
I have to say that the Playwright Trace Viewer is pretty cool!**

So I figured out that I can configure my trace in my playwright.config.ts file
like this:

```js
    use: {
        ...
        trace: 'on-first-retry'
        ...
    },
```

Running CI with tracing enabled will make sure Github Action automatically
creates a
[trace file](https://github.com/joelgrimberg/www.joelgrimberg.nl/actions/runs/11280149453/artifacts/2041979051)
, which can be loaded into the
[Playwright Trace Viewer](https://trace.playwright.dev/) or run locally with the
following shell command:

```bash
npx playwright show-trace trace.zip
```

Running the Playwright Tracer leads to an interesting state: in the upper part
of the tracer, the timeline of the test is shown, which does not show a menu
bar, but in the lower part of the tracer, the 'state' of the complete site is
visible including the menu bar.

And ofcourse, grabbing the element by the locator highlighted the element in the
active view also showed the correct element:

```
getByRole('navigation').getByRole('link', {name: /blog/i})
```

So, I was really confused. The element was there, but Playwright could not find
it.

### The solution

In these rare cases, when the element IS there, and the viewport - error is
shown in the log, set the viewport level to 100%, by setting a default viewport
in the Playwright config:

```js
{
    name: 'Google Chrome',
    use: {
         ...devices['Desktop Chrome'],
         channel: 'chrome',
         viewport: { width: 1280, height: 720 }
    }
}
```
