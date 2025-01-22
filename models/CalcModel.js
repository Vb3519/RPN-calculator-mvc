class CalcModel {
  constructor() {
    this.inputValue = []; // для рендера
    this.calcStack = [];

    this.isUserInputActive = false;
    this.userInputActiveTimer = null;
    this.temporalNumber = null; // временное значение, перед добавлением числа в стек

    this.mathOperatorValue = null;
    this.mathOperatorPos = null;
    this.clearInputValuePos = null;

    this.secondExpressionNum = null;
    this.firstExpressionNum = null;

    this.unaryExpressionNum = null;

    this.currentMathExpression = null;
    this.mathExpressionResult = null;

    this.unaryMathExpressionsData = {
      '√': (a) => Math.sqrt(parseFloat(a)),
      'e^x': (a) => Math.exp(parseFloat(a)), // возведение основания натурального логарифма (~2.7182) в степень х
      'ln(x)': (a) => Math.log(parseFloat(a)), // натуральный логарифм числа по основанию е (~2.7182)
      '1/x': (a) => 1 / parseFloat(a),

      // Тригонометрия:
      'sin(x)': (a) => {
        // Проверочные значения: sin 0 = 0; sin 90 = 1
        let radiansVal = (parseFloat(a) * Math.PI) / 180; // перевод градусов в радианы
        const result = Math.sin(radiansVal);
        return Math.abs(result) < 1e-10 ? 0 : result;
      },

      'cos(x)': (a) => {
        // cos 0 = 1; cos 90 = 0
        const radiansVal = (parseFloat(a) * Math.PI) / 180;
        const result = Math.cos(radiansVal);
        return Math.abs(result) < 1e-10 ? 0 : result; // малые числа считаются за 0
      },

      'tan(x)': (a) => {
        // tan 45 = 1
        let radiansVal = (parseFloat(a) * Math.PI) / 180;
        const result = Math.tan(radiansVal);
        return Math.abs(result) < 1e-10 ? 0 : result;
      },
    };

    this.binaryMathExpressionsData = {
      '+': (a, b) => parseFloat(a) + parseFloat(b),
      '-': (a, b) => parseFloat(a) - parseFloat(b),
      '*': (a, b) => parseFloat(a) * parseFloat(b),
      '/': (a, b) => parseFloat(a) / parseFloat(b),
      '^': (a, b) => parseFloat(a) ** parseFloat(b),
      'E+': (a, b) => parseFloat(a) * 10 ** parseFloat(b), // 115 000: 1.15 * 10^5 (для указания малых / больших чисел)
    };
  }

  // Активация пользовательского поля ввода:
  setIsUserInputActive(boolean) {
    this.isUserInputActive = boolean;
  }

  // Указать значение для цифры / числа, для добавления в стек:
  setDigitToAddToTheStack(val) {
    // это может быть как одна цифра, так и число
    if (this.temporalNumber === null) {
      // если пользователь первой цифрой вводит 0, ставится десятичная дробь "."
      if (val === '0') {
        this.temporalNumber = val.toString() + '.';
      }

      if (val !== '0') {
        this.temporalNumber = val.toString();
      }
    } else {
      this.temporalNumber = this.temporalNumber + val.toString();
    }
  }

  // Добавить цифру / число в стэк:
  addNumberToStack(numberStr) {
    if (!isNaN(numberStr)) {
      this.calcStack.push(numberStr);
    }
  }

  // Получить значение "верхней" цифры / числа в стэке:
  getStackTopNumber() {
    const lengthVal = this.calcStack.length;
    const number = this.calcStack[lengthVal - 1];

    return number;
  }

  // Назначить значение оператора математического выражения:
  setMathOperatorValue(value) {
    this.mathOperatorValue = value;
    console.log(this.mathOperatorValue);
  }

  // Назначить текущее математическое выражение:
  setCurrentMathExpression(value) {
    if (this.mathOperatorValue === null || this.currentMathExpression) return;

    this.currentMathExpression = value;
  }

  // Назначить унарное математическое выражение (операнд и оператор):
  setUnaryMathExpression(operatorVal) {
    const unaryMathOperatorsArr = Object.keys(this.unaryMathExpressionsData);

    if (unaryMathOperatorsArr.includes(operatorVal)) {
      this.unaryExpressionNum = this.calcStack.pop();
    }

    this.setCurrentMathExpression(this.unaryMathExpressionsData[operatorVal]);
  }

  // Назначить быинарное математическое выражение (операнды и оператор):
  setBinaryMathExpression(operatorVal) {
    const binaryMathOperatorsArr = Object.keys(this.binaryMathExpressionsData);

    if (binaryMathOperatorsArr.includes(operatorVal)) {
      this.secondExpressionNum = this.calcStack.pop();
      this.firstExpressionNum = this.calcStack.pop();
    }

    this.setCurrentMathExpression(this.binaryMathExpressionsData[operatorVal]);
  }

  // На основании оператора назначить значения чисел для вычисления результата выражения и само выражение:
  setExpressionData() {
    if (this.mathOperatorValue === null) return;

    const currentMathOperator = this.mathOperatorValue;

    this.setUnaryMathExpression(currentMathOperator);
    this.setBinaryMathExpression(currentMathOperator);
  }

  // Расчет результата выражения:
  calculateResult() {
    if (this.currentMathExpression === null) return;

    const unaryMathOperatorsArr = Object.keys(this.unaryMathExpressionsData);
    const binaryMathOperatorsArr = Object.keys(this.binaryMathExpressionsData);

    if (binaryMathOperatorsArr.includes(this.mathOperatorValue)) {
      this.mathExpressionResult = this.currentMathExpression(
        this.firstExpressionNum,
        this.secondExpressionNum
      ).toString();
    }

    if (unaryMathOperatorsArr.includes(this.mathOperatorValue)) {
      this.mathExpressionResult = this.currentMathExpression(
        this.unaryExpressionNum
      ).toString();
    }
  }

  // Полный ресет данных мат. выражения после завершения расчета:
  resetMathExpressionData() {
    this.mathOperatorValue = null;
    this.mathOperatorPos = null;

    this.secondExpressionNum = null;
    this.firstExpressionNum = null;

    this.unaryExpressionNum = null;

    this.currentMathExpression = null;
    this.mathExpressionResult = null;
  }

  // Поменять два верхних значения стека местами:
  swapNearbyNumsInStack() {
    const replacedNumsArr = this.calcStack.splice(-2, 2).reverse();
    replacedNumsArr.forEach((replacedNum) => this.calcStack.push(replacedNum));
  }
}

export default CalcModel;
