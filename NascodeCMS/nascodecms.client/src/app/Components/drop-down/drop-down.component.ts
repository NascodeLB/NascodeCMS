import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css'
})
export class DropDownComponent {
  @Input() Title: string = "";
  @Input() Data: { Value: string, Title: string }[] = [];
  @Input() Error: boolean = false;
  @Input() Disable: boolean = false;
  @Input() selectedValue: string = "";
  @Input() TextValue: string = "";
  @Output() onSelectChange = new EventEmitter<string>();

  ngOnInit() {
    if (this.Data.length > 0) {
      this.selectedValue = this.Data[0].Value;
      this.TextValue = this.Data[0].Title;
    }
  }
  ngOnChanges() {
    const selectedItem = this.Data.find(item => item.Value === this.selectedValue);
    this.TextValue = selectedItem ? selectedItem.Title : '';
  }
  SelectChange(event: Event) {
    const selectedItem = this.Data.find(item => item.Value === this.selectedValue);
    this.TextValue = selectedItem ? selectedItem.Title : '';
    const dropdown = event.target as HTMLInputElement; 
    this.onSelectChange.emit(dropdown.value);
  }
}
