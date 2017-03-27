import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styles:[`
        my-sidebar, my-materials {
            display: block;
        }
    `]
})

export class AppComponent {
    appName = "Periodic Elements Demo";

}