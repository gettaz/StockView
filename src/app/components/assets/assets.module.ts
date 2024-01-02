import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssetListComponent } from './asset-list/asset-list.component';
import { savedAssetsResolver } from './asset-list/saved-assets.resolver';

@NgModule({
  declarations: [
    AssetListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', 
      component: AssetListComponent,
      resolve: { assets: savedAssetsResolver }
    }
    ])]
})
export class AssetsModule { }
