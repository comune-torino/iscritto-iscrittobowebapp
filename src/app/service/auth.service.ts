import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ConfigService } from "./config.service";
import { SrvError } from "../model/common/srv-error";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthService {

    constructor(
        private router: Router,
        private config: ConfigService,
        private http: HttpClient
    ) { }

    checkOperatoreAbilitato(): void {
        this.checkOperatore().subscribe({
            next: (data: string) => {
                // OK
            },
            error: (data: SrvError) => {
                this.jumpToUnauthorizedPage();
            }
        });
    }

    checkOperatore(): Observable<string | SrvError> {
        return this.http.get<string>(this.config.getBEServer() + '/autorizzazione/operatore');
    }

    jumpToUnauthorizedPage() {
        this.router.navigate(['unauthorized']);
    }

}