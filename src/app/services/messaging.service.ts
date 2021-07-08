import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserType } from 'src/User';
import { io } from 'socket.io-client';
import { MessageType } from 'src/MessageType';
import { AuthService } from './auth.service';
import { RoomType } from 'src/Room';
import { Observable, Observer, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private socketUrl = 'http://localhost:8080';
  private chatApiUrl = 'http://localhost:8080/api/chats';
  private roomApiUrl = 'http://localhost:8080/api/rooms';
  socket!: any;
  currentRoom!: String;
  constructor(private http: HttpClient, private auth: AuthService) {}

  establishSocketConnection() {
    this.socket = io(this.socketUrl);
  }

  sendMessage(message: MessageType) {
    this.socket.emit('message', message);
  }

  joinRoom(room: any) {
    this.currentRoom = room;
    this.socket.emit('joinRoom', room);
  }

  newMessages = new Observable((observer) => {
    let message: MessageType;
    message = this.socket.on('messageBroadcast', (msg: MessageType) => {
      // console.log('received broadcast message as ', msg);
      observer.next(msg);
    });
    return {
      unsubscribe() {},
    };
  });

  // receivedMessages = new Observable(this.receivedMessageObserver);

  getRooms() {
    return this.http.get<RoomType[]>(this.roomApiUrl);
  }

  getMessages(room: any) {
    return this.http.post<any>(this.chatApiUrl, { room });
  }

  getUser() {
    console.log(this.auth.username);
    return this.auth.username;
  }
}
