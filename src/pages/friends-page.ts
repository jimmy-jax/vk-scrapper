import { getInput, pushData } from 'apify';
import { Schema } from '../models';
import { BasePage } from './base-page';
import { PageTypes } from './page-types';

export class FriendsPage extends BasePage {
    async process(): Promise<void> {
        const input = await getInput() as Schema;
        const { level } = this.context.request.userData;

        // https://intoli.com/blog/scrape-infinite-scroll/
        //
        // await this.context.page.waitForNetworkIdle('');

        // await this.context.page.evaluate(async () => {
        //     while (Math.round(window.pageYOffset + window.innerHeight) < document.body.scrollHeight) {
        //         window.scrollTo(0, document.body.scrollHeight);
        //         await new Promise((delayResolve) => setTimeout(delayResolve, 100));
        //     }
        // });

        const friends = await this.context.page.evaluate(() => {
            return Array.from(document.querySelectorAll('.friends_user_info'))
                .map((x) => {
                    const toggleFriendFuncText = x.querySelector('a[onclick^="return showWriteMessageBox').getAttribute('onclick');
                    const id = +/return showWriteMessageBox\(event,\s*(?<id>\d+)\)/gm.exec(toggleFriendFuncText).groups.id;

                    return {
                        id,
                        url: x.querySelector('.friends_field_title a').getAttribute('href'),
                        name: x.querySelector('.friends_field_title a').textContent,
                    };
                });
        });

        friends.forEach(async (friend) => {
            pushData({
                id: friend.id,
                url: new URL(friend.url, input.baseUrl).toString(),
                name: friend.name,
                level,
            });

            if (level >= input.maxCrawlingLevel) { return; }

            const friendsUrl = `/friends?id=${friend.id}&section=all`;
            await this.context.requestQueue.addRequest({
                url: new URL(friendsUrl, input.baseUrl).toString(),
                userData: {
                    label: PageTypes.Friends,
                    level: level + 1,
                },
            });
        });
    }
}
