import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WelcomeComponent } from './home/welcome.component';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AssetsModule } from './assets/assets.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PagenotfoundComponent
  ],
  imports: [
    BrowserModule,
    AssetsModule,  // Include the AssetsModule in the imports array
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
