 
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';  
import { Paginator } from 'primeng/paginator/paginator';
import { Table } from 'primeng/table/table';
//import * as rtlDetect from 'rtl-detect';

export class PrimengTableHelper {
    // predefinedRecordsCountPerPage = [5, 10, 25, 50, 100, 250, 500];
    predefinedRecordsCountPerPage = [5, 10, 25, 50, 100, 250];
    defaultRecordsCountPerPage : number = 10;

    isResponsive = true;

    resizableColumns!: false;

    totalRecordsCount = 0;

    records: any[] = [];
 
    isLoading = false;

    showLoadingIndicator(): void {
        setTimeout(() => {
            this.isLoading = true;
        }, 0);
    }

    hideLoadingIndicator(): void {
        setTimeout(() => {
            this.isLoading = false;
        }, 0);
    }

    getSorting(table: Table): string {
        let sorting = 'ID'; 
        if (table && table.sortField) {
            sorting = table.sortField;
            if (table.sortOrder === 1) {
               // sorting += ' ASC';
            } else if (table.sortOrder === -1) {
                sorting += ' DESC';
            }
        } 
        return sorting;
    }

    getMaxResultCount(paginator: Paginator, event: LazyLoadEvent | undefined): number {
        //console.log(paginator.rows);
        let rowsNumb = 10;
        if ( paginator && paginator.rows) {
            return paginator.rows;
        }

        if (!event) {
            return 0;
        }

        return rowsNumb;
    }

    getSkipCount(paginator: Paginator, event: LazyLoadEvent  | undefined): number { 
        let firstItem = 0;
      //  console.log( paginator );
        if ( paginator &&  paginator.first) {
            return paginator.first;
        }

        if (!event) {
            return 0;
        }
        return firstItem;
    }

    shouldResetPaging(event: LazyLoadEvent | undefined): boolean {
        if (!event /*|| event.sortField*/) { // if you want to reset after sorting, comment out parameter
            return true;
        }

        return false;
    }

    // adjustScroll(table: Table) {
    //     const rtl = rtlDetect.isRtlLang(abp.localization.currentLanguage.name);
    //     if (!rtl) {
    //         return;
    //     }

    //     const body: HTMLElement = table.el.nativeElement.querySelector('.ui-table-scrollable-body');
    //     const header: HTMLElement = table.el.nativeElement.querySelector('.ui-table-scrollable-header');
    //     body.addEventListener('scroll', () => {
    //       header.scrollLeft = body.scrollLeft;
    //     });
    // }
}
