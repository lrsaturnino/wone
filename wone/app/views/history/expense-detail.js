var appsettings = require("../../utils/appsettings");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var page;


var pageData = new observable({

});


exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;
    
}

exports.goBack = function(){
    frameModule.topmost().goBack();
};