import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { PrintService } from '../print.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit, AfterViewChecked {

  private text: string = ""

  constructor(private printService: PrintService) { }

  private newContents: boolean = false;
  ngAfterViewChecked(): void {
    if (this.newContents) {
      this.newContents = false;
      this.printService.notifyUpdate();
    }
  }


  ngOnInit() {
    this.printService.getText().subscribe(t => {
      this.text = t;
      this.newContents = true;
    })
  }

}
