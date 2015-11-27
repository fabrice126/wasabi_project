$(document).ready(function() {
    //var page = $('#nav li a:first').text(); // par défaut c'est Index
    // au clic sur un lien du menu
    /*$('#alphabet_Artist>li>a').click(function(e) {
        e.preventDefault();
        var url = $(this).attr('href'); // on récupère le href
        console.log("url avant ajax = "+url);
        $.ajax({
            url: url,
            type: 'GET',
            cache: false,
            success: function(data) {
                console.log(data);
                $("#articleMainContent_listCategorie").append(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('error ' + textStatus + " " + errorThrown);
            }
        });
    });*/
    
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
