import { Injectable } from "@angular/core";
import { Login } from "../model/login.model";
import { TokenRepository } from "../model/token.repository";
import { Router } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs";
interface IToken {
    token: string,
    expiresIn: number,
    userId: number,
    userTypeId: number
}

@Injectable()
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(false);
    public isLoggedIn = this.loggedIn.asObservable();

    constructor(private tokenRepository: TokenRepository, private router: Router) { }

    login(model: Login): Observable<boolean> {
        return new Observable((observer) => {
            this.tokenRepository.get(model).subscribe(data => {
                let authresult: IToken = JSON.parse(data);
                this.setSession(authresult);
                this.loggedIn.next(true);
                observer.next(true);
                observer.complete();
            }, (err: HttpErrorResponse) => {
                if (err.status == 401) {
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    }

    private setSession(authResult: IToken) {
        let minutes: number = +authResult.expiresIn;
        let expiresAt: Date = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + minutes);

        sessionStorage.setItem("token", authResult.token);
        sessionStorage.setItem("expires_at", expiresAt.getTime().toString());
        sessionStorage.setItem("user_id", authResult.userId.toString());
        sessionStorage.setItem("user_type_id", authResult.userTypeId.toString());
    }

    logout() {
        sessionStorage.clear();

        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }

    get isSessionExpired(): boolean {
        let sessionHasExpired: boolean = (new Date()).getTime() > +sessionStorage.getItem("expires_at");
        this.loggedIn.next(!sessionHasExpired);

        return sessionHasExpired;
    }

    get currentUserId(): number {
        return +sessionStorage.getItem("user_id")
    }
}
