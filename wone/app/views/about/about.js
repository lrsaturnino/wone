var appsettings = require("../../utils/appsettings");
var viewModule = require("ui/core/view");
var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var page;

var pageData = new observable({
    about: '',
    consultant: '',
    contact: ''
});


exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    pageData.set('about', 'A W1 Finance é uma empresa de consultoria financeira com um conceito novo e único no Brasil. \n\nHoje, já ajudamos mais de 10 mil clientes a estruturar suas vidas financeiras. \n\nConverse com um de nossos consultores e conheça nossos serviços. \n\nMatriz:\nRua Cubatão 408 2° – 3° Andar, São Paulo - SP CEP 04013–001 - Brasil\nTel.: +55 (11) 4301-7007 \n\nUnidade Campinas:\nRua dos Alecrins, 26 1° – 2° Andar, Campinas - SP CEP 13024-410 - Brasil\nTel.: +55 (19) 3579-3025')

    viewModule.getViewById(page, 'consultant').isEnabled = false;
    viewModule.getViewById(page, 'contact').isEnabled = false;

    viewModule.getViewById(page, 'confirmConsultant').visibility = "collapsed";
    viewModule.getViewById(page, 'changeConsultant').visibility = "visible";

    viewModule.getViewById(page, 'confirmContact').visibility = "collapsed";
    viewModule.getViewById(page, 'changeContact').visibility = "visible";

    if (appsettings.consultantName){
        pageData.set('consultant', appsettings.consultantName);
    };

    if (appsettings.consultantContact){
        pageData.set('contact', appsettings.consultantContact);
    };

};

exports.goBack = function(){
    frameModule.topmost().goBack();
};

exports.confirmConsultant = function(){
    appsettings.consultantName = pageData.get('consultant');
    viewModule.getViewById(page, 'consultant').isEnabled = false;
    viewModule.getViewById(page, 'confirmConsultant').visibility = "collapsed";
    viewModule.getViewById(page, 'changeConsultant').visibility = "visible";
};

exports.changeConsultant = function(){
    viewModule.getViewById(page, 'consultant').isEnabled = true;
    viewModule.getViewById(page, 'consultant').focus();

    viewModule.getViewById(page, 'confirmConsultant').visibility = "visible";
    viewModule.getViewById(page, 'changeConsultant').visibility = "collapsed";
};

exports.confirmContact = function(){
    appsettings.consultantContact = pageData.get('contact');
    viewModule.getViewById(page, 'contact').isEnabled = false;
    viewModule.getViewById(page, 'confirmContact').visibility = "collapsed";
    viewModule.getViewById(page, 'changeContact').visibility = "visible";
};

exports.changeContact = function(){
    viewModule.getViewById(page, 'contact').isEnabled = true;
    viewModule.getViewById(page, 'contact').focus();

    viewModule.getViewById(page, 'confirmContact').visibility = "visible";
    viewModule.getViewById(page, 'changeContact').visibility = "collapsed";

};
