
var constructData = function (field, tParamToFind) {
    'use strict';
    var tObjectRequest, i, objRequest;
    tObjectRequest = [];
    for (i = 0; i < tParamToFind.length; i += 1) {
        objRequest = {};
        objRequest[field] = tParamToFind[i];
        tObjectRequest.push(objRequest);
    }
    return tObjectRequest;
};

//Fonction permettant d'optimiser le find de mongodb. En utilisant: /^AB/ /^Ab/ /^aB/ /^ab/ cela utilise l'index contrairement à lieu /^AB/i qui n'utilise pas l'index
var optimizeFind = function(lettre){
    var tParamToFind = [];
    if(lettre.length==2){
        tParamToFind.push(new RegExp('^' + lettre[0].toUpperCase()+lettre[1].toUpperCase()));
        tParamToFind.push(new RegExp('^' + lettre[0].toUpperCase()+lettre[1].toLowerCase()));
        tParamToFind.push(new RegExp('^' + lettre[0].toLowerCase()+lettre[1].toUpperCase()));
        tParamToFind.push(new RegExp('^' + lettre[0].toLowerCase()+lettre[1].toLowerCase()));
    }
    else{
        tParamToFind.push(new RegExp('^' + lettre.toUpperCase()));
        tParamToFind.push(new RegExp('^' + lettre.toLowerCase()));  
    } 
    return tParamToFind;
};


exports.constructData = constructData;
exports.optimizeFind = optimizeFind;