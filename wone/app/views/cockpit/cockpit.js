var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var gestures = require("ui/gestures");
var page;
var fav1;
var fav2;
var fav3;
var favButton1;
var favButton2;
var favButton3;
var actDate;
var lastDayActDate;
var objBasicBudget;
var objExtraBudget;
var objInvestimentBudget;
var BasicBudgetReleased;
var ExtraBudgetReleased;
var InvestimentBudgetReleased;
var monthNamesAbrev = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];


var valueConverter = {
    toView: function (value) {
        var n = value, c = 2, d = ",", t = ".", s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
        return 'R$ ' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    },
    toModel: function (value) {
        var n = value;
        n = n.replace(' ','');
        n = n.replace('R$', '');
        n = n.replace(',','');
        n = n.replace('.','');
        n = parseInt(n) / 100;
        return n;
    }
};

var allowanceDates = [
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth(), 8),
    new Date(new Date().getFullYear(), new Date().getMonth(), 15),
    new Date(new Date().getFullYear(), new Date().getMonth(), 22)
];

/*function(){
    var checkDate;
    var allowanceDates = [];

    for (var i = 1; i <= lastDayActDate; i++){
        checkDate = new Date(actDate.getFullYear(), actDate.getMonth(), i);
        if (checkDate.getDay() == 1){
            allowanceDates.push(checkDate);
        };
    };

    return allowanceDates;
};*/

var checkWeekMonth = function(){
    var checkDate;
    var actualWeek;

    for (i = 1; i <= allowanceDates.length; i++){
        if (actDate >= allowanceDates[i-1]){
            actualWeek = i;
        };
    };

    switch (actualWeek){
        case 1:
            return 'Dia 01 ao 07';
            break;
        case 2:
            return 'Dia 08 ao 14';
            break;
        case 3:
            return 'Dia 15 ao 21';
            break;
        case 4:
            return 'Dia 22 ao último dia';
            break;
    };
};

var budgetReleased = function(data){
    var budgetReleased = 0;
    var registerDate = new Date(appsettings.registerdate);

    //if (allowanceDates.length > 4 && allowanceDates[allowanceDates.length - 2] < registerDate){
    //    registerDate = allowanceDates[allowanceDates.length - 2]
    //};

    if (String(actDate.getFullYear()) + String(actDate.getMonth()) == String(new Date(appsettings.registerdate).getFullYear()) + String(new Date(appsettings.registerdate).getMonth())){
        for (var i = 1; i <= 4; i++){
            if (allowanceDates[i-1] >= registerDate){
                budgetReleased += data.weeklyBudget[i];
            }else{
                if (allowanceDates[i] > registerDate){
                    budgetReleased += data.weeklyBudget[i] * ((allowanceDates[i].getDate() - registerDate.getDate()) / 7);
                };
            };
        };
    }else{
        budgetReleased = data.weeklyBudget[1];
        for (var i = 2; i <= 4; i++){
            if (actDate >= allowanceDates[i-1]){
                budgetReleased += data.weeklyBudget[i];
            };
        };
    };

    return budgetReleased;
};


var pageData = new observable({
    cockpitMessage: "",
    fab1Label: "",
    fab2Label: "",
    fab3Label: "",
    basicCategoryBar: 0,
    extraCategoryBar: 0,
    investimentCategoryBar: 0,
    basicCategoryLabel: "",
    extraCategoryLabel: "",
    investimentCategoryLabel: "",
    hpBar: 0,
    actualWeekMessage: ""
});

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    actDate = new Date();
    lastDayActDate = (new Date(actDate.getFullYear(), actDate.getMonth() + 1, 0)).getDate();

    objBasicBudget = JSON.parse(appsettings.basicCategoryBudget);
    objExtraBudget = JSON.parse(appsettings.extraCategoryBudget);
    objInvestimentBudget = JSON.parse(appsettings.investimentCategoryBudget);

    BasicBudgetReleased = budgetReleased(objBasicBudget);
    ExtraBudgetReleased = budgetReleased(objExtraBudget);
    InvestimentBudgetReleased = budgetReleased(objInvestimentBudget);

    if (appsettings.favsubcat1){
        fav1 = JSON.parse(appsettings.favsubcat1);
        pageData.set('fab1Label', fav1.SubCategoryName);
    }else{
        pageData.set('fab1Label', 'Definir');
    };
    if (appsettings.favsubcat2){
        fav2 = JSON.parse(appsettings.favsubcat2);
        pageData.set('fab2Label', fav2.SubCategoryName);
    }else{
        pageData.set('fab2Label', 'Definir');
    };
    if (appsettings.favsubcat3){
        fav3 = JSON.parse(appsettings.favsubcat3);
        pageData.set('fab3Label', fav3.SubCategoryName);
    }else{
        pageData.set('fab3Label', 'Definir');
    };

    pageData.set('basicCategoryLabel', valueConverter.toView(objBasicBudget.totalExpense) + ' / ' + valueConverter.toView(BasicBudgetReleased));
    pageData.set('extraCategoryLabel', valueConverter.toView(objExtraBudget.totalExpense) + ' / ' + valueConverter.toView(ExtraBudgetReleased));
    pageData.set('investimentCategoryLabel', valueConverter.toView(objInvestimentBudget.totalExpense) + ' / ' + valueConverter.toView(InvestimentBudgetReleased));

    pageData.set('basicCategoryBar', objBasicBudget.totalExpense / BasicBudgetReleased * 100.00);
    pageData.set('extraCategoryBar', objExtraBudget.totalExpense / ExtraBudgetReleased * 100.00);
    pageData.set('investimentCategoryBar',  objInvestimentBudget.totalExpense / InvestimentBudgetReleased * 100.00);

    pageData.set('actualWeekMessage', checkWeekMonth() + ' de ' + monthNamesAbrev[actDate.getMonth()] + '/' + actDate.getFullYear());

    pageData.set('cockpitMessage', "Bem-vindo ao W1 Expense Manager. O controle de suas despesas na palma de sua mão.");


    if (pageData.get('basicCategoryBar') > 100){
        viewModule.getViewById(page, 'basicCategoryBar').className = 'progress-categories-red';
    };
    if (pageData.get('extraCategoryBar') > 100){
        viewModule.getViewById(page, 'extraCategoryBar').className = 'progress-categories-red';
    };
    if (pageData.get('investimentCategoryBar') > 100){
        viewModule.getViewById(page, 'investimentCategoryBar').className = 'progress-categories-green';
    };

    pageData.set('hpBar', 100 - (objBasicBudget.totalExpense + objExtraBudget.totalExpense) / (BasicBudgetReleased + ExtraBudgetReleased) * 100.00);

    favButton1 = viewModule.getViewById(page, 'favButton1');
    favButton2 = viewModule.getViewById(page, 'favButton2');
    favButton3 = viewModule.getViewById(page, 'favButton3');

    favButton1.on(gestures.GestureTypes.longPress, function (args) {
        favButton1.off(gestures.GestureTypes.longPress);
        frameModule.topmost().navigate({
            moduleName: "views/subcategories/subcategories",
            context: {
                from: 1,
                define_category: true
            }
        });
    });

    favButton2.on(gestures.GestureTypes.longPress, function (args) {
        favButton2.off(gestures.GestureTypes.longPress);
        frameModule.topmost().navigate({
            moduleName: "views/subcategories/subcategories",
            context: {
                from: 2,
                define_category: true
            }
        });
    });

    favButton3.on(gestures.GestureTypes.longPress, function (args) {
        favButton3.off(gestures.GestureTypes.longPress);
        frameModule.topmost().navigate({
            moduleName: "views/subcategories/subcategories",
            context: {
                from: 3,
                define_category: true
            }
        });
    });

    if (appsettings.messagetoken === false){
      frameModule.topmost().navigate({
          moduleName: "views/helpers/helpers",
          context: {
              registered: appsettings.registered
          }
      });
    };
};

