import { Component, OnInit } from '@angular/core';
import { TogglemodeService } from 'src/app/service/togglemode.service';
import { UtilityService } from 'src/app/service/utility.service';

@Component({
  selector: 'app-cal-body',
  templateUrl: './cal-body.component.html',
  styleUrls: ['./cal-body.component.scss'],
})
export class CalBodyComponent implements OnInit {
  showstatus: boolean = false;
  constructor(public toggle: TogglemodeService, private us: UtilityService) {}
  // calculator buttons in order
  buttons = [
    { sign: 'AC', type: 'A' },
    { sign: '±', type: 'A' },
    { sign: '%', type: 'A' },
    { sign: '÷', type: 'B' },
    { sign: 7 },
    { sign: 8 },
    { sign: 9 },
    { sign: '×', type: 'B' },
    { sign: 4 },
    { sign: 5 },
    { sign: 6 },
    { sign: '-', type: 'B' },
    { sign: 1 },
    { sign: 2 },
    { sign: 3 },
    { sign: '+', type: 'B' },
    { sign: '', disabled: true },
    { sign: 0 },
    { sign: '.' },
    { sign: '=', type: 'B' },
  ];
  ngOnInit(): void {
    window?.addEventListener('keyup', (e) => {
      this.showstatus = this.us.addcalexp(e.key, 'enteredvalue', 'calcresult');
    });
  }
  calcexp(clickbtn: any): void {
    switch (clickbtn.target.value) {
      case '×':
        this.showstatus = this.us.addcalexp('*', 'enteredvalue', 'calcresult');
        break;
      case '÷':
        this.showstatus = this.us.addcalexp('/', 'enteredvalue', 'calcresult');
        break;
      default:
        this.showstatus = this.us.addcalexp(
          clickbtn.target.value,
          'enteredvalue',
          'calcresult'
        );
        break;
    }
  }
}
