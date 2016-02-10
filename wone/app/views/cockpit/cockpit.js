var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var viewModel = require("./cockpit-view-model"); 
var categoryBarData = new viewModel.categoryBarData().categoryExpenseBudget;

var pageData = new observable({
    categoryDataChart: categoryBarData,
    cockpitMessage: "Parabéns! Continue com o bom trabalho"//,
});

exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = pageData;

}

exports.addFav1 = function() {
    appsettings.favsubcat1 = '4bacd2d0-c2d8-11e5-937a-8dd629aa32b8';
	frameModule.topmost().navigate({
        moduleName: "views/inputexpense/inputexpense",
        context: {teste: appsettings.favsubcat1}
    });   	
};

exports.toggleSideDrawer = function() {
	var drawer = frameModule.topmost().getViewById("sideDrawer");
    drawer.toggleDrawerState();   	
};

