export class UserDto {
  id: number | null;
  groupID: number | null;
  groupName: string | null;
  fullName: string | null;
  userID: string | null;
  password: string;
  confirmpassword: string | null;
  active: number | null;
  mobile: string | null;
  email: string | null;
  backendThumbnail: string | null;
  resetCode: string | null;
  resetCodeExpiryDate: Date | null;
  recType: string | null;
  recID: number | null;
  timezoneID: number | null;
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
    this.groupID = data?.groupID ?? null;
    this.fullName = data?.fullName ?? null;
    this.userID = data?.userID ?? null;
    this.password = data?.password ?? "";
    this.confirmpassword = data?.password ?? null;
    this.active = data?.active ?? 0;
    this.mobile = data?.mobile ?? null;
    this.email = data?.email ?? null;
    this.backendThumbnail = data?.backendThumbnail ?? null;
    this.resetCode = data?.resetCode ?? null;
    this.resetCodeExpiryDate = data?.resetCodeExpiryDate ? new Date(data.resetCodeExpiryDate) : null;
    this.recType = data?.recType ?? null;
    this.recID = data?.recID ?? null;
    this.timezoneID = data?.timezoneID ?? null;
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
    this.groupName = data?.groupName ?? null;
  }
}
