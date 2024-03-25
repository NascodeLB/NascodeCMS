import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface PopupMessage {
  title: string;
  desc: string;
  buttonTitle: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type: any; // Adjust the type according to your MessageType enum or class
}

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private messageSource = new BehaviorSubject<PopupMessage | null>(null);
  public message$ = this.messageSource.asObservable();

  constructor() { }

  showMessage(message: PopupMessage) {
    this.messageSource.next(message);
  }

  hideMessage() {
    this.messageSource.next(null);
  }
}
