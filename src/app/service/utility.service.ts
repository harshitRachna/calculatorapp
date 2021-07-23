import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  identifySign(keypressed: string) {
    switch (keypressed) {
      case '+' || '-' ||'%' || '*' || '/':
        return 'sign';
      case Number(keypressed).toString():
        return 'number';
      
      
    }
  }

  addcalexp(value: string, elid: string) {
    const span = document.createElement('span');

    span.textContent = value;
    span.setAttribute('class', 'sign');
    document.getElementById(elid)?.appendChild(span);
  }
}
