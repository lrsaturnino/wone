var appsettings = require("../../utils/appsettings");
var dialogsModule = require("ui/dialogs");
var observable = require("data/observable").Observable;
var viewModule = require("ui/core/view");
var frameModule = require("ui/frame");
var imageSource = require("image-source");
var fs = require("file-system");
var helperOrder;
var page;

var pageData = new observable({
  helperPath: "",
  nextTxt: "Próximo"
});

exports.loaded = function(args){
  page = args.object;
  page.bindingContext = pageData;

  helperOrder = 0;
  nextImg(helperOrder);
};

exports.next = function(){
  helperOrder++;

  if (helperOrder == 5 && page.navigationContext.registered === true || helperOrder == 6){
    appsettings.messagetoken = true;
    frameModule.topmost().navigate({
        moduleName: "views/cockpit/cockpit",
        clearHistory: true
    });
  };

  nextImg(helperOrder);

  if (helperOrder == 4 && page.navigationContext.registered === true || helperOrder == 5){
    pageData.set('nextTxt', 'Começar');
  }else{
    nextImg(helperOrder);
  };
};

function nextImg(i){
  switch(i) {
    case 0:
      pageData.set('helperPath', '~/images/helpers/helper_favorite.png');
      break;
    case 1:
      pageData.set('helperPath', '~/images/helpers/helper_add_expense.png');
      break;
    case 2:
      pageData.set('helperPath', '~/images/helpers/helper_energy_bar.png');
      break;
    case 3:
      pageData.set('helperPath', '~/images/helpers/helper_budget_bar.png');
      break;
    case 4:
      pageData.set('helperPath', '~/images/helpers/helper_history.png');
      break;
    case 5:
      pageData.set('helperPath', '~/images/helpers/helper_login.png');
      break;
  };
};
