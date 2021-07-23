import { Component, OnInit } from '@angular/core';
import { TogglemodeService } from 'src/app/service/togglemode.service';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {
  mode: string = 'light';
  constructor(public toggle:TogglemodeService) { }

  ngOnInit(): void {
  }

}
