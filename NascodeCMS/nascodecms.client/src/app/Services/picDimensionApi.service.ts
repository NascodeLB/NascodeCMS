
import { AppConsts } from '../shared/AppConsts';
import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf, throwError } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import { PicDimensionDto } from '../Models/PicDimensionDto.model';

@Injectable({
  providedIn: 'root'
})

export class PicDimensionApiService {

  private http: HttpClient;
  private baseUrl: string = AppConsts.RemoteServiceURL;
  private token = localStorage.getItem('token');
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(@Inject(HttpClient) http: HttpClient, private messageService: MessageService) {
    this.http = http;
  }


  getPicDimension(section: string | undefined, imgTag: string | undefined): Observable<PicDimensionDto> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Assuming you're using a Bearer token
    });
    return this.http.get<{ value: PicDimensionDto }>(`${this.baseUrl}api/PicDimension/${section}/${imgTag}`, {
      headers: headers
    }).pipe(
      tap(response => { // this used to debug the response
        const data = response.value;
      }),
      map(response => response.value),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(() => new Error('Error in getPicDimension: ' + error));
      })
    );
  }

  private handleHttpError(error: any): void {
    let errorMessage = 'An error occurred: ' + (error.message || 'unknown error');
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
  }



  uploadImage(uploadedFile: FileParameter[], SectionName: string | undefined): Observable<string> {
    let url_ = this.baseUrl + "api/UploadImage/";
    // if(section==ImportSectionEnum.Leads){
    //     url_=url_+ "UploadLeadsExcel";
    // }
    // if(section==ImportSectionEnum.AgenciesSystemUsers){
    //     url_=url_+ "UploadAgenciesSystemUsersExcel";
    // }

    const content_ = new FormData();
    var folderpath_;
    for (let file of uploadedFile) {
      //console.log((file.fileName));
      content_.append("uploadedFile", file.data, file.fileName !== '' ? file.fileName : "uploadedFile");
      // folderpath_ = file.folderPath;
      folderpath_ = file.folderPath.split("/", 2)[1]//file.folderPath;
    }
    /* console.log(content_)*/
    // url_ += folderpath_;
    // url_ += "folderPath='" + encodeURIComponent("" + folderpath_)+"'"; 
    url_ += folderpath_;
    url_ += "/" + SectionName;
    url_ = url_.replace(/[?&]$/, "");
    // console.log(url_)
    let options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        "Accept": "application/json"
      })
    };


    return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
      return this.processUploadImage(response_);
    })).pipe(_observableCatch((response_: any) => {
      if (response_ instanceof HttpResponseBase) {
        try {
          return this.processUploadImage(<any>response_);
        } catch (e) {
          return <Observable<string>><any>_observableThrow(e);
        }
      } else
        return <Observable<string>><any>_observableThrow(response_);
    }));
  }

  protected processUploadImage(response: HttpResponseBase): Observable<string> {
    const status = response.status;
    const responseBlob =
      response instanceof HttpResponse ? response.body :
        (<any>response).error instanceof Blob ? (<any>response).error : undefined;

    let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } };
    if (status === 200) {
      return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        let result200: any = null;
        let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
        result200 = resultData200 !== undefined ? resultData200 : <any>null;
        return _observableOf(result200);
      }));
    } else if (status !== 200 && status !== 204) {
      return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        // this.logFrontend.createLogFrontend("Upload Image", _responseText.toString()).subscribe(() => { });
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
      }));
    }
    return _observableOf<string>(<any>null);
  }

  uploadXML(strXML1: string) {
    let url_ = this.baseUrl + "api/UploadFile/XML";

    url_ = url_.replace(/[?&]$/, "");
    const content_ = strXML1;
    //console.log(content_);
    let options_: any = {
      body: content_,
      observe: "response",
      responseType: "blob",
      headers: new HttpHeaders({
        'Accept': 'text/xml',
        'Content-Type': 'text/xml'
      })
    };

    //console.log(url_);
    return this.http.request("post", url_, options_).pipe(map((res: any) => {
      return res;
    }));
  }


  uploadFile(uploadedFile: FileParameter[], path: string): Observable<any> {

    const url = this.baseUrl + "api/UploadFile/" + path;
    const headers = new HttpHeaders();

    // Set the Content-Type header to 'multipart/form-data'
    headers.set('Content-Type', 'multipart/form-data');
    // Add any other headers if needed

    var formData = new FormData();
    formData.append("uploadedFile", uploadedFile[0].data);





    return this.http.post<string[]>(url, formData, { headers: headers }).pipe(
      map(response => response), // Map the response to extract the ID
      catchError(error => {
        this.handleHttpError(error);
        return throwError(() => new Error('Error in uploadimages: ' + error));
      })
    );

  }


}




function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
  if (result !== null && result !== undefined)
    return _observableThrow(result);
  else
    return _observableThrow(new ApiException(message, status, response, headers, null));
}

function blobToText(blob: any): Observable<string> {
  return new Observable<string>((observer: any) => {
    if (!blob) {
      observer.next("");
      observer.complete();
    } else {
      let reader = new FileReader();
      reader.onload = event => {
        observer.next((<any>event.target).result);
        observer.complete();
      };
      reader.readAsText(blob);
    }
  });
}

export class ApiException extends Error {
  //message: string;
  status: number;
  response: string;
  headers: { [key: string]: any; };
  result: any;

  constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
    super();

    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
  }

  protected isApiException = true;

  static isApiException(obj: any): obj is ApiException {
    return obj.isApiException === true;
  }



}

export interface FileParameter {
  data: File;
  folderPath: string;
  fileName: string;
}

