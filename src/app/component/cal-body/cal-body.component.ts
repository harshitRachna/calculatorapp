import { Component, OnInit } from '@angular/core';
import { BtnDataService } from 'src/app/service/btn-data.service';

import { TogglemodeService } from 'src/app/service/togglemode.service';
import { UtilityService } from 'src/app/service/utility.service';

@Component({
  selector: 'app-cal-body',
  templateUrl: './cal-body.component.html',
  styleUrls: ['./cal-body.component.scss'],
})
export class CalBodyComponent implements OnInit {
  showstatus: boolean = false;
  invsci: boolean = false;
  constructor(
    public toggle: TogglemodeService,
    private btnData: BtnDataService,
    private us: UtilityService
  ) {}
  // calculator buttons in order
  scbutton: any = this.btnData.scbutton;
  buttons = this.btnData.buttons;
  ngOnInit(): void {
    window?.addEventListener('keyup', (e) => {
      if (e.key === '#') {
        this.degRad(this.toggle.isDeg ? 'r' : 'd');
        return;
      }
      this.calcexp(e.key);
    });
  }

  degRad(type: string) {
    this.toggle.isDeg = type === 'r' ? false : true;

    this.calcexp('DegRad');
  }

  calcexp(clickbtn: any): void {
    switch (clickbtn) {
      case '×':
        this.showstatus = this.us.addcalexp(
          '*',
          'enteredvalue',
          'calcresult',
          this.toggle.isDeg
        );
        break;
      case '÷':
        this.showstatus = this.us.addcalexp(
          '/',
          'enteredvalue',
          'calcresult',
          this.toggle.isDeg
        );
        break;
      default:
        this.showstatus = this.us.addcalexp(
          clickbtn,
          'enteredvalue',
          'calcresult',
          this.toggle.isDeg
        );
        break;
    }
  }
}
