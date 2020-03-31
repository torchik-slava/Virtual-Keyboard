const BTN_DATA = {
  Backquote: ['button', '`', '~', 'ё', 'Ё'],
  Digit1: ['button', '1', '!', '1', '!'],
  Digit2: ['button', '2', '@', '2', '"'],
  Digit3: ['button', '3', '#', '3', '№'],
  Digit4: ['button', '4', '$', '4', ';'],
  Digit5: ['button', '5', '%', '5', '%'],
  Digit6: ['button', '6', '^', '6', ':'],
  Digit7: ['button', '7', '&', '7', '?'],
  Digit8: ['button', '8', '*', '8', '*'],
  Digit9: ['button', '9', '(', '9', '('],
  Digit0: ['button', '0', ')', '0', ')'],
  Minus: ['button', '-', '_', '-', '_'],
  Equal: ['button', '=', '+', '=', '+'],
  Backspace: ['long_button', '', '', '', ''],
  Tab: ['button', '    ', '    ', '    ', '    '],
  KeyQ: ['button', 'q', 'Q', 'й', 'Й'],
  KeyW: ['button', 'w', 'W', 'ц', 'Ц'],
  KeyE: ['button', 'e', 'E', 'у', 'У'],
  KeyR: ['button', 'r', 'R', 'к', 'К'],
  KeyT: ['button', 't', 'T', 'е', 'Е'],
  KeyY: ['button', 'y', 'Y', 'н', 'Н'],
  KeyU: ['button', 'u', 'U', 'г', 'Г'],
  KeyI: ['button', 'i', 'I', 'ш', 'Ш'],
  KeyO: ['button', 'o', 'O', 'щ', 'Щ'],
  KeyP: ['button', 'p', 'P', 'з', 'З'],
  BracketLeft: ['button', '[', '{', 'х', 'Х'],
  BracketRight: ['button', ']', '}', 'ъ', 'Ъ'],
  Backslash: ['button', '\\', '|', '\\', '/'],
  Delete: ['button', '', '', '', ''],
  CapsLock: ['long_button', '', '', '', ''],
  KeyA: ['button', 'a', 'A', 'ф', 'Ф'],
  KeyS: ['button', 's', 'S', 'ы', 'Ы'],
  KeyD: ['button', 'd', 'D', 'в', 'В'],
  KeyF: ['button', 'f', 'F', 'а', 'А'],
  KeyG: ['button', 'g', 'G', 'п', 'П'],
  KeyH: ['button', 'h', 'H', 'р', 'Р'],
  KeyJ: ['button', 'j', 'J', 'о', 'О'],
  KeyK: ['button', 'k', 'K', 'л', 'Л'],
  KeyL: ['button', 'l', 'L', 'д', 'Д'],
  Semicolon: ['button', ';', ':', 'ж', 'Ж'],
  Quote: ['button', '\'', '"', 'э', 'Э'],
  Enter: ['long_button', '\n', '\n', '\n', '\n'],
  ShiftLeft: ['long_button', '', '', '', ''],
  KeyZ: ['button', 'z', 'Z', 'я', 'Я'],
  KeyX: ['button', 'x', 'X', 'ч', 'Ч'],
  KeyC: ['button', 'c', 'C', 'с', 'С'],
  KeyV: ['button', 'v', 'V', 'м', 'М'],
  KeyB: ['button', 'b', 'B', 'и', 'И'],
  KeyN: ['button', 'n', 'N', 'т', 'Т'],
  KeyM: ['button', 'm', 'M', 'ь', 'Ь'],
  Comma: ['button', ',', '<', 'б', 'Б'],
  Period: ['button', '.', '>', 'ю', 'Ю'],
  Slash: ['button', '/', '?', '.', ','],
  ArrowUp: ['button', '', '', '', ''],
  ShiftRight: ['long_button', '', '', '', ''],
  ControlLeft: ['button', '', '', '', ''],
  AltLeft: ['button', '', '', '', ''],
  MetaLeft: ['button', '', '', '', ''],
  Space: ['space', ' ', ' ', ' ', ' '],
  AltRight: ['button', '', '', '', ''],
  ArrowLeft: ['button', '', '', '', ''],
  ArrowDown: ['button', '', '', '', ''],
  ArrowRight: ['button', '', '', '', ''],
  ControlRight: ['button', '', '', '', ''],
};

if (!localStorage.lang) localStorage.setItem('lang', 1);
const view = document.createElement('div');
view.classList.add('view');
const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');

const fragment = new DocumentFragment();

Object.keys(BTN_DATA).forEach((key) => {
  const btn = document.createElement('span');
  btn.id = key;
  btn.classList.add(BTN_DATA[key][0]);
  [btn.innerHTML] = [BTN_DATA[key][localStorage.lang]];
  fragment.append(btn);
});

keyboard.append(fragment);
view.append(textarea, keyboard);
document.body.append(view);

let CapsOn = false;

function printSymbol(e) {
  textarea.setRangeText(e.target.textContent, textarea.selectionStart, textarea.selectionEnd, 'end');
}

function simulateBackspace() {
  if (textarea.selectionEnd === 0) return;
  if (textarea.selectionStart === textarea.selectionEnd) {
    textarea.setRangeText('', textarea.selectionStart - 1, textarea.selectionEnd, 'end');
  } else {
    textarea.setRangeText('', textarea.selectionStart, textarea.selectionEnd, 'end');
  }
}

