import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   version: string = '1.0.0';
   username: string = 'Samee';
  // helpUrl: string;
  // timeZoneList: string[];
  // searchText: string;
  // selectedLanguage: Language;
  // languages: Language[];

  selectedTimeZone: any;
  linkConfig: any[] = [];
  linkConfigMenu: any[] = [];
  userData: any;
  isActive = true;
  languageDropdown = false;
  userTimeZone: any;

  @Output() toggleMenuEvent = new EventEmitter<boolean>();
  hideSideNav = false;

  constructor() {
  }

  ngOnInit() {
  }

  getVersion() {
    //this.version = environment.version.current;
  }

  hideSideNavEvent() {
    this.hideSideNav = !this.hideSideNav;
    this.toggleMenuEvent.emit(this.hideSideNav);
  }

  hideSubMenu(event: any) {
    this.languageDropdown = false;
  }

  logout(): void {
    //this.authService.signOut();
  }

}
