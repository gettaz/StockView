import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Asset } from '../models/Asset';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private firestore: AngularFirestore) {}

  getAssets(): Observable<Asset[]> {
    return this.firestore.collection<Asset>('assets').valueChanges();
  }

  addAsset(userId: string, asset: Asset): Promise<DocumentReference<any>> {
    return this.firestore.collection('users').doc(userId).collection('assets').add(asset);
  }
}