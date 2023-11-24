import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

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
      console.log('Received message:', msg);

      if (msg.type === 'trade') {
        msg.data.forEach((trade: { s: string; p: number }) => {
          console.log('Trade data:', trade);
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
  searchTickers(term: string): Observable<any> {
    console.log("searchTicker in price service", term);

    if (!term.trim()) {
      // If not search term, return empty array.
      return of([]);
    }
    return this.http.get<any>(`https://api.finnhub.io/api/v1/search?q=${term}&token=ch1hvi9r01qn6tg76npgch1hvi9r01qn6tg76nq0`)
        .pipe(
            tap(response => console.log('Response from searchTickers:', response))
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

  getCurrentPrice(ticker: string): void {
    // Replace with the actual REST API endpoint and your API key
    const url = `https://api.finnhub.io/api/v1/quote?symbol=${ticker}&token=ch1hvi9r01qn6tg76npgch1hvi9r01qn6tg76nq0`;

    this.http.get(url).subscribe({
      next: (response: any) => {
        const currentPrice = response.c; // Assuming 'c' is the property for current price
        this.priceUpdates.next({ ticker, price: currentPrice });
      },
      error: (error) => {
        console.error('Error fetching current price:', error);
      },
      complete: () => {
        console.log('Completed fetching current price');
      }
    });
  }
}