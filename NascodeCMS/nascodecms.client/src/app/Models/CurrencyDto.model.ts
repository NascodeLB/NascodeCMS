export class CurrencyDto {
  id: number | null;
  name: string | null;
  code: string | null;
  symbol: string | null;
  creationDate: Date | null;
  createdBy: number | null;
  createdByName: string | null;
  modificationDate: Date | null;
  lastModificationDate: Date | null;
  modifiedBy: number | null;
  modifiedByName: string | null;
  deleted: boolean | null;
  deletedBy: number | null;
  deletionDate: Date | null;

  constructor(data?: any) {  // Make the data parameter optional
    this.id = data?.ID || null;
    this.name = data?.Name || null;
    this.code = data?.Code || null;
    this.symbol = data?.Symbol || null;
    this.creationDate = data?.CreationDate ? new Date(data.CreationDate) : null;
    this.createdBy = data?.CreatedBy || null;
    this.createdByName = data?.CreatedByName || null;
    this.modificationDate = data?.ModificationDate ? new Date(data.ModificationDate) : null;
    this.lastModificationDate = data?.LastModificationDate ? new Date(data.LastModificationDate) : null;
    this.modifiedBy = data?.ModifiedBy || null;
    this.modifiedByName = data?.ModifiedByName || null;
    this.deleted = data?.Deleted ? !!data.Deleted : null;  // Convert to boolean or null
    this.deletedBy = data?.DeletedBy || null;
    this.deletionDate = data?.DeletionDate ? new Date(data.DeletionDate) : null;
  }

}