function simulateDel() {
  if (textarea.selectionStart === textarea.selectionEnd) {
    textarea.setRangeText('', textarea.selectionStart, textarea.selectionEnd + 1, 'end');
  } else {
    textarea.setRangeText('', textarea.selectionStart, textarea.selectionEnd, 'end');
  }
}

function simulateCapsLock(e) {
  e.target.classList.toggle('on');
  CapsOn = !CapsOn;
  const checkKey = document.getElementById('KeyQ').textContent;
  let lowerCase;
  if (checkKey === BTN_DATA.KeyQ[1] || checkKey === BTN_DATA.KeyQ[3]) {
    lowerCase = true;
  } else {
    lowerCase = false;
  }
  document.querySelectorAll('span').forEach((btn) => {
    const oldvalue = btn.textContent;
    if (btn.firstChild) btn.firstChild.remove();
    if (lowerCase) {
      btn.append(oldvalue.toUpperCase());
    } else {
      btn.append(oldvalue.toLowerCase());
    }
  });
}

function simulateShift() {
  const checkKey = document.getElementById('BracketLeft').textContent;
  let target;
  switch (checkKey) {
    case `${BTN_DATA.BracketLeft[1]}`:
      target = 2;
      break;
    case `${BTN_DATA.BracketLeft[2]}`:
      target = 1;
      break;
    case `${BTN_DATA.BracketLeft[3]}`:
      target = 4;
      break;
    default:
      target = 3;
  }
  document.querySelectorAll('span').forEach((btn) => {
    const { id } = btn;
    if (btn.firstChild) {
      if (CapsOn && id[0] === 'K' && target % 2 === 0) {
        btn.firstChild.replaceWith(BTN_DATA[id][target - 1]);
      } else if (CapsOn && id[0] === 'K' && target % 2 === 1) {
        btn.firstChild.replaceWith(BTN_DATA[id][target + 1]);
      } else {
        btn.firstChild.replaceWith(BTN_DATA[id][target]);
      }
    }
  });
}

function moveHorizontally(e) {
  if (e.target.id === 'ArrowRight') {
    textarea.selectionStart += 1;
  } else {
    textarea.selectionStart -= 1;
  }
  textarea.selectionEnd = textarea.selectionStart;
}

function moveVertically(e) {
  if (e.target.id === 'ArrowUp') {
    textarea.selectionStart += 1;
  } else {
    textarea.selectionStart -= 1;
  }
  textarea.selectionEnd = textarea.selectionStart;
}

function handleMouseDown(e) {
  if (e.target !== keyboard) {
    e.target.classList.add('pressed');
    switch (e.target.id) {
      case 'Backspace':
        simulateBackspace();
        break;
      case 'Delete':
        simulateDel();
        break;
      case 'CapsLock':
        simulateCapsLock(e);
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        simulateShift();
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        moveHorizontally(e);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        moveVertically(e);
        break;
      default:
        printSymbol(e);
    }
  }
}

function handleMouseUp(e) {
  e.target.classList.remove('pressed');
  if (e.target.id === 'ShiftRight' || e.target.id === 'ShiftLeft') simulateShift();
  textarea.focus();
}

function handleKeyDown(e) {
  const existingBtn = document.getElementById(e.code);
  if (!existingBtn || existingBtn.classList.contains('pressed')) return;
  e.preventDefault();
  textarea.focus();
  const event = new Event('mousedown', {
    bubbles: true,
    cancelable: true,
  });
  existingBtn.dispatchEvent(event);
}

function handleKeyUp(e) {
  e.preventDefault();
  const existingBtn = document.getElementById(e.code);
  if (!existingBtn) return;
  const event = new Event('mouseup', {
    bubbles: true,
    cancelable: true,
  });
  existingBtn.dispatchEvent(event);
}

function changeLang(e) {
  let clampedBtn;
  if (e.target.id === 'AltLeft') {
    clampedBtn = document.getElementById('ControlLeft');
  } else {
    clampedBtn = document.getElementById('AltLeft');
  }
  if (!clampedBtn.classList.contains('pressed')) return;
  const checkKey = document.getElementById('KeyQ').textContent;
  let target;
  switch (checkKey) {
    case `${BTN_DATA.KeyQ[1]}`:
      target = 3;
      localStorage.setItem('lang', 3);
      break;
    case `${BTN_DATA.KeyQ[2]}`:
      target = 4;
      localStorage.setItem('lang', 3);
      break;
    case `${BTN_DATA.KeyQ[3]}`:
      target = 1;
      localStorage.setItem('lang', 1);
      break;
    default:
      target = 2;
      localStorage.setItem('lang', 3);
  }
  document.querySelectorAll('span').forEach((btn) => {
    const { id } = btn;
    if (btn.firstChild) btn.firstChild.replaceWith(BTN_DATA[id][target]);
  });
}

document.addEventListener('DOMContentLoaded', () => textarea.focus());

keyboard.addEventListener('mousedown', handleMouseDown);
keyboard.addEventListener('mouseup', handleMouseUp);

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

document.getElementById('ControlLeft').addEventListener('mousedown', changeLang);
document.getElementById('AltLeft').addEventListener('mousedown', changeLang);
