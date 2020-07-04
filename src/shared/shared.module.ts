import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from './services/utility.service';
import { HighlightTextPipe } from './pipes/highlight-text.pipe';

@NgModule({
  declarations: [
    HighlightTextPipe
  ],
  exports: [
    HighlightTextPipe
  ],
  imports: [
    CommonModule
  ],
  providers: [UtilityService]
})
export class SharedModule { }
