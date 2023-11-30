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
      // If not search term, return an empty array.
      return of([]);
    }
  
    return this.http.get<any[]>(`https://api.finnhub.io/api/v1/search?q=${term}&token=ch1hvi9r01qn6tg76npgch1hvi9r01qn6tg76nq0`).pipe(
      tap((response: any) => {
        console.log('Search results:', response);
      }),
      map((response: any) => {
        if (Array.isArray(response.result)) {
          // Filter results by type "Common Stock," "Crypto," or "ETP"
          const filteredResults = response.result.filter((result: SearchResult) => result.type === "Common Stock" || result.type === "ETP");
  
          // Sort the filtered results so that "Common Stock" items appear first
          filteredResults.sort((a: SearchResult, b: SearchResult) => {
            if (a.type === "Common Stock" && b.type !== "Common Stock") {
              return -1; // "Common Stock" items come first
            } else if (a.type !== "Common Stock" && b.type === "Common Stock") {
              return 1; // "Common Stock" items come first
            } else {
              return 0; // No change in order for other types
            }
          });
  
          console.log('Filtered and sorted results:', filteredResults); // Log the filtered and sorted results
  
          return filteredResults;
        } else {
          // Log the unexpected response format
          console.error('Unexpected response format:', response);
          throw new Error('Invalid response format');
        }
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