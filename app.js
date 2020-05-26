//BUDGETCONTROLLER
var budgetController = (function () {
  // Expenses Constructor -Con --budgetCotroller
  var Expenses = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //Incomes Constructor -Con --budgetCotroller
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //Budget calculation -fun --budgetCotroller
  var calculateTotal = (type) => {
    var sum = 0;
    data.allItems[type].forEach((cur) => {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };
  
  //Datastructure to store inc,exp --budgetCotroller
  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  //budgetController Return
  return {
    //addItem -Method --budgetCotroller
    addItem: (type, des, val) => {
      var newItem, ID;

      //create new Id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      //create new item based on 'inc' or 'exp'
      if (type === "exp") {
        newItem = new Expenses(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      //push it into our datastructures
      data.allItems[type].push(newItem);

      //addItem Return the new el
      return newItem;
    },

    //calculateBudget Method --budgetCotroller
    calculateBudget: () => {
      //calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      //calculate the budget income expenses
      data.budget = data.totals.inc - data.totals.exp;

      //calculate tthe percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    //getBudget:returns budget items -Method --budgetController
    getBudget: () => {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    //testing method not for production --budgetCotroller
    testing: () => console.log(data),
  };
})();

//UICONTROLLER
var UIController = (() => {
  //Variables
  var DOMStings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
  };

  //UIController Return
  return {
    //getInput -Method --UIController
    getInput: () => {
      return {
        type: document.querySelector(DOMStings.inputType).value, //Will be either inc or exp
        description: document.querySelector(DOMStings.inputDescription).value, //will be desription
        value: parseFloat(document.querySelector(DOMStings.inputValue).value),
      };
    },

    //addListItem -Method --UIController
    addListItem: (obj, type) => {
      var html, newHtml, element;
      //create HTML string with placeholder text

      if (type === "inc") {
        element = DOMStings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      //Insert the HTML into the UI
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    //clearFields -Method --UIController
    clearFields: () => {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMStings.inputDescription + "," + DOMStings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current, index, array) => {
        current.value = "";
      });
      fieldsArr[0].focus();
    },

    //getDOMStrings -Method --UIController
    getDOMStrings: () => DOMStings,
  };
})();

//CONTROLLER
var controller = ((budgetCtrl, UICtrl) => {
  //importing DOMStrings from UIController
  var DOM = UICtrl.getDOMStrings();

  //fun exp for click and enter key
  var setupEventListener = () => {
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keydown", (event) => {
      if (event.key === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };
  //updateBudget -fun%exp --controller
  var updateBudget = () => {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();

    //2. return the budget
    var budget = budgetCtrl.getBudget();

    //3.Display the budget on the UI
    console.log(budget);
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

      //4.Calculate the Budget
      updateBudget();
    }

    //5.Display the Budget on the UI
  };

  //controller return
  return {
    //init:  -Method --controller
    init: () => {
      console.log("application has Started");
      setupEventListener();
    },
  };
})(budgetController, UIController);

//to initialize when the page loads
controller.init();
