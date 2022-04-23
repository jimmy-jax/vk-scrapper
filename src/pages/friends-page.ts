import { getInput } from 'apify';
import { Schema } from '../models';
import { BasePage } from './base-page';
import { PageTypes } from './page-types';

export class FriendsPage extends BasePage {
    async process(): Promise<void> {
        const input = await getInput() as Schema;
        const { level } = this.context.request.userData;

        const friendUrls = await this.context.page.$$eval('.friends_field_title a', ($a) => {
            const items = [];

            $a.forEach((a) => items.push(a.getAttribute('href')));

            return items;
        });

        friendUrls.forEach(async (friendUrl) => {
            await this.context.requestQueue.addRequest({
                url: new URL(friendUrl, input.baseUrl).toString(),
                userData: {
                    label: PageTypes.Profile,
                    level: level + 1,
                },
            });
        });
    }
}
