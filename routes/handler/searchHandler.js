
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
var countWordsLyrics = function(){

};


exports.constructData = constructData;