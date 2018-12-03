import { Injectable } from "@angular/core";

export enum Roles
{
    Admin = 1,
    Manager = 2,
    User = 4,
    Requester = 8
}

@Injectable()
export class RoleService {

    constructor() {}

    get currentUserRole(): Roles {
        return +sessionStorage.getItem("user_type_id");
    }

    isUserInRole(role: Roles) {
        return (this.currentUserRole & role) == role;
    }
}