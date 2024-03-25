export class DynamicContentDto {
  id: number | null;
  language: number | null;
  categoryID: number | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  picture: string | null;
  active: number | null;
  priority: number | null;
  deleted: number | null;
  deletedDate: Date | null;
  deletedBy: string | null;
  creationDate: Date | null;
  createdBy: string | null;
  createdByName: string | null;
  modificationDate: Date | null;
  lastModificationDate: Date | null;
  modifiedBy: string | null;
  modifiedByName: string | null;
  checked: number | null;

  constructor(data?: any) {
    this.id = data?.id || null;
    this.language = data?.language || null;
    this.categoryID = data?.categoryID || null;
    this.title = data?.title || null;
    this.subtitle = data?.subtitle || null;
    this.description = data?.description || null;
    this.buttonText = data?.buttonText || null;
    this.buttonLink = data?.buttonLink || null;
    this.picture = data?.picture || null;
    this.active = data?.active || 0;
    this.priority = data?.priority || 10;
    this.deleted = data?.deleted || 0;
    this.deletedDate = data?.deletedDate ? new Date(data.deletedDate) : null;
    this.deletedBy = data?.deletedBy || null;
    this.creationDate = data?.creationDate ? new Date(data.creationDate) : null;
    this.createdBy = data?.createdBy || null;
    this.createdByName = data?.createdByName || null;
    this.modificationDate = data?.modificationDate ? new Date(data.modificationDate) : null;
    this.lastModificationDate = data?.lastModificationDate ? new Date(data.lastModificationDate) : null;
    this.modifiedBy = data?.modifiedBy || null;
    this.modifiedByName = data?.modifiedByName || null;
    this.checked = data?.checked || 0;
  }
}
