import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SortableTableDirectiveDirective} from '../sortable-table-directive.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SortableTableDirectiveDirective],
  exports: [SortableTableDirectiveDirective]
})
export class ModuleDirectiveModule { }
