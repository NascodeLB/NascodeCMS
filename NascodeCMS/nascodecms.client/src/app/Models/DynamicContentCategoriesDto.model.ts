export class DynamicContentCategoriesDto {
  id: number | null;
  title: string ;
  programingCode: string ;
  active: number ;
  creationDate: Date | null;
  createdBy: string | null;
  modificationDate: Date | null;
  modifiedBy: string | null;

  constructor(data?: any) {
    this.id = data?.id || null;
    this.title = data?.title ;
    this.programingCode = data?.programingCode ;
    this.active = data?.active ;
    this.creationDate = data?.creationDate ? new Date(data.creationDate) : null;
    this.createdBy = data?.createdBy || null;
    this.modificationDate = data?.modificationDate ? new Date(data.modificationDate) : null;
    this.modifiedBy = data?.modifiedBy || null;
  }
}
