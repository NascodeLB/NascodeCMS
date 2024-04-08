import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  validateField(form: FormGroup, fieldName: string): boolean {
    const isFieldEmpty = (form.get(fieldName)?.value || '').trim() === '';
    return isFieldEmpty;
  }
  clearField(form: FormGroup, fieldName: string): void {
    form.get(fieldName)?.setValue('');
  }
  isFieldEmpty(model: any, fieldName: string): boolean {
    return !model[fieldName];
  }
  isValidEmailField(model: any, fieldName: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(model[fieldName]);
  }
  isNumericField(model: any, fieldName: string): boolean {
    const value = model[fieldName];
    return !isNaN(value) && isFinite(value);
  }
  isValidDateField(model: any, fieldName: string): boolean {
    const timestamp = Date.parse(model[fieldName]);
    return !isNaN(timestamp);
  }

  formatWithUtcOffsetString(date: Date | string, format: string, datePipe: DatePipe): string {
  if (!date) return 'Not Set'; // Early return if date is null or invalid

  const inputDate = new Date(date);

  // Retrieve the saved UTC offset as a string, e.g., "-3" and convert it to number
  const savedOffset = parseInt(localStorage.getItem("utcOffset") || "0", 10);

  // Calculate the offset in milliseconds. Note: The sign is reversed because a positive offset means the local time is ahead of UTC, which requires subtracting the offset
  const offsetMilliseconds = savedOffset * 60 * 60 * 1000;

  // Adjust the UTC date by the offset to get the correct local time
  const adjustedDate = new Date(inputDate.getTime() + offsetMilliseconds);

  // Format and return the adjusted date
  return datePipe.transform(adjustedDate, format) ?? 'Not Set';
}

}
