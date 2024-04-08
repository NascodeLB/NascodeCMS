export class DropdownDto {
  value: number | null;
  title: string;
  

  constructor(data?: any) {  // data is now optional
    this.value = data?.id || null;
    this.title = data?.title || "";
  }
   
}
