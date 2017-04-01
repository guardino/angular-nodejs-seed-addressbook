import { Injectable } from '@angular/core';
import { CanActivate , Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
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
    return this._authService.checkToken()
               .map(res =>{
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
                  this._authService.isAuthenticated.next(false);
                  return Observable.of(false);
              }).take(1);
  }

}