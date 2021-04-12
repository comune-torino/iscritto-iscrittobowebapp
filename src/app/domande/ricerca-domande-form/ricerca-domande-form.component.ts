import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CodiceDescrizione } from '../../model/common/codice-descrizione';
import '../../model/common/costants';
import { DomandeFilter } from '../../model/common/domande-filter';
import { InfoScuola } from '../../model/common/info-scuola';
import { SrvError } from '../../model/common/srv-error';
import { TestataDomanda } from '../../model/common/testata-domanda';
import { DomandaService } from '../../service/domanda.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-ricerca-domande-form',
  templateUrl: './ricerca-domande-form.component.html',
  styleUrls: ['./ricerca-domande-form.component.css']
})
export class RicercaDomandeFormComponent implements OnInit {

  // testata domande trovate
  // composizione del filtro di ricerca
  testataDomande: TestataDomanda[] = [];
  domandeFilter: DomandeFilter = new DomandeFilter();
  errorOnRicerca = false;
  errorLoadNidi = false;
  errorLoadStati = false;
  cachingMode = false;
  statusSearch = false;

  modificaStatoScuola = false;

  isFromMps = false;
  // elenco degli stati di una domanda (binding model-> view per una select list)
  statiDomanda: CodiceDescrizione[];

  // elenco delle scuole (binding model-> view per una select list)
  scuole: CodiceDescrizione[];

  // memorizza il criterio selezionato dall'utente
  raggruppamentoSelezionato: string;

  // implementa il form completo di ricerca ed è costruito dinamicamente in funzione del filtro/raggruppamento criteri di ricerca
  // unione di tutti i possibili control form previsti
  FiltroRicercaForm = new FormGroup({});

  // flag di abilitazione alla visualizzazione dei componenti che realizzano la funzione di ricerca domande
  showTestata = false;
  showRaggruppamenti = true;
  showCriterio = true;
  defaultSelectScuola = null;
  defaultSelectStato = 0;

