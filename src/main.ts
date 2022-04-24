import dotenv from 'dotenv';
dotenv.config();

import Apify from 'apify';
import { Schema } from './models';
import { PageContext, PageFactory } from './pages';
import { HTTPResponse } from 'puppeteer';

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

        autoscaledPoolOptions: {
            maxConcurrency: process.env.VK_SCRAPPER_AUTOSCALED_POOL_CONCURRENCY
                ? +process.env.VK_SCRAPPER_AUTOSCALED_POOL_CONCURRENCY
                : undefined,
            desiredConcurrency: process.env.VK_SCRAPPER_AUTOSCALED_POOL_CONCURRENCY
                ? +process.env.VK_SCRAPPER_AUTOSCALED_POOL_CONCURRENCY
                : undefined,
        },

        proxyConfiguration: !process.env.VK_SCRAPPER_NO_PROXY ? (await Apify.createProxyConfiguration()) : undefined,
        useSessionPool: true,
        sessionPoolOptions: {
            maxPoolSize: process.env.VK_SCRAPPER_SESSION_MAX_POOL_SIZE
                ? +process.env.VK_SCRAPPER_SESSION_MAX_POOL_SIZE
                : undefined,
        },
        persistCookiesPerSession: true,

        maxRequestsPerCrawl: process.env.VK_SCRAPPER_MAX_REQUESTS_PER_CRAWL
            ? +process.env.VK_SCRAPPER_MAX_REQUESTS_PER_CRAWL
            : undefined,

        preNavigationHooks: [
            async ({ page, request, session }) => {
                const sessionCookies = session.getPuppeteerCookies(request.url);

                if (!sessionCookies?.length) {
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
        handlePageFunction: async ({ request, response, page, session }) => {
            const status = (response as HTTPResponse).status();
            if (session.retireOnBlockedStatusCodes(status)) {
                return;
            }

            const quickLoginForm = await page.$('form#quick_login_form');
            if (quickLoginForm) {
                session.markBad();
                return;
            }

            const processor = PageFactory.create(request.userData.label, new PageContext(request, page, requestQueue));
            await processor.process();
            session.markGood();
        },
    });

    Apify.utils.log.info('Starting the crawl.');
    await crawler.run();
    Apify.utils.log.info('Crawl finished.');
});
