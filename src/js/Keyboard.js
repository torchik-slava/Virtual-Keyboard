export default class Keyboard {
  constructor(data) {
    this.capsOn = false;
    this.lowerCase = true;
    this.keysData = data;
  }

  init() {
    if (!localStorage.lang) localStorage.setItem('lang', 1);
    this.view = document.createElement('div');
    this.view.classList.add('view');
    this.textarea = document.createElement('textarea');
    this.textarea.classList.add('textarea');
    this.view.append(this.textarea);
    this.drawKeyboard();
    const legend = document.createElement('p');
    legend.textContent = 'Created on Windows! Change language: left Ctrl + left Alt';
    this.view.append(legend);
    document.body.append(this.view);
    this.addListeners();
    this.textarea.focus();
  }

  drawKeyboard() {
    this.keyboard = document.createElement('div');
    this.keyboard.classList.add('keyboard');
    const fragment = new DocumentFragment();
    Object.keys(this.keysData).forEach((key) => {
      const btn = this.drawBtn(key);
      fragment.append(btn);
    });
    this.keyboard.append(fragment);
    this.view.append(this.keyboard);
  }

  drawBtn(key) {
    const btn = document.createElement('span');
    btn.id = key;
    btn.classList.add(this.keysData[key][0]);
    [btn.innerHTML] = [this.keysData[key][localStorage.lang]];
    return btn;
  }

  addListeners() {
    this.keyboard.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.keyboard.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.keyboard.addEventListener('mouseout', this.handleMouseOut.bind(this));

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));

    document.getElementById('ControlLeft').addEventListener('mousedown', this.changeLang.bind(this));
    document.getElementById('AltLeft').addEventListener('mousedown', this.changeLang.bind(this));
  }

  printSymbol(e) {
    this.textarea.setRangeText(e.target.textContent, this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
  }

  simulateBackspace() {
    if (this.textarea.selectionEnd === 0) return;
    if (this.textarea.selectionStart === this.textarea.selectionEnd) {
      this.textarea.setRangeText('', this.textarea.selectionStart - 1, this.textarea.selectionEnd, 'end');
    } else {
      this.textarea.setRangeText('', this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
    }
  }

  simulateDel() {
    if (this.textarea.selectionStart === this.textarea.selectionEnd) {
      this.textarea.setRangeText('', this.textarea.selectionStart, this.textarea.selectionEnd + 1, 'end');
    } else {
      this.textarea.setRangeText('', this.textarea.selectionStart, this.textarea.selectionEnd, 'end');
    }
  }

  simulateCapsLock(e) {
    e.target.classList.toggle('on');
    this.CapsOn = !this.CapsOn;
    document.querySelectorAll('span').forEach((btn) => {
      const button = btn;
      if (this.lowerCase) {
        button.textContent = button.textContent.toUpperCase();
      } else {
        button.textContent = button.textContent.toLowerCase();
      }
    });
    this.lowerCase = !this.lowerCase;
  }

  simulateShift() {
    const checkKey = document.getElementById('Slash').textContent;
    let target;
    switch (checkKey) {
      case `${this.keysData.Slash[1]}`:
        target = 2;
        break;
      case `${this.keysData.Slash[2]}`:
        target = 1;
        break;
      case `${this.keysData.Slash[3]}`:
        target = 4;
        break;
      default:
        target = 3;
    }
    document.querySelectorAll('span').forEach((btn) => {
      const { id } = btn;
      const isLetter = (btn.textContent.toUpperCase() !== btn.textContent.toLowerCase());
      if (btn.firstChild) {
        if (this.CapsOn && isLetter && target % 2 === 0) {
          btn.firstChild.replaceWith(this.keysData[id][target - 1]);
        } else if (this.CapsOn && isLetter && target % 2 === 1) {
          btn.firstChild.replaceWith(this.keysData[id][target + 1]);
        } else {
          btn.firstChild.replaceWith(this.keysData[id][target]);
        }
      }
    });
    this.lowerCase = !this.lowerCase;
  }

  changeLang(e) {
    let clampedBtn;
    if (e.target.id === 'AltLeft') {
      clampedBtn = document.getElementById('ControlLeft');
    } else {
      clampedBtn = document.getElementById('AltLeft');
    }
    if (!clampedBtn.classList.contains('pressed')) return;
    const checkKey = document.getElementById('Slash').textContent;
    let target;
    switch (checkKey) {
      case `${this.keysData.Slash[1]}`:
        target = 3;
        localStorage.setItem('lang', 3);
        break;
      case `${this.keysData.Slash[2]}`:
        target = 4;
        localStorage.setItem('lang', 3);
        break;
      case `${this.keysData.Slash[3]}`:
        target = 1;
        localStorage.setItem('lang', 1);
        break;
      default:
        target = 2;
        localStorage.setItem('lang', 3);
    }
    document.querySelectorAll('span').forEach((btn) => {
      const button = btn;
      const { id } = btn;
      if (btn.firstChild) {
        btn.firstChild.replaceWith(this.keysData[id][target]);
        if (this.CapsOn) {
          if (this.lowerCase) {
            button.textContent = button.textContent.toLowerCase();
          } else {
            button.textContent = button.textContent.toUpperCase();
          }
        }
      }
    });
  }

  moveHorizontally(e) {
    if (e.target.id === 'ArrowRight') {
      this.textarea.selectionStart += 1;
    } else {
      this.textarea.selectionStart -= 1;
    }
    this.textarea.selectionEnd = this.textarea.selectionStart;
  }

  moveVertically(e) {
    const value = this.textarea.value.split('\n');
    if (value.length === 1) return;
    const position = this.textarea.selectionStart;
    let temp = -1;
    let newPos = 0;
    for (let i = 0; i < value.length; i += 1) {
      temp += value[i].length + 1;
      if (position <= temp) {
        if (e.target.id === 'ArrowUp') {
          if (i === 0) break;
          const diff = value[i].length - value[i - 1].length;
          const isLast = temp - position === 0;
          if (diff > 0 && isLast) {
            newPos = position - value[i - 1].length - 1 - diff;
          } else if (diff && position - (temp - value[i].length) > value[i - 1].length) {
            newPos = temp - value[i].length - 1;
          } else {
            newPos = position - value[i - 1].length - 1;
          }
        } else {
          if (i === value.length - 1) break;
          const diff = value[i].length - value[i + 1].length;
          const isLast = temp - position === 0;
          if (diff > 0 && isLast) {
            newPos = temp + value[i + 1].length + 1;
          } else if (diff && position - (temp - value[i].length) > value[i + 1].length) {
            newPos = temp + value[i + 1].length + 1;
          } else {
            newPos = position + value[i].length + 1;
          }
        }
        this.textarea.selectionStart = newPos;
        this.textarea.selectionEnd = newPos;
        break;
      }
    }
  }

  handleMouseDown(e) {
    if (e.target !== this.keyboard) {
      e.target.classList.add('pressed');
      switch (e.target.id) {
        case 'Backspace':
          this.simulateBackspace();
          break;
        case 'Delete':
          this.simulateDel();
          break;
        case 'CapsLock':
          this.simulateCapsLock(e);
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.simulateShift();
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          this.moveHorizontally(e);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          this.moveVertically(e);
          break;
        default:
          this.printSymbol(e);
      }
    }
  }

  handleMouseUp(e) {
    e.target.classList.remove('pressed');
    if (e.target.id === 'ShiftRight' || e.target.id === 'ShiftLeft') this.simulateShift();
    this.textarea.focus();
  }

  handleMouseOut(e) {
    if ((e.target.id === 'ShiftRight' || e.target.id === 'ShiftLeft') && e.target.classList.contains('pressed')) this.simulateShift();
    e.target.classList.remove('pressed');
    this.textarea.focus();
  }

  handleKeyDown(e) {
    if (e.code !== 'F12') e.preventDefault();
    const existingBtn = document.getElementById(e.code);
    const isCaseChageBtn = e.code === 'CapsLock' || e.code === 'ShiftLeft' || e.code === 'ShiftRight';
    if (!existingBtn || (isCaseChageBtn && existingBtn.classList.contains('pressed'))) return;
    this.textarea.focus();
    const event = new Event('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    existingBtn.dispatchEvent(event);
  }

  handleKeyUp(e) {
    e.preventDefault();
    const existingBtn = document.getElementById(e.code);
    if (!existingBtn) return;
    const event = new Event('mouseup', {
      bubbles: true,
      cancelable: true,
    });
    existingBtn.dispatchEvent(event);
    this.textarea.focus();
  }
}
