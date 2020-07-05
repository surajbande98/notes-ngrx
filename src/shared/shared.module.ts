import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from './services/utility.service';
import { HighlightTextPipe } from './pipes/highlight-text.pipe';
import { DateFormatterPipe } from './pipes/date-formatter.pipe';

@NgModule({
  declarations: [
    HighlightTextPipe,
    DateFormatterPipe
  ],
  exports: [
    HighlightTextPipe,
    DateFormatterPipe
  ],
  imports: [
    CommonModule
  ],
  providers: [UtilityService]
})
export class SharedModule { }
