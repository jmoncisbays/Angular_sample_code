import { Injectable } from "@angular/core";
import { Login } from "./login.model"
import { Observable } from "rxjs";
import { WebAPIDataSource } from "./webapi.datasource";

@Injectable()
export class TokenRepository {

    constructor(private dataSource: WebAPIDataSource) { }

    get(model: Login): Observable<any> {
        return this.dataSource.getToken(model);
    }
}