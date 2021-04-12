import {ValidationErrors,ValidatorFn,FormGroup} from '@angular/forms';

export const checkFiltroRicerca: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    
    // 
    const codiceFiscale = control.get('codiceFiscale');
    const cognome = control.get('anagrafica').get('cognome');
    const nome = control.get('anagrafica').get('nome');
  
    if(codiceFiscale && (cognome || nome) )
        return { 'filterError': true };

    return null;
  };