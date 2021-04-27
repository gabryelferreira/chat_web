import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-show-image',
  templateUrl: './dialog-show-image.component.html',
  styleUrls: ['./dialog-show-image.component.scss']
})
export class DialogShowImageComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public imageUrl: string,
  ) { }

  ngOnInit(): void {
  }

}
