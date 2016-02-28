var viewModel;
var page;

exports.loaded = function(args){
    page = args.object;
    viewModel = page.navigationContext.data;
    page.bindingContext = viewModel;

};

exports.goBack = function(){
    viewModel.done();
};