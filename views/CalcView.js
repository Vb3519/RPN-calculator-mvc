class CalcView {
  constructor() {
    this.simpleMathExpressionsBtns = Array.from(
      document.querySelectorAll('.operator')
    );
    //------------------------------------------------------------------------------------------------------------------------------
    // ВЕРХНЯЯ ЧАСТЬ КАЛЬКУЛЯТОРА:
    this.calcInput = document.getElementById('calc-input');
    // РЯД №1:
    this.squareRootBtn = document.querySelector('.square-root'); // квадратный корень из числа x
    this.expBtn = document.querySelector('.exp-btn'); // возведение основания нат. логарифма (~2.71828) в степень х, т.е. e^x
    this.lnBtn = document.querySelector('.ln-btn'); // натуральный логарифм ln(x)
    this.powBtn = document.querySelector('.pow-btn'); // возведение в степень y^x
    this.reciprocalBtn = document.querySelector('.reciprocal-btn'); // расчет обратного числа 1/x
    this.convertToScientificNotationBtn = document.querySelector('.ePlus-btn'); // пример: 115 000: 1.15 * 10^5

    // РЯД №2:
    this.calculationsStoreBtn = document.querySelector('.memory-actions-store'); // сохранить значение в store
    this.calculationsRecallBtn = document.querySelector(
      '.memory-actions-recall'
    ); // извлечь из store верхнее значение
    this.prevNumberBtn = document.querySelector('.prev-number-btn'); // перемещение верхнего числа стека вниз [5, 8, 3] -> [3, 5, 8]

    // Тригонометрия:
    this.SinBtn = document.querySelector('.sin-btn'); // Синус
    this.CosBtn = document.querySelector('.cos-btn'); // Косинус
    this.TanBtn = document.querySelector('.tan-btn'); // Тангенс

    // РЯД №3:
    this.enterValueBtn = document.querySelector('.enter-btn'); // ввод значения
    this.swapValuesBtn = document.querySelector('.swap-values-btn'); // поменять местами два верхних значения в стеке
    this.toggleNumberSignBtn = document.querySelector(
      '.toggle-number-sign-btn'
    ); // кнопка переключения знака верхнего числа стека "+ / -"
    this.expValueBtn = document.querySelector('.exp-val-btn'); // быстрый ввод значения основания нат. логарифма (~2.71828)
    this.clearCurrentValBtn = document.querySelector('.clear-value-elem'); // стереть верхнее значение стека

    //------------------------------------------------------------------------------------------------------------------------------
    // НИЖНЯЯ ЧАСТЬ КАЛЬКУЛЯТОРА:

    // ЛЕВЫЙ СТОЛБЕЦ:
    this.userProgsBtn = document.querySelector('.xeq-elem'); // пользовательские настройки (скрипты и т.д.)
    this.backwardBtn = document.querySelector('.rd-elem'); // назад
    this.forwardBtn = document.querySelector('.rup-elem'); // вперед
    this.resetAllBtn = document.querySelector('.clear-all-elem'); // ресет всех значений

    // ЧИСЛА И АРИФМЕТИЧЕСКИЕ ВЫРАЖЕНИЯ:
    this.numbersArr = Array.from(document.querySelectorAll('.operand')); // включает "." кнопку добавления дробной части числа
    // РЯД 4:
    this.number7Btn = document.querySelector('.num-7-btn');
    this.number8Btn = document.querySelector('.num-8-btn');
    this.number9Btn = document.querySelector('.num-9-btn');
    this.divideNumsBtn = document.querySelector('.divide-btn'); // деление чисел

    // РЯД 5:
    this.number4Btn = document.querySelector('.num-4-btn');
    this.number5Btn = document.querySelector('.num-5-btn');
    this.number6Btn = document.querySelector('.num-6-btn');
    this.multNumsBtn = document.querySelector('.mult-btn'); // умножение чисел

    // РЯД 6:
    this.number1Btn = document.querySelector('.num-1-btn');
    this.number2Btn = document.querySelector('.num-2-btn');
    this.number3Btn = document.querySelector('.num-3-btn');
    this.subtractNumsBtn = document.querySelector('.subtract-btn'); // разность чисел

    // РЯД 7:
    this.number0Btn = document.querySelector('.num-0-btn');
    this.decimalBtn = document.querySelector('.decimal-btn'); // добавление десятичной дроби к числу
    this.userProgsControlBtn = document.querySelector(
      // кнопка контроля скриптов старт / пазуа
      '.user-progs-control-btn'
    );
    this.addUpNumsBtn = document.querySelector('.add-up-btn'); // сумма чисел
  }

  renderCurrentInputValue(value) {
    this.calcInput.value = value;
  }

  renderActionMsg(msgValue) {
    this.calcInput.value = msgValue;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.calcInput.value = '';
        resolve();
      }, 300);
    });
  }
}

export default CalcView;
