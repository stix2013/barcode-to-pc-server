import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleTextComponent } from './circle-text.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CircleTextComponent
  ],
  exports: [
    CircleTextComponent
  ]
})
export class CircleModule {}
