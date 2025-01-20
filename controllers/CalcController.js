class CalcController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Обработчики событий:
    this.view.numbersArr.forEach((numberBtn) => {
      numberBtn.addEventListener('click', this.handleAddDigitToInput);
    });

    this.view.decimalBtn.addEventListener('click', this.addDecimalToNumber);

    this.view.enterValueBtn.addEventListener(
      'click',
      this.handleAddNumberToStack
    );

    this.view.simpleMathExpressionsBtns.forEach((expressionBtn) => {
      expressionBtn.addEventListener('click', this.handleSetMathOperatorValue);
    });
  }

  renderInputState = () => {
    const lastNumberInStack = this.model.getStackTopNumber();

    this.model.isUserInputActive
      ? this.view.renderCurrentInputValue(this.model.temporalNumber)
      : this.view.renderCurrentInputValue(lastNumberInStack);
  };

  // Таймер при активном пользовательском вводе (указание цифр для записи числа):
  setUserInputActiveTimer() {
    clearInterval(this.model.userInputActiveTimer);

    this.model.userInputActiveTimer = setInterval(() => {
      if (this.view.calcInput.value.endsWith('_')) {
        const pos = this.view.calcInput.value.indexOf('_');

        this.view.calcInput.value = this.view.calcInput.value.slice(0, pos);
      } else {
        this.view.calcInput.value = this.view.calcInput.value + '_';
      }

      this.view.calcInput.value = this.view.calcInput.value;
    }, 700);
  }

  // -------------------------------------------------------------------------------------------------------
  // Добавление точки (десятичной дроби):
  addDecimalToNumber = (e) => {
    // потеря контекста: addDecimalToNumber() {}
    if (
      this.model.temporalNumber === null ||
      this.model.temporalNumber.includes('.')
    )
      return;

    const target = e.target;
    const currentDigitValue = target.innerText.trim();
    this.model.setDigitToAddToTheStack(currentDigitValue); // this.model.temporalNumber
    this.setUserInputActiveTimer();

    const currentInputValue = this.model.temporalNumber + '_';

    this.view.renderCurrentInputValue(currentInputValue);
  };

  // -------------------------------------------------------------------------------------------------------
  // Формирование числа для добавления в стек (или добавление цифры в стек):
  handleAddDigitToInput = (e) => {
    const { target } = e;
    this.model.setIsUserInputActive(true); // состояние поля ввода (добавление цифр)
    this.setUserInputActiveTimer(); // при пользовательском вводе: таймер мигающей у числа линии

    const currentDigitValue = target.innerText.trim();
    this.model.setDigitToAddToTheStack(currentDigitValue); // this.model.temporalNumber

    const currentInputValue = this.model.temporalNumber + '_';
    this.view.renderCurrentInputValue(currentInputValue);
  };

  // -------------------------------------------------------------------------------------------------------
  // Добавление числа в стек (при нажатии кнопки Enter):
  handleAddNumberToStack = async () => {
    if (this.model.temporalNumber === null || this.model.calcStack.length >= 9)
      return;

    if (this.model.temporalNumber.endsWith('.')) return; // работаю с числами - строками

    this.model.setIsUserInputActive(false); // состояние поля ввода

    clearInterval(this.model.userInputActiveTimer); // очистка таймера this.userInputActiveTimer
    this.model.userInputActiveTimer = null;

    const numberToAdd = this.model.temporalNumber;
    await this.view.renderActionMsg('Enter'); // промис на отображение слова "Enter" в поле input при добавлении числа в стек

    this.view.calcInput.value = this.model.temporalNumber;

    this.model.addNumberToStack(numberToAdd);

    this.model.temporalNumber = null;
    this.view.calcInput.value = '';

    this.renderInputState();

    console.log(this.model);
  };

  // Обработчик присваивания значения this.mathOperatorValue:
  handleSetMathOperatorValue = (e) => {
    const { target } = e;
    const mathOperatorValue = target.innerText.trim();

    this.model.setMathOperatorValue(mathOperatorValue);
    console.log(this.model);
  };
}

export default CalcController;
