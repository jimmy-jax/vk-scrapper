import { BasePage } from './base-page';
import { FriendsPage } from './friends-page';
import { PageContext } from './page-context';
import { PageTypes } from './page-types';
import { ProfilePage } from './profile-page';

export class PageFactory {
    static create(type: PageTypes, context: PageContext): BasePage {
        switch (type) {
            case PageTypes.Profile:
                return new ProfilePage(context);

            case PageTypes.Friends:
                return new FriendsPage(context);

            default:
                throw new Error(`Unknown PageTypes value "${type}."`);
        }
    }
}
