import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent {
  @Input() selectedDate: string = ""
  @Input() MaxDate: string = ""
  @Output() onDateChange = new EventEmitter<string>();

  minDate = new Date(1900, 0, 1);
  maxDate = new Date();
  Date: FormControl = new FormControl;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    if (this.MaxDate != '') this.maxDate = this.getDate(this.MaxDate);
    if (this.selectedDate != "") this.Date.setValue(this.getDate(this.selectedDate));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
       const currentValue = changes['selectedDate'].currentValue;
      if (currentValue == "") {
        this.Date.setValue("");
      }
    }
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    const date: string = this.datePipe.transform(event.value, 'dd-MM-yyyy') ?? "";
    this.onDateChange.emit(date);
   
  }

  getDate(date: string) : Date {
    const dateParts = date.split('-');
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[0], 10);
    return new Date(year, month, day)
  }
}
