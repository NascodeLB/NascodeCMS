import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

@Injectable()
export class CallbackInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Check if the request is a POST request and has a body
    if (req.method === 'POST' && req.body) {
      const data = req.body;
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      console.log(data);
      // Handle the data here
    }

    // Pass the request along to the next interceptor
    return next.handle(req);
  }
}
