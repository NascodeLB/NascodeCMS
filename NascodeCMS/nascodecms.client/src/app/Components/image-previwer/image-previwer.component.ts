import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-previwer',
  templateUrl: './image-previwer.component.html',
  styleUrl: './image-previwer.component.css',
  animations: [
    trigger('fadeInOut', [
      state('show', style({
        opacity: 1,
        display: "flex"
      })),
      state('hide', style({
        opacity: 0,
        display: "none"
      })),
      transition('show => hide', animate('0.3s ease-in')),
      transition('hide => show', animate('0.5s ease-out'))
    ])
  ]
})
export class ImagePreviwerComponent {
  @Input() Show: boolean = false;
  @Input() Title: string = "";
  @Input() ImageSrc: string = "";
  @Output() onShowChange = new EventEmitter<boolean>();

  Close() {
    this.Show = false;
    this.onShowChange.emit(false);
  }
}
