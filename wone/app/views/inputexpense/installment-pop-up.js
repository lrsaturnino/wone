var viewModule = require("ui/core/view");
var viewModel;
var page;

exports.loaded = function(args){
    page = args.object;
    viewModel = page.navigationContext.data;
    page.bindingContext = viewModel;
};

exports.goBack = function(){
    var selectedItem = viewModule.getViewById(page, "installmentList");
    viewModel.done(selectedItem.items[selectedItem.selectedIndex]);
};