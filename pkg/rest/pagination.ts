export class PaginationResponse {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;

    constructor(totalItems: number, totalPages: number, currentPage: number, itemsPerPage: number) {
        this.totalItems = totalItems;
        this.totalPages = totalPages;
        this.currentPage = currentPage ?? 1;
        this.itemsPerPage = itemsPerPage ?? 10;
    }
}

interface IRequestPagination {
    page?: number;
    limit?: number;
    search?: string;
    sort?: "ASC" | "DESC";
    order?: string;
}

export class Pagination {
    page: number;
    limit: number;
    search: string;
    sort: "ASC" | "DESC";
    order: string;

    constructor({ page = 1, limit = 10, search = "", sort = "DESC", order = "created_at" }: IRequestPagination = {}) {
        this.page = page > 0 ? page : 1;
        this.limit = limit > 0 ? limit : 10;
        this.search = search;
        this.sort = sort || "DESC";
        this.order = order || "created_at";
    }

    getOffset(): number {
        return (this.page - 1) * this.limit;
    }
}
