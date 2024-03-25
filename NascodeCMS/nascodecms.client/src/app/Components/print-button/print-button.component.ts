import { Component } from '@angular/core';

@Component({
  selector: 'app-print-button',
  templateUrl: './print-button.component.html',
  styleUrl: './print-button.component.css'
})

export class PrintButtonComponent {

  print(): void {
    const head = document.getElementsByTagName('head')[0];
    const el = document.getElementsByClassName("DivToPrint")[0];


    const iframe = document.createElement('iframe');
   /* iframe.style.display = 'none';*/
    document.body.appendChild(iframe);
    // Check if the contentDocument is not null
    const printDocument = iframe.contentWindow?.document;
    if (printDocument) {
      printDocument.open();
      printDocument.write('<html><head>' + head.innerHTML + '</head><body>');
      printDocument.write(el.innerHTML);
      printDocument.write('</body></html>');
      printDocument.close();

      // Call print on the iframe's window
    
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 600);

      //// Remove iframe after a delay to ensure print dialog appears
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 600);
    } else {
      console.error('Unable to access iframe document');
    }
   
   
  }
}



