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

  ngOnInit(): void {
    window?.addEventListener('keyup', (e) => {
      this.showstatus = this.us.addcalexp(e.key, 'enteredvalue', 'calcresult');
    });
  }
}
