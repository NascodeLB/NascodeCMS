import { UserGroupsFile } from "./UserGroupsFile.model";

export class UserGroup {
  id: number | null;
  name: string | null;
  isSuperAdmin: number ;
  creationDate: Date | null;
  createdBy: string | null;
  createdByName: string | null;
  modificationDate: Date | null;
  modifiedBy: string | null;
  lastModificationDate: string | null;
  modifiedByName: string | null;
  deleted: boolean | null;
  deletedBy: string | null;
  deletionDate: Date | null;
  checked: number | null;

  constructor(data?: any) {
    this.id = data?.id || null;
    this.name = data?.name || null;
    this.isSuperAdmin = data?.isSuperAdmin || 0;
    this.creationDate = data?.creationDate ? new Date(data.creationDate) : null;
    this.createdBy = data?.createdBy || null;
    this.createdByName = data?.createdByName || null;
    this.modificationDate = data?.modificationDate ? new Date(data.modificationDate) : null;
    this.modifiedBy = data?.modifiedBy || null;
    this.lastModificationDate = data?.lastModificationDate || null;
    this.modifiedByName = data?.modifiedByName || null;
    this.deleted = data?.deleted ?? null;
    this.deletedBy = data?.deletedBy || null;
    this.deletionDate = data?.deletionDate ? new Date(data.deletionDate) : null;
    this.checked = data?.checked || 0;

  }
}
