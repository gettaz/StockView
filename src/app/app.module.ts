import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WelcomeComponent } from './components/home/welcome.component';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { AssetsModule } from './components/assets/assets.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
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
    AngularFirestoreModule ,
    RouterModule.forRoot([
      {path: 'welcome', component: WelcomeComponent},
      {path: 'assets', loadChildren: () => import('./components/assets/assets.module').then(m => m.AssetsModule)}, // Lazy loading AssetsModule
      {path: '', redirectTo: 'welcome', pathMatch: 'full'},
      {path: '**', component: PagenotfoundComponent}
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
