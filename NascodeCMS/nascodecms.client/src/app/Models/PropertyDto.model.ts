export class PropertyDto {
  code: string ;
  value: string | null;
  description: string | null;


  constructor(data?: any) {  // Make the data parameter optional
   
    this.value = data?.value || null;
    this.code = data?.Code;
    this.description = data?.Symbol || null;

  }

}
