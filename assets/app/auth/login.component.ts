import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { AuthService } from './auth.service';
import { User } from '../model/User';

@Component({
    selector: 'my-login',
    template: `
        <div class="container">
            <button type="button" class="btn btn-outline-primary btn-lg btn-block" (click)="onGeSsoClick()">Login via GE SSO</button>
        </div>
    `
})

export class LoginComponent implements OnInit {

    constructor(
        private route : ActivatedRoute,
        private router : Router,
        private _authService : AuthService
    ) {}

    ngOnInit() {
        this.route.queryParams
                    .subscribe(params => {
                        this._authService.user.next(new User("", params['username'], "", "", "", [], "", [], "", "", "", "", "", "", "", "", "", "", null));
                        this.router.navigate(['material']);
                    });
    }

    onGeSsoClick() {
        this._authService.login();
    }
}