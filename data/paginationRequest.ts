export class PaginationRequest {
    /**
     * Records per page
     */
    pageSize: number
    /**
     * Zero-based page index
     */
    pageIndex: number

    constructor(pageSize: number, pageIndex: number) {
        this.pageIndex = pageIndex
        this.pageSize = pageSize
    }

    /**
     * Get the number of records to skip before take the results
     * @returns
     */
    offset() { return this.pageSize * this.pageIndex }
}