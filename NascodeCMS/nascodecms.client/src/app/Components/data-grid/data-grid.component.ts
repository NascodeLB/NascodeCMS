import { Component, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { forEach } from 'lodash';
import { AppConsts } from '../../Shared/AppConsts';
import { GlobalService } from '../../Shared/Global.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.css',

})
export class DataGridComponent implements OnInit {
  @Input() Headers: { Title: string; Type: string, Code: string }[] = [];
  @Input() Items: any[] = [];
  @Input() Pages: number[] = [];
  @Input() FirstPage: number = 0;
  @Input() LastPage: number = 0;
  @Input() GridEditMode: boolean = false;
  @Input() GridEditErros: any = [];
  @Input() PicturePath: string = "";
   
  @Output() checkboxChange = new EventEmitter<{ id: number, checked: boolean }>();
  @Output() activeToggleChange = new EventEmitter<{ id: number, checked: boolean }>();
  @Output() onrowClick = new EventEmitter<number>();
  @Output() onsortChange = new EventEmitter<{ Title: string, Sort: string }>();
  @Output() selectAllChange = new EventEmitter<boolean>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onPageSizeChange = new EventEmitter<string>();
  @Output() onEditInputChange = new EventEmitter<{ value: string, id: number, field: string }>();

  CheckAll: boolean = false;
  Sortby: string = "";
  Sortdirection: string = "asc";
  CurrentPage: number = 1;
  Loading: boolean = true;
  ItemsListSize: { Value: string, Title: string }[] = [
    { Value: '10', Title: '10' },
    { Value: '50', Title: '50' },
    { Value: '100', Title: '100' },
    { Value: '200', Title: '200' },
  ];
  ServerHost: string = AppConsts.RemoteServiceURL;

  // for picture preview
  PreviewImgSrc: string = ""
  PreviewImageTitle: string = ""
  PreviewShow: boolean = false
  constructor(private renderer: Renderer2, public ClsGlobal: GlobalService) { }

  ngOnInit() {
    this.ServerHost += this.PicturePath + "/";
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Items']) {
      if (changes['Items'].currentValue.length > 0) {
        this.Loading = false;
      }
    }

  }

  HandleGridPictureClick(ImgSrc: string, ImgTitle: string) {
    this.PreviewImgSrc = ImgSrc;
    this.PreviewImageTitle = ImgTitle;
    this.PreviewShow = true;
  }


  CheckAllCheckBoxs(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.CheckAll = checkbox.checked;
    const tablerows = document.getElementsByClassName('GridResults');
    Array.from(tablerows).forEach((tablerow: Element) => {
      if (checkbox.checked) {
        this.renderer.addClass(tablerow, 'PrintMe');
      } else {
        this.renderer.removeClass(tablerow, 'PrintMe');
      }
    });
    this.selectAllChange.emit(this.CheckAll);
  }

  onCheckboxChange(event: Event, id: number) {
    const checkbox = event.target as HTMLInputElement;
    const tablerow = checkbox.parentElement?.parentElement?.parentElement;
    if (checkbox.checked) {
      this.renderer.addClass(tablerow, 'PrintMe');
    } else {
      this.renderer.removeClass(tablerow, 'PrintMe');
    }
    this.checkboxChange.emit({ id: id, checked: checkbox.checked });
  }

  onActiveToggleChange(event: any, id: number) {
    this.activeToggleChange.emit({ id: id, checked: event.checked });
  }
  onRowClick(event: Event, id: number) {
    this.onrowClick.emit(id);
  }
  onSortChange(event: Event, Sortby: string) {
    if (this.GridEditMode) {
      return;
    }
    if (Sortby == this.Sortby) {
      if (this.Sortdirection == "asc") {
        this.Sortdirection = "desc";
      } else {
        this.Sortdirection = "asc";
      }
    } else {
      this.Sortby = Sortby;
      this.Sortdirection = "desc";
    }
    this.onsortChange.emit({ Title: this.Sortby, Sort: this.Sortdirection });
  }

  selectPage(page: number) {
    this.CurrentPage = page;
    this.onPageChange.emit(this.CurrentPage);
  }

  selectPrePage() {
    this.CurrentPage = this.CurrentPage - 1;
    this.onPageChange.emit(this.CurrentPage);
  }
  selectNextPage() {

    this.CurrentPage = this.CurrentPage + 1;
    this.onPageChange.emit(this.CurrentPage);
  }

  handlePageSizeChange(pageSize: string) {
    this.onPageSizeChange.emit(pageSize);
  }

  onTextInputChange(event: Event, id: number, field: string) {
    const input = event.target as HTMLInputElement;
    this.onEditInputChange.emit({ value: input.value, id: id, field: field });
  }

  checkerror(id: number, field: string) : boolean {
    var exisits = false;
    if (this.GridEditErros.length == 0) {
      return false;
    }
   this.GridEditErros.map((item: any): any => {
      if (item.id == id && item.field === field) {
        exisits = true;
      }
    });
    return exisits;
  
  }
  getlocaldate(date: string) {
    return this.ClsGlobal.formatWithUtcOffsetString(date, 'dd/MM/yyyy HH:mm:ss', new DatePipe('en-US'));
  }
}

