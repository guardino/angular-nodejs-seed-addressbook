import { Component } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { AuthService } from './auth.service';

@Component({
    selector: 'my-login',
    template: `
        <div class="container">
            <button type="button" class="btn btn-outline-primary btn-lg btn-block" (click)="onGeSsoClick()">Login via GE SSO</button>
        </div>
    `
})

export class LoginComponent {

    constructor(
        private _authService : AuthService
    ) {}

    onGeSsoClick() {
        this._authService.clear();
        this._authService.login();
    }
}