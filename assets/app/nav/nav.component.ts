import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { User } from '../model/User';

@Component({
    selector: "my-nav",
    templateUrl: "./nav.component.html"
})

export class NavComponent implements OnInit {

    @Input() appName= "";

    user;
    isAuthenticated;

    constructor(
        private _authService: AuthService,
        private _router: Router
    ){ }

    ngOnInit() {
        this.user = this._authService.user;
        this.isAuthenticated = this._authService.isAuthenticated;
    }

    private onLogin() {
        this._router.navigateByUrl('/login');
    }

    private onLogout() {
        this._authService.logout();
    }

}