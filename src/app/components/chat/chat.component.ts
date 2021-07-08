import { Component, OnInit } from '@angular/core';
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
  socket!: any;
  messages!: MessageType[];
  rooms!: RoomType[];
  text: String = '';

  username: String = this.messagingService.getUser();
  room!: String;

  constructor(private messagingService: MessagingService) {}

  ngOnInit(): void {
    this.messagingService.establishSocketConnection();
    this.messagingService.getRooms().subscribe((rooms) => {
      this.rooms = rooms;
    });
    this.messagingService.newMessages.subscribe((message: any) => {
      this.messages.push(message);
    });
  }

  constructMessage() {
    return {
      text: this.text,
      sender: this.username,
      time: Date().slice(16, 21).toString(),
      room: this.messagingService.currentRoom,
    };
  }

  sendMessage() {
    const newMessage: MessageType = this.constructMessage();
    this.text = '';
    this.messages.push(newMessage);
    this.messagingService.sendMessage(newMessage);
  }

  joinRoom(room: any) {
    this.messagingService.joinRoom(room);
    this.messagingService.getMessages(room).subscribe((messages) => {
      this.messages = messages;
    });
  }
}
