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
  private _token : string = '';

  user = new BehaviorSubject<User>(this._user);
  token = new BehaviorSubject<string>(this._token);
  isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private _http: Http, private _router: Router) { }

  clear() : void {
    localStorage.removeItem('token');
    Cookie.delete('token');
    Cookie.delete('connect.sid');
    this._user = new User( "", "", "", "", "", [], "", [], "", "", "", "", "", "", "", "", "", "", null );
    this.user.next(this._user);
  }

  getToken() : Observable<Response> {
    return this._http.get(this.app_url + '/signin/token')
              .map(res => res.json().token)
  }

  login() : void {
    window.location.href = this.app_url + '/signin';
  }

  logout() : void {
    this.clear();
    window.location.href = this.app_url + '/logout';
  }

  checkToken() : Observable<Response> {
    return this.getToken().flatMap(token => {
      return this._http.get(this.app_url + '/isauthenticated?token=' + token)
                        .catch(err => Observable.throw(err.json().error || 'Unknown error'));
    })
  }
}
