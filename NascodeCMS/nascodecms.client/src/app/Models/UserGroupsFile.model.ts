export class UserGroupsFile {
  id: number;
  groupID: number ;
  fileName: string ;
  name: string ;
  addOpr: number ;
  editOpr: number ;
  deleteOpr: number ;
  viewOpr: number ;
  printOpr: number ;
  cloneOpr: number ;
  exportOpr: number;
  creationDate: Date | null;
  createdBy: number | null;
 

  constructor(data?: any) {
    this.id = data?.id;
    this.groupID = data?.groupID || 0 ;
    this.fileName = data?.fileName ;
    this.name = data?.name;
    this.addOpr = data?.addOpr || 0;
    this.editOpr = data?.editOpr || 0;
    this.deleteOpr = data?.deleteOpr || 0;
    this.viewOpr = data?.viewOpr || 0;
    this.printOpr = data?.printOpr || 0;
    this.cloneOpr = data?.cloneOpr || 0;
    this.exportOpr = data?.exportOpr || 0;
    this.creationDate = data?.creationDate ? new Date(data.creationDate) : null;
    this.createdBy = data?.createdBy || null;

  }
}
