import { getInput, pushData } from 'apify';
import { Schema } from '../models';
import { BasePage } from './base-page';
import { PageTypes } from './page-types';

export class ProfilePage extends BasePage {
    async process(): Promise<void> {
        const input = await getInput() as Schema;
        const { level } = this.context.request.userData;

        const url = this.context.request.loadedUrl;
        const name = await this.context.page.$eval('h1', (h1) => h1.textContent);
        pushData({ url, name });

        if (level > input.maxLevel) { return; }

        const friendsLink = await this.context.page.$('a[href^="/friends?id="]');
        if (!friendsLink) { return; }

        const friendsUrl = await friendsLink.evaluate((x) => x.getAttribute('href')) as string;

        await this.context.requestQueue.addRequest({
            url: new URL(friendsUrl, input.baseUrl).toString(),
            userData: {
                label: PageTypes.Friends,
                level,
            },
        });
    }
}
