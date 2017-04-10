import { Component } from '@angular/core';

import { AuthService } from './auth.service';

@Component({
    selector: 'my-login',
    template: `
        <div class="container">
            <button type="button" class="btn btn-outline-primary btn-lg btn-block" (click)="onGeSsoClick()">Login</button>
        </div>
    `
})

export class LoginComponent {

    constructor(
        private _authService : AuthService
    ) {}

    onGeSsoClick() {
        this._authService.login();
    }
}
