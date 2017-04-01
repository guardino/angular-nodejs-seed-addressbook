import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, URLSearchParams, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs';
import 'rxjs';

import { User } from '../model/User';

@Injectable()
export class AuthService {

  private auth_url = process.env.uaaUrl;
  private app_url = process.env.appUrl;
  private client_id = process.env.client_id;
  private client_secret = process.env.client_secret;
  private _user : User;

  user = new BehaviorSubject<User>(this._user);
  isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private _http: Http, private _router: Router) {
    this.checkToken();
  }

  clear() : void {
    localStorage.removeItem('token');
    Cookie.delete('token');
    Cookie.delete('connect.sid');
    this._user = new User( "", "", "", "", "", [], "", [], "", "", "", "", "", "", "", "", "", "", null );
    this.user.next(this._user);
  }

  getToken() : string {
    return localStorage.getItem('token');
  }

  login() : void {
    window.location.href = this.app_url + '/signin';
  }

  logout() : void {
    this.clear();
    window.location.href = this.app_url + '/logout';
  }

  checkToken() : Observable<Response> {
    if(Cookie.get('token')) {
      localStorage.setItem('token', Cookie.get('token'));
    }
    let token = localStorage.getItem('token')? localStorage.getItem('token') : '';
    return this._http.get(this.app_url + '/isauthenticated?token='+ token)
  }

}
