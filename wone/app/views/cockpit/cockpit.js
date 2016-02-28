var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var viewModel = require("./cockpit-view-model"); 
var gestures = require("ui/gestures");

//var categoryBarData = new viewModel.categoryBarData().categoryExpenseBudget;
var page;
var fav1;
var fav2;
var fav3;
var favButton1;
var favButton2;
var favButton3;
var actDate = new Date();
var lastDayActDate = (new Date(actDate.getFullYear(), actDate.getMonth() + 1, 0)).getDate();


var allowanceDates = function(){
    var checkDate;
    var allowanceDates = [];
    for (var i = 1; i <= lastDayActDate; i++){
        checkDate = new Date(actDate.getFullYear(), actDate.getMonth(), i);
        if (checkDate.getDay() == 1){
            allowanceDates.push(checkDate);           
        };
    };
    return allowanceDates;
};

var budgetReleased = function(data){
    var checkDates = allowanceDates();
    var budgetReleased = 0;
    if (String(actDate.getFullYear()) + String(actDate.getMonth()) == String(new Date(appsettings.registerdate).getFullYear()) + String(new Date(appsettings.registerdate).getMonth())){
        for (var i = 1; i <= 4; i++){
            if (actDate >= checkDates[i-1]){
                if (checkDates[i-1] >= new Date(appsettings.registerdate)){
                    budgetReleased += data.weeklyBudget[i];
                }else{
                    if (checkDates[i] > new Date(appsettings.registerdate)){
                        budgetReleased += data.weeklyBudget[i] * ((checkDates[i].getDate() - new Date(appsettings.registerdate).getDate()) / 7);
                    };     
                };
            };
        };      
    }else{
        var budgetReleased = data.weeklyBudget[1];
        for (var i = 2; i <= 4; i++){
            if (actDate >= checkDates[i-1]){
                budgetReleased += data.weeklyBudget[i];
            };
        };
    };
    return budgetReleased;
};


var pageData = new observable({
    //categoryDataChart: categoryBarData,
    cockpitMessage: "Bem-vindo ao W1 Expense Manager. O controle de suas despesas na palma de sua mão.",
    fab1Label: "Definir",
    fab2Label: "Definir",
    fab3Label: "Definir",
    basicCategoryBar: 40,
    extraCategoryBar: 40,
    investimentCategoryBar: 100,
    basicCategoryLabel: "",
    extraCategoryLabel: "",
    investimentCategoryLabel: "",
    hpBar: 50
});

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    fav1 = appsettings.favsubcat1;
    fav2 = appsettings.favsubcat2;
    fav3 = appsettings.favsubcat3;    
    
    if (fav1){
        fav1 = JSON.parse(fav1);
        pageData.set('fab1Label', fav1.SubCategoryName);
    };
    if (fav2){
        fav2 = JSON.parse(fav2);
        pageData.set('fab2Label', fav2.SubCategoryName);
    };
    if (fav3){
        fav3 = JSON.parse(fav3);
        pageData.set('fab3Label', fav3.SubCategoryName);
    };
    
    pageData.set('basicCategoryLabel', budgetReleased(JSON.parse(appsettings.basicCategoryBudget)));
    pageData.set('extraCategoryLabel', budgetReleased(JSON.parse(appsettings.extraCategoryBudget)));
    pageData.set('investimentCategoryLabel', budgetReleased(JSON.parse(appsettings.investimentCategoryBudget)));
    
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

    /*alert('basic: \n\n' + appsettings.basicCategoryBudget +
         '\n\nextra: \n\n' + appsettings.extraCategoryBudget +
          '\n\ninvestiment: \n\n' + appsettings.investimentCategoryBudget 
         );*/
};


/*exports.onNavigatedTo = function(args) {
    if (args.isBackNavigation){
        frameModule.topmost().navigate({
            moduleName: "views/cockpit/cockpit",
            context: {
                reload: false
            }
        });        
    }else{
        if (args.context.reload){
            frameModule.topmost().navigate({
                moduleName: "views/cockpit/cockpit",
                context: {
                    reload: false
                }
            });
        };
    };
};*/

exports.addFav1Expense = function() {
    if (appsettings.favsubcat1){
        frameModule.topmost().navigate({
            moduleName: "views/inputexpense/inputexpense",
            context: {
                categoryID: fav1.CategoryID,
                subCategoryID: fav1.Id,
                subCategoryName: fav1.SubCategoryName,
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
        moduleName: "views/history/history",
    });   	
};

exports.goToBudget = function() {
	frameModule.topmost().navigate({
        moduleName: "views/budget/budget",
    });   	
};


exports.goToCreditCard = function() {
	frameModule.topmost().navigate({
        moduleName: "views/creditcards/creditcards",
    });   	
};

exports.goToAccount = function() {
	frameModule.topmost().navigate({
        moduleName: "views/register/register",
    });   	
};

