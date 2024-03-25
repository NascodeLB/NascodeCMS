import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-multi-select-drop-down',
  templateUrl: './multi-select-drop-down.component.html',
  styleUrl: './multi-select-drop-down.component.css'
})
export class MultiSelectDropDownComponent {
  @Input() Items: { value: string, title: string }[] = [];
  @Input() Error: boolean = false;
  @Input() Title: string = "";
  @Input() SelectedItems: { value: string, title: string }[] = [];
  @Output() onSelectItemsChange = new EventEmitter<Object>();


  
  SearchResultsItems: { value: string, title: string }[] = [];
  ShowList: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) { }


  AddItem(value: string, title: string) {
    if (this.SelectedItems.findIndex(item => item.value === value && item.title === title) == -1) {
      this.SelectedItems.push({value, title});
      this.onSelectItemsChange.emit(this.SelectedItems);
    }
  }


  RemoveSelectedItem(value: string) {
    const newItems = this.SelectedItems.filter(item => item.value !== value);
    this.SelectedItems = newItems;
    this.onSelectItemsChange.emit(this.SelectedItems);
  }

  handleSearch(event: Event) {
    const textbox = event.target as HTMLInputElement;
    const txtSearch = textbox.value;
    if (txtSearch != "") {
      this.SearchResultsItems = this.Items.filter(item => item.title.toLowerCase().startsWith(txtSearch.toLowerCase()));
    } else {
      this.SearchResultsItems = [];
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Check if the clicked element is not inside the div
    if (!this.el.nativeElement.contains(event.target)) {
      // Change the state or perform any other action
      this.ShowList = false;
      this.SearchResultsItems = [];
    }
  }
}
