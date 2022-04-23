"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendsPage = void 0;
const apify_1 = require("apify");
const base_page_1 = require("./base-page");
const page_types_1 = require("./page-types");
class FriendsPage extends base_page_1.BasePage {
    async process() {
        const input = await (0, apify_1.getInput)();
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
                    label: page_types_1.PageTypes.Profile,
                    level: level + 1,
                },
            });
        });
    }
}
exports.FriendsPage = FriendsPage;
//# sourceMappingURL=friends-page.js.map