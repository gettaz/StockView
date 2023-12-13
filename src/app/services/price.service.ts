import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SearchResult } from '../models/SearchResult'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private webSocket: WebSocket;
  private isConnectionOpen = false;
  private messageQueue: string[] = [];
  public priceUpdates = new Subject<{ ticker: string, price: number }>();
  public usTickers: string[] = [];

  constructor(private http: HttpClient) {
    this.webSocket = new WebSocket('wss://ws.finnhub.io?token=ch1hvi9r01qn6tg76npgch1hvi9r01qn6tg76nq0');

    this.webSocket.addEventListener('open', () => {
      console.log('WebSocket connection opened');
      this.isConnectionOpen = true;
      this.processMessageQueue();
    });

    this.webSocket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'trade') {
        msg.data.forEach((trade: { s: string; p: number }) => {
          this.priceUpdates.next({ ticker: trade.s, price: trade.p });
        });
      }
    });

    this.webSocket.addEventListener('error', (error) => {
      console.error('WebSocket Error:', error);
    });

    this.webSocket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      this.isConnectionOpen = false;
    });

    this.fetchUsTickers().subscribe({
      next: tickers => console.log('US tickers fetched', tickers),
      error: error => console.error('Error fetching US tickers', error)
    });
    
   }
  fetchUsTickers(): Observable<string[]> {
    const url = `https://api.finnhub.io/api/v1/stock/symbol?exchange=US&token=ch1hvi9r01qn6tg76npgch1hvi9r01qn6tg76nq0`;
    return this.http.get<any[]>(url).pipe(
      tap((response: any) => {
        console.log('fetchUsTickers results:', response);
      }),
      map((response: any[]) => {
        this.usTickers = response.map(tickerInfo => tickerInfo.symbol);
        return this.usTickers;
      }),
      catchError((error) => {
        console.error('Error fetching US tickers:', error);
        return throwError(error);
      })
    );
  }
  subscribeToTicker(ticker: string) {
    const message = JSON.stringify({ 'type': 'subscribe', 'symbol': ticker });
    console.log('Preparing to send message:', message);
    if (this.isConnectionOpen) {
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
      if (message) {
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
}