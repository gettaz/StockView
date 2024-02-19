import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssetListComponent } from './asset-list/asset-list.component';
import { savedAssetsResolver } from './asset-list/saved-assets.resolver';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AssetListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    RouterModule.forChild([
      { path: '', 
      component: AssetListComponent,
      resolve: { assets: savedAssetsResolver }
    }
    ])]
})
export class AssetsModule { }
