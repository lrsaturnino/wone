var appsettings = require("../../utils/appsettings");
var viewModule = require("ui/core/view");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var page;
var context;
var closeCallback;

var pageData = new observable({
    newBudgetValue: ""
});


exports.onShowingModally = function(args) {
    context = args.context;
    //pageData.set('newBudgetValue' , context)
    closeCallback = args.closeCallback;
    page = args.object;
    page.bindingContext = pageData;
};


exports.updateBudget = function() {
    closeCallback(pageData.get('newBudgetValue'));
    pageData.set('newBudgetValue' , '');
};

exports.cancelUpdate = function() {
    closeCallback(context);
    pageData.set('newBudgetValue' , '');
};
