import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { WelcomeComponent } from './components/home/welcome.component';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { AssetsModule } from './components/assets/assets.module';
import { AssetService } from './services/asset.service';
import { HttpClientModule } from '@angular/common/http'; 
import { PriceService } from './services/price.service';
import { ReactiveFormsModule  } from '@angular/forms';
import 'chartjs-adapter-date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DataTablesModule } from "angular-datatables";
import { welcomeResolverResolver } from './components/home/welcome-resolver.resolver';
import { ClassificationService } from './services/classification.service';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PagenotfoundComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule ,
    DataTablesModule.forRoot(),
    MatButtonToggleModule,
    MatTableModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterModule.forRoot([
      {path: 'welcome',      
      component: WelcomeComponent,
      resolve: {welcome: welcomeResolverResolver}},
      {path: 'assets',
       loadChildren: () => import('./components/assets/assets.module').then(m => m.AssetsModule)}, // Lazy loading AssetsModule
      {path: '', redirectTo: 'welcome', pathMatch: 'full'},
      {path: '**', component: PagenotfoundComponent}
    ]),
    BrowserAnimationsModule
  ],
  providers: [AssetService, PriceService, ClassificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
