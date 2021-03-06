import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { fade, grow, slide } from 'src/app/animations/animations';
import { MessagingService } from 'src/app/services/messaging.service';
import { MessageType } from 'src/MessageType';
import { RoomType } from 'src/Room';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [grow],
})
export class ChatComponent implements OnInit {
  active: boolean = false;
  hidePicker: boolean = true;
  socket!: any;
  messages: MessageType[] = [];
  rooms!: RoomType[];
  userList: any[] = [];
  text: String = '';
  isPrivate: boolean = false;
  toUser!: any;

  user: any = this.messagingService.getUser();
  room!: String;
  panelOpenState: boolean = false;
  constructor(
    private messagingService: MessagingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.messagingService.establishSocketConnection();
    this.messagingService.getRooms().subscribe(
      (rooms) => {
        this.rooms = rooms;
      },
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
    this.messagingService.newMessages.subscribe((message: any) => {
      this.messages.push(message);
    });
    this.messagingService.newUser.subscribe((userList: any) => {
      this.userList = userList;
    });
    this.messagingService.newPrivateMessages.subscribe(
      (privateMessage: any) => {
        this.messages.push(privateMessage);
      }
    );
  }

  ngOnDestroy(): void {
    this.logoutUser();
  }

  constructMessage() {
    return {
      text: this.text,
      sender: this.user.username,
      time: Date().slice(16, 21).toString(),
      room: this.messagingService.currentRoom,
    };
  }

  sendMessage() {
    const newMessage: MessageType = this.constructMessage();
    this.text = '';
    this.messages.push(newMessage);
    if (this.isPrivate === false) {
      //LOG console.log(newMessage);
      this.messagingService.sendMessage(newMessage);
    } else {
      this.messagingService.sendPrivateMessage(newMessage, this.toUser);
    }
  }

  joinPrivateRoom(user: any) {
    this.active = true;
    this.isPrivate = true;
    this.toUser = user;
    this.messagingService.joinPrivateRoom(user);
    // console.log(this.toUser);
    this.messagingService.getPrivateMessages(user).subscribe((messages) => {
      this.messages = messages;
      //LOG console.log(this.messages);
    });
    // this.messages = [];
  }

  joinRoom(room: any) {
    this.active = true;
    this.isPrivate = false;
    this.messagingService.joinRoom(room);
    this.messagingService.getMessages(room).subscribe((messages) => {
      this.messages = messages;
    });
  }

  showEmojiPicker() {
    this.hidePicker = !this.hidePicker;
  }

  addEmoji(event: any) {
    const newText = `${this.text}${event.emoji.native}`;
    this.text = newText;
  }

  logoutUser() {
    // localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
