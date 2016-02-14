var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var viewModel = require("./cockpit-view-model"); 
//var categoryBarData = new viewModel.categoryBarData().categoryExpenseBudget;

var fav1 = appsettings.favsubcat1;
var fav2 = appsettings.favsubcat2;
var fav3 = appsettings.favsubcat3;


var pageData = new observable({
    //categoryDataChart: categoryBarData,
    cockpitMessage: "Parabéns! Continue com o bom trabalho!",
    fab1Label: "",
    fab2Label: "",
    fab3Label: "",
    basicCategoryBar: "",
    extraCategoryBar: "",
    investimentCategoryBar: "",
    basicCategoryLabel: "",
    extraCategoryLabel: "",
    investimentCategoryLabel: "",
    hpBar: ""
});

exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = pageData;

}

exports.addFav1Expense = function() {
	frameModule.topmost().navigate({
        moduleName: "views/inputexpense/inputexpense",
        context: {teste: appsettings.favsubcat1}
    });   	
};

exports.addFav2Expense = function() {
	frameModule.topmost().navigate({
        moduleName: "views/inputexpense/inputexpense",
        context: {teste: appsettings.favsubcat1}
    });   	
};

exports.addFav3Expense = function() {
	frameModule.topmost().navigate({
        moduleName: "views/inputexpense/inputexpense",
        context: {teste: appsettings.favsubcat1}
    });   	
};

exports.addOtherExpense = function() {
	frameModule.topmost().navigate({
        moduleName: "views/categories/categories",
        context: {teste: appsettings.favsubcat1}
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