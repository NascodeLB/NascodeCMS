export class PaginationDto {
  currentPage: number | null;
  firstPage: number | null;
  lastPage: number | null;
  pages: number[] | null;
  totalCount: number | null;

  constructor(data: any) {
    this.currentPage = data.currentPage;
    this.firstPage = data.firstPage;
    this.lastPage = data.lastPage;
    this.totalCount = data.totalCount;
    this.pages = data.pages || null;
  }
}
