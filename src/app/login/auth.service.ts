import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  password: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  public baseUrl = environment.baseUrl+ 'users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('user');
    if (saved) this.currentUserSubject.next(JSON.parse(saved));
  }

  login(username: string, password: string) {
    console.log('the data are', username, password);
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http
      .get<User[]>(this.baseUrl, { params })   // 
      .pipe(
        map(users => {
          if (!users.length) throw new Error('Invalid credentials');

          const user = users[0];
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  get currentUser() { return this.currentUserSubject.value; }
  get token() { return this.currentUser?.token ?? null; }
  isAuthenticated() { return !!this.token; }
}
