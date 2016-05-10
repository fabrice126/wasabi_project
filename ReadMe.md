
Comment lancer l'application
=======
1. Récupérer l'application sur le GIT
2. Installer node js : https://nodejs.org/en/
3. Installer mongodb : version >= 3.2 : https://www.mongodb.com/  
	3.1 (facultatif mais conseillé) Installer robomongo : https://robomongo.org/
4. Lancer le serveur
	4.1. en ligne de commande : cd C:/Users/user/Documents/wasabi_project  
	4.2. node bin/www  
		4.2.1. Si ca ne fonctionne pas : taper "npm install" en ligne commande dans le projet wasabi : C:/Users/user/Documents/wasabi_project 
	4.3. le serveur est maintenant lancé sur http://localhost (dans le navigateur)  


Architecture du code:
=======
bin/
-----------
	www  
	#Permet de lancer l'application  

mongo/
-----------
### backup_mongo/  
	#Contient les dumps de l'application  
	#Le dump courant s'appel "dump", les anciens dumps : "dump_old_X" le dump_old_1 sera plus ancien que le dump_old_2  
	#Créer un dump de la base de données :   
		#assurez-vous que mongodb est actif -> commande mongod en console ayant été effectué  
		#rendez-vous dans le répertoire des dumps en ligne de commande   
		#changer le nom du dossier appelé "dump" pour l'appeler "dump_old_x+1"  
		#lancer la commande mongodump, un dossier dump sera crée  
### request_mongo/  
	#contient des requêtes utiles  
	#si la base de données est recrée de zéro elle contiendra:  
		#Une collection artist contenant des documents représentant un artiste avec leurs albums et leurs musiques, il faudra donc lancer :  
			#1- le fichier FindSameDocument.js dans mongo afin de trouver les documents en double (ayant le même nom d'artist) dans la base de données  
				#Il y aura toujours des documents en double dans la base de données une fois celle-ci crée  
				#car lors de l'extraction  sur le site de lyrics wikia certains artistes étaient présents plusieurs fois  
				#Supprimer alors un des deux documents apparaissant en double  
			#2- le fichier ConstructBDAfterCreate.js dans mongodb afin de créer :   
				#-une collection artist contenant uniquement les informations relatives à l'artiste (sans le champs album)  
				#-une collection album contenant les informations relatives à l'album  
				#-une collection song contenant les informations relatives à la musique  
				#-Les index des collections artist, album et song  
            #3- le fichier RefArtistInAlbum.js permettant d'ajouter une référence d'artiste dans un document album(~2 minutes)  
			#4- le fichier RefAlbumInSong.js permettant dajouter une référence d'album dans un document song(~20 minutes) 
			#5- le fichier WordCount_Artist.js faisant le word count des lyrics pour chaque artist (~3 heures d'éxecution)(afin de voir les termes les plus utilisés par un artiste)  
			#6- le fichier WordCount_Album.js faisant le word count des lyrics pour chaque album (~10 heures d'éxecution) (afin de voir les termes les plus utilisés dans un album)  
			#7- le fichier WordCount_Song.js faisant le word count des lyrics pour chaque song (afin de voir les termes les plus utilisés dans une musique)   
			#8- le fichier CreateSearchField.js permettant de créer le champs sur lequel sera effectuée la recherche (~10 minutes)  

node_modules/
-----------
	#Contient les modules installés dans node js. exemple :le module require('express') sera dans ce répertoire  



public/
-----------
### bower-components/  
	#Composant téléchargé afin de les utiliser dans l'application  
### img/  
	#Les images du projet  
### javascripts/ 
	#Code javascript des pages html  
### my_components/  
	#Composant crée pour être utilisé dans l'application  
### stylesheets/  
	#Code css des pages html  



routes/
-----------
	#Contient la définition des routes supportées par l'application. C'est ici que se situe la partie REST  
### conf/  
------conf.json  
	#Fichier de configuration permettant  de ne pas reécrire les données redondante dans l'application  
### handler/  
------xxxx.js  
	#Contient la logique applicative à appliquer lors de requêtes sur les routes.   



app.js
-----------
	#C'est le fichier qui sera appelé par la commande node bin/www. C'est ici qu'on appellera les nouvelles routes de l'application et   
        #qu'on configurera certaines parties de l'application  



package.json
-----------
	#Fichier décrivant l'application  



