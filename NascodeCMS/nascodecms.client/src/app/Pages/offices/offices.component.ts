import { Component, OnInit, ViewChild } from '@angular/core';
import { Office } from '../../Models/Office.model';
import { CKEditorComponent } from 'ng2-ckeditor';

@Component({
  selector: 'app-offices',
  templateUrl: './offices.component.html',
  styleUrl: './offices.component.css'
})
export class OfficesComponent implements OnInit  {
  name = 'ng2-ckeditor';
  ckeConfig: CKEDITOR.config = {
   
  };;
  mycontent: string = "<p>My html content</p>";
  log: string = '';
  @ViewChild("myckeditor") ckeditor!: CKEditorComponent;

  onChange($event: any): void {
    
  }

  onPaste($event: any): void {
   
    //this.log += new Date() + "<br />";
  }

  MultiSelectItems: { value: string, title: string }[] = [
    { value: '1', title: 'test 1' },
    { value: '2', title: 'test 2' },
    { value: '3', title: 'test 3' },
    { value: '4', title: 'test 4' },
    { value: '5', title: 'test 5' },
    { value: '6', title: 'test 6' },
    { value: '7', title: 'test 7' },
    { value: '8', title: 'test 8' },
    { value: '9', title: 'test 9' },
    { value: '10', title: 'test 10' },
    { value: '11', title: 'test 11' },
  ];

  Headers: { Title: string; Type: string, Code: string }[] = [
    { Title: 'Thumbnail', Type: 'picture' , Code: 'Thumbnail' },
    { Title: 'Category', Type: 'text', Code: 'Category' },
    { Title: 'Title', Type: 'text', Code: 'Title' },
    { Title: 'Active', Type: 'toggle', Code: 'Active' },
    { Title: 'Last modified', Type: 'text', Code: 'Last_modified' },
    { Title: 'Modified by', Type: 'text', Code: 'Modified_by' },
  ];

  Data: Office[] = [
    {
      Id: 1,
      Thumbnail: '../../../assets/images/thumbnailImage.png',
      Category: 'Title lorem ipsum',
      Title: 'Title lorem ipsum',
      Active: false,
      Last_modified: '03/04/2023',
      Modified_by: 'Administrator'
    },
    {
      Id: 2,
      Thumbnail: '../../../assets/images/thumbnailImage.png',
      Category: 'Title lorem ipsum',
      Title: 'Title lorem ipsum',
      Active: false,
      Last_modified: '03/04/2023',
      Modified_by: 'Administrator'
    },
    {
      Id: 3,
      Thumbnail: '../../../assets/images/thumbnailImage.png',
      Category: 'Title lorem ipsum',
      Title: 'Title lorem ipsum',
      Active: false,
      Last_modified: '03/04/2023',
      Modified_by: 'Administrator'
    },
    {
      Id: 4,
      Thumbnail: '../../../assets/images/thumbnailImage.png',
      Category: 'Title lorem ipsum',
      Title: 'Title lorem ipsum',
      Active: true,
      Last_modified: '03/04/2023',
      Modified_by: 'Administrator'
    }

  ];

  Pages: number[] = [1, 2, 3, 4, 5];
  ViewMode: string = "Details";
  TypesDropdownData: { Value: string, Title: string }[] = [
    { Value: "0", Title: "Select Value" },
    { Value: "1", Title: "Select Value 1" },
    { Value: "2", Title: "Select Value 2" },
      { Value: "2", Title: "Select Value 3" }
  ];

  UploadedFiles: string[] = [
    '2024-02-01-12-36-10-7046.png',
    '2024-02-01-12-34-52-9258.png'
  ];

  ngOnInit() {
  }

  onCLickbutton() {
    alert();
  }

  handleCheckboxChange(event: { id: number, checked: boolean }) {
    const { id, checked } = event;
    alert(id + "" + checked + " checkbox");
  }
  handleactiveToggleChange(event: { id: number, checked: boolean }) {
    const { id, checked } = event;
    alert(id + "" + checked + " toggle");
  }
  handleRowCLick(id: number) {
    this.ViewMode = "Details";
  }

  handleSortClick(event: { Title: string, Sort: string }) {
    const { Title, Sort } = event;
    alert(Title + " " + Sort);
  }

  handleSelectAll(checked: boolean) {
    alert(checked);
  }
  handlepageChange(page: number) {
    alert(page);
  }

  goback() {
    this.ViewMode = "Items";
  }

  handleLanguageChange(languageId: number) {
    alert(languageId);
  }

  HandleSearchTextChange(searchText: string) {
    console.log(searchText);
  }

  handleOnSelectChange(value: string) {
    alert(value);
  }

  handlePageSizeChange(value: string) {
    alert(value);
  }

  handleOnMultiSelectChange(selectItems: Object) {
    console.log(selectItems);
  }

  handleonFilesChange(files: string[]) {
    console.log(files);
  }
}
