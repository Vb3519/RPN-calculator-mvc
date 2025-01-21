import CalcModel from './models/CalcModel.js';
import CalcView from './views/CalcView.js';
import CalcController from './controllers/CalcController.js';

const calcModel = new CalcModel();
const calcView = new CalcView();
const calcController = new CalcController(calcModel, calcView);

console.log(calcModel);
console.log(calcView);
console.log(calcController);
