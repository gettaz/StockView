import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WelcomeComponent } from './components/home/welcome.component';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AssetsModule } from './assets/assets.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { firebaseConfig } from './firebase-config';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PagenotfoundComponent
  ],
  imports: [
    BrowserModule,
    AssetsModule, 
    AngularFireModule.initializeApp(firebaseConfig), 
    AngularFireDatabaseModule,
    RouterModule.forRoot([
      {path: 'welcome', component: WelcomeComponent},
      {path: 'assets', loadChildren: () => import('./assets/assets.module').then(m => m.AssetsModule)}, // Lazy loading AssetsModule
      {path: '', redirectTo: 'welcome', pathMatch: 'full'},
      {path: '**', component: PagenotfoundComponent}
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
