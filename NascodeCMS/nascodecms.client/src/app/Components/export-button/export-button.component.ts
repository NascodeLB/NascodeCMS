import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-export-button',
  templateUrl: './export-button.component.html',
  styleUrl: './export-button.component.css'
})
export class ExportButtonComponent {
  export(): void {
    const element = document.getElementById("TableToExport");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, Date.now() + '.xlsx');
  }
}
