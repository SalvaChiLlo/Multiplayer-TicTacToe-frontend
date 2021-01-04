import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  data: any;
  myWebSocket: WebSocketSubject<any> = webSocket(environment.socketURL);
  constructor() {
    this.setConnection();
  }

  setConnection(): void {
    this.closeConnection();
    this.myWebSocket = webSocket(environment.socketURL);
  }

  closeConnection(): void {
    this.myWebSocket.unsubscribe();
  }

  sendMessageToServer(status, team, turn, gameStatus, name): void {
    this.myWebSocket.next({
      status,
      team,
      turn,
      gameStatus,
      name
    });
  }
}
