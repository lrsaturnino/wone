var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var viewModel = require("./cockpit-view-model"); 
//var categoryBarData = new viewModel.categoryBarData().categoryExpenseBudget;
var page;
var fav1;
var fav2;
var fav3;

var pageData = new observable({
    //categoryDataChart: categoryBarData,
    cockpitMessage: "Bem-vindo ao W1 Expense Manager. O controle de suas despesas na palma de sua mão.",
    fab1Label: "Definir",
    fab2Label: "Definir",
    fab3Label: "Definir",
    basicCategoryBar: 33,
    extraCategoryBar: 50,
    investimentCategoryBar: 100,
    basicCategoryLabel: "100 / 300",
    extraCategoryLabel: "100 / 200",
    investimentCategoryLabel: "180 / 150",
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
                subCategoryID: fav1.Id
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
                subCategoryID: fav2.Id
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
                subCategoryID: fav3.Id
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

