import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

 isExpanded = false;

  collapse(): any {
    this.isExpanded = false;
  }

  toggle(): any {
    this.isExpanded = !this.isExpanded;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
