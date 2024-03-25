 
import { Data } from '@angular/router'; 
import { NumberLiteralType } from 'typescript';
import { AppConsts } from './shared/AppConsts';

import { mergeMap as _observableMergeMap, catchError as _observableCatch, map } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http'; 

// import { Subject } from 'rxjs'


 
//import * as moment from 'moment';



@Injectable()
export class ApiService {
 
    // private selectedQuestion = new Subject<any>();
    // questionSelected = this.selectedQuestion.asObservable();
   
    private http: HttpClient; 
    private baseUrl: string = AppConsts.RemoteServiceURL ; 
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient) {
      this.http = http; 
  }

   //  ---- Cufex Users Groups Start ----
//get all Groups
// getCufex_UsersGroups()  { 
//   var urlData = "?pagenumber=" + 1 + "&pagesize=" + 10
//   var url = encodeURI( AppConsts.RemoteServiceURL + 'api/Cufex_UsersGroups'+ urlData)
   

//   return this.http.get<Group>(url)
//   .toPromise()
//   .then(res => <Group>res);
//  //.then(q => { return q; }); 
// }

   //  ---- Cufex Users Groups End ----


   
   getCufex_UsersGroups(filter: string | undefined, sorting: string | undefined, pagesize: number | undefined, pagenumber: number | undefined): Observable<PagedResultDtoOfGroupListDto> {
    let url_ = this.baseUrl + "api/Cufex_UsersGroups?";
    if (filter === null)
    throw new Error("The parameter 'filter' cannot be null.");
    else if (filter !== undefined)
        url_ += "Filter=" + encodeURIComponent("" + filter) + "&"; 

        //console.log(url_);
    if (sorting === null)
        throw new Error("The parameter 'sorting' cannot be null.");
    else if (sorting !== undefined)
        url_ += "Sorting=" + encodeURIComponent("" + sorting) + "&"; 

    if (pagesize === null)
        throw new Error("The parameter 'pagesize' cannot be null.");
    else if (pagesize !== undefined)
        url_ += "pagesize=" + encodeURIComponent("" + pagesize) + "&"; 

    if (pagenumber === null)
        throw new Error("The parameter 'pagenumber' cannot be null.");
    else if (pagenumber !== undefined)
        url_ += "pagenumber=" + encodeURIComponent("" + pagenumber) + "&"; 
       
    url_ = url_.replace(/[?&]$/, "");

    let options_ : any = {
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
            "Accept": "text/plain"
        })
    };
 
    return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
        return this.processgetCufex_UsersGroups(response_);
    })).pipe(_observableCatch((response_: any) => {
        if (response_ instanceof HttpResponseBase) {
            try {
                return this.processgetCufex_UsersGroups(<any>response_);
            } catch (e) {
                return <Observable<PagedResultDtoOfGroupListDto>><any>_observableThrow(e);
            }
        } else
            return <Observable<PagedResultDtoOfGroupListDto>><any>_observableThrow(response_);
    }));
}



protected processgetCufex_UsersGroups(response: HttpResponseBase): Observable<PagedResultDtoOfGroupListDto> {
    const status = response.status;
    const responseBlob = 
        response instanceof HttpResponse ? response.body : 
        (<any>response).error instanceof Blob ? (<any>response).error : undefined;

    let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
    if (status === 200) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        let result200: any = null;
        let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
        result200 = PagedResultDtoOfGroupListDto.fromJS(resultData200);
        return _observableOf(result200);
        }));
    } else if (status !== 200 && status !== 204) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }));
    }
    return _observableOf<PagedResultDtoOfGroupListDto>(<any>null);
}



deleteGroup(id: number | undefined): Observable<boolean> {
    let url_ = this.baseUrl + "api/Cufex_UsersGroups?";
    if (id === null)
        throw new Error("The parameter 'id' cannot be null.");
    else if (id !== undefined)
        url_ += "Id=" + encodeURIComponent("" + id) + "&"; 
    url_ = url_.replace(/[?&]$/, "");

    let options_ : any = {
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
        })
    }; 

    return this.http.request("delete", url_, options_).pipe(_observableMergeMap((response_ : any) => {
        return this.processDeleteAgencyGroup(response_);
    })).pipe(_observableCatch((response_: any) => {
        if (response_ instanceof HttpResponseBase) {
            try {
                return this.processDeleteAgencyGroup(<any>response_);
            } catch (e) {
                return <Observable<boolean>><any>_observableThrow(e);
            }
        } else
            return <Observable<boolean>><any>_observableThrow(response_);
    }));
}

