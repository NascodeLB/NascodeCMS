export class LogFrontendDto {
  id: number | null;
  message: string | null;
  url: string | null;
  date: Date | null;
  checked: number | null;

  constructor(data?: any) {  // data is now optional
    this.id = data?.id || null;
    this.message = data?.message || null;
    this.url = data?.url || null;
    this.date = data?.deletionDate ? new Date(data.deletionDate) : null;
    this.checked = data?.checked || 0;
 
  }
   
}
