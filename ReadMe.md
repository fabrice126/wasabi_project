
Comment lancer l'application
=======
 	1. Récupérer l'application sur le GIT
  	2. Installer node js : https://nodejs.org/en/
  	3. Installer mongodb : version >= 3.2 : https://www.mongodb.com/  
  		3.1. (facultatif mais conseillé) Installer robomongo : https://robomongo.org/
  	4. Lancer le serveur  
		4.1. en ligne de commande : cd C:/Users/user/Documents/wasabi_project  
        4.2. node bin/www  
          4.2.1. Si ca ne fonctionne pas : taper "npm install" en ligne commande dans le projet wasabi (voir 4.1.)  
        4.3. le serveur est maintenant lancé sur http://localhost (dans le navigateur)



Architecture du code:
=======
## bin/
##### bin/www  
	Permet de lancer l'application  



## mongo/
##### mongo/backup_mongo/  
	Contient les dumps de l'application  
	Le dump courant s'appel "dump", les anciens dumps : "dump_old_X" le dump_old_1 sera plus ancien que le dump_old_2  
	Créer un dump de la base de données :   
		1. assurez-vous que mongodb est actif -> commande mongod en console ayant été effectué  
		2. rendez-vous dans le répertoire des dumps en ligne de commande   
		3. changer le nom du dossier appelé "dump" pour l'appeler "dump_old_x+1"  
		4. lancer la commande mongodump, un dossier dump sera crée  



##### mongo/request_mongo/  
	Contient des requêtes utiles  
	Si la base de données est recrée de zéro via le webservice /createdb elle contiendra:  
	Une collection artist contenant des documents représentant un artiste avec leurs albums et leurs musiques, il faudra donc lancer :  
	1. Le fichier FindSameDocument.js dans mongo afin de trouver les documents en double (ayant le même nom d'artist) dans la base de 	données
		1.1. Il y aura toujours des documents en double dans la base de données une fois celle-ci crée car lors de l'extraction sur le site de lyrics wikia certains artistes étaient présents plusieurs fois. Il faut supprimer alors un des deux documents apparaissant en double pour n'en garder qu'un

	2. Le fichier ConstructBDAfterCreate.js dans mongodb afin de créer :
		2.1. Une collection artist contenant uniquement les informations relatives à l'artiste (sans le champs album)
		2.2. Une collection album contenant les informations relatives à l'album
		2.3. Une collection song contenant les informations relatives à la musique
		2.4. Les index des collections artist, album et song

	3. le fichier RefArtistInAlbum.js permettant d'ajouter une référence d'artiste dans un document album(~2 minutes)

	4. le fichier RefAlbumInSong.js permettant dajouter une référence d'album dans un document song(~20 minutes)

	5. le fichier WordCount_Artist.js faisant le word count des lyrics pour chaque artist (~3 heures d'éxecution)(afin de voir les termes les plus utilisés par un artiste)

	6. le fichier WordCount_Album.js faisant le word count des lyrics pour chaque album (~10 heures d'éxecution) (afin de voir les termes les plus utilisés dans un album)

	7. le fichier WordCount_Song.js faisant le word count des lyrics pour chaque song (afin de voir les termes les plus utilisés dans une musique)

	8. le fichier CreateSearchField.js permettant de créer le champs sur lequel sera effectuée la recherche (~10 minutes)



##### mongo/sparql/
	Contient les requêtes sparql utilisées par l'application pour l'extraction du RDF pour les :  
		- Artistes: sparql_artist_data.rq  
		- Albums: sparql_album_data.rq  
		- Musiques: sparql_song_data.rq  
___



## node_modules/
	Contient les modules installés dans node js. exemple :le module require('express') sera dans ce répertoire  
___



## public/
##### public/bower-components/  
	Composant téléchargé afin de les utiliser dans l'application

##### public/img/  
	Les images du projet

##### public/javascripts/ 
	Code javascript des pages html

##### public/my_components/  
	Composant crée pour être utilisé dans l'application  

##### public/stylesheets/  
	Code css des pages html  
___



## routes/
	Contient la définition des routes supportées par l'application. C'est ici que se situe la partie REST  
##### routes/conf/  
	conf.json : Fichier de configuration permettant  de ne pas reécrire les données redondante dans l'application  
##### routes/handler/  
	xxxx.js : Contient la logique applicative à appliquer lors de requêtes sur les routes.   
___



## app.js
	C'est le fichier qui sera appelé par la commande node bin/www. C'est ici qu'on appellera les nouvelles routes de l'application et qu'on configurera certaines parties de l'application  
___



## package.json
	Fichier décrivant l'application, c'est aussi le gestionnaire de dépendance de node js. 
___


