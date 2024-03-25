export class PicDimensionDto {
  section!: string | undefined;
  imgTag!: string | undefined;
  width!: number;
  height!: number;
  maxSize!: number | undefined;
  folderPath !: string | undefined;
  maxWidth!: number | undefined;
  minWidth!: number | undefined;
  maxHeight!: number | undefined;
  minHeight!: number | undefined;
  modificationDate!: Date | undefined;
  modifiedBy!: number | undefined;
  creationDate!: Date | undefined;
  createdBy!: number | undefined;

  constructor(data?: any) {  // data is now optional
    for (var property in data) {
      if (data.hasOwnProperty(property))
        (<any>this)[property] = (<any>data)[property];
    }
  }

}