protected processDeleteAgencyGroup(response: HttpResponseBase): Observable<boolean> {
    const status = response.status;
    const responseBlob = 
        response instanceof HttpResponse ? response.body : 
        (<any>response).error instanceof Blob ? (<any>response).error : undefined;

    let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
    if (status === 200) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        return _observableOf<boolean>(<any>_responseText);
        }));
    } else if (status !== 200 && status !== 204) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }));
    }
    return _observableOf<boolean>(<any>null);
}


// updateGroup(record: any, id: number | undefined) {
//     return this.http.put<any>(this.baseUrl + "api/Cufex_UsersGroups?Id="+id, record)
//     .pipe(map((res:any)=>{
//       return res;
//     }))
// }


// addGroup(record: GroupListDto) {
//     return this.http.post<any>(this.baseUrl + "api/Cufex_UsersGroups?", record)
//     .pipe(map((res:any)=>{
//       return res;
//     }))
// }


createUserGroup(body: GroupListDto | undefined): Observable<void> {
    let url_ = this.baseUrl + "api/Cufex_UsersGroups";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(body);

    let options_ : any = {
        body: content_,
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
            "Content-Type": "application/json-patch+json", 
        })
    }; 
    return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
        return this.processCreateUserGroup(response_);
    })).pipe(_observableCatch((response_: any) => {
        if (response_ instanceof HttpResponseBase) {
            try {
                return this.processCreateUserGroup(<any>response_);
            } catch (e) {
                return <Observable<void>><any>_observableThrow(e);
            }
        } else
            return <Observable<void>><any>_observableThrow(response_);
    }));
}

protected processCreateUserGroup(response: HttpResponseBase): Observable<void> {
    const status = response.status;
    const responseBlob = 
        response instanceof HttpResponse ? response.body : 
        (<any>response).error instanceof Blob ? (<any>response).error : undefined;

    let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
    if (status === 200) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        return _observableOf<void>(<any>null);
        }));
    } else if (status !== 200 && status !== 204) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }));
    }
    return _observableOf<void>(<any>null);
}

editUserGroup(body: GroupListDto | undefined): Observable<void> {
    
    let url_ = this.baseUrl +  "api/Cufex_UsersGroups/"+body?.id;
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(body);

    let options_ : any = {
        body: content_,
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
            "Content-Type": "application/json-patch+json", 
        })
    };
    return this.http.request("put", url_, options_).pipe(_observableMergeMap((response_ : any) => {
        return this.processEditUserGroup(response_);       
    })).pipe(_observableCatch((response_: any) => {
        if (response_ instanceof HttpResponseBase) {
            try {
                return this.processEditUserGroup(<any>response_);
            } catch (e) {
                return <Observable<void>><any>_observableThrow(e);
            }
        } else
            return <Observable<void>><any>_observableThrow(response_);
    }));
}

protected processEditUserGroup(response: HttpResponseBase): Observable<void> {
    const status = response.status;
    const responseBlob = 
        response instanceof HttpResponse ? response.body : 
        (<any>response).error instanceof Blob ? (<any>response).error : undefined;

    let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
    if (status === 200) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        return _observableOf<void>(<any>null);
        }));
    } else if (status !== 200 && status !== 204) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }));
    }
    return _observableOf<void>(<any>null);
}


uploadImage(uploadedFile: FileParameter[]): Observable<string> {
    let url_ = this.baseUrl + "api/UploadImage";
    // if(section==ImportSectionEnum.Leads){
    //     url_=url_+ "UploadLeadsExcel";
    // }
    // if(section==ImportSectionEnum.AgenciesSystemUsers){
    //     url_=url_+ "UploadAgenciesSystemUsersExcel";
    // }
    url_ = url_.replace(/[?&]$/, "");
    const content_ = new FormData();
    for (let file of uploadedFile) {
        content_.append("uploadedFile", file.data, file.fileName ? file.fileName : "uploadedFile");
       // console.log(file.data);
    }

  let options_ : any = {
  body: content_,
  observe: "response",
  responseType: "blob",
  headers: new HttpHeaders({
      "Accept": "application/json"
  })
};


    return this.http.request("post", url_, options_).pipe(_observableMergeMap((response_ : any) => {
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

    let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }};
    if (status === 200) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        let result200: any = null;
        let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
        result200 = resultData200 !== undefined ? resultData200 : <any>null;
        return _observableOf(result200);
        }));
    } else if (status !== 200 && status !== 204) {
        return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        }));
    }
    return _observableOf<string>(<any>null);
}


}

export class PagedResultDtoOfGroupListDto implements IPagedResultDtoOfGroupListDto {
  items!: GroupListDto[];
  totalCount!: number;

