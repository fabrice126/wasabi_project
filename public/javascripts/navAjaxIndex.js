$(document).ready(function() {
    //Quand on entre sur l'application :
    window.history.pushState({path:"/"},'',"/");
    
    $(document).on("click","paper-card", function(e) {
        e.preventDefault();
        console.log("dans blabla");
        var url  = $(this).attr("id");
        console.log("URL ="+url);
        $.get(url, function(data, status){
//            console.log(data);
            var pageArtist = document.createElement("page-artist");
            pageArtist.artist = JSON.parse(data);           
            $('#mainContent').html('');
            $('#mainContent').html(pageArtist);
            if(url!=window.location){  
                window.history.pushState({path:url},'',url);
            }
        });
    });

});