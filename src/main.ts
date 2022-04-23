import Apify from 'apify';
import { Schema } from './models';
import { PageContext, PageFactory } from './pages';

Apify.main(async () => {
    const input = await Apify.getInput() as Schema;

    const startUrls = [{
        url: input.startUrl,
        userData: {
            label: 'PROFILE',
            level: 0,
        },
    }];

    const requestList = await Apify.openRequestList('start-urls', startUrls);
    const requestQueue = await Apify.openRequestQueue();

    const crawler = new Apify.PuppeteerCrawler({
        requestList,
        requestQueue,
        launchContext: {
            // Chrome with stealth should work for most websites.
            // If it doesn't, feel free to remove this.
            // useChrome: true,
            // stealth: true,
        },
        // browserPoolOptions: {
        //     useFingerprints: true,
        // },
        proxyConfiguration: !process.env.VK_SCRAPPER_NO_PROXY ? (await Apify.createProxyConfiguration()) : undefined,
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
                    await signInButton?.click();
                    await page.waitForNavigation({ waitUntil: 'networkidle2' });

                    const loginInput = await page.$('input[name="login"');
                    await loginInput?.type(input.loginUsername);
                    const loginSubmitButton = await page.$('button[type="submit"');
                    await loginSubmitButton?.click();
                    await page.waitForNavigation({ waitUntil: 'networkidle2' });

                    const passwordInput = await page.$('input[name="password"');
                    await passwordInput?.type(input.loginPassword);
                    const passwordSubmitButton = await page.$('button[type="submit"');
                    await passwordSubmitButton?.click();
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

            const processor = PageFactory.create(request.userData.label, new PageContext(request, page, requestQueue));
            await processor.process();
            session.markGood();
        },
    });

    Apify.utils.log.info("Starting the crawl.");
    await crawler.run();
    Apify.utils.log.info("Crawl finished.");
});
