import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddAssetComponent } from './add-asset.component';

@NgModule({
  declarations: [
    AddAssetComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [ // Add the AddAssetComponent to the exports array
    AddAssetComponent
  ]
})
export class AddAssetModule { }
