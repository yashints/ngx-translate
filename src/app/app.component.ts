import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: any = {
    name: 'Yaser'
  };
  constructor(private translateService: TranslateService) {
    translateService.setDefaultLang('en');
  }

  switchLanguage(language: string) {
    this.translateService.use(language);
  }
}
