export class LogAudit {
  id: number | null;
  userID: string | null;
  recID: number | null;
  recType: string | null;
  operationType: string | null;
  info: string | null;
  logDate: Date | null;
  ipaddress: string | null;
  machineName: string | null;
  checked: number | null;

  constructor(data?: any) {  // data is now optional
    this.id = data?.id || null;
    this.userID = data?.userId || null;
    this.recID = data?.recId || null;
    this.operationType = data?.operationType || null;
    this.info = data?.info || null;
    this.ipaddress = data?.ipaddress || null;
    this.machineName = data?.machineName || null;
    this.recType = data?.recType || null;
    this.logDate = data?.logDate ? new Date(data.logDate) : null;
    this.checked = data?.checked || 0;
 
  }
   
}
