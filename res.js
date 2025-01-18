const myRpnCalc = {
  inputValue: ['3', '4', '2', '*', '1', '5', '-', '2', '^', '/', '+'],
  calcStack: [],

  mathOperatorValue: null,
  mathOperatorPos: null,
  clearInputValuePos: null,

  secondExpressionNum: null,
  firstExpressionNum: null,
  currentMathExpression: null,
  mathExpressionResult: null,

  mathExpressionsData: {
    '+': (a, b) => parseInt(a) + parseInt(b),
    '-': (a, b) => parseInt(a) - parseInt(b),
    '*': (a, b) => parseInt(a) * parseInt(b),
    '/': (a, b) => parseInt(a) / parseInt(b),
  },

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

  setExpressionNums() {
    if (this.mathOperatorPos === null || this.clearInputValuePos === null)
      return;
    this.secondExpressionNum = this.calcStack.pop();
    this.firstExpressionNum = this.calcStack.pop();
  },

  setCurrentMathExpression() {
    if (!this.firstExpressionNum || !this.secondExpressionNum) return;

    this.currentMathExpression =
      this.mathExpressionsData[this.mathOperatorValue];
  },

  calcMathExpressionResult() {
    if (!this.firstExpressionNum || !this.secondExpressionNum) return;

    this.mathExpressionResult = this.currentMathExpression(
      this.firstExpressionNum,
      this.secondExpressionNum
    ).toString();
  },

  updateCalcStack() {
    if (!this.mathExpressionResult) return;

    this.calcStack.push(this.mathExpressionResult.toString());
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
    this.secondExpressionNum = null;
    this.firstExpressionNum = null;
    this.currentMathExpression = null;
    this.mathExpressionResult = null;
  },
};
