export class ContactDto {
  id: number | null;
  preferedLanguage: number | null;
  languageName: string | null;
  fullName: string | null;
  email: string | null;
  mobile: string | null;
  companyName: string | null;
  message: string | null;
  date: Date | null;
  checked: number | null;

  constructor(data?: any) {  // data is now optional
    this.id = data?.id || null;
    this.preferedLanguage = data?.preferedLanguage || null;
    this.languageName = data?.languageName || null;
    this.fullName = data?.fullName || null;
    this.email = data?.email || null;
    this.mobile = data?.mobile || null;
    this.companyName = data?.companyName || null;
    this.message = data?.message || null;
    this.date = data?.date ? new Date(data.date) : null;
    this.checked = data?.checked || 0;
 
  }
   
}
