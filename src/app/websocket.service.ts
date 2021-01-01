import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  data: any;
  myWebSocket: WebSocketSubject<any> = webSocket('wss://tictactoeonlinescl.herokuapp.com');
  constructor() {
    this.setConnection();
  }

  setConnection(): void {
    this.closeConnection();
    this.myWebSocket = webSocket('wss://tictactoeonlinescl.herokuapp.com');
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
