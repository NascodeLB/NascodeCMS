export class EmailsbookDto {
  id: number | null;
  language: number | null;
  languageName: string | null;
  code: number | null;
  subject: string | null;
  body: string | null;
  creationDate: Date | null;
  createdBy: string | null;
  createdByName: string | null;
  modificationDate: Date | null;
  lastModificationDate: Date | null;
  modifiedBy: string | null;
  modifiedByName: string | null;
  deleted: boolean | null;
  deletedBy: string | null;
  deletionDate: Date | null;
  checked: number | null;

  constructor(data?: any) {  // data is now optional
    this.id = data?.id || null;
    this.language = data?.language || null;
    this.languageName = data?.languageName || null;
    this.code = data?.code || null;
    this.subject = data?.subject || null;
    this.body = data?.body || null;
    this.creationDate = data?.creationDate ? new Date(data.creationDate) : null;
    this.createdBy = data?.createdBy || null;
    this.createdByName = data?.createdByName || null;
    this.modificationDate = data?.modificationDate ? new Date(data.modificationDate) : null;
    this.lastModificationDate = data?.lastModificationDate ? new Date(data.lastModificationDate) : null;
    this.modifiedBy = data?.modifiedBy || null;
    this.modifiedByName = data?.modifiedByName || null;
    this.deleted = data?.deleted || null;
    this.deletedBy = data?.deletedBy || null;
    this.deletionDate = data?.deletionDate ? new Date(data.deletionDate) : null;
    this.checked = data?.checked || 0;
 
  }
   
}
