class CalcController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // --------------------------------------------------------------------------------------------------------------------------------------------
    // Обработчики событий:

    // Добавление цифр в поле ввода:
    this.view.numbersArr.forEach((numberBtn) => {
      numberBtn.addEventListener('click', this.handleAddDigitToInput);
    });

    // Добавления десятичной дроби к числу:
    this.view.decimalBtn.addEventListener('click', this.addDecimalToNumber);

    // Добавить число в стек:
    this.view.enterValueBtn.addEventListener(
      'click',
      this.handleAddNumberToStack
    );

    // Простые арифметические выражения с бинарным оператором ['+', '-', '*', '/']
    this.view.simpleMathExpressionsBtns.forEach((expressionBtn) => {
      expressionBtn.addEventListener(
        'click',
        this.handleCalculateBinaryExpressionResult
      );
    });

    // Извлечение квадратного корня из числа (тест): // ------------------------
    this.view.unaryOperatorsArr.forEach((unaryOperator) =>
      unaryOperator.addEventListener(
        'click',
        this.handleCalculateUnaryExpressionResult
      )
    );

    // Поменять два верхних значения стека местами:
    this.view.swapValuesBtn.addEventListener(
      'click',
      this.handleSwapNearbyNums
    );

    // Переключить знак ("+" или "-") у числа в поле input:
    this.view.toggleNumberSignBtn.addEventListener(
      'click',
      this.handleSetSignToNumberInInput
    );

    this.view.expValueBtn.addEventListener(
      'click',
      this.handleFastAdditionOfBaseLn
    );

    this.view.clearCurrentValBtn.addEventListener(
      'click',
      this.handleDeleteDigitInInput
    );

    this.view.resetAllBtn.addEventListener(
      'click',
      this.handleResetAllCalcData
    );
  }

  // Рендер состояния Input:
  renderInputState = async () => {
    const lastNumberInStack = this.model.getStackTopNumber();

    this.model.isUserInputActive
      ? this.view.renderCurrentInputValue(this.model.temporalNumber)
      : this.view.renderCurrentInputValue(lastNumberInStack);
  };

  // --------------------------------------------------------------------------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------------------------------------------------------------------------
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

  isNumberCorrect = () => {
    if (this.model.temporalNumber === null) return;
    if (this.model.temporalNumber.endsWith('.')) return;

    if (
      this.model.temporalNumber[this.model.temporalNumber.length - 1] === 0 &&
      this.model.temporalNumber.includes('.')
    ) {
      return;
    }
  };

  // --------------------------------------------------------------------------------------------------------------------------------------------
  // Добавление числа в стек (при нажатии кнопки Enter):
  handleAddNumberToStack = async () => {
    if (this.model.temporalNumber === null || this.model.calcStack.length >= 9)
      return;

    if (
      this.model.temporalNumber.endsWith('.') ||
      this.model.temporalNumber === ''
    )
      return; // работаю с числами - строками

    if (this.model.temporalNumber === '-') {
      this.model.temporalNumber = null;
      await this.view.renderActionMsg('Error');
      return;
    }

    // Регулярное выражение, которое не дает добавить в стек числа вида 0.0 или -0.0 с любым кол-ом 0:
    // Изначально проверял методом endsWidth('0') и includes('.') блокирует ввод чисел вида "10.20"
    if (/^(-?0(\.0+)?|0(\.0+)?)$/.test(this.model.temporalNumber)) {
      return;
    }
    this.view.enterValueBtn.disabled = true;

    this.model.setIsUserInputActive(false); // состояние поля ввода

    clearInterval(this.model.userInputActiveTimer); // очистка таймера this.userInputActiveTimer
    this.model.userInputActiveTimer = null;

    await this.view.renderActionMsg('Enter'); // промис на отображение слова "Enter" в поле input при добавлении числа в стек

    const numberToAdd = this.model.temporalNumber;
    this.view.calcInput.value = this.model.temporalNumber;

    if (numberToAdd === null) return; // повторная проверка (защита от спама кнопки и добавления null в стек)

    this.model.addNumberToStack(numberToAdd);

    this.model.temporalNumber = null;
    this.view.calcInput.value = '';

    this.renderInputState();

    this.view.enterValueBtn.disabled = false;

    console.log(this.model);
  };

  // Общие действия для расчета мат. выражения с добавлением операндов ч/з Enter и по клику на оператор:
  setGeneralizedOptionsForMathExpression = async (targetText) => {
    this.model.setMathOperatorValue(targetText);

    this.model.setExpressionData(); // назначить всю дату выбранного математического выражения (оператор, операнды, само мат. выражение)

    this.model.calculateResult();

    await this.view.renderActionMsg(targetText); // промис - сообщение со значением текущего оператора

    this.model.addNumberToStack(this.model.mathExpressionResult); // добавление результата вычисления в стэк
    console.log(this.model);
    this.model.resetMathExpressionData(); // ресет данных всего математического выражения

    // Поле ввода неактивно, отображается верхний элемент стэка; антиспам:
    this.view.disableCalcBtn(false); // включение всех кнопок арифм. выражений
    this.model.setIsUserInputActive(false);
    this.renderInputState();
    console.log(this.model);
  };

  // --------------------------------------------------------------------------------------------------------------------------------------------
  // Вычисление результата бинарного выражения:
  handleCalculateBinaryExpressionResult = (e) => {
    const { target } = e;

    if (this.model.calcStack.length === 0) return; // для начала расчетов пользователь должен добавить ч/з Enter в стак хотя бы одно число

    // Выполнение расчета при нажатии на кнопку бинарного оператора (это "+", "-", "/", "*"):
    // Обязательно! уже должен быть добавлен ч/з Enter один операнд
    if (this.model.isUserInputActive && this.model.calcStack.length >= 1) {
      this.view.disableCalcBtn(true); // отключение всех кнопок арифм. выражений
      clearInterval(this.model.userInputActiveTimer); // очистка таймера this.userInputActiveTimer
      this.model.userInputActiveTimer = null;

      // По нажатию на оператор - добавление текущего числа (из input) в стек:
      const numberToAdd = this.model.temporalNumber;
      this.model.addNumberToStack(numberToAdd);

      // Очистка текущего числа и очистка поля input:
      this.model.temporalNumber = null;
      this.view.calcInput.value = '';

      this.setGeneralizedOptionsForMathExpression(target.innerText);
    }

    // Вычисление результата когда пользователь добавил оба операнда ч/з Enter и поле ввода НЕактивно:
    // в стэке обязательно должны быть минимум 2 операнда
    if (!this.model.isUserInputActive && this.model.calcStack.length >= 2) {
      this.view.disableCalcBtn(true);
      this.setGeneralizedOptionsForMathExpression(target.innerText);
    }
  };

  // --------------------------------------------------------------------------------------------------------------------------------------------
  // Вычисление результата унарного выражения:
  handleCalculateUnaryExpressionResult = async (e) => {
    const { currentTarget } = e; // т.к. у унарных операторов внутри кнопки символы, использую "currentTarget.dataset.operator"
    if (this.model.calcStack.length === 0 && !this.model.isUserInputActive)
      return;

    this.view.disableCalcBtn(true);

    // Вычисление результата когда пользователь добавил операнд ч/з Enter и поле ввода НЕактивно:
    // в стэке обязательно должен быть минимум 1 операнд
    if (!this.model.isUserInputActive && this.model.calcStack.length >= 1) {
      this.setGeneralizedOptionsForMathExpression(
        currentTarget.dataset.operator
      );
    }

    // Расчет при активном поле ввода:
    if (this.model.isUserInputActive) {
      clearInterval(this.model.userInputActiveTimer);
      this.model.userInputActiveTimer = null;

      const numberToAdd = this.model.temporalNumber;
      this.model.addNumberToStack(numberToAdd);

      this.model.temporalNumber = null;
      this.view.calcInput.value = '';

      // Общие действия для расчета мат. выражения с добавлением операндов ч/з Enter и по клику на оператор:
      this.setGeneralizedOptionsForMathExpression(
        currentTarget.dataset.operator
      );
    }
  };

  // --------------------------------------------------------------------------------------------------------------------------------------------
  // Поменять два верхних значения стека местами:
  handleSwapNearbyNums = async (e) => {
    const target = e.target;

    if (this.model.calcStack.length >= 2 && !this.model.isUserInputActive) {
      clearInterval(this.model.userInputActiveTimer);
      await this.view.renderActionMsg('<>');
      this.model.swapNearbyNumsInStack();

      const lastNumberInStack = this.model.getStackTopNumber();
      this.view.renderCurrentInputValue(lastNumberInStack);

      console.log(this.model);
    }
  };

  // Задать отрицательное / положительное значение для this.model.temporalNumber
  handleSetSignToNumberInInput = () => {
    if (this.model.temporalNumber === null || !this.model.isUserInputActive)
      return;

    if (this.model.temporalNumber.includes('-')) {
      this.model.temporalNumber = this.model.temporalNumber.slice(1);
      this.view.renderCurrentInputValue(this.model.temporalNumber);
    } else {
      this.model.temporalNumber = '-' + this.model.temporalNumber;
      this.view.renderCurrentInputValue(this.model.temporalNumber);
    }

    console.log(this.model);
  };

  // Удаление цифры (либо по одной цифре, включая десятичную дробь) текущего числа в input:
  handleDeleteDigitInInput = () => {
    if (this.model.temporalNumber === null || !this.model.isUserInputActive)
      return;

    // Если пользователь стирает все цифры, поле ввода становится неактивным до ввода новых цифр:
    if (this.model.temporalNumber === '') {
      this.model.setIsUserInputActive(false); // состояние поля ввода
      this.model.temporalNumber = null;
      return;
    }

    const currentNum = this.model.temporalNumber;
    const editedNum = currentNum.slice(0, -1); // каждый раз стирает последнюю цифру, возвращая число от первой до предпоследней цифры
    this.model.temporalNumber = editedNum;
    // Второй вариант (метод массивов ".pop()"):

    this.view.renderCurrentInputValue(editedNum);

    console.log(this.model);
  };

  // Быстрое добавление основания натурального логарифма в поле input и свойство this.model.temporalNumber
  handleFastAdditionOfBaseLn = async (e) => {
    // handleFastAdditionOfBaseLn() {} потеря контекста
    if (this.model.temporalNumber !== null) return;
    this.view.expValueBtn.disabled = true;

    const { currentTarget } = e;
    await this.view.renderActionMsg('e');

    this.model.setIsUserInputActive(true);
    this.setUserInputActiveTimer();

    const currentDigitValue = currentTarget.dataset.lnbase.trim();
    this.model.setDigitToAddToTheStack(currentDigitValue); // this.model.temporalNumber

    const currentInputValue = this.model.temporalNumber + '_';
    this.view.renderCurrentInputValue(currentInputValue);
    this.view.expValueBtn.disabled = false;
  };

  // Полный ресет всей даты калькулятора:
  handleResetAllCalcData = async () => {
    if (this.model.calcStack.length === 0 && !this.model.isUserInputActive)
      return;
    this.view.resetAllBtn.disabled = true;

    await this.view.renderActionMsg('Reset');
    clearInterval(this.model.userInputActiveTimer); // очистка таймера this.userInputActiveTimer

    this.model.inputValue = []; // для рендера
    this.model.calcStack = [];

    this.model.isUserInputActive = false;
    this.model.userInputActiveTimer = null;
    this.model.temporalNumber = null; // временное значение, перед добавлением числа в стек

    this.model.resetMathExpressionData();
    this.view.resetAllBtn.disabled = false;

    console.log(this.model);
  };
}

export default CalcController;
