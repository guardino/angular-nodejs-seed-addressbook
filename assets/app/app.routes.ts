import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialsComponent } from './materials/materials.component';
import { LoginComponent } from './auth/login.component';

import { CanActivateViaOAuthGuard } from './auth/auth.canActivateGuard';

export const appRoutes: Routes = [
    { 
        path: '', 
        pathMatch: 'full',
        redirectTo: '/materials' 
    },
    { 
        path: 'materials', 
        component: MaterialsComponent, 
        canActivate: [CanActivateViaOAuthGuard]
    },
    { path: 'login', component: LoginComponent},
    { path:'**', redirectTo: '/materials'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});