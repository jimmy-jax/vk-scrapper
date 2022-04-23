import { RequestQueue, Request } from 'apify';
import { Page } from 'puppeteer';

export class PageContext {
    constructor(
        public request: Request,
        public page: Page,
        public requestQueue: RequestQueue,
    ) {

    }
}
