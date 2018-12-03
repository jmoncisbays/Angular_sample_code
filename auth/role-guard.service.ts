import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { RoleService, Roles } from './role.service';

@Injectable()
export class RoleGuardService implements CanActivate {

    constructor(public authService: AuthService, public roleService: RoleService, public router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {        
        if (!this.authService.isLoggedIn || this.authService.isSessionExpired) {
            this.router.navigate(['login']);
            return false;
        }
        
        const currentUserRole: number = this.roleService.currentUserRole;
        const expectedRoles: Roles[] = route.data.expectedRoles;
        let i: number;

        for(i = 0; i <= expectedRoles.length - 1; i++) {
            if((currentUserRole & expectedRoles[i]) == expectedRoles[i]) {
                return true;
            }
        }

        this.router.navigate(['notauthorized']);
        return false;
    }

}