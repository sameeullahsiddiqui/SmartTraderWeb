import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { slideInAnimation } from './shared/animations/animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent {
  title = 'JCASWeb';
  updateUserExpireTime: any;
  triggeredNotification = false;
  hideSideNav = false;
  isAuth = false;

  constructor(
    private translate: TranslateService
  ) {
  }

  prepareRoute(outlet: RouterOutlet): any {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  toggleMenuEventClicked($event: any): any {
    this.hideSideNav = $event;
  }
}
