$(document).ready(function() {
    //var page = $('#nav li a:first').text(); // par défaut c'est Index
    // au clic sur un lien du menu
    $('#alphabet_Artist>li>a').click(function(e) {
        var url = $(this).attr('href'); // on récupère le href
        console.log("url avant ajax = "+url);
        $.ajax({
            url: url,
            type: 'GET',
            cache: false,
        });
    });
    
    //Au clic sur un le bouton
    $('#btn_chercherLyricsWikia').click(function(e) {

        console.log("btn_chercherLyricsWikia");             
            // chargement dans la div
            $.ajax({
                url: "/chercherLyricsWikia",
                cache: false
            });
        
        return false;
    });
    
    //Au clic sur un le bouton
    $('#btn_testPromise').click(function(e) {
        testPromise();
    });
    
});


'use strict';
var comptePromesse = 0;

var testPromise = function(){
    var thisComptePromesse = ++comptePromesse;

    var log = document.getElementById('log');
    log.insertAdjacentHTML('beforeend', thisComptePromesse + 
    ') Started (<small>Début du code synchrone</small>)<br/>');
    
    
    var p1 = new Promise(
        function(resolve, reject) {       
            log.insertAdjacentHTML('beforeend',thisComptePromesse +') Promise started (<small>Début du code asynchrone</small>)<br/>');
            window.setTimeout(function() {
                resolve(thisComptePromesse);
            }, Math.random() * 2000 + 2000);
    });

    // On définit ce qui se passe quand la promesse est tenue
    // et ce qu'on appelle (uniquement) dans ce cas
    p1.then(
    // On affiche un message avec la valeur
    function(val) {
        log.insertAdjacentHTML('beforeend',val +') Promise fulfilled (<small>Fin du code asynchrone</small>)<br/>');
    }).catch(
    // Promesse rejetée
    function() { 
        console.log("promesse rompue");
    });
    log.insertAdjacentHTML('beforeend',thisComptePromesse +') Promise made (<small>Fin du code synchrone</small>)<br/>');
}