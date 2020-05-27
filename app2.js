//CONTROLLER
var controller = ((budgetCtrl, UICtrl) => {
  //importing DOMStrings from UIController
  var DOM = UICtrl.getDOMStrings();

  //fun exp for click and enter key
  var setupEventListener = () => {
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changedType);

    document.addEventListener("keydown", (event) => {
      if (event.key === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  //updateBudget -fun%exp --controller
  var updateBudget = () => {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();

    //2. return the budget
    var budget = budgetCtrl.getBudget();

    //3.Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = () => {
    //1. Calculate percentages
    budgetCtrl.calculatePercentages();

    //2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();

    //3.Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  //ctrlAddItem -fun%exp --controller
  var ctrlAddItem = () => {
    //local variables
    var input, newItem;

    //1.Get the fied input data
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2.Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3.Add the item to UI
      UICtrl.addListItem(newItem, input.type);

      //3.1.Clear the fields
      UICtrl.clearFields();

      //4.Calculate the Budget && //5.Display the Budget on the UI
      updateBudget();

      //5.Calculate and Update percentages
      updatePercentages();
    }
  };

  //ctrlDeleteItem -fun%exp --controller
  var ctrlDeleteItem = (event) => {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
    }

    //1. Delete the item from the Datastructure
    budgetCtrl.deleteItem(type, ID);

    //2.Delete the item from the UI
    UICtrl.deleteListItem(itemID);

    //3.Update and show the new budget
    updateBudget();

    //4.Calculate and Update percentages
    updatePercentages();
  };

  //controller return
  return {
    //init:  -Method --controller
    init: () => {
      console.log("application has Started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListener();
    },
  };
})(budgetController, UIController);

//to initialize when the page loads
controller.init();
