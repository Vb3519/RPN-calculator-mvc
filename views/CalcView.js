class CalcView {
  constructor() {
    // Унарные операторы:
    this.unaryOperatorsArr = Array.from(
      document.querySelectorAll('.unary-operator')
    );
    this.arithmeticExpressionsAndNums = Array.from(
      document.querySelectorAll('.arithmetic-nums__elem')
    );

    this.simpleMathExpressionsBtns = Array.from(
      document.querySelectorAll('.operator')
    );
    //------------------------------------------------------------------------------------------------------------------------------
    // ВЕРХНЯЯ ЧАСТЬ КАЛЬКУЛЯТОРА:
    this.signAndLabelContainer = document.querySelector(
      '.sign-container__label'
    );
    this.calcManual = document.querySelector('.rpn-calc__manual');

    this.calcInput = document.getElementById('calc-input');
    // Почти все верхние кнопки верха калькулятора:
    this.mathFunctionsBtns = Array.from(
      document.querySelectorAll('.math-functions__elem')
    );
    // РЯД №1:
    this.squareRootBtn = document.querySelector('.square-root'); // квадратный корень из числа x
    this.expBtn = document.querySelector('.exp-btn'); // возведение основания нат. логарифма (~2.71828) в степень х, т.е. e^x
    this.lnBtn = document.querySelector('.ln-btn'); // натуральный логарифм ln(x)
    this.powBtn = document.querySelector('.pow-btn'); // возведение в степень y^x
    this.reciprocalBtn = document.querySelector('.reciprocal-btn'); // расчет обратного числа 1/x
    this.convertToScientificNotationBtn = document.querySelector('.ePlus-btn'); // пример: 115 000: 1.15 * 10^5

    // РЯД №2:
    // Память калькулятора:
    this.memoryActionsBtns = Array.from(
      document.querySelectorAll('.memory-actions__elem')
    );
    this.calculationsStoreBtn = document.querySelector('.memory-actions-store'); // сохранить значение в store
    this.calculationsRecallBtn = document.querySelector(
      '.memory-actions-recall'
    ); // извлечь из store верхнее значение
    this.prevNumberBtn = document.querySelector('.prev-number-btn'); // перемещение верхнего числа стека вниз [5, 8, 3] -> [3, 5, 8]

    // Тригонометрия:
    this.triginometryBtns = Array.from(
      document.querySelectorAll('.triginometry__elem')
    );
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

  renderActionMsg(msgValue, timerVal) {
    this.calcInput.value = msgValue;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.calcInput.value = '';
        resolve();
      }, timerVal);
    });
  }

  disableCalcBtn(isDisabled) {
    // Кнопки верхней части калькулятора:
    this.mathFunctionsBtns.forEach(
      (mathFuncBtn) => (mathFuncBtn.disabled = isDisabled)
    );

    // Память калькулятора:
    this.memoryActionsBtns.forEach(
      (memoryActionsBtn) => (memoryActionsBtn.disabled = isDisabled)
    );

    // Тригонометрия:
    this.triginometryBtns.forEach(
      (triginometryBtn) => (triginometryBtn.disabled = isDisabled)
    );

    // Кнопки нижней части калькулятора (операторы простых арифм. выражений и цифры):
    this.arithmeticExpressionsAndNums.forEach(
      (arithmeticBtn) => (arithmeticBtn.disabled = isDisabled)
    );

    // Кнопка ресета:
    this.resetAllBtn.disabled = isDisabled;
  }

  // ------------------------------------------
  // СТЕК КАЛЬКУЛЯТОРА:
  renderCalcMemoryActiveBtns = () => {
    // renderCalcMemoryActive() {} потеря контекста
    this.calculationsStoreBtn.classList.toggle('calc-memory');
    this.prevNumberBtn.classList.toggle('calc-memory');
  };

  // ------------------------------------------
  // МАНУАЛ КАЛЬКУЛЯТОРА:
  renderCalcManual = () => {
    this.calcManual.classList.toggle('calc-manual-active');
  };
}

export default CalcView;
