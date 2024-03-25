import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { NgxCroppedEvent, NgxPhotoEditorService } from "ngx-photo-editor";
import { PicDimensionApiService, FileParameter } from '../../Services/picDimensionApi.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { forEach } from 'lodash';
import { AppConsts } from '../../shared/AppConsts';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.css'
})
export class ImageEditorComponent {
  output?: NgxCroppedEvent;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() SectionName: string = "";
  @Input() TagName: string = "";
  @Input() Path: string = "";
  @Input() UploadedFiles: string[]=[];
  @Input() MaxImagesCount: number = 1;
  @Output() onFilesChange = new EventEmitter<string[]>();
  @Input() disabled: boolean = false;


  base64: any;
  myFiles: any[] = [];
  myFile: any = {};
  width: number = 100;
  height: number = 100;
  folderPath: string = "";
  aspect_ratio: any | undefined;
  imagepath: any;
  imageResize !: string;
  imageLabel !: string;
  showLoader !: boolean;
  imgquality !: number;
  croppedImage: any = '';
  formatTypes: string = "png";
  baseUrl: string = "";



  PreviewImgSrc: string = "";
  PreviewImageTitle: string = "";
  PreviewShow: boolean = false;

  constructor(private service: NgxPhotoEditorService,
    private renderer2: Renderer2,
    private api: PicDimensionApiService
    ) { }

  ngOnInit() {
    this.getPic();
  }

  fileChangeHandler($event: any) {
    if (this.UploadedFiles.length < this.MaxImagesCount) {
      this.service.open($event, {
        aspectRatio: this.aspect_ratio,
        autoCropArea: 1,
        resizeToWidth: this.width.toString(),
        resizeToHeight: this.height.toString(),
        imageQuality: this.imgquality,
        format: "png"
      }).subscribe(data => {
        this.output = data;
        this.uploadPic(data);
      });
    }
   
  }
  uploadPic(event: any) {
    this.base64 = event.base64;
    this.imagepath = event.base64;
    
    this.myFile.data = event.file;
    this.myFile.fileName = event.file?.name;
    this.myFile.folderPath = this.folderPath;
    this.myFiles.push(this.myFile);
   
    this.api.uploadFile(this.myFiles, this.folderPath)
      .pipe(finalize(() => {
      }))
      .subscribe((result) => {
       
        if (result) {
          for (let item of result) {
            this.UploadedFiles.push(item);
            this.myFiles = [];
          }
          this.onFilesChange.emit(this.UploadedFiles);
        }
        
      });
  }
  getPic() {
    this.api.getPicDimension(this.SectionName, this.TagName)
      .pipe(finalize(() => {
      }))
      .subscribe((result: any) => {
        if (result) {
          this.width = result.width;
          this.height = result.height;
          this.folderPath = result.folderPath || this.Path;
          this.aspect_ratio = (result.width / result.height).toFixed(2);
          this.imageLabel = "Images size W: " + this.width + "px, H: " + this.height + "px (up to 5mb)";
          this.baseUrl = AppConsts.RemoteServiceURL + this.folderPath.replace("_", "/") + "/";
        }
      });


  }

  deleteItem(name: string) {
    this.UploadedFiles = this.UploadedFiles.filter(item => item !== name );
    this.onFilesChange.emit(this.UploadedFiles);
  }

  PreviewImage(ImageSrc: string, ImageTitle: string) {
   
    this.PreviewImgSrc = ImageSrc;
    this.PreviewImageTitle = ImageTitle;
    this.PreviewShow = true;

  }
  triggerFileInputClick() {
    // Trigger a click event on the hidden file input
    this.renderer2.selectRootElement(this.fileInput.nativeElement).click();
  }
}
