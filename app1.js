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
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expPercentLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var formatNumber = (num, type) => {
    var numSplit, int, dec, type;
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };
  var nodeListForEach = (list, callback) => {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      //Insert the HTML into the UI
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    //deleteListItem -Method -UIController
    deleteListItem: (selectorID) => {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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

    //displayBudget -Method --UIController
    displayBudget: (obj) => {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMStings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMStings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        type
      );
      document.querySelector(
        DOMStings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, type);
      if (obj.percentage > 0) {
        document.querySelector(DOMStings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMStings.percentageLabel).textContent = "---";
      }
    },

    //displayPercentage
    displayPercentages: (percentages) => {
      var fields = document.querySelectorAll(DOMStings.expPercentLabel);

      nodeListForEach(fields, (current, index) => {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    displayMonth: () => {
      var now, months, month, year;
      now = new Date();

      months = [
        "January",
        "Febraury",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      month = now.getFullYear();
      document.querySelector(DOMStings.dateLabel).textContent =
        months[month] + " " + year;
    },
    changedType: () => {
      var fields = document.querySelectorAll(
        DOMStings.inputType +
          "," +
          DOMStings.inputDescription +
          "," +
          DOMStings.inputValue
      );
      nodeListForEach(fields, (cur) => {
        cur.classList.toggle("red-focus");
      });
      document.querySelector(DOMStings.inputBtn).classList.toggle("red");
    },

    //getDOMStrings -Method --UIController
    getDOMStrings: () => DOMStings,
  };
})();