  /*
  inietto nel costruttore il form Builder e il service della domanda
  */
  constructor(
    private fb: FormBuilder,
    private domandaService: DomandaService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {

    if (this.router.url == "/domande/preferenze/ricerca") this.isFromMps = true;

    this.authService.checkOperatoreAbilitato();

    console.log('init componente .. ');
    this.errorLoadNidi = false;
    // imposto il raggruppamento di default, quello del criterio di ricerca per codice fiscale
    this.showRaggruppamenti = true;
    this.raggruppamentoSelezionato = 'CF';

    this.FiltroRicercaForm.addControl('codiceFiscaleMinore', new FormControl('',
      [Validators.required, Validators.minLength(16), Validators.maxLength(16)]));

    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandaService.getScuoleByUtente(ordineScuola).subscribe({
      next: (data: Array<InfoScuola>) => {
        this.scuole = new Array<CodiceDescrizione>();
        data.forEach((element, index) => {
          const scuola: CodiceDescrizione = new CodiceDescrizione;
          scuola.codice = data[index].codScuola;
          scuola.descrizione = data[index].indirizzo + ' - ' + data[index].descrizione;
          this.scuole.push(scuola);
        });
        console.log('Scuole trovate: ' + this.scuole.length);
      },
      error: (data: SrvError) => {
        console.log('Errore: ' + JSON.stringify(data));
        this.errorLoadNidi = true;
        // nota: condizione di errore non bloccante =>
        // la scelta del nido è obbligatoria nel caso di scelta criterio scuola-stato domanda,
        // ma è sempre possibile scegliere altro criterio
        setTimeout(() => {
          this.errorLoadNidi = false;
        }, 9000);
      },
    });

    this.errorLoadStati = false;
    this.domandaService.getStatiDomanda().subscribe({
      next: (data: Array<CodiceDescrizione>) => {
        this.statiDomanda = data;
        console.log('Stati domanda trovati: ' + this.statiDomanda.length);
      },
      error: (data: SrvError) => {
        console.log('Errore: ' + JSON.stringify(data));
        this.errorLoadStati = true;
        // nota: condizione di errore non bloccante => il mancato caricamento degli stati domanda non compromette la possibilità
        // di fare una ricerca impostando un altro criterio
        setTimeout(() => {
          this.errorLoadStati = false;
        }, 9000);
      }
    });

    console.log('Caching path: ' + this.route.queryParams);
    const caching = this.route.snapshot.paramMap.get('caching');
    if (caching === 'caching') {
      this.showRaggruppamenti = false;
      this.cachingMode = true;
      this.statusSearch = true;
      const ordineScuola: string = sessionStorage.getItem('ordineScuola');
      this.domandaService.getDomandeChaching(ordineScuola).subscribe({
        next: (response: Array<TestataDomanda>) => {
          this.testataDomande = response;
          this.showTestata = true;
          this.showCriterio = false;
          this.showRaggruppamenti = false;
          this.errorOnRicerca = false;
          this.statusSearch = false;
          this.FiltroRicercaForm.invalid;
          console.log('RicercaDomande, domande trovate: ' + this.testataDomande.length);
        },
        error: (response: SrvError) => {
          console.log('Errore: ' + JSON.stringify(response));
          this.statusSearch = false;
          // gestione dell'errore, di fatto recuperabile soltanto in presenza di errori di rete/backend temporanei
          // trattandosi di un dato in sola lettura, una possibilità potrebbe essere il retry automatico trasparente
          // all'utente fatto dal service, pilotato da qui
          // sollevo il flag che informa la view di mantenersi nella modalità di invio richiesta di ricerca, preservando il filtro compilato
          this.showTestata = false;
          this.errorOnRicerca = true;
        },
      });
    }

    
  }

  /*
  * metodo di callback che effettua la ricerca domande in base al criterio
  */
  onSubmit() {
    // TODO: Use EventEmitter with form value
    /* TODO:
    - validare il criterio di ricerca selezionato
    - richiamare il servizio di ricerca mappato sul criterio di ricerca
    - notificare l'elenco risultato al componente che gestisce l'MVC della testata
    - richiamare la view della testata
    - disabilitare la sezione dei criteri (visibile ma disabilitata)
    */
    this.statusSearch = true;
    console.log('stato del form => ' + this.FiltroRicercaForm.value);
    if (this.raggruppamentoSelezionato === 'CF') {
      this.domandeFilter.codiceFiscaleMinore = this.codiceFiscaleMinore;
    }
    if (this.raggruppamentoSelezionato === 'CC') {
      if (this.cognomeMinore && this.cognomeMinore.length !== 0) {
        this.domandeFilter.cognomeMinore = this.cognomeMinore;
      }
      if (this.nomeMinore && this.nomeMinore.length !== 0) {
        this.domandeFilter.nomeMinore = this.nomeMinore;
      }
      if (this.cognomeMinore && this.cognomeMinore.length === 0 && this.nomeMinore && this.nomeMinore.length === 0) {
        this.domandeFilter.codiceScuola = this.codiceScuola;
      }
      if (!this.cognomeMinore && !this.nomeMinore) {
        this.domandeFilter.codiceScuola = this.codiceScuola;
      }
    }
    if (this.raggruppamentoSelezionato === 'PD') {
      this.domandeFilter.protocollo = this.protocolloDomanda;
    }
    if (this.raggruppamentoSelezionato === 'SS') {
      this.domandeFilter.codiceScuola = this.codiceScuola;
      if (this.codiceStatoDomanda) {
        this.domandeFilter.codiceStatoDomanda = this.codiceStatoDomanda;
      }
    }

    console.log('filtro ricerca = ' + JSON.stringify(this.domandeFilter));
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandaService.getDomande(ordineScuola, this.domandeFilter, this.criterioCompilato).subscribe({
      next: (response: Array<TestataDomanda>) => {
        this.testataDomande = response;
        this.showTestata = true;
        this.showCriterio = false;
        this.showRaggruppamenti = false;
        this.errorOnRicerca = false;
        this.domandeFilter = new DomandeFilter();
        // this.FiltroRicercaForm.invalid;
        console.log('RicercaDomande, domande trovate: ' + this.testataDomande.length);
        this.statusSearch = false;


      },
      error: (response: SrvError) => {
        console.log('Errore: ' + JSON.stringify(response));
        this.statusSearch = false;
        // gestione dell'errore, di fatto recuperabile soltanto in presenza di errori di rete/backend temporanei
        // trattandosi di un dato in sola lettura, una possibilità potrebbe essere il retry automatico trasparente
        // all'utente fatto dal service, pilotato da qui
        // sollevo il flag che informa la view di mantenersi nella modalità di invio richiesta di ricerca, preservando il filtro compilato
        this.showTestata = false;
        this.errorOnRicerca = true;
        this.domandeFilter = new DomandeFilter();
      },
    });
  }

  /*
  * Pulisco il criterio impostato, ripristinando il default
  * Nascondo il template del risultato ricerca
  */
  onReset() {
    console.log('onReset(): ripristino setup iniziale della form ...');
    this.showTestata = false;
    this.showCriterio = true;
    this.showRaggruppamenti = true;
    this.errorOnRicerca = false;
    // setup default della form di ricerca
    // this.raggruppamentoSelezionato = 'CF';
    this.onRaggruppamento(this.raggruppamentoSelezionato);
    // resetto il model del risultato ricerca
    // this.clearForm();
    this.testataDomande = [];
    this.router.navigateByUrl('domande/ricerca');
  }

  // gestione della composizione della view in funzione del tipo raggruppamento selezionato
  onRaggruppamento(raggruppamento: string) {
    this.raggruppamentoSelezionato = raggruppamento;
    // devo gestire la pulizia dei campi criterio dei raggruppamenti diversi da quello selezionato
    if (this.raggruppamentoSelezionato === 'CF') {
      this.clearForm();
      this.FiltroRicercaForm.addControl('codiceFiscaleMinore', new FormControl('',
        [Validators.required, Validators.minLength(16), Validators.maxLength(16)
        ]));
    }
    if (this.raggruppamentoSelezionato === 'CC') {
      this.clearForm();
      this.FiltroRicercaForm.addControl('cognomeMinore', new FormControl('',
        [Validators.required, Validators.minLength(2), Validators.maxLength(16)]));
      this.FiltroRicercaForm.addControl('nomeMinore', new FormControl('',
        [Validators.required, Validators.minLength(2), Validators.maxLength(16)]));

      // this.FiltroRicercaForm.get('cognomeMinore').valueChanges
      //   .subscribe( value => {
      //     if (value.length >= 2) {
      //       this.FiltroRicercaForm.setControl('nomeMinore', new FormControl('',
      //         [Validators.minLength(2), Validators.maxLength(16)]));
      //     }
      //     if (value.length === 1) {
      //       this.FiltroRicercaForm.setControl('nomeMinore', new FormControl('',
      //         [Validators.required, Validators.minLength(2), Validators.maxLength(16)]));
      //     }
      //   });
      // this.FiltroRicercaForm.get('nomeMinore').valueChanges
      //   .subscribe( value => {
      //     if (value.length >= 2) {
      //       this.FiltroRicercaForm.setControl('cognomeMinore', new FormControl('',
      //         [Validators.minLength(2), Validators.maxLength(16)]));
      //       }
      //     if (value.length === 1) {
      //       this.FiltroRicercaForm.setControl('cognomeMinore', new FormControl('',
      //         [Validators.required, Validators.minLength(2), Validators.maxLength(16)]));
      //     }
      //   });
    }
    if (this.raggruppamentoSelezionato === 'PD') {
      this.clearForm();
      this.FiltroRicercaForm.addControl('protocolloDomanda', new FormControl('',
        [Validators.required, Validators.minLength(14), Validators.maxLength(14)]));
    }
    if (this.raggruppamentoSelezionato === 'SS') {
      this.clearForm();
      this.FiltroRicercaForm.addControl('codiceStatoDomanda', new FormControl(''));
      this.FiltroRicercaForm.addControl('codiceScuola', new FormControl('', [Validators.required]));
    }
  }

  private clearForm() {
    this.FiltroRicercaForm.removeControl('codiceFiscaleMinore');
    this.FiltroRicercaForm.removeControl('cognomeMinore');
    this.FiltroRicercaForm.removeControl('nomeMinore');
    this.FiltroRicercaForm.removeControl('protocolloDomanda');
    this.FiltroRicercaForm.removeControl('codiceStatoDomanda');
    this.FiltroRicercaForm.removeControl('codiceScuola');
  }

  get codiceFiscaleMinore() {
    return this.FiltroRicercaForm.get('codiceFiscaleMinore').value;
  }

  get nomeMinore() {
    if (!this.FiltroRicercaForm || !this.FiltroRicercaForm.get('nomeMinore')) {
      return '';
    }
    return this.FiltroRicercaForm.get('nomeMinore').value;
  }

  get cognomeMinore() {
    if (!this.FiltroRicercaForm || !this.FiltroRicercaForm.get('cognomeMinore')) {
      return '';
    }
    return this.FiltroRicercaForm.get('cognomeMinore').value;
  }

  get codiceScuola() {
    return this.FiltroRicercaForm.get('codiceScuola').value;
  }

  get protocolloDomanda() {
    if (!this.FiltroRicercaForm || !this.FiltroRicercaForm.get('protocolloDomanda')) {
      return '';
    }
    return this.FiltroRicercaForm.get('protocolloDomanda').value;
  }

  get codiceStatoDomanda() {
    return this.FiltroRicercaForm.get('codiceStatoDomanda').value;
  }

  get disabledButtonSearch() {
    if (this.raggruppamentoSelezionato === 'CF') {
      return !this.FiltroRicercaForm.valid;
    }
    if (this.raggruppamentoSelezionato === 'CC') {
      return this.FiltroRicercaForm.get('nomeMinore').invalid && this.FiltroRicercaForm.get('cognomeMinore').invalid;
    }
    if (this.raggruppamentoSelezionato === 'PD') {
      return !this.FiltroRicercaForm.valid;
    }
    if (this.raggruppamentoSelezionato === 'SS') {
      return !this.FiltroRicercaForm.valid;
    }
  }

  /*
  * proprietà descrittiva del criterio selezionato
  */
  get criterioCompilato() {
    if (this.cachingMode) {
      return this.domandaService.getCriterioCompilatoChaching();
    }
    let context = '';
    const prefix = 'Filtro di ricerca impostato: [ ';
    if (this.raggruppamentoSelezionato === 'CF') {
      context += 'codice fiscale = ' + this.codiceFiscaleMinore;
    }
    if (this.raggruppamentoSelezionato === 'CC') {
      if (this.cognomeMinore != null && this.cognomeMinore.length !== 0) {
        context += 'cognome = ' + this.cognomeMinore;
      }
      if (this.nomeMinore != null && this.nomeMinore.length !== 0) {
        if (this.cognomeMinore === null || this.cognomeMinore === '') {
          context += 'nome = ' + this.nomeMinore;
        } else {
          context += ', nome = ' + this.nomeMinore;
        }
      }
    }
    if (this.raggruppamentoSelezionato === 'PD') {
      if (this.protocolloDomanda != null && this.protocolloDomanda.length !== 0) {
        context += 'numero domanda = ' + this.protocolloDomanda;
      }
    }
    if (this.raggruppamentoSelezionato === 'SS') {
      if (this.codiceScuola === 0) {
        context += 'scuola = ' + 'TUTTE';
      } else {
        this.scuole.forEach(element => {
          if (element.codice === this.codiceScuola) {
            context += 'scuola = ' + element.descrizione;
          }
        });
      }
      // filtro opzionale
      if (this.codiceStatoDomanda != null && this.codiceStatoDomanda.length !== 0) {
        if (this.codiceStatoDomanda === 0) {
          context += ', stato domanda = ' + 'TUTTE';
        } else {
          this.statiDomanda.forEach(element => {
            if (element.codice === this.codiceStatoDomanda) {
              context += ', stato domanda = ' + element.descrizione;
            }
          });
        }
      }
    }
    return prefix + context + ' ]';
  }

  get isNido(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'NID';
  }

  get isMaterna(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'MAT';
  }
}
