import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { fade, grow, slide } from 'src/app/animations/animations';
const texts = [
  'hey',
  'hi',
  "what's up?",
  'Nothing much, I just wanted to know if you are free today for the outing we have planned at 5?',
];
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [grow ],
})
export class ChatComponent implements OnInit {
  socket!: any;
  texts: String[] = texts;
  constructor() {}
  ngOnInit(): void {
    this.socket = io('http://localhost:8080');
    this.socket.emit('joinRoom', 'General');
    this.socket.on('welcomMessage', console.log('Received a warm welcome!'));
  }
}
