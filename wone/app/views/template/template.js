var appsettings = require("../../utils/appsettings");
var dialogsModule = require("ui/dialogs");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var frameModule = require("ui/frame");
var page;

var pageData = new observable({


});

exports.loaded = function(args){
  page = args.object;
  page.bindingContext = pageData;


};

exports.next = function(){


};
