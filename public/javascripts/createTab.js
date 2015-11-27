/*
* Permet de générer les listes alphabétiques de chansons paroles artistes et albums
*
*/
$(document).ready(function() {
    createTabCategories();
    createAlphabeticList();
    var oldCategorieLiSelected = $("#categorie_Artist").addClass('active');
    var oldAlphabelUlSelected = $("#alphabet_Artist");
    var categorieSelected;
    //Quand on change de tab on selectionnne le UL contenant l'alphabet correspondant a la tab selectionnée
	$(".categorie").click(function(evt){
        oldCategorieLiSelected.removeClass('active');//L'ancienne catégorie <li> devient non active car on clique sur un nouvel element
        oldAlphabelUlSelected.addClass('hide'); // On rend invisible la liste alphabétique <ul> de l'ancienne catégorie oldCategorieLiSelected
        $(this).addClass('active'); //this est l'element sur lequel on vient de cliquer, on le rend active
        categorieSelected = $(this).attr('id').split('_')[1];//les id des LI sont de type: categorie_Nom on recupére "Nom" 
        $("#alphabet_"+categorieSelected).removeClass("hide"); //on supprime la class hide de la liste alphabetique
        oldAlphabelUlSelected = $("#alphabet_"+categorieSelected);
        oldCategorieLiSelected = $(this);// ce sera donc la nouvelle oldCategorieLiSelected
	});
});
    //des catégories peuvent être ajouté, les href des lettres seront générés automatiquement
    // ces catégories représentent des noms de dossier sur le serveur
    // ces catégories seront passées en parametre dans l'url, on cherchera ensuite les dossiers correspondants
    var nomsCategories = ['Artist', 'Album', 'Songs', 'Label'];
    //création des tab contenant la catégorie, on crée les LI du UL articleMainContent_AlphabeticalIndex_tabs
	function createTabCategories(){
        var tabLi = [];
	  	for(var i = 0; i<nomsCategories.length; i++){
            var currentLi = $(document.createElement('li'));
            var link = $(document.createElement('a'));
            currentLi.attr('name',nomsCategories[i]);
            currentLi.attr('role','presentation');
            currentLi.attr('id','categorie_'+nomsCategories[i]);
            if(currentLi.attr('name') == 'Artist'){
                currentLi.addClass('active');
            }
            currentLi.addClass('categorie');
            //link.attr('href','href="#'+nomsCategories[i]+'"');
            link.text(nomsCategories[i]);
            currentLi.append(link);
            tabLi.push(currentLi);
		}	
        $(".articleMainContent_AlphabeticalIndex_tabs").append(tabLi);
	}	
    //création de la liste alphabétique
	function createAlphabeticList(){
        'use strict';
        var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		for(var i = 0; i<nomsCategories.length; i++){
			//On ajoute un id => <ul id="categorieArtist"> <ul id="categorieAlbum"> <ul id="categorieSongs"> <ul id="categorieLabel">		
			var currentUl = $(document.createElement('ul'));
            var tabLi =[];
			$(currentUl).attr('id', 'alphabet_'+nomsCategories[i]);
				if(currentUl.attr('id')!='alphabet_Artist'){
					currentUl.addClass('hide');
				}
				for(var j = 0; j< alphabet.length;j++){
                    var currentLi = $(document.createElement('li'));
                    var link = $(document.createElement('a'));
                    link.attr('href','search?categorie='+ nomsCategories[i] + '&lettre=' + alphabet[j]);
                    link.text(alphabet[j]); //on ajoute la lettre dans le <a></a>
                    currentLi.append(link); // on ajoute le <a></a> dans le <li></li>
                    tabLi.push(currentLi);
				}
            currentUl.append(tabLi);
            $(".articleMainContent_AlphabeticalIndex_letters>fieldset>legend").append(currentUl);
        }
    }

