import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserType } from 'src/User';
import { io } from 'socket.io-client';
import { MessageType } from 'src/MessageType';
import { AuthService } from './auth.service';
import { RoomType } from 'src/Room';
import { observable, Observable, Observer, of } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private socketUrl = baseUrl;
  private chatApiUrl = `${baseUrl}api/chats`;
  private privateChatApiUrl = `${baseUrl}api/privatechats`;
  private roomApiUrl = `${baseUrl}api/rooms`;
  // private socketUrl = 'http://localhost:8080';
  // private chatApiUrl = 'http://localhost:8080/api/chats';
  // private privateChatApiUrl = 'http://localhost:8080/api/privatechats';
  // private roomApiUrl = 'http://localhost:8080/api/rooms';
  // private usersApiUrl = '/api/users';
  // private usersApiUrl = 'http://localhost:8080/api/users';
  socket: any = io(this.socketUrl, { autoConnect: false });
  currentRoom!: String;
  currentUser: any = { username: '', userID: '' };
  toUser: any = { username: '', userID: '' };
  constructor(private http: HttpClient, private auth: AuthService) {}

  myVariable = 'Hello';

  establishSocketConnection() {
    //LOG console.log(baseUrl);
    let username = this.auth.username;
    this.socket.auth = { username };
    //LOG console.log(username);
    // this.socket.onAny((eventName: any, ...args: any) => {
    //   console.log(eventName);
    // });
    this.socket.connect();
    this.socket.emit('newUser', { username });
    this.currentUser.username = username;
  }

  sendMessage(message: MessageType) {
    this.socket.emit('message', message);
  }

  joinRoom(room: any) {
    this.socket.emit('leaveRoom', this.currentRoom);
    this.currentRoom = room;
    this.socket.emit('joinRoom', room);
  }

  joinPrivateRoom(user: any) {
    this.toUser = user;
  }

  newMessages = new Observable((observer) => {
    let message: MessageType;
    message = this.socket.on('messageBroadcast', (msg: MessageType) => {
      //LOG console.log('received broadcast message as ', msg);
      //this is a fucntion to send messges to chat component
      //TODO checkk for multipe transmission bug - DONE
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

  getPrivateMessages(fromUser: any) {
    let currentUserID = this.currentUser.username;
    let senderName = fromUser.username;
    //LOG console.log(currentUserID);
    //LOG console.log(senderName);
    return this.http.post<any>(this.privateChatApiUrl, {
      senderName,
      currentUserID,
    });
  }

  getUser() {
    // console.log(this.auth.username);
    // console.log(this.currentUser);
    return this.currentUser;
  }

  //--------------------------------------------------------------------------//
  //below this is code for direct-messaging only!
  //--------------------------------------------------------------------------//

  //--------------------------------------------------------------------------//
  //sending a message to a particular user
  sendPrivateMessage(message: MessageType, user: any) {
    //LOG console.log(message);
    //LOG console.log(user);
    message.room = user.username;
    //LOG console.log(message);
    this.socket.emit('privateMessage', { content: message, to: user.userID });
  }
  //--------------------------------------------------------------------------//

  //--------------------------------------------------------------------------//
  //sending new messages recieved from another user to chat component for
  //displaying using an observer
  newPrivateMessages = new Observable((observer) => {
    let message: MessageType;
    message = this.socket.on('privateMessage', (message: any) => {
      //LOG console.log(message);
      if (message.sender == this.toUser.username) {
        if (message.room == this.currentUser.username) {
          observer.next(message);
        }
      }
    });
    return {
      unsubscribe() {},
    };
  });
  //--------------------------------------------------------------------------//

  //--------------------------------------------------------------------------//
  //addding newly connected users to current userList on frontend side to allow
  //for sending of messages
  newUser = new Observable((observer) => {
    let user: any;
    user = this.socket.on('updateUserList', (userList: any) => {
      this.currentUser.userID = this.socket.id;
      userList.forEach((user: any) => {
        user.self = user.userID === this.socket.id;
        // this.socket.initReactiveProperties(user);
      });
      userList = userList.sort((a: any, b: any) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      // console.log(userList);
      // console.log(usr);
      observer.next(userList);
    });
    return {
      unsubscribe() {},
    };
  });
  //--------------------------------------------------------------------------//
}
