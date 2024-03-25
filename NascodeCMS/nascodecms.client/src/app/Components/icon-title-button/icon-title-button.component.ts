import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-title-button',
  templateUrl: './icon-title-button.component.html',
  styleUrl: './icon-title-button.component.css'
})
export class IconTitleButtonComponent {
  @Input() IconSource!: String;
  @Input() Title!: String;
  @Input() BackgroundColor!: String;
  @Input() TextColor!: String;
}
