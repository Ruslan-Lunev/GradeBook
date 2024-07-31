"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationRequest = void 0;
class PaginationRequest {
    constructor(pageSize, pageIndex) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
    }
    /**
     * Get the number of records to skip before take the results
     * @returns
     */
    offset() { return this.pageSize * this.pageIndex; }
}
exports.PaginationRequest = PaginationRequest;
//# sourceMappingURL=paginationRequest.js.map