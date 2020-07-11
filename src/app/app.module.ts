import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedModule } from 'src/shared/shared.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { SidebarComponent } from './main/components/sidebar/sidebar.component';
import { NoteComponent } from './main/components/note/note.component';

import { MainService } from './main/services/main.service';

import { StoreModule } from '@ngrx/store';

import {NoteReducer} from './store/reducers/note.reducer';
import { environment } from 'src/environments/environment';

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
    StoreModule.forRoot({ notes: NoteReducer }) ,
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),

    LayoutModule,
    SharedModule
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule {}
