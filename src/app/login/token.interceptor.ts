import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })        // ⬅️ مهمّ
export class TokenInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);      // (أو حقن عبر الـ constructor)

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.auth.token;
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}
