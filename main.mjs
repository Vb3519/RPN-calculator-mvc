const inputData = ['1', '7', '+', '4', '2', '/', '*']; // 16
const inputData2 = ['1', '2', '+', '4', '*', '3', '+']; // 15
const inputData3 = ['3', '4', '2', '*', '1', '5', '-', '2', '^', '/', '+'];

const myRpnCalc = {
  inputValue: ['3', '4', '2', '*', '1', '5', '-', '2', '^', '/', '+'], // 3.5 // ['1', '4', '9', '√', '+', '3', '*', '+'], // 22
  calcStack: [],

  mathOperatorValue: null,
  mathOperatorPos: null,
  clearInputValuePos: null,

  secondExpressionNum: null,
  firstExpressionNum: null,

  unaryExpressionNum: null,

  currentMathExpression: null,
  mathExpressionResult: null,

  unaryMathExpressionsData: {
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
  },

  binaryMathExpressionsData: {
    '+': (a, b) => parseFloat(a) + parseFloat(b),
    '-': (a, b) => parseFloat(a) - parseFloat(b),
    '*': (a, b) => parseFloat(a) * parseFloat(b),
    '/': (a, b) => parseFloat(a) / parseFloat(b),
    '^': (a, b) => parseFloat(a) ** parseFloat(b),
    'E+': (a, b) => parseFloat(a) * 10 ** parseFloat(b), // 115 000: 1.15 * 10^5 (для указания малых / больших чисел)
  },

  // Заполнение стека до первого оператора:
  fillCalcStack() {
    for (let i = 0; i < this.inputValue.length; i++) {
      if (isNaN(this.inputValue[i])) {
        this.mathOperatorValue = this.inputValue[i];
        this.mathOperatorPos = i;
        this.clearInputValuePos = i + 1;
        break;
      }

      this.calcStack.push(this.inputValue[i]);
    }
  },

  // Присваивание значений переменным в выражении:
  setExpressionNums() {
    if (this.mathOperatorPos === null || this.clearInputValuePos === null)
      return;

    const unaryMathOperatorsArr = Object.keys(this.unaryMathExpressionsData);
    const binaryMathOperatorsArr = Object.keys(this.binaryMathExpressionsData);

    if (unaryMathOperatorsArr.includes(this.mathOperatorValue)) {
      this.unaryExpressionNum = this.calcStack.pop();
    }

    if (binaryMathOperatorsArr.includes(this.mathOperatorValue)) {
      this.secondExpressionNum = this.calcStack.pop();
      this.firstExpressionNum = this.calcStack.pop();
    }
  },

  setCurrentMathExpression() {
    if (this.unaryExpressionNum) {
      this.currentMathExpression =
        this.unaryMathExpressionsData[this.mathOperatorValue];
    }

    if (this.firstExpressionNum && this.secondExpressionNum) {
      this.currentMathExpression =
        this.binaryMathExpressionsData[this.mathOperatorValue];
    }
  },

  calcMathExpressionResult() {
    if (this.unaryExpressionNum) {
      this.mathExpressionResult = this.currentMathExpression(
        this.unaryExpressionNum
      ).toString();
    }

    if (this.firstExpressionNum && this.secondExpressionNum) {
      this.mathExpressionResult = this.currentMathExpression(
        this.firstExpressionNum,
        this.secondExpressionNum
      ).toString();
    }
  },

  updateCalcStack() {
    if (!this.mathExpressionResult) return;

    this.calcStack.push(this.mathExpressionResult);
    // this.calcStack.push(this.mathExpressionResult.toString());
  },

  updateInputValue() {
    const clearFromPos = this.clearInputValuePos;
    this.inputValue = this.inputValue.slice(clearFromPos);
  },

  resetMathOperatorData() {
    this.mathOperatorValue = null;
    this.mathOperatorPos = null;
    this.clearInputValuePos = null;
  },

  resetMathExpressionData() {
    this.unaryExpressionNum = null;

    this.secondExpressionNum = null;
    this.firstExpressionNum = null;
    this.currentMathExpression = null;
    this.mathExpressionResult = null;
  },
};

// Шаг расчета:
const calcResult = () => {
  myRpnCalc.fillCalcStack();
  myRpnCalc.setExpressionNums();
  myRpnCalc.setCurrentMathExpression();
  myRpnCalc.calcMathExpressionResult();
  myRpnCalc.updateCalcStack();
  myRpnCalc.updateInputValue();
  myRpnCalc.resetMathOperatorData();
  myRpnCalc.resetMathExpressionData();
};
