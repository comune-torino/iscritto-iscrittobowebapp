import {environment} from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
/**
 * Servizio di configurazione
 */
export class ConfigService {

    /**
     * server del backend nel formato http://server:port
     */
    getBEServer(): string {
        return environment.beServer;
    }

    /**
     * Url di logout da SSO
     */
    getSSOLogoutURL(): string {
        return environment.shibbolethSSOLogoutURL;
    }

    /**
     * URL a cui saltare in caso di logout locala
     */
    getOnAppExitURL(): string {
        return environment.onAppExitURL;
    }

    /**
     * URL a cui saltare in caso di logout locala
     */
    getContoTerziURL(): string {
        return environment.contoTerziURL;
    }

    /**
     * Indica se bisogna nascondere la gestione delle materne
     */
    hideMaterne(): boolean {
        return environment.hideMaterne;
    }
}
