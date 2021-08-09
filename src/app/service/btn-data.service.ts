import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BtnDataService {
  // calculator buttons in order
  scbutton: any = [
    { sign: '(', type: 'C' },
    {
      sign: ')',
      type: 'C',

      disabled: false,
    },
    {
      sign: 'x!',
      type: 'A',
    },

    {
      sign: 'sin',
      type: 'B',
      isVisible: true,
    },
    {
      sign: 'sin-1',

      type: 'B',
      isHide: true,
    },
    { sign: '𝛑', type: 'C' },
    {
      sign: 'cos',
      type: 'B',
      isVisible: true,
    },
    {
      sign: 'cos-1',

      type: 'B',
      isHide: true,
    },
    { sign: 'ln', type: 'A' },
    {
      sign: 'log',
      type: 'A',
    },
    { sign: 'e', isVisible: true },
    {
      sign: '10ٰx',

      isHide: true,
    },
    {
      sign: 'tan',
      type: 'B',
      isVisible: true,
    },
    {
      sign: 'tan-1',

      type: 'B',
      isHide: true,
    },
    {
      sign: '√',
      isVisible: true,
    },
    {
      sign: 'ⁿ√x',

      isHide: true,
    },

    { sign: 'x²', type: 'B' },
    { sign: 'Ans', type: 'A', isVisible: true },
    { sign: 'Rnd', type: 'A', isHide: true },
    { sign: 'EXP' },
    { sign: 'xⁿ' },
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
  constructor() {}
}
