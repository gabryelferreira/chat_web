import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loader-background',
  templateUrl: './loader-background.component.html',
  styleUrls: ['./loader-background.component.scss']
})
export class LoaderBackgroundComponent implements OnInit {

  @Input("isLoading") isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
