import { Injectable } from '@angular/core';

export interface sign {
  type: string;
  sign: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() { }
  // field to store input numbers
  numbers: number[] = [];
  // field to store input numbers and sign
  calcArray: any = [];
  // field to store calculater result
  calcTotal!: number;

  calc = false;

  // method to identify the entered input is a sign or number
  identifySign(keypressed: string): sign {
    let obj: any = {};
    switch (keypressed) {
      case '+':
      case '-':
      case '%':
        obj = { type: 'sign', sign: keypressed };
        break;

      case '*':
        obj = { type: 'sign', sign: 'x' };
        break;
      case '/':
        obj = { type: 'sign', sign: '÷' };
        break;
      case Number(keypressed).toString():
        obj = { type: 'number', sign: keypressed };
        break;

      case '=':
      case 'Enter':
        obj = { type: 'cal', sign: '=' };
        break;

      default:
        obj = { type: '', sign: '' };
        break;
    }

    return obj;
  }


  // perform the requered operation 
  operationsOnSign(enteredkey: sign): sign {
    if (enteredkey.type !== 'cal') {
      if (enteredkey.type === '') return { type: '', sign: '' };

      if (enteredkey.type === 'number') {
        this.numbers.push(Number(enteredkey.sign));
      }
      if (enteredkey.type === 'sign') {
        const number = Number(this.numbers.join(''));

        if (number.toString() == this.numbers.join(''))
          this.calcArray.push(number);

        if (
          this.identifySign(this.calcArray[this.calcArray.length - 1]).type ===
            'sign' ||
          !this.calcArray[0]
        )
          return { type: '', sign: '' };

        if (this.calcArray.length % 2 !== 0)
          this.calcTotal = this.calculate(this.calcArray);
        this.calcArray.push(enteredkey.sign);
        this.numbers = [];
      }
    } else {
    }
    return enteredkey;
  }



// method to calculate the result
  calculate(calArray: any) {
    let num = calArray[0];
    calArray.forEach((numsign: any, i: number) => {
      if (typeof numsign === 'string') {
        switch (numsign) {
          case '+':
            num += calArray[i + 1];
            break;
          case '-':
            num -= calArray[i + 1];
            break;
          case '%':
            num %= calArray[i + 1];
            break;
          case 'x':
            num *= calArray[i + 1];
            break;
          case '÷':
            num /= calArray[i + 1];
            break;
        }
      }
    });
 

    return num;
  }



  addcalexp(value: string, inputId: string, resutlId: string): boolean {
    const span = document.createElement('span'),
      enteredkey = this.operationsOnSign(this.identifySign(value)),
      input = document.getElementById(inputId) as HTMLElement,
      result = document.getElementById(resutlId) as HTMLElement;

    if (enteredkey.type === 'cal') {
      const number = Number(this.numbers.join(''));

      if (number.toString() === this.numbers.join(''))
        this.calcArray.push(number);

      if (
        this.identifySign(this.calcArray[this.calcArray.length - 1]).type ===
          'sign' ||
        !this.calcArray[0]
      )
        return false;

      this.calcTotal = this.calculate(this.calcArray);

      this.numbers = [this.calcTotal];
      this.calcArray = [];
      input.innerHTML = this.calcTotal.toString();
      if (this.calcTotal) result.textContent = '';
      this.calc = true;
      return true;
    }
    if (this.calc === true && enteredkey.type === 'number') {
      input.innerHTML = '';
      this.numbers.shift();
      this.calcTotal = NaN;
    }
    span.textContent = enteredkey.sign;
    span.setAttribute('class', enteredkey.type);
    input.appendChild(span);

    if (this.calcTotal) result.textContent = this.calcTotal.toString();
    this.calc = false;
    return false;
  }
}
