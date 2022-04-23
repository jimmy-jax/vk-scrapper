import { PageContext } from './page-context';

export abstract class BasePage {
    constructor(
        protected context: PageContext,
    ) {
    }

    abstract process(): Promise<void>;
}