  constructor(data?: IPagedResultDtoOfGroupListDto) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(data?: any) {
      if (data) {
          this.totalCount = data["totalCount"];
          if (Array.isArray(data["items"])) {
              this.items = [] as any;
              for (let item of data["items"])
                  this.items!.push(GroupListDto.fromJS(item));
          }
      }
  }

  static fromJS(data: any): PagedResultDtoOfGroupListDto {
      data = typeof data === 'object' ? data : {};
      let result = new PagedResultDtoOfGroupListDto();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["totalCount"] = this.totalCount;
      if (Array.isArray(this.items)) {
          data["items"] = [];
          for (let item of this.items)
              data["items"].push(item.toJSON());
      }
      return data; 
  }
}

export interface IPagedResultDtoOfGroupListDto {
  totalCount: number;
  items: GroupListDto[];
}

export class GroupListDto implements IGroupListDto {
  id!: number | undefined;
  name!: string | undefined;
  active!: number | undefined;
  lastModifiedDate!: Date | undefined;
  lastModifiedBy!: number | undefined;
  deleted! : number | undefined;
  deleted_Date!: Date | undefined;
  delete_By!: number | undefined;
  modificationDate!: Date | undefined;
  modifiedBy!: number | undefined;
  creationDate!: Date | undefined;
  createdBy!: number | undefined;

  constructor(data?: IGroupListDto) {
      if (data) {
          for (var property in data) {
              if (data.hasOwnProperty(property))
                  (<any>this)[property] = (<any>data)[property];
          }
      }
  }

  init(data?: any) {
      if (data) {
          this.id = data["id"];
          this.name = data["name"];
          this.active = data["active"];
          this.lastModifiedBy = data["lastModifiedBy"];
          this.lastModifiedDate = data["lastModifiedDate"] ? (data["lastModifiedDate"].toString()) : <any>undefined;
          this.deleted = data["deleted"];
          this.deleted_Date = data["deleted_Date"];
          this.delete_By = data["delete_By"]
          this.modifiedBy = data["modifiedBy"];
          this.modificationDate = data["modificationDate"];
          this.createdBy = data["createdBy"];
          this.creationDate = data["creationDate"]; 
      }
  }

  static fromJS(data: any): GroupListDto {
      data = typeof data === 'object' ? data : {};
      let result = new GroupListDto();
      result.init(data);
      return result;
  }

  toJSON(data?: any) {
      data = typeof data === 'object' ? data : {};
      data["id"] = this.id;
      data["name"] = this.name;
      data["active"] = this.active;
      data["lastModifiedBy"] = this.lastModifiedBy;   
      data["lastModifiedDate"] = this.lastModifiedDate ;
      
      data["delete_By"] = this.delete_By;   
      data["deleted_Date"] = this.deleted_Date ;
      data["deleted"]= this.deleted;

      data["modifiedBy"] = this.modifiedBy;   
      data["modificationDate"] = this.modificationDate ;
      
      data["createdBy"] = this.createdBy;   
      data["creationDate"] = this.creationDate ;

      return data; 
  }
}

export interface IGroupListDto {
  id: number | undefined;
  name: string | undefined;
  active: number | undefined;
  lastModifiedBy: number | undefined;
  lastModifiedDate: Date | undefined;
  deleted : number | undefined;
  deleted_Date: Date | undefined;
  delete_By: number | undefined;
  modifiedBy: number | undefined;
  modificationDate: Date | undefined;
  createdBy: number | undefined;
  creationDate: Date | undefined;
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
  override message: string;
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
    data: any;
    fileName: string;
}




/* 
  //get all questions
  getQuestions() {
    return this.http.get('https://localhost:44338/api/Questions');
  }

  // save question
  postQuestion(question) {
    this.http.post('https://localhost:44338/api/Questions', question).subscribe(res => {
     // console.log(res)
    })
  }

  //  edit question
  putQuestion(question) {
   // console.log('11')
    this.http.put(`https://localhost:44338/api/Questions/${question.id}`, question).subscribe(res => {
     // console.log(res)
    });
  //  console.log("22")
  }
  //putQuestion(question) {
  //  this.http.put(`http://localhost:63100/api/questions/${question.id}`, question).subscribe(res => {
  //    console.log(res)
  //  })
  //}


  // select before edit
  selectQuestion(question) {
    this.selectedQuestion.next(question)
  }



  // save quiz
  postQuiz(quiz) {
    this.http.post('https://localhost:44338/api/quizzes', quiz).subscribe(res => {
     // console.log(res)
    })
  }*/ 
