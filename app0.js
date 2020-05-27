//BUDGETCONTROLLER
var budgetController = (function () {
  // Expenses Constructor -Con --budgetCotroller
  var Expenses = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  //PROBLEM WITH BELOW CODE IS THAT NEW ES6 ARROW FUNCS POINT THIS KEYWORD TO THE OUTSIDE SCOPE OBJ IE.,WINDOW OBJ
  // Expenses.prototype.calculatePercentage = (totalIncome) => {
  //   if (totalIncome > 0) {
  //     this.percentage = Math.round((this.value / totalIncome) * 100);
  //   } else {
  //     this.percentage = -1;
  //   }
  // };

  Expenses.prototype.calculatePercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  //PROBLEM WITH BELOW CODE IS THAT NEW ES6 ARROW FUNCS POINT THIS KEYWORD TO THE OUTSIDE SCOPE OBJ IE.,WINDOW OBJ
  // Expenses.prototype.getPercentage = () => this.percentage;

  //ES5 SYNTAX
  Expenses.prototype.getPercentage = function () {
    return this.percentage;
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

    //deleteItem -Method --budget Controller
    deleteItem: (type, id) => {
      var ids, index;
      ids = data.allItems[type].map((current) => current.id);
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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

    //calculatePercentages
    calculatePercentages: () => {
      data.allItems.exp.forEach((cur) => {
        cur.calculatePercentage(data.totals.inc);
      });
    },

    getPercentages: () => {
      var allPerc = data.allItems.exp.map((cur) => cur.getPercentage());
      return allPerc;
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
