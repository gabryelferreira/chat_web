import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {

  isMenuVisibleMobile: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleMenuOpened(): void {
    this.isMenuVisibleMobile = !this.isMenuVisibleMobile;
  }

}
