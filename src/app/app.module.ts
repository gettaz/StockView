import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WelcomeComponent } from './components/home/welcome.component';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { AssetsModule } from './components/assets/assets.module';
import { AssetService } from './services/asset.service';
import { HttpClientModule } from '@angular/common/http'; 
import { PriceService } from './services/price.service';
import { FormsModule } from '@angular/forms';
import 'chartjs-adapter-date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DataTablesModule } from "angular-datatables";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PagenotfoundComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AssetsModule, 
    FormsModule,
    DataTablesModule.forRoot(),
    MatButtonToggleModule,
    RouterModule.forRoot([
      {path: 'welcome', component: WelcomeComponent},
      {path: 'assets', loadChildren: () => import('./components/assets/assets.module').then(m => m.AssetsModule)}, // Lazy loading AssetsModule
      {path: '', redirectTo: 'welcome', pathMatch: 'full'},
      {path: '**', component: PagenotfoundComponent}
    ]),
    BrowserAnimationsModule
  ],
  providers: [AssetService, PriceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
