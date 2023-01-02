// DEFININDO AS VARIAVEIS E FIXANDO A COR PRETA
const color = document.querySelectorAll('.color');
color[0].classList.add('selected');
const storage = localStorage;

// FUNÇÃO DE GERAR COR AUTOMÁTICA

const creteColorRandom = () => {
  let colorR = 0;
  let colorG = 0;
  let colorB = 0;
  while ((colorR + colorG + colorB) === 0 || (colorR + colorG + colorB) === (255 * 3)) {
    colorR = parseInt(Math.random() * 255, 10);
    colorG = parseInt(Math.random() * 255, 10);
    colorB = parseInt(Math.random() * 255, 10);
  }
  return `rgb(${colorR}, ${colorG}, ${colorB})`;
};

// FUNÇÃO PARA GERAR A PALETA

const createArrayPalette = () => {
  const arrayPalette = ['black'];
  for (let index = 1; index < (color.length); index += 1) {
    arrayPalette.push(creteColorRandom());
  }
  return arrayPalette;
};

// FUNÇÃO CHECK COR REPITIDA

const checkRepeatedColor = (arrayPalette) => {
  const arrayWihtOutRepeated = [...new Set(arrayPalette)];
  return arrayWihtOutRepeated.length !== arrayPalette.length;
};

const finalPalette = () => {
  let arrayPalette = createArrayPalette();
  while (checkRepeatedColor(arrayPalette)) {
    arrayPalette = createArrayPalette();
  }
  return arrayPalette;
};

const savePalette = () => {
  const arrayPalette = finalPalette();
  storage.setItem('colorPalette', arrayPalette.join('-'));
  for (let index = 0; index < color.length; index += 1) {
    const assignColor = arrayPalette[index];
    color[index].style.backgroundColor = assignColor;
  }
};

// INICIALIZANDO AS CORES

const initializeColors = () => {
  if (storage.getItem('colorPalette') === null) {
    savePalette();
  } else {
    for (let index = 0; index < color.length; index += 1) {
      const getColorStorage = storage.getItem('colorPalette').split('-');
      color[index].style.backgroundColor = getColorStorage[index];
    }
  }
};
initializeColors();

// BOTÃO GERAÇÃO DE COR AUTOMÁTICA

const btnRandomColor = document.querySelector('#button-random-color');
btnRandomColor.addEventListener('click', savePalette);

// CRIANDO O QUADRO

const main = document.querySelector('main');
const pixelBoard = document.createElement('div');
pixelBoard.id = 'pixel-board';
main.appendChild(pixelBoard);

const createBoard = (size) => {
  for (let line = 0; line < size; line += 1) {
    const eachLine = document.createElement('div');
    eachLine.className = 'line';
    pixelBoard.appendChild(eachLine);
    for (let index = 0; index < size; index += 1) {
      const eachPixel = document.createElement('div');
      eachPixel.className = 'pixel';
      eachLine.appendChild(eachPixel);
    }
  }
};

const removeBoard = () => {
  while (pixelBoard.firstChild) {
    pixelBoard.removeChild(pixelBoard.firstChild);
  }
};

// TRANSFERINDO A CLASSE SELECTED COLOR PALETTE

const selectedColor = () => {
  for (let index = 0; index < color.length; index += 1) {
    color[index].addEventListener('click', () => {
      const selection = document.querySelector('.selected');
      selection.classList.remove('selected');
      color[index].classList.add('selected');
    });
  }
};
selectedColor();

// INCIALIZANDO BORDER SIZE NO LOCAL STORAGE

const initializeBorderSize = () => {
  if (storage.getItem('boardSize') === null) {
    createBoard(5);
  } else {
    const boardSize = parseInt(storage.getItem('boardSize'), 10);
    createBoard(boardSize);
  }
};
initializeBorderSize();

// CHECANDO O VALOR DO INPUT - ENTRE 5 E 50

const validateInputSize = (inputSize) => {
  if (inputSize < 5) {
    return 5;
  }
  if (inputSize > 50) {
    return 50;
  }
  if (inputSize >= 5 && inputSize <= 50) {
    return inputSize;
  }
};

// MUDANDO O TAMANHO DO QUADRO

const changeBoardSize = () => {
  const input = document.querySelector('#board-size');
  const btnGenerateBoard = document.querySelector('#generate-board');
  btnGenerateBoard.addEventListener('click', () => {
    const valueInput = input.value;
    if (valueInput === '') {
      alert('Board inválido!');
    } else {
      removeBoard();
      storage.removeItem('pixelBoard');
      storage.setItem('boardSize', validateInputSize(valueInput));
      window.location.reload();
    }
  });
};
changeBoardSize();

// PINTANDO OS PIXELS

const savePixelBoard = (colorObj, key) => {
  let newObj = {};
  if (storage.getItem('pixelBoard') != null) {
    newObj = JSON.parse(storage.getItem('pixelBoard'));
    newObj[key] = colorObj;
  } else {
    newObj[key] = colorObj;
  }
  storage.setItem('pixelBoard', JSON.stringify(newObj));
};

const paintPixels = () => {
  const pixel = document.querySelectorAll('.pixel');
  for (let index = 0; index < pixel.length; index += 1) {
    pixel[index].addEventListener('click', () => {
      const selected = document.querySelector('.selected');
      pixel[index].style.backgroundColor = selected.style.backgroundColor;
      savePixelBoard(pixel[index].style.backgroundColor, index);
    });
  }
};
paintPixels();

// BOTÃO DE LIMPAR QUADRO

const clearBoard = () => {
  const btnClear = document.querySelector('#clear-board');
  btnClear.addEventListener('click', () => {
    const pixel = document.querySelectorAll('.pixel');
    for (let index = 0; index < pixel.length; index += 1) {
      pixel[index].style.backgroundColor = 'white';
      storage.removeItem('pixelBoard');
    }
  });
};
clearBoard();

// INICIALIZANDO LOCAL STORAGE PIXEL BORDER

const initializeBoardPixel = () => {
  if (storage.getItem('pixelBoard') != null) {
    const objPixel = JSON.parse(storage.getItem('pixelBoard'));
    const keys = Object.keys(objPixel);
    const values = Object.values(objPixel);
    const pixel = document.querySelectorAll('.pixel');
    for (let index = 0; index < keys.length; index += 1) {
      const postionPixel = keys[index];
      const colorPixel = values[index];
      pixel[postionPixel].style.backgroundColor = colorPixel;
    }
  }
};
initializeBoardPixel();
