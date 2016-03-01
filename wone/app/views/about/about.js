var frameModule = require("ui/frame");
var observable = require("data/observable").Observable;
var page;

var pageData = new observable({
    about: ''
});


exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    pageData.set('about', 'A W1 Finance é uma empresa de consultoria financeira com um conceito novo e único no Brasil. \n\nA partir da vasta experiência de seus sócios europeus, a decisão de fundar a W1 Finance no Brasil foi tomada em 2010 e desde o início das operações a empresa cresce em um ritmo médio de 100% ao ano. \nHoje, já ajudamos mais de 10 mil clientes a estruturar suas vidas financeiras. \n\nConverse com um de nosso consultores e conheça nossos serviços. \n\nMatriz:\nRua Cubatão 408 2° – 3° Andar, São Paulo - SP CEP 04013–001 - Brasil\nTel.: +55 (11) 4301-7007 \n\nUnidade Campinas:\nRua dos Alecrins, 26 1° – 2° Andar, Campinas - SP CEP 13024-410 - Brasil\nTel.: +55 (19) 3579-3025')

};

exports.goBack = function(){
    frameModule.topmost().goBack();
};