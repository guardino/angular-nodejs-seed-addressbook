import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, URLSearchParams, Headers, Response } from '@angular/http';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
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
  sid = new BehaviorSubject<string>(null);

  constructor(private _http: Http, private _router: Router) { }

  clear() : void {
    this.isAuthenticated.next(false);
    this._user = new User( "", "", "", "", "", [], "", [], "", "", "", "", "", "", "", "", "", "", null );
    this.user.next(this._user);
  }

  getToken() : Observable<Response> {
    return this.sid.flatMap(sid => {
                  return this._http.get(this.app_url + '/signin/token?sid=' + sid)
                        .map(res => res.json().token)
              })
  }

  getTokenFromProvidedSid(sid : string) : Observable<Response> {
    return this._http.get(this.app_url + '/signin/token?sid=' + sid)
                      .map(res => res.json())
  }

  login() : void {
    window.location.href = this.app_url + '/signin';
  }

  logout() : void {
    this.clear();
    window.location.href = this.app_url + '/logout';
  }

  checkToken(sid : string) : Observable<Response> {
    return this.getToken().flatMap(token => {
              if(!sid) {
                this.login();
              }
              if((typeof token === "undefined" || token == null || token.toString().length == 0) && sid) {
                return this.getTokenFromProvidedSid(sid).flatMap(token => {
                  return this._http.get(this.app_url + '/isauthenticated?token=' + token)
                                .catch(err => Observable.throw(err.json().error || 'Unknown error'));
                })
              }
              return this._http.get(this.app_url + '/isauthenticated?token=' + token)
                                .catch(err => Observable.throw(err.json().error || 'Unknown error'));
            })
  }
}
