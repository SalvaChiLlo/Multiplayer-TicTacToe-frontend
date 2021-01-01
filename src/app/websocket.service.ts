import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  data: any;
  myWebSocket: WebSocketSubject<any> = webSocket('ws://localhost:5000');
  constructor() {
    this.setConnection();
  }

  setConnection(): void {
    this.closeConnection();
    this.myWebSocket = webSocket('ws://localhost:5000');
  }

  closeConnection(): void {
    this.myWebSocket.unsubscribe();
  }

  sendMessageToServer(status, team, turn, gameStatus): void {
    this.myWebSocket.next({
      status,
      team,
      turn,
      gameStatus,
    });
  }
}
