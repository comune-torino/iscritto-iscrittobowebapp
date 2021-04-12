import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SortableColumnComponent} from '../sortable-column/sortable-column.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SortableColumnComponent],
  exports: [SortableColumnComponent]
})
export class ModuleCommonModuleModule {
}
