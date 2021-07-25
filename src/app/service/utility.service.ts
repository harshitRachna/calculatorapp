import { Injectable } from '@angular/core';

export interface sign {
  type: string;
  sign: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}
  // field to store input numbers
  numbers: any = [];
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
      case '±':
        obj = { type: 'nev', sign: '-' };
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
      case '.':
        obj = { type: 'point', sign: keypressed };
        break;

      case '=':
      case 'Enter':
        obj = { type: 'cal', sign: '=' };
        break;
      case 'AC':
        obj = { type: 'clean', sign: 'AC' };
        break;
      default:
        obj = { type: '', sign: '' };
        break;
    }

    return obj;
  }
  addnum() {
    if (this.numbers.length === 0) return;
    let num = this.numbers.join(''),
      number = Number(num),
      check = number.toString();
    if (check[0] === '0') check = check.replace(check[0], '');
    if (num[0] === '0') num = num.replace('0', '');
    if (check == num) this.calcArray.push(number);
  }
  // perform the requered operation
  operationsOnSign(enteredkey: sign): sign {
    if (enteredkey.type !== 'cal') {
      if (enteredkey.type === '') return { type: '', sign: '' };
      if (enteredkey.type === 'point') {
        if (!this.numbers.includes('.')) {
          const number = '.';
          this.numbers.push(number);
        }
      }
      if (enteredkey.type === 'number') {
        this.numbers.push(Number(enteredkey.sign));
      }

      if (enteredkey.type === 'nev') {
        if (this.numbers[0] === '-') this.numbers.shift();
        else this.numbers.unshift(enteredkey.sign);
      }
      if (enteredkey.type === 'sign') {
        this.addnum();
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

  forNev(input: any, type: string): void {
    if (type !== 'point')
      if (this.numbers[1] && this.numbers[1].toString()[0] === '-') {
        this.numbers[1] = -this.numbers[1];
        this.numbers.shift();
      }

    input.innerHTML = '';
    this.calcArray.forEach((value: any) => {
      const span = document.createElement('span'),
        signtype = this.identifySign(value);
      span.textContent = value;

      span.setAttribute('class', signtype.type);
      input.appendChild(span);
    });
    this.numbers.forEach((value: any) => {
      const span = document.createElement('span');
      span.textContent = value;
      span.setAttribute('class', 'number');
      input.appendChild(span);
    });
  }

  addcalexp(value: string, inputId: string, resutlId: string): boolean {
    const span = document.createElement('span'),
      enteredkey = this.operationsOnSign(this.identifySign(value)),
      input = document.getElementById(inputId) as HTMLElement,
      result = document.getElementById(resutlId) as HTMLElement;

    if (enteredkey.type === 'clean') {
      input.innerHTML = '';
      result.innerHTML = '';
      this.numbers = [];
      this.calcArray = [];
      this.calcTotal = NaN;
      this.calc = false;
      return false;
    }

    if (enteredkey.type === 'cal') {
      this.addnum();

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
    if (
      this.calc === true &&
      (enteredkey.type === 'number' || enteredkey.type === 'point')
    ) {
      input.innerHTML = '';
      this.numbers.shift();
      this.calcTotal = NaN;
    }

    span.textContent = enteredkey.sign;
    span.setAttribute('class', enteredkey.type);

    if (enteredkey.type === 'nev' || enteredkey.type === 'point') {
      this.forNev(input, enteredkey.type);
      return false;
    }

    input.appendChild(span);

    if (this.calcTotal) result.textContent = this.calcTotal.toString();

    this.calc = false;
    return false;
  }
}
