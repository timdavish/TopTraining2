export class Pager {
	totalItems: number;
	currentPage: number;
	pageSize: number;
	totalPages: number;
	startPage: number;
	endPage: number;
	startIndex: number;
	endIndex: number;
	pages: number[];
}

export class PagerService {
	getPager(totalItems: number, currentPage: number = 1, totalPages: number, pageSize: number = 10): Pager {
		let startPage: number;
		let endPage: number;

		if (totalPages <= 10) {
			startPage = 1;
			endPage = totalPages;
		} else {
			if (currentPage <= 6) {
				startPage = 1;
				endPage = 10;
			} else if (currentPage + 4 >= totalPages) {
				startPage = totalPages - 9;
				endPage = totalPages;
			} else {
				startPage = currentPage - 5;
				endPage = currentPage + 4;
			}
		}

		let startIndex = (currentPage - 1) * pageSize;
		let endIndex = Math.min(startIndex + pageSize, totalItems);

		let pages = this.createRange(startPage, endPage);

		return {
			totalItems: totalItems,
			currentPage: currentPage,
			pageSize: pageSize,
			totalPages: totalPages,
			startPage: startPage,
			endPage: endPage,
			startIndex: startIndex,
			endIndex: endIndex,
			pages: pages
		};
	}

	private createRange(start: number, end: number): number[] {
		const range = [];
		while (start <= end && range.push(start++));
		return range;
	}
}
