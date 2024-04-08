export class TimezonesDto {
  id: number | null;
  title: string | null;
  utcOffset: string | null;
  code: number | null;
  creationDate: Date | null;
  createdBy: number | null;
  modificationDate: Date | null;
  modifiedBy: number | null;
  createdByName: string | null;
  lastModificationDate: Date | null;
  modifiedByName: string | null;
  checked: number | null;

  constructor(data?: any) {  // data is now optional
    this.id = data?.id || null;
    this.title = data?.title || null;
    this.utcOffset = data?.utcOffset || null;
    this.code = data?.code || null;
    this.checked = data?.checked || 0;
    this.creationDate = data?.creationDate ? new Date(data.creationDate) : null;
    this.createdBy = data?.createdBy ?? null;
    this.createdByName = data?.createdByName || null;
    this.modificationDate = data?.modificationDate ? new Date(data.modificationDate) : null;
    this.lastModificationDate = data?.LastModificationDate ? new Date(data.LastModificationDate) : null;
    this.modifiedBy = data?.modifiedBy ?? null;
    this.modifiedByName = data?.modifiedByName || null;
  }
   
}
