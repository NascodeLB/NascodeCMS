import { Component, EventEmitter, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  Showbar: boolean = false;
  @Output() onTextChange = new EventEmitter<string>();
 
  ShowSearchBar() {
    this.Showbar = true;
  }
  CloseSearchBar() {
    this.Showbar = false;
    this.onTextChange.emit("");
  }
  HandleTextChange(event: Event) {
    const textbox = event.target as HTMLInputElement;
    this.onTextChange.emit(textbox.value);
  }

 
}
