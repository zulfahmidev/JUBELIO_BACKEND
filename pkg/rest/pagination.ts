export class PaginationResponse {
    total_items: number;
    total_pages: number;
    current_page: number;
    items_per_page: number;

    constructor(totalItems: number, totalPages: number, currentPage: number, itemsPerPage: number) {
        this.total_items = totalItems;
        this.total_pages = totalPages;
        this.current_page = currentPage ?? 1;
        this.items_per_page = itemsPerPage ?? 10;
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
