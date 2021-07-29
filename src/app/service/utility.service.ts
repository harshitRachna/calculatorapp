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
      case 'x':
        obj = { type: 'sign', sign: 'x' };
        break;
      case '/':
      case '÷':
        obj = { type: 'sign', sign: '÷' };
        break;
      case '-1':
      case 'Backspace':
        obj = { type: 'back', sign: keypressed };
        break;
      case Number(keypressed).toString():
        obj = { type: 'number', sign: keypressed };
        break;
      case '.':
        obj = { type: 'point', sign: '.' };
        break;
      case '(':
      case ')':
        obj = { type: 'bracket', sign: keypressed };
        break;
      case 'x²':
        obj = { type: 'sq2', sign: keypressed };
        break;
      case '𝛑':
        obj = { type: 'pi', sign: keypressed };
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
    // check if the numbers array is empty
    if (this.numbers.length === 0) return;

    let num = this.numbers.join(''),
      number = num === '.' ? 0 : Number(num);
    this.calcArray.push(number);
  }
  // perform the required operation
  operationsOnSign(enteredkey: sign): sign {
    if (enteredkey.type === 'back') {
      return enteredkey;
    }
    if (enteredkey.type === 'sq2') {
      this.calcArray.push('sqr(');
    }

    // check if user not clicked '=' or Enter button
    if (enteredkey.type !== 'cal') {
      if (enteredkey.type === '') return { type: '', sign: '' };
      // check if user entered point value
      if (enteredkey.type === 'point') {
        if (!this.numbers.includes('.')) {
          const number = '.';
          this.numbers.push(number);
        }
      }

      // check if user entered number
      if (enteredkey.type === 'number') {
        this.numbers.push(Number(enteredkey.sign));
      }

      // check if user clicked '±' button
      if (enteredkey.type === 'nev') {
        if (this.numbers[0] === '-') this.numbers.shift();
        else this.numbers.unshift(enteredkey.sign);
      }
      // check if user entered any mathematical operator
      if (
        enteredkey.type === 'sign' ||
        enteredkey.type === 'bracket' ||
        enteredkey.type === 'pi'
      ) {
        // method call to push the entered numbers in calArray.
        this.addnum();

        // check if the last value of the calArray is mathematical operator or if the array is empty
        if (
          (this.identifySign(this.calcArray[this.calcArray.length - 1]).type ===
            'sign' &&
            enteredkey.type !== 'bracket' &&
            enteredkey.sign !== '𝛑') ||
          (this.identifySign(this.calcArray[this.calcArray.length - 1]).type ===
            'bracket' &&
            enteredkey.type === 'sign' &&
            this.calcArray[this.calcArray.length - 1] === '(') ||
          (!this.calcArray[0] && enteredkey.type === 'sign')
        )
          return { type: '', sign: '' };

        // push the mathematical operator in calcArray
        this.calcArray.push(enteredkey.sign);
        this.numbers = [];
      }
    }
    return enteredkey;
  }

  //method that accepts that array and solve the '*','÷' & '%'
  muldiv(array: any): any {
    console.log(array);

    if (array.includes('𝛑')) {
      const index = array.indexOf('𝛑'),
        pi = 22 / 7;

      array.splice(index, 1, '(', pi, ')');

      return this.muldiv(array);
    }

    if (array.includes('(') || array.includes('sqr(')) {
      let start = array.includes('(')
          ? array.lastIndexOf('(')
          : array.lastIndexOf('sqr('),
        end =
          array.slice(0, start).length +
          (array.slice(start).indexOf(')') === -1
            ? array.slice(start).length - 1
            : array.slice(start).indexOf(')'));

      if (!array[start + 1]) {
        array.splice(start, 1);
        return this.muldiv(array);
      }

      let numw = this.calculate(
          array.slice(start + 1, array[end] === ')' ? end : end + 1)
        ),
        bnum = array.includes('(') ? numw : numw * numw;

      const noof = end - start + 1 <= 0 ? 1 : end - start + 1;

      if (Number(array[start - 1])) {
        if (Number(array[end + 1]) && array.length > end)
          array.splice(start, noof, 'x', bnum, 'x');
        else array.splice(start, noof, 'x', bnum);

        return this.muldiv(array);
      } else if (Number(array[end + 1]) && array[start + 1] !== array[end]) {
        array.splice(start, noof, bnum, 'x');

        return this.muldiv(array);
      } else {
        // debugger;
        array.splice(start, noof, bnum);

        return this.muldiv(array);
      }
    }

    if (array.includes(')')) {
      return [NaN];
    }
    if (array.includes('÷')) {
      const index = array.indexOf('÷'),
        n = array[index - 1] / array[index + 1];

      array.splice(index - 1, 3, n);

      return this.muldiv(array);
    }
    if (array.includes('x')) {
      const index = array.indexOf('x'),
        n = array[index - 1] * array[index + 1];

      array.splice(index - 1, 3, n);
      return this.muldiv(array);
    }
    if (array.includes('%')) {
      const index = array.indexOf('%'),
        n = array[index + 1]
          ? (array[index - 1] / 100) * array[index + 1]
          : array[index - 1] / 100;

      array.splice(index - 1, array[index + 1] ? 3 : 2, n);
      return this.muldiv(array);
    }

    return array;
  }

  // method to calculate the result
  calculate(calArray: any) {
    let arrcal = [...calArray];

    if (this.numbers.length > 0)
      arrcal.push(
        this.numbers.join('') === '.' ? 0 : Number(this.numbers.join(''))
      );
    if (!arrcal[0]) return NaN;
    arrcal = this.muldiv(arrcal);

    let num = arrcal[0];

    arrcal.forEach((numsign: any, i: number) => {
      if (typeof numsign === 'string') {
        switch (numsign) {
          case '+':
            num += arrcal[i + 1];
            break;
          case '-':
            num -= arrcal[i + 1];
            break;
        }
      }
    });

    num = num ? Number(num.toFixed(4)) : num;
    return num;
  }

  backspace() {
    this.numbers = this.calcArray[this.calcArray.length - 1]
      .toString()
      .split('')
      .map((e: any) => (e === '- ' || e === '.' ? e : Number(e)));
  }

  // method that handles the point and '±' button operation
  forNev(input: any, type: string, result: any): void {
    if (type === 'nev') {
      if (this.numbers[1] && this.numbers[1].toString()[0] === '-') {
        this.numbers[1] = -this.numbers[1];
        this.numbers.shift();
      }

      if (this.numbers.length === 1 && this.numbers[0] === '-')
        this.numbers.pop();
    }

    if (type === 'back') {
      if (this.numbers.length > 0) this.numbers.pop();
      else {
        if (Number(this.calcArray[this.calcArray.length - 1])) {
          this.backspace();
          this.numbers.pop();
        }
        this.calcArray.pop();
      }
    }

    this.calcTotal = this.calculate(this.calcArray);
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

    result.textContent =
      this.calcTotal === 0 || this.calcTotal ? this.calcTotal.toString() : '';
  }

  addcalexp(value: string, inputId: string, resutlId: string): boolean {
    if (this.numbers.length === 1 && Number(this.numbers[0]) === 0) {
      this.numbers.pop();
    }

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
        (this.identifySign(this.calcArray[this.calcArray.length - 1]).type ===
          'sign' &&
          this.calcArray[this.calcArray.length - 1] !== '%') ||
        !this.calcArray[0]
      )
        return false;

      this.calcTotal = this.calculate(this.calcArray);

      this.numbers = [this.calcTotal];
      this.calcArray = [];
      input.innerHTML =
        this.calcTotal.toString().length > 12
          ? this.calcTotal.toString().slice(0, 12)
          : this.calcTotal
          ? this.calcTotal.toString()
          : 'Expression Error';
      result.innerHTML =
        this.calcTotal.toString().length > 12
          ? this.calcTotal.toString().slice(12)
          : '';

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

    this.forNev(input, enteredkey.type, result);
    this.calc = false;
    return false;
  }
}
