import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funzione } from '../model/common/funzione';
import { Profilo } from '../model/common/profilo';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
  useFactory: 'loadData'
})

export class ProfileService {
  public readonly CODICE_PROFILO_ECONOMA = 'P4';
  public readonly CODICE_PROFILO_ECONOMA_MATERNA_COMUNALE = 'P11';
  public readonly CODICE_PROFILO_ECONOMA_MATERNA_STATALE_E_CONVENZIONATA = 'P12';

  public readonly FUNZIONE_DOMANDA = 'DOM';
  public readonly FUNZIONE_GRADUATORIA = 'GRA';

  public readonly ATTIVITA_RICERCA_DOMANDA = 'DOM_RIC';
  public readonly PRIVILEGIO_UPLOAD = 'P_DOM_RIC_UPL';

  public readonly ATTIVITA_RICERCA_GESTIONE_CLASSI = 'GRA_RIC_CLS';
  public readonly PRIVILEGIO_ELIMINA_CLASSE = 'P_GRA_DEL_CLS';

  public readonly ATTIVITA_INSERIMENTO_DOMANDA = 'DOM_INS';
  public readonly PRIVILEGIO_INSERIMENTO_DOMANDA = 'P_DOM_INS';

  public readonly PRIVILEGIO_DOWNLOAD = 'P_DOM_RIC_DWN_ALL';
  public readonly PRIVILEGIO_DOWNLOAD_MINORE = 'P_DOM_RIC_DWN_MIN';

  elencoMacroFunzioni: Funzione[];
  elencoProfili: Profilo[];
  profiloSelezionato: Profilo;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) { }

  // getter sui dati di profilazione
  getElencoMacroFunzioni(): Observable<Funzione[]> {
    if (this.elencoMacroFunzioni) {
      return new Observable((observer) => {
        observer.next(this.elencoMacroFunzioni);
      });
    } else {
      const elenco = this.http.get<Funzione[]>(this.config.getBEServer() + '/autorizzazione/currentUser/elenco-autorizzazioni');
      elenco.subscribe((data) => {
        this.elencoMacroFunzioni = data;
      });
      return elenco;
    }
  }
  //get dei profili disponibili
  getElencoProfili(): Observable<Profilo[]> {
    if (this.elencoProfili) {
      return new Observable((observer) => {
        observer.next(this.elencoProfili);
      });
    } else {
      const elenco = this.http.get<Profilo[]>(this.config.getBEServer() + '/autorizzazione/currentUser/elenco-profili');
      elenco.subscribe((data) => {
        this.elencoProfili = data;
      });
      return elenco;
    }
  }
  //set del profilo
  setProfilo(codice: string): Observable<string> {
    const URL = `/autorizzazione/currentUser/profilo-selezionato/${codice}`;

    return this.http.put<string>(this.config.getBEServer() + URL, null);
  }

  //get profilo attualmente in uso
  getProfiloUtilizzato(): Observable<Profilo> {
    const prof = this.http.get<Profilo>(this.config.getBEServer() + '/autorizzazione/currentUser/profilo-selezionato');
    return prof;
  }



  hasPrivilegioUpload(): boolean {
    return this.hasPrivilegio(
      this.FUNZIONE_DOMANDA,
      this.ATTIVITA_RICERCA_DOMANDA,
      this.PRIVILEGIO_UPLOAD
    );
  }

  hasPrivilegioEliminaClasse(): boolean {
    return this.hasPrivilegio(
      this.FUNZIONE_GRADUATORIA,
      this.ATTIVITA_RICERCA_GESTIONE_CLASSI,
      this.PRIVILEGIO_ELIMINA_CLASSE
    );
  }

  hasPrivilegioInserisciPreferenza(): boolean {
    return this.hasPrivilegio(
      this.FUNZIONE_DOMANDA,
      this.ATTIVITA_INSERIMENTO_DOMANDA,
      this.PRIVILEGIO_INSERIMENTO_DOMANDA
    );
  }

  hasPrivilegioDownloadAllegati(): boolean {
    return this.hasPrivilegio(
      this.FUNZIONE_DOMANDA,
      this.ATTIVITA_RICERCA_DOMANDA,
      this.PRIVILEGIO_DOWNLOAD
    );
  }

  hasPrivilegioDownloadAllegatiMinore(): boolean {
    return this.hasPrivilegio(
      this.FUNZIONE_DOMANDA,
      this.ATTIVITA_RICERCA_DOMANDA,
      this.PRIVILEGIO_DOWNLOAD_MINORE
    );
  }

  //////////////////////////////////////////////////////////////////////
  // Utils
  //////////////////////////////////////////////////////////////////////
  private hasPrivilegio(codFunzione: string, codAttivita: string, codPrivilegio: string): boolean {
    if (!this.elencoMacroFunzioni) {
      return false;
    }

    for (const funzione of this.elencoMacroFunzioni) {
      if (funzione.codice === codFunzione) {
        if (!funzione.attivita) {
          return false;
        }
        for (const attivita of funzione.attivita) {
          if (attivita.codice === codAttivita) {
            if (!attivita.privilegi) {
              return false;
            }
            for (const privilegio of attivita.privilegi) {
              if (privilegio.codice === codPrivilegio) {
                return true;
              }
            }
          }
        }
      }
    }

    return false;
  }

}
