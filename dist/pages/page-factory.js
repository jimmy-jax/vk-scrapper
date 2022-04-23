"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageFactory = void 0;
const friends_page_1 = require("./friends-page");
const page_types_1 = require("./page-types");
const profile_page_1 = require("./profile-page");
class PageFactory {
    static create(type, context) {
        switch (type) {
            case page_types_1.PageTypes.Profile:
                return new profile_page_1.ProfilePage(context);
            case page_types_1.PageTypes.Friends:
                return new friends_page_1.FriendsPage(context);
            default:
                throw new Error(`Unknown PageTypes value "${type}."`);
        }
    }
}
exports.PageFactory = PageFactory;
//# sourceMappingURL=page-factory.js.map