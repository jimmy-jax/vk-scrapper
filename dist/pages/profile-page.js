"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilePage = void 0;
const apify_1 = require("apify");
const base_page_1 = require("./base-page");
const page_types_1 = require("./page-types");
class ProfilePage extends base_page_1.BasePage {
    async process() {
        const input = await (0, apify_1.getInput)();
        const { level } = this.context.request.userData;
        const url = this.context.request.loadedUrl;
        const name = await this.context.page.$eval('h1', (h1) => h1.textContent);
        (0, apify_1.pushData)({ url, name });
        if (level > input.maxLevel) {
            return;
        }
        const friendsLink = await this.context.page.$('a[href^="/friends?id="]');
        if (!friendsLink) {
            return;
        }
        const friendsUrl = await friendsLink.evaluate((x) => x.getAttribute('href'));
        await this.context.requestQueue.addRequest({
            url: new URL(friendsUrl, input.baseUrl).toString(),
            userData: {
                label: page_types_1.PageTypes.Friends,
                level,
            },
        });
    }
}
exports.ProfilePage = ProfilePage;
//# sourceMappingURL=profile-page.js.map