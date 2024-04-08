export class CountryDto {
  id: number | null;
  language: number | null;
  title: string | null;
  countryCode: string | null;
  active: number | null;
  languageName: string | null;
  creationDate: Date | null;
  createdBy: number | null;
  modificationDate: Date | null;
  modifiedBy: number | null;
  deleted: number | null;
  deletedBy: number | null;
  deletionDate: Date | null;
  checked: number | null;
  createdByName: string | null;
  lastModificationDate: Date | null;
  modifiedByName: string | null;
 
  constructor(data?: any) {
    this.id = data?.id ?? null;
    this.language = data?.language ?? null;
    this.title = data?.title ?? null;
    this.active = data?.active ?? 0;
    this.countryCode = data?.countryCode ?? null;
    this.languageName = data?.languageName ?? "";
    this.creationDate = data?.creationDate ? new Date(data.creationDate) : null;
    this.createdBy = data?.createdBy ?? null;
    this.createdByName = data?.createdByName || null;
    this.modificationDate = data?.modificationDate ? new Date(data.modificationDate) : null;
    this.lastModificationDate = data?.LastModificationDate ? new Date(data.LastModificationDate) : null;
    this.modifiedBy = data?.modifiedBy ?? null;
    this.modifiedByName = data?.modifiedByName || null;
    this.deleted = data?.deleted ?? null;
    this.deletedBy = data?.deletedBy ?? null;
    this.deletionDate = data?.deletionDate ? new Date(data.deletionDate) : null;
    this.checked = data?.checked || 0;
  }
}
