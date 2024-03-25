export class GlobalStaticKeywordsCategoriesDto {
  id: number;
  parent: number;
  title: string;
  menuTitle: string;
  active: number;
 

  constructor(data: any) {
    this.id = data.id;
    this.parent = data.parent;
    this.title = data.title;
    this.menuTitle = data.menuTitle;
    this.active = data.active;
   
  }
}
