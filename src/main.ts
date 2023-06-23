import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))
  .finally(()=>{
    const firebaseConfig = {
      apiKey: "AIzaSyDtfJq5-4RBaB786Deq4_cKnDerTez-YpI",
      authDomain: "assetviewer-7ade8.firebaseapp.com",
      projectId: "assetviewer-7ade8",
      storageBucket: "assetviewer-7ade8.appspot.com",
      messagingSenderId: "59788748970",
      appId: "1:59788748970:web:2bca430790ccbf0a8fc8d3",
      measurementId: "G-CRG7NZ6TGP"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  });
