"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageContext = void 0;
class PageContext {
    constructor(request, page, requestQueue) {
        Object.defineProperty(this, "request", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: request
        });
        Object.defineProperty(this, "page", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: page
        });
        Object.defineProperty(this, "requestQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: requestQueue
        });
    }
}
exports.PageContext = PageContext;
//# sourceMappingURL=page-context.js.map