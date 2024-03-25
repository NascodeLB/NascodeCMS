import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { PopupService } from '../../Services/popup.service'; // Adjust the import path as necessary

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PopupMessageComponent implements OnInit {
  // Removed @Input() and @Output() properties as they are no longer directly used
  show: boolean = false; // Use local show property to control visibility
  title: string = "";
  desc: string = "";
  buttonTitle: string = "";
  type: string = "";
  icon: string = "";
  backgroundColor: string = "";
  onConfirm?: () => void;
  onCancel?: () => void;
  constructor(private popupService: PopupService) { }

  ngOnInit() {
    this.popupService.message$.subscribe(message => {
      if (message) {
        // Update component properties based on the message
        this.type = message.type;
        this.title = message.title;
        this.desc = message.desc;
        this.buttonTitle = message.buttonTitle;
        this.onConfirm = message.onConfirm;
        this.onCancel = message.onCancel;
        this.show = true; // Show the popup
        this.updateStyleBasedOnType();
      } else {
        this.show = false; // Hide the popup
      }
    });
  }

  close() {
    this.popupService.hideMessage(); // Hide the popup using the service
  }

  confirmAction() {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this.close(); // Close the popup after action
  }

  cancelAction() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.close(); // Close the popup after action
  }

  private updateStyleBasedOnType() {
    if (this.type == "Error") {
      this.backgroundColor = "#CE2F66";
      this.icon = "ic_error";
    } else if (this.type == "Success") {
      this.backgroundColor = "#1DD6C4";
      this.icon = "ic_success";
    }
    // Add more conditions as necessary based on your application's needs
  }

  convertLineBreaks(text: string): string {
    return text.replace(/\n/g, '<br/>');
  }
}
