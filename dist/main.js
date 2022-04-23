"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apify_1 = tslib_1.__importDefault(require("apify"));
const pages_1 = require("./pages");
apify_1.default.main(async () => {
    const input = await apify_1.default.getInput();
    const startUrls = [{
            url: input.startUrl,
            userData: {
                label: 'PROFILE',
                level: 0,
            },
        }];
    const requestList = await apify_1.default.openRequestList('start-urls', startUrls);
    const requestQueue = await apify_1.default.openRequestQueue();
    const crawler = new apify_1.default.PuppeteerCrawler({
        requestList,
        requestQueue,
        launchContext: {
            // Chrome with stealth should work for most websites.
            // If it doesn't, feel free to remove this.
            useChrome: true,
            stealth: true,
        },
        // browserPoolOptions: {
        //     useFingerprints: true,
        // },
        proxyConfiguration: !process.env.VK_SCRAPPER_NO_PROXY ? (await apify_1.default.createProxyConfiguration()) : undefined,
        useSessionPool: true,
        // sessionPoolOptions: {
        //     maxPoolSize: 3,
        // },
        persistCookiesPerSession: true,
        preNavigationHooks: [
            async ({ page, request, session }) => {
                const sessionCookies = session.getPuppeteerCookies(request.url);
                if (!sessionCookies.length) {
                    await page.goto(input.baseUrl);
                    const signInButton = await page.$('.VkIdForm__signInButton');
                    await (signInButton === null || signInButton === void 0 ? void 0 : signInButton.click());
                    await page.waitForNavigation({ waitUntil: 'networkidle2' });
                    const loginInput = await page.$('input[name="login"');
                    await (loginInput === null || loginInput === void 0 ? void 0 : loginInput.type(input.loginUsername));
                    const loginSubmitButton = await page.$('button[type="submit"');
                    await (loginSubmitButton === null || loginSubmitButton === void 0 ? void 0 : loginSubmitButton.click());
                    await page.waitForNavigation({ waitUntil: 'networkidle2' });
                    const passwordInput = await page.$('input[name="password"');
                    await (passwordInput === null || passwordInput === void 0 ? void 0 : passwordInput.type(input.loginPassword));
                    const passwordSubmitButton = await page.$('button[type="submit"');
                    await (passwordSubmitButton === null || passwordSubmitButton === void 0 ? void 0 : passwordSubmitButton.click());
                    await page.waitForNavigation({ waitUntil: 'networkidle2' });
                    const puppeteerCookies = await page.cookies();
                    session.setPuppeteerCookies(puppeteerCookies, request.url);
                }
            },
        ],
        handlePageFunction: async ({ request, page, session }) => {
            const quickLoginForm = await page.$('form#quick_login_form');
            const title = await page.title();
            if (quickLoginForm || title === '429 Too Many Requests') {
                session.markBad();
                return;
            }
            const processor = pages_1.PageFactory.create(request.userData.label, new pages_1.PageContext(request, page, requestQueue));
            await processor.process();
            session.markGood();
        },
    });
    apify_1.default.utils.log.info("Starting the crawl.");
    await crawler.run();
    apify_1.default.utils.log.info("Crawl finished.");
});
//# sourceMappingURL=main.js.map