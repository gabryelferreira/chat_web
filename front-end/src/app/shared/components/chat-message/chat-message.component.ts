import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { IMessage } from '@app/shared/models/message';

@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatMessageComponent implements OnInit {

  @Input('message') message: IMessage;
  @Input('messageBefore') messageBefore: IMessage;

  constructor() { }

  ngOnInit(): void {
  }

}