exports.basicExpenseList = function(){
    frameModule.topmost().navigate({
        moduleName: "views/history/expense-list",
        context: {
            yearmonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            category_id: objBasicBudget.idCategory,
            category: objBasicBudget.categoryName,
            from: 'cockpit'
        }
    });
};

exports.extraExpenseList = function(){
    frameModule.topmost().navigate({
        moduleName: "views/history/expense-list",
        context: {
            yearmonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            category_id: objExtraBudget.idCategory,
            category: objExtraBudget.categoryName,
            from: 'cockpit'
        }
    });
};

exports.investimentExpenseList = function(){
    frameModule.topmost().navigate({
        moduleName: "views/history/expense-list",
        context: {
            yearmonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            category_id: objInvestimentBudget.idCategory,
            category: objInvestimentBudget.categoryName,
            from: 'cockpit'
        }
    });
};

exports.addFav1Expense = function() {
    if (appsettings.favsubcat1){
        frameModule.topmost().navigate({
            moduleName: "views/inputexpense/inputexpense",
            context: {
                categoryID: fav1.CategoryID,
                subCategoryID: fav1.Id,
                subCategoryName: fav1.SubCategoryName,
                categoryName: fav1.CategoryName,
                new: true
            }
        });
    }else{
        frameModule.topmost().navigate({
            moduleName: "views/subcategories/subcategories",
            context: {
                from: 1,
                define_category: true
            }
        });
    };
};

exports.addFav2Expense = function() {
    if (appsettings.favsubcat2){
        frameModule.topmost().navigate({
            moduleName: "views/inputexpense/inputexpense",
            context: {
                categoryID: fav2.CategoryID,
                subCategoryID: fav2.Id,
                subCategoryName: fav2.SubCategoryName,
                categoryName: fav2.CategoryName,
                new: true
            }
        });
    }else{
        frameModule.topmost().navigate({
            moduleName: "views/subcategories/subcategories",
            context: {
                from: 2,
                define_category: true
            }
        });
    };
};

exports.addFav3Expense = function() {
    if (appsettings.favsubcat3){
        frameModule.topmost().navigate({
            moduleName: "views/inputexpense/inputexpense",
            context: {
                categoryID: fav3.CategoryID,
                subCategoryID: fav3.Id,
                subCategoryName: fav3.SubCategoryName,
                categoryName: fav3.CategoryName,
                new: true
            }
        });
    }else{
        frameModule.topmost().navigate({
            moduleName: "views/subcategories/subcategories",
            context: {
                from: 3,
                define_category: true
            }
        });
    };
};

exports.addOtherExpense = function() {
	frameModule.topmost().navigate({
        moduleName: "views/subcategories/subcategories",
        context: {
            define_category: false
        }
    });
};

exports.toggleSideDrawer = function() {
	var drawer = frameModule.topmost().getViewById("sideDrawer");
    drawer.toggleDrawerState();
};

exports.goToHistory = function() {
	frameModule.topmost().navigate({
        moduleName: "views/history/history"
    });
};

exports.goToBudget = function() {
	frameModule.topmost().navigate({
        moduleName: "views/budget/budget",
        context: {
            origin: 'cockpit'
        }
    });
};


exports.goToCreditCard = function() {
	frameModule.topmost().navigate({
        moduleName: "views/creditcards/creditcards"
    });
};

exports.goToAccount = function() {
	frameModule.topmost().navigate({
        moduleName: "views/register/register"
    });
};

exports.goToAbout = function() {
	frameModule.topmost().navigate({
        moduleName: "views/about/about"
    });
};
