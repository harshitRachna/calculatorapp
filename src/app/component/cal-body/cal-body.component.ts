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
  scbutton = [
    { sign: '(', type: 'C' },
    {
      sign: ')',
      type: 'C',
      html: '',
      disabled: false,
    },
    {
      sign: 'x!',
      type: 'A',
    },
    { sign: 'Inv' },
    {
      sign: 'sin',
      type: 'B',
    },
    { sign: 'In' },
    { sign: '𝛑', type: 'C' },
    {
      sign: 'cos',
      type: 'B',
    },
    {
      sign: 'log',
      type: 'A',
    },
    { sign: 'e' },
    {
      sign: 'tan',
      type: 'B',
    },
    {
      sign: '√',
    },


    { sign: 'x²', type: 'C' },
    { sign: 'Ans' },
    { sign: 'EXP' },
  {sign:'x'}
   
  ];
  buttons = [
    { sign: 'AC', type: 'A' },
    { sign: '-1', html: 'CE', disabled: false },

    { sign: '%', type: 'A' },
    { sign: '÷', type: 'B' },
    { sign: '7' },
    { sign: '8' },
    { sign: '9' },
    { sign: '×', type: 'B' },
    { sign: '4' },
    { sign: '5' },
    { sign: '6' },
    { sign: '-', type: 'B' },
    { sign: '1' },
    { sign: '2' },
    { sign: '3' },
    { sign: '+', type: 'B' },
    { sign: '±', type: 'A' },
    { sign: '0' },
    { sign: '.' },
    { sign: '=', type: 'B' },
  ];
  ngOnInit(): void {
    window?.addEventListener('keyup', (e) => {
      this.calcexp(e.key);
    });
  }
  calcexp(clickbtn: any): void {
    switch (clickbtn) {
      case '×':
        this.showstatus = this.us.addcalexp('*', 'enteredvalue', 'calcresult');
        break;
      case '÷':
        this.showstatus = this.us.addcalexp('/', 'enteredvalue', 'calcresult');
        break;
      default:
        this.showstatus = this.us.addcalexp(
          clickbtn,
          'enteredvalue',
          'calcresult'
        );
        break;
    }
  }
}
