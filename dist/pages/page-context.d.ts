import { RequestQueue, Request } from 'apify';
import { Page } from 'puppeteer';
export declare class PageContext {
    request: Request;
    page: Page;
    requestQueue: RequestQueue;
    constructor(request: Request, page: Page, requestQueue: RequestQueue);
}
//# sourceMappingURL=page-context.d.ts.map