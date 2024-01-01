import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssetListComponent } from './asset-list/asset-list.component';
import { savedAssetsResolver } from './saved-assets.resolver';

@NgModule({
  declarations: [
    AssetListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', 
      component: AssetListComponent,
      resolve: { assets: savedAssetsResolver }
    }
    ]),
  ]
})
export class AssetsModule { }
