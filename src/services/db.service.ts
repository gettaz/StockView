import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';

@Injectable({
    providedIn: 'root'
  })
  export class DbService {
    constructor(
      private firestore: AngularFirestore,
    ) {}
  
    // Method for saving user data
    saveUserData(userData: any): Promise<void> {
        const userId = auth().currentUser.uid; // Update the reference to auth
        return this.firestore.doc(`users/${userId}`).set(userData); // Update the reference to firestore
      }
  
    // Method for retrieving user data
    getUserData(): Promise<any> {
        const userId = auth().currentUser.uid; // Update the reference to auth
        return this.firestore.doc(`users/${userId}`).valueChanges().toPromise(); // Update the reference to firestore
      }
  }
  