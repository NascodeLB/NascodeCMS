import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-language-button',
  templateUrl: './language-button.component.html',
  styleUrl: './language-button.component.css'
})
export class LanguageButtonComponent {
  @Input() Title!: String;
  @Input() SelectLangaugeId!: number ;
  @Output() onLanguageChange = new EventEmitter<number>();


  Languages: { id: number; title: string, code: string }[] = [
    { id: 1, title: 'English', code: 'EN'  },
    { id: 3, title: 'Arabic', code: 'AR' }
  ]

  ShowList: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    
    //this.Languages.map(item => {
    //  if (item.id == this.SelectLangaugeId) {
    //    this.Title = item.code;
    //  }
    //});
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['SelectLangaugeId']) {
     
        this.Languages.map(item => {
          if (item.id == this.SelectLangaugeId) {
            this.Title = item.code;
          }
        });
      
    }

  }
 
  changeSelectedLanguage(LanguageId: number, CodeId: string) {
    this.SelectLangaugeId = LanguageId;
    this.Title = CodeId;
    this.ShowList = false;
    this.onLanguageChange.emit(LanguageId);
  }
  changeShowListStatus() {
    this.ShowList = !this.ShowList;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Check if the clicked element is not inside the div
    if (!this.el.nativeElement.contains(event.target)) {
      // Change the state or perform any other action
      this.ShowList = false;
      
    }
  }
}
