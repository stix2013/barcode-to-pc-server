import { Component, Input, OnInit } from '@angular/core';

const settingColors: string[] = [
    'e57373',
    'f06292',
    'ba68c8',
    '9575cd',
    '7986cb',
    '64b5f6',
    '4fc3f7',
    '4dd0e1',
    '4db6ac',
    '81c784',
    'aed581',
    'ff8a65',
    'd4e157',
    'ffd54f',
    'ffb74d',
    'a1887f',
    '90a4ae'];

@Component({
  /* tslint:disable:component-selector */
  selector: 'circle-text',
  template: `
    <div class="circle-text" [style.background-color]="backgroundColor">
      {{ letters }}
    </div>`,
  styleUrls: ['./circle-text.component.scss']
})
export class CircleTextComponent implements OnInit {
  @Input() value: string;

  // private static colors: string[] = [
  //   'e57373',
  //   'f06292',
  //   'ba68c8',
  //   '9575cd',
  //   '7986cb',
  //   '64b5f6',
  //   '4fc3f7',
  //   '4dd0e1',
  //   '4db6ac',
  //   '81c784',
  //   'aed581',
  //   'ff8a65',
  //   'd4e157',
  //   'ffd54f',
  //   'ffb74d',
  //   'a1887f',
  //   '90a4ae'];

  public backgroundColor: string;
  public letters: string;

  constructor() { }

  ngOnInit() {
    const colors = settingColors;
    this.backgroundColor = '#' + colors[Math.abs(this.hashCode(this.value)) % colors.length].toString();

    this.letters = this.value[0] + this.value[1];
  }

  private hashCode(key) {
    let hash = 0, i, chr, len;
    if (key.length === 0) {
      return hash;
    }

    for (i = 0, len = key.length; i < len; i++) {
      chr = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
