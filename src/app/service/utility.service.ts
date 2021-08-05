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
  isDeg: boolean = false;
  calc = false;

  ans: number = 0;

  // method to identify the entered input is a sign or number
  identifySign(keypressed: string): sign {
    let obj: any = {};

    switch (keypressed) {
      case '+':
      case '-':
      case '%':
      case 'xⁿ':
        obj = { type: 'sign', sign: keypressed };
        break;
      case 'ⁿ√x':
        obj = { type: 'sign', sign: 'ⁿ√x(' };
        break;
      case 'EXP':
        obj = { type: 'sign', sign: 'E' };
        break;
      case '10ٰx':
        obj = { type: 'sign', sign: '10' };
        break;
      case 'Ans':
        obj = { type: 'sign', sign: keypressed };
        break;
      case 'Rnd':
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
      case 'sin':
      case 'sin-1':
      case 'cos':
      case 'cos-1':
      case 'tan':
      case 'tan-1':
      case 'log':
      case 'ln':
      case '√':
        obj = { type: 'sin', sign: keypressed };
        break;
      case 'x!':
        obj = { type: 'fact', sign: '!' };
        break;
      case '𝛑':
      case 'e':
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
    this.numbers = [];
  }
  // perform the required operation
  operationsOnSign(enteredkey: sign): sign {
    if (enteredkey.type === 'back') {
      return enteredkey;
    }
    if (enteredkey.type === 'sq2') {
      this.calcArray.push('sqr(');
    }
    if (enteredkey.type === 'sin') {
      this.addnum();
      this.calcArray.push(enteredkey.sign + '(');
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
        if (
          this.numbers.length === 1 &&
          this.numbers[0] === 0 &&
          Number(enteredkey.sign) === 0
        )
          this.numbers.pop();
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
        enteredkey.type === 'pi' ||
        enteredkey.type === 'fact'
      ) {
        // method call to push the entered numbers in calArray.
        this.addnum();
        if (enteredkey.sign === 'Rnd') {
          const num = Number(Math.random().toFixed(5));
          if (Number(this.calcArray[this.calcArray.length - 1]))
            this.calcArray.push(...['x', num]);
          else this.calcArray.push(num);
          this.numbers = [];
          return enteredkey;
        }

        const array =
          enteredkey.sign === '('
            ? true
            : enteredkey.sign === 'E' ||
              enteredkey.sign === '10' ||
              enteredkey.type === 'fact' ||
              enteredkey.type === 'pi' ||
              enteredkey.sign === 'Ans'
            ? this.calculate([...this.calcArray, enteredkey.sign])
            : enteredkey.sign === 'ⁿ√x(' &&
              this.calcArray[this.calcArray.length - 1] === ')'
            ? this.calculate([...this.calcArray, enteredkey.sign, 2])
            : this.calculate([...this.calcArray]);

        // check if the last value of the calArray is mathematical operator or if the array is empty
        if (array !== 0 ? !array : false) return { type: '', sign: '' };

        // push the mathematical operator in calcArray
        this.calcArray.push(enteredkey.sign);
        this.numbers = [];
      }
    }
    return enteredkey;
  }

  trigonometry(array: any, index: number, fun: any, isDeg: boolean = false) {
    const start = index,
      end =
        array.slice(0, start).length +
        (array.slice(start).indexOf(')') === -1
          ? array.slice(start).length - 1
          : array.slice(start).indexOf(')'));

    const num = this.calculate(
        array.slice(
          start + 1,
          !Number(array[end]) && Number(array[end]) !== 0 ? end : end + 1
        )
      ),
      noof = end - start + 1 <= 0 ? 1 : end - start + 1,
      snum = fun(isDeg ? (num * Math.PI) / 180 : num);

    array.splice(start, noof, '(', snum, ')');

    return array;
  }

  //method that accepts that array and solve the '*','÷' & '%'
  muldiv(array: any): any {
    if (array.includes(NaN)) return [NaN];
    if (array.includes('Ans')) {
      this.ans = this.ans ? this.ans : 0;
      const index = array.indexOf('Ans');

      array.splice(index, 1, '(', this.ans, ')');

      return this.muldiv(array);
    }
    if (array.includes('𝛑')) {
      const index = array.indexOf('𝛑');

      array.splice(index, 1, '(', Math.PI, ')');

      return this.muldiv(array);
    }

    if (array.includes('e')) {
      const index = array.lastIndexOf('e'),
        e = 2.71828182846;
      array.splice(index, 1, '(', e, ')');

      return this.muldiv(array);
    }

    if (
      array.includes('sin(') ||
      array.includes('sin-1(') ||
      array.includes('cos(') ||
      array.includes('cos-1(') ||
      array.includes('tan(') ||
      array.includes('tan-1(') ||
      array.includes('log(') ||
      array.includes('ln(') ||
      array.includes('√(') ||
      array.includes('ⁿ√x(') ||
      array.includes('(') ||
      array.includes('sqr(')
    ) {
      const sIndex = array.lastIndexOf('sin('),
        asIndex = array.lastIndexOf('sin-1('),
        cIndex = array.lastIndexOf('cos('),
        acIndex = array.lastIndexOf('cos-1('),
        tIndex = array.lastIndexOf('tan('),
        atIndex = array.lastIndexOf('tan-1('),
        lIndex = array.lastIndexOf('log('),
        lnIndex = array.lastIndexOf('ln('),
        rIndex = array.lastIndexOf('√('),
        nrIndex = array.lastIndexOf('ⁿ√x('),
        bIndex = array.lastIndexOf('('),
        sqrIndex = array.lastIndexOf('sqr(');

      switch (
        Math.max(
          sIndex,
          bIndex,
          asIndex,
          sqrIndex,
          cIndex,
          acIndex,
          tIndex,
          atIndex,
          lIndex,
          lnIndex,
          rIndex,
          nrIndex
        )
      ) {
        case bIndex: {
          let start = bIndex,
            end =
              array.slice(0, start).length +
              (array.slice(start).indexOf(')') === -1
                ? array.slice(start).length - 1
                : array.slice(start).indexOf(')'));

          if (!array[start + 1] && array[start + 1] !== 0) {
            array.splice(start, 1);
            return this.muldiv(array);
          }

          let numw = this.calculate(
              array.slice(start + 1, array[end] === ')' ? end : end + 1)
            ),
            bnum = numw;
          const noof = end - start + 1 <= 0 ? 1 : end - start + 1;

          if (Number(array[start - 1])) {
            if (Number(array[end + 1]) && array.length > end)
              array.splice(start, noof, 'x', bnum, 'x');
            else array.splice(start, noof, 'x', bnum);

            return this.muldiv(array);
          } else if (
            Number(array[end + 1]) &&
            array[start + 1] !== array[end]
          ) {
            array.splice(start, noof, bnum, 'x');

            return this.muldiv(array);
          } else {
            array.splice(start, noof, bnum);

            return this.muldiv(array);
          }
        }
        case acIndex:
          return this.muldiv(
            this.trigonometry(array, acIndex, Math.acos, this.isDeg)
          );
        case atIndex:
          return this.muldiv(
            this.trigonometry(array, atIndex, Math.atan, this.isDeg)
          );
        case sIndex:
          return this.muldiv(
            this.trigonometry(array, sIndex, Math.sin, this.isDeg)
          );
        case asIndex:
          return this.muldiv(
            this.trigonometry(array, asIndex, Math.asin, this.isDeg)
          );
        case cIndex:
          return this.muldiv(
            this.trigonometry(array, cIndex, Math.cos, this.isDeg)
          );
        case tIndex:
          return this.muldiv(
            this.trigonometry(array, tIndex, Math.tan, this.isDeg)
          );
        case lIndex:
          return this.muldiv(this.trigonometry(array, lIndex, Math.log10));
        case rIndex:
          return this.muldiv(this.trigonometry(array, rIndex, Math.sqrt));
        case lnIndex:
          return this.muldiv(this.trigonometry(array, lnIndex, Math.log));

        case nrIndex: {
          if (!Number(array[nrIndex - 1])) return this.muldiv([NaN]);
          const start = nrIndex,
            end =
              array.slice(0, start).length +
              (array.slice(start).indexOf(')') === -1
                ? array.slice(start).length - 1
                : array.slice(start).indexOf(')'));

          const num = this.calculate(
              array.slice(
                start + 1,
                !Number(array[end]) && Number(array[end]) !== 0 ? end : end + 1
              )
            ),
            noof = end - start + 2 <= 0 ? 1 : end - start + 2,
            snum = Math.pow(num, 1 / array[start - 1]);

          array.splice(start - 1, noof, '(', snum, ')');

          return this.muldiv(array);
        }

        case sqrIndex: {
          if (!Number(array[nrIndex - 1])) return this.muldiv([NaN]);
          const start = sqrIndex,
            end =
              array.slice(0, start).length +
              (array.slice(start).indexOf(')') === -1
                ? array.slice(start).length - 1
                : array.slice(start).indexOf(')'));

          const num = this.calculate(
              array.slice(
                start + 1,
                !Number(array[end]) && Number(array[end]) !== 0 ? end : end + 1
              )
            ),
            noof = end - start + 2 <= 0 ? 1 : end - start + 2,
            snum = Math.pow(num, 2);

          array.splice(start - 1, noof, '(', snum, ')');

          return this.muldiv(array);
        }
      }
    }
    if (array.includes(')')) {
      return this.muldiv([NaN]);
    }

    if (array.includes('E') || array.includes('10')) {
      const index =
          array.indexOf('E') === -1 ? array.indexOf('10') : array.indexOf('E'),
        n = Number(array[index - 1])
          ? Number(array[index - 1])
          : 1 *
            Math.pow(
              10,
              Number(array[index + 1]) ? Number(array[index + 1]) : 0
            );

      array.splice(
        Number(array[index - 1]) ? index - 1 : index,
        Number(array[index - 1])
          ? Number(array[index + 1])
            ? 3
            : 2
          : Number(array[index + 1])
          ? 2
          : 1,
        n
      );
      return this.muldiv(array);
    }
    if (array.includes('xⁿ')) {
      const index = array.indexOf('xⁿ'),
        num = Math.pow(
          array[index - 1],
          Number(array[index + 1]) ? Number(array[index + 1]) : 0
        );
      array.splice(index - 1, Number(array[index + 1]) ? 3 : 2, num);
      return this.muldiv(array);
    }
    if (array.includes('%')) {
      const index = array.indexOf('%'),
        n = Number(array[index + 1])
          ? (array[index - 1] / 100) * array[index + 1]
          : array[index - 1] / 100;

      array.splice(index - 1, Number(array[index + 1]) ? 3 : 2, n);
      return this.muldiv(array);
    }

    if (array.includes('!')) {
      const index = array.indexOf('!'),
        num = array[index - 1] < 0 ? array[index - 1] * -1 : array[index - 1];

      if (array[index - 1] % 1 !== 0) return this.muldiv([NaN]);
      if (array[index - 1].toString().includes('e')) return [Infinity];
      let fact = array[index - 1] < 0 ? -1 : 1;
      for (let i = num; i > 0; i--) {
        fact *= i;
      }

      if (Number(array[index + 1])) array.splice(index - 1, 2, fact, 'x');
      else array.splice(index - 1, 2, fact);

      return this.muldiv(array);
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

    return array;
  }

  // method to calculate the result
  calculate(calArray: any) {
    let arrcal = [...calArray];

    if (this.numbers.length > 0)
      arrcal.push(
        this.numbers.join('') === '.' ? 0 : Number(this.numbers.join(''))
      );
    if (!arrcal[0] && arrcal[0] !== 0) return NaN;
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
    this.numbers = this.calcArray[this.calcArray.length - 2]
      .toString()
      .split('')
      .map((e: any) => (e === '-' || e === '.' ? e : Number(e)));
    this.calcArray.splice(this.calcArray.length - 2, 1);
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
      if (this.numbers.length > 0) {
        this.numbers.pop();
      } else {
        if (Number(this.calcArray[this.calcArray.length - 2])) {
          this.backspace();
        }
        this.calcArray.pop();
      }
    }

    this.calcTotal = this.calculate(this.calcArray);
    input.innerHTML = '';

    let arr = [...this.calcArray].map((value: any) =>
      !Number(value) && value !== 0 && value.includes('-1')
        ? `${value.slice(0, 3)}<sup>${value.slice(3, 5)}</sup>${value.slice(5)}`
        : !Number(value) && value !== 0 && value.includes('10')
        ? `${value.slice(0, 2)}<sup>^</sup>`
        : value === 'xⁿ'
        ? '^'
        : value
    );
    arr = this.displaynroot(arr);

    arr.forEach((value: any) => {
      const span = document.createElement('span'),
        signtype = this.identifySign(
          value === 'E' ? 'EXP' : value === '10' ? '10ٰx' : value
        );
      span.innerHTML = value;

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

  addcalexp(
    value: string,
    inputId: string,
    resutlId: string,
    isDeg: boolean
  ): boolean {
    this.isDeg = isDeg;
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

      if (this.calculate(this.calcArray)) {
        this.calcTotal = this.calculate(this.calcArray);
        this.ans = this.calcTotal;
        this.numbers = [this.calcTotal];
      }
      this.calcArray = [];
      input.innerHTML =
        this.calcTotal.toString().length > 12
          ? this.calcTotal.toString().slice(0, 12)
          : !this.calcTotal && this.calcTotal !== 0
          ? 'Expression Error'
          : this.calcTotal.toString();
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

  displaynroot(array: any): any {
    if (!array.includes('ⁿ√x(')) return array;

    let index = array.lastIndexOf('ⁿ√x('),
      num = array[index - 1];

    if (num === ')') {
      const a = Math.max(array.slice(0, index - 1).lastIndexOf('('));
      num = array.slice(a, index).join('');
      array.splice(a, a + index, num);
    }

    index = array.lastIndexOf('ⁿ√x(');
    array.splice(index - 1, 2, `<sup>${num}</sup>√(`);

    return this.displaynroot(array);
  }
}
