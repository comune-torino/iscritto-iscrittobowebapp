import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  private text$: ReplaySubject<string> = new ReplaySubject();

  private updated$: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor() { }

  getPrinterReadySemaphore() {
    return this.updated$;
  }

  getText() {
    return this.text$.asObservable();
  }

  setMessage(m: string) {
    this.text$.next(m)
  }

  notifyUpdate() {
    this.updated$.next(true);
  }
}
