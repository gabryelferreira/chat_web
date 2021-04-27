import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'title-description',
  templateUrl: './title-description.component.html',
  styleUrls: ['./title-description.component.scss']
})
export class TitleDescriptionComponent implements OnInit {

  @Input("title") title: string;
  @Input("description") description: string;

  constructor() { }

  ngOnInit(): void {
  }

}
