import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'chat-loader',
  templateUrl: './chat-loader.component.html',
  styleUrls: ['./chat-loader.component.scss']
})
export class ChatLoaderComponent implements OnInit {

  fakeChats = new Array(20);

  constructor() { }

  ngOnInit(): void {
  }

}
