import { AnagraficaSoggetto } from "./anagrafica-soggetto";
import { Luogo } from "./luogo";

export class Minore {
    anagrafica: AnagraficaSoggetto;
    luogoNascita: Luogo;
    luogoResidenza: Luogo;
    disabilita: boolean;
    problemiSalute: boolean;
    serviziSociali: boolean;
    /*
    assistente: string;
    nome: string;
    indirizzo: string;
    telefono: string;
    */
}