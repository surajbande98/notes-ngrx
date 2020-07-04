import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NgRedux, NgReduxModule } from '@angular-redux/store';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { SidebarComponent } from './main/components/sidebar/sidebar.component';
import { NoteComponent } from './main/components/note/note.component';
import { IAppState, rootReducer, INITIAL_STATE } from './store';
import { createLogger } from 'redux-logger'
import { MainService } from './main/services/main.service';
import { SharedModule } from 'src/shared/shared.module';

const logger = createLogger({
  // ...options
});

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    SidebarComponent,
    NoteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgReduxModule,
    SharedModule
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE, logger);
  }
}
