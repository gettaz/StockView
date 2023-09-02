import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  private webSocket: WebSocket;
  public priceUpdates = new Subject<{ ticker: string, price: number }>();

  constructor() {
    this.webSocket = new WebSocket('wss://ws.finnhub.io?token=ch1hvi9r01qn6tg76npgch1hvi9r01qn6tg76nq0');

    this.webSocket.addEventListener('open', () => {
      console.log('WebSocket connection opened');
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
    });
  }

  subscribeToTicker(ticker: string) {
    try {
      const message = JSON.stringify({ 'type': 'subscribe', 'symbol': ticker });
      console.log('Sending message:', message);
      this.webSocket.send(message);
      console.log('Subscribed to ticker:', ticker);
    } catch (err) {
      console.error('Error while subscribing to ticker:', err);
    }
  }
}
