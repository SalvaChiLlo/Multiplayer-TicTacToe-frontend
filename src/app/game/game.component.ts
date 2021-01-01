import { WebsocketService } from './../websocket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  cont = 0;
  gameFinished = false;

  turn = document.getElementById('turn');
  title = document.getElementById('title');
  grid: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName(
    'box'
  ) as HTMLCollectionOf<HTMLElement>;
  resetBTN = document.getElementById('reset');

  status = '';
  team = '';
  playerTurn = '';
  gameStatus = [];

  constructor(private socket: WebsocketService) {}

  // installPwa(): void {
  //   this.Pwa.promptEvent.prompt();
  // }

  ngOnInit(): void {
    this.turn = document.getElementById('turn');
    this.title = document.getElementById('title');
    this.grid = document.getElementsByClassName(
      'box'
    ) as HTMLCollectionOf<HTMLElement>;
    this.resetBTN = document.getElementById('reset');
    this.processData();
  }

  processData(): void {
    this.socket.myWebSocket.subscribe({
      next: (data) => {
        console.log(data);
        const { status, team, turn, gameStatus } = data;
        this.status = status;
        if (team) {
          this.team = team;
        }
        this.gameStatus = gameStatus;
        this.playerTurn = turn;
        // tslint:disable-next-line: prefer-for-of
        this.cont = 0;
        for (let i = 0; i < this.grid.length; i++) {
          this.grid[i].innerHTML = gameStatus[i];
          if (gameStatus[i] !== '') {
            this.cont++;
          }
        }

        this.checkGameStatus();
      },
      error: (error) => console.error(error),
      complete: () => console.log('Completed'),
    });
  }

  startGame(): void {
    this.title.style.display = 'none';

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i].style.display = 'flex';
    }

    this.resetBTN.style.display = 'block';

    this.turn.style.display = 'block';
    this.turn.innerHTML =
      this.team === this.playerTurn
        ? this.team === 'player1'
          ? 'Your turn X'
          : 'Your turn O'
        : 'Not your turn';
  }

  play(event): void {
    if (this.playerTurn === this.team) {
      if (event.innerHTML === '' && !this.gameFinished) {
        if (this.playerTurn === 'player1') {
          event.innerHTML = 'X';
          this.turn.innerHTML =
            this.team === this.playerTurn
              ? this.team === 'player1'
                ? 'Your turn X'
                : 'Your turn O'
              : 'Not your turn';
        } else {
          event.innerHTML = 'O';
          this.turn.innerHTML =
            this.team === this.playerTurn
              ? this.team === 'player1'
                ? 'Your turn X'
                : 'Your turn O'
              : 'Not your turn';
        }
      }
      const gameStatus = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.grid.length; i++) {
        gameStatus.push(this.grid[i].innerHTML);
      }

      this.socket.sendMessageToServer(
        'HI',
        this.team,
        this.playerTurn,
        gameStatus
      );
    }
    this.checkGameStatus();
  }

  reset(): void {
    const grid: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName(
      'box'
    ) as HTMLCollectionOf<HTMLElement>;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < grid.length; i++) {
      grid[i].innerHTML = '';
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < grid.length; i++) {
      grid[i].style.color = 'white';
    }
    this.cont = 0;
    this.turn.style.color = 'white';
    this.gameFinished = false;
    this.socket.setConnection();
    this.processData();
    this.turn.innerHTML =
      this.team === this.playerTurn
        ? this.team === 'player1'
          ? 'Your turn X'
          : 'Your turn O'
        : 'Not your turn';
  }

  checkGameStatus(): void {
    let gridComplete = true;
    let xWins = false;
    let oWins = false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i].innerHTML === '') {
        gridComplete = false;
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        let player = '';
        if (j % 2 === 0) {
          player = 'X';
        } else {
          player = 'O';
        }
        // Check horizontal coincidences
        if (
          this.grid[1 + 3 * i - 1].innerHTML === player &&
          this.grid[2 + 3 * i - 1].innerHTML === player &&
          this.grid[3 + 3 * i - 1].innerHTML === player
        ) {
          this.grid[1 + 3 * i - 1].style.color = 'red';
          this.grid[2 + 3 * i - 1].style.color = 'red';
          this.grid[3 + 3 * i - 1].style.color = 'red';
          if (player === 'X') {
            xWins = true;
          } else {
            oWins = true;
          }
        }

        // Check vertical coincidences
        if (
          this.grid[0 + i].innerHTML === player &&
          this.grid[3 + i].innerHTML === player &&
          this.grid[6 + i].innerHTML === player
        ) {
          this.grid[0 + i].style.color = 'red';
          this.grid[3 + i].style.color = 'red';
          this.grid[6 + i].style.color = 'red';
          if (player === 'X') {
            xWins = true;
          } else {
            oWins = true;
          }
        }

        // Check diagonal coincidences
        if (
          this.grid[0].innerHTML === player &&
          this.grid[4].innerHTML === player &&
          this.grid[8].innerHTML === player
        ) {
          this.grid[0].style.color = 'red';
          this.grid[4].style.color = 'red';
          this.grid[8].style.color = 'red';
          if (player === 'X') {
            xWins = true;
          } else {
            oWins = true;
          }
        }
        if (
          this.grid[2].innerHTML === player &&
          this.grid[4].innerHTML === player &&
          this.grid[6].innerHTML === player
        ) {
          this.grid[2].style.color = 'red';
          this.grid[4].style.color = 'red';
          this.grid[6].style.color = 'red';
          if (player === 'X') {
            xWins = true;
          } else {
            oWins = true;
          }
        }
      }
    }

    this.turn.innerHTML =
      this.team === this.playerTurn
        ? this.team === 'player1'
          ? 'Your turn X'
          : 'Your turn O'
        : 'Not your turn';

    if (xWins) {
      this.turn.innerHTML = 'X wins';
      this.gameFinished = true;
    }

    if (oWins) {
      this.turn.innerHTML = 'O wins';
      this.gameFinished = true;
    }

    if (gridComplete && !(xWins || oWins)) {
      this.turn.innerHTML = 'Game has finished';
      this.gameFinished = true;
    }

    if (this.cont === 8) {
      this.turn.innerHTML = 'Game has finished';
      this.gameFinished = true;
    }

    if (this.turn.innerHTML === 'Game has finished') {
      this.turn.style.color = 'yellow';
    }

    if (xWins || oWins) {
      this.turn.style.color = 'green';
    }
  }
}
