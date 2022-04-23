import { PageContext } from './page-context';
export declare abstract class BasePage {
    protected context: PageContext;
    constructor(context: PageContext);
    abstract process(): Promise<void>;
}
//# sourceMappingURL=base-page.d.ts.map