import { WebsocketService } from './../websocket.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-join-party',
  templateUrl: './join-party.component.html',
  styleUrls: ['./join-party.component.css'],
})
export class JoinPartyComponent implements OnInit {
  name: any;
  connectedClients: string[] = [];
  constructor(private socket: WebsocketService) {}

  ngOnInit(): void {
    this.processData();
  }

  processData(): void {
    this.socket.myWebSocket.subscribe({
      next: (data) => {
        console.log(data);
        const { status, names } = data;
        if (status === 'Name') {
          this.connectedClients = names;
        }
      },
      error: (error) => console.error(error),
      complete: () => console.log('Completed'),
    });
  }

  joinParty(): void {
    if (this.name) {
      this.socket.sendMessageToServer('Name', '', '', '', this.name);
    }
  }
}
