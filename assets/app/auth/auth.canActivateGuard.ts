import { Injectable } from '@angular/core';
import { CanActivate , Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs';

import { AuthService } from './auth.service';
import { User } from '../model/User';

@Injectable()
export class CanActivateViaOAuthGuard implements CanActivate {

  constructor(
    private _router : Router,
    private _authService : AuthService
  ) { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean {  
    let target = 'sid';
    let sid = this.findQueryString(state.url, target);
    if(sid.length > 0) {
        this._authService.sid.next(sid);
    }
    return this._authService.checkToken()
               .map(res =>{
                   console.log(res)
                  let resJson = res.json();
                  if(resJson.isAuthenticated == true) {
                      this._authService.user.next(new User(
                            resJson.body.user_id,
                            resJson.body.user_name,
                            resJson.body.email,
                            resJson.body.client_id,
                            resJson.body.exp,
                            resJson.body.scope,
                            resJson.body.jti,
                            resJson.body.aud,
                            resJson.body.sub,
                            resJson.body.iss,
                            resJson.body.iat,
                            resJson.body.cid,
                            resJson.body.grant_type,
                            resJson.body.azp,
                            resJson.body.auth_time,
                            resJson.body.zid,
                            resJson.body.rev_sig,
                            resJson.body.origin,
                            resJson.body.revocable
                      ))
                  } else {
                      this._router.navigateByUrl('/login');
                      this._authService.clear();
                  }
                  this._authService.isAuthenticated.next(resJson.isAuthenticated);
                  return resJson.isAuthenticated;
              })
              .catch(error =>{
                  this._router.navigateByUrl('/login');
                  this._authService.clear();
                  return Observable.of(false);
              }).take(1);
  }

  findQueryString(url : string, target: string) : string {
      if(url.indexOf('?') > -1){
        let query = url.substring(url.indexOf('?')+1);
        // grab username query
        if(query.indexOf(target) > -1){
            let username = query.substring(query.indexOf(target) + target.length + 1);
            if(username.indexOf('&') > -1) {
                username = username.substring(0, username.indexOf('&'));
            }
            return username;
        }
        // no username query exists
        return '';
      }
      // no query exists
      return '';
  }

}