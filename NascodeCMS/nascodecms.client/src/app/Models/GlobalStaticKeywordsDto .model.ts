export class GlobalStaticKeywordsDto {
  id: number;
  language: number;
  categoryID: number;
  sectionName: string;
  title: string;
  code: string;
  value: string | null;
  type: string;
  maxLength: number;
  priority: number;
  creationDate: Date | null;
  createdBy: string | null;
  createdByName: string | null;
  modificationDate: Date | null;
  lastModificationDate: Date | null;
  modifiedBy: string | null;
  modifiedByName: string | null;
  fielderror: boolean | null;

  constructor(data: any) {
    this.id = data.id;
    this.language = data.language;
    this.categoryID = data.categoryID;
    this.sectionName = data.sectionName;
    this.title = data.title;
    this.code = data.code;
    this.value = data.value ?? null;
    this.type = data.type;
    this.maxLength = data.maxLength;
    this.priority = data.priority;
    this.creationDate = data.creationDate ? new Date(data.creationDate) : null;
    this.createdBy = data.createdBy ?? null;
    this.createdByName = data.createdByName ?? null;
    this.modificationDate = data.modificationDate ? new Date(data.modificationDate) : null;
    this.lastModificationDate = data.lastModificationDate ? new Date(data.lastModificationDate) : null;
    this.modifiedBy = data.modifiedBy ?? null;
    this.modifiedByName = data.modifiedByName ?? null;
    this.fielderror = data.fielderror ?? null;
  }
}
