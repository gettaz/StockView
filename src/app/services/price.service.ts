import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SearchResult } from '../models/SearchResult'; // Adjust the import path as needed
import { TimelineSummary } from '../models/TimelineSummary';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private webSocket: WebSocket | null | undefined;
  private isConnectionOpen = false;
  private messageQueue: string[] = [];
  public priceUpdates = new Subject<{ ticker: string, price: number }>();
  public usTickers: string[] = [];

  constructor(private http: HttpClient) {
   }

   public initializeWebSocket() {
    this.priceUpdates = new Subject<{ ticker: string, price: number }>();
    if (!this.webSocket || this.webSocket.readyState === WebSocket.CLOSED) {
      this.webSocket = new WebSocket('wss://ws.finnhub.io?token=ch1hvi9r01qn6tg76npgch1hvi9r01qn6tg76nq0');
      this.webSocket.addEventListener('message', (event) => {
        const msg = JSON.parse(event.data);
        console.log(msg);
        if (msg.type === 'trade') {
          msg.data.forEach((trade: { s: string; p: number }) => {
            this.priceUpdates.next({ ticker: trade.s, price: trade.p }); //TODO: this should be one time nor foreach, if price ===  dont change 
          });
        }
      });
      this.fetchUsTickers().subscribe({
        next: tickers => console.log('US tickers fetched', tickers),
        error: error => console.error('Error fetching US tickers', error)
      });
      this.webSocket.addEventListener('open', () => {
        console.log('WebSocket connection opened');
        this.isConnectionOpen = true;
        this.processMessageQueue();
      });

      this.webSocket.addEventListener('error', (error) => {
        console.error('WebSocket Error:', error);
      });

      this.webSocket.addEventListener('close', () => {
        console.log('WebSocket connection closed');
        this.isConnectionOpen = false;
      });
    }
  }

  fetchUsTickers(): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDg1OTc4NzcsImV4cCI6MTcwODc3MDY3NywiaWF0IjoxNzA4NTk3ODc3LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.lQadD_SBIjDfrOR5nEGicCbreNR3z12Of01feF-Lb0k'
    });
    const url = `http://localhost:5130/api/assets/allowed`;
  
    // Ensure the HTTP GET request is typed to return any (to be safely cast later)
    return this.http.get<any>(url, { headers: headers }).pipe(
      tap(response => {
        console.log('fetchUsTickers results:', response);
      }),
      map(response => {
        // Check if response is an array and each element is a string
        if (Array.isArray(response) && response.every(element => typeof element === 'string')) {
          this.usTickers = response;
        } else {
          // Handle the case where response is not an array of strings
          console.error('Invalid response type:', response);
          // You might want to throw an error or return an empty array instead
          this.usTickers = [];
        }
        return this.usTickers;
      }),
      catchError(error => {
        console.error('Error fetching US tickers:', error);
        return of(this.usTickers); 
      })
    );
  }
  

  fetchTimelineSummary(aggregationType : string): Observable<TimelineSummary[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDg1OTc4NzcsImV4cCI6MTcwODc3MDY3NywiaWF0IjoxNzA4NTk3ODc3LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.lQadD_SBIjDfrOR5nEGicCbreNR3z12Of01feF-Lb0k'
    });
    let apiUrl = `http://localhost:5130/PastPrice/historic?aggregationType=${aggregationType}`; // API URL

    return this.http.get<TimelineSummary[]>(apiUrl, { headers: headers }).pipe(
      tap((response) => {
        console.log('fetchTimelineSummary results:', response);
      }),
      catchError((error) => {
        console.error('Error fetching fetchTimelineSummary:', error);
        return throwError(() => new Error('Error fetching fetchTimelineSummary'));
      })
    );
  }

  subscribeToTicker(ticker: string) {
    const message = JSON.stringify({ 'type': 'subscribe', 'symbol': ticker });
    console.log('Preparing to send message:', message);
    if (this.webSocket && this.isConnectionOpen) {
      this.webSocket.send(message);
      console.log('Subscribed to ticker:', ticker);
    } else {
      console.log('Connection not open. Queuing message:', message);
      this.messageQueue.push(message);
    }
  }

  searchTickers(term: string): Observable<SearchResult[]> {
    console.log("searchTicker in price service", term);
  
    if (!term.trim()) {
      return of([]);
    }
  
    return this.http.get<any[]>(`https://api.finnhub.io/api/v1/search?q=${term}&token=ch1hvi9r01qn6tg76npgch1hvi9r01qn6tg76nq0`).pipe(
      tap((response: any) => {
        console.log('Search results:', response);
      }),
      map((response: any) => {
        // ... existing processing code ...
        // Filter to include only tickers that are in the usTickers list
        return response.result.filter((result: SearchResult) => this.usTickers.includes(result.symbol));
      }),

      catchError((error) => {
        console.error('Error fetching search results:', error);
        return throwError(error);
      })
    );
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (this.webSocket && message) {
        this.webSocket.send(message);
        console.log('Sending queued message:', message);
      }
    }
  }

  getCurrentPrice(ticker: string): Observable<number> {
    console.log('getting price of:', ticker);

    const url = `https://api.finnhub.io/api/v1/quote?symbol=${ticker}&token=ch1hvi9r01qn6tg76npgch1hvi9r01qn6tg76nq0`;
  
    return this.http.get(url).pipe(
      map((response: any) => {
        if (response && response.c) {
          return response.c; // Assuming 'c' is the property for current price
        } else {
          throw new Error('Invalid response format');
        }
      }),
      catchError((error) => {
        console.error('Error fetching current price:', error);
        return throwError(error);
      })
    );
  }

  public closeWebSocket() {
    if (this.webSocket && this.isConnectionOpen) {
      console.log('Closing WebSocket connection');
      this.webSocket.close();
      this.isConnectionOpen = false;
      this.webSocket = null;
    }
  }
}