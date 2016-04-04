1-
2-Lancer le serveur
	2.1 - cd C:/Users/user/Documents/wasabi_project
	2.2 - node bin/www
	2.3 - le serveur est maintenant lancé sur http://localhost (dans le navigateur)
3 - 
4-Pour recuperer l'ensemble des paroles clicker sur le bouton EXTRACTION OF LYRICS
5-Pour recuperer les donnees relatives au texte et les enregistrer dans le local Storage clicker sur le bouton EXTRACTION OF BABEL'S DATA
6-Pour afficher les donnees clicker sur le bouton SHOW EXTRACTED INFORMATIONS
7-
8-


Architecture :

--bin/
----www
	#Permet de lancer l'application



--mongo/
----backup_mongo/
	#Contient les dumps de l'application
	#Le dump courant s'appel "dump", les anciens dumps : "dump_old_X" le dump_old_1 sera plus ancien que le dump_old_2
	#Créer un dump de la base de données : 
		#assurez-vous que mongodb est actif -> commande mongod en console ayant été effectué
		#rendez-vous dans le répertoire des dumps en ligne de commande 
		#changer le nom du dossier appelé "dump" pour l'appeler "dump_old_x+1" 
		#lancer la commande mongodump, un dossier dump sera crée 
----backup_mongo/
	#contient des requêtes utiles
	#si la base de données est recrée de zéro elle contiendra:
		#Une collection artist contenant des documents représentant un artiste avec ses albums et ses musiques, il faudra donc lancer :
		#1- le fichier findSameDocument.js afin de trouver les documents en double (ayant le même nom d'artist) dans la base de données
			#Il y aura toujours des documents en double dans la base de données une fois celle-ci crée
			#car lors de l'extraction  sur le site de lyrics wikia certains artistes étaient présent 2 fois
			#Supprimer alors un des deux documents apparaissant en double
		#2- le fichier constructBDAfterCreate.js dans mongodb afin de créer : une collection artist sans albums, une colelction song et album ainsi que leurs index



--node_modules/
	#Contient les modules installés dans node js. exemple :le module require('express') sera dans ce répertoire



--public/
----bower-components/
	#Composant téléchargé afin de les utiliser dans l'application
----img/
	#Les images du projet
----javascripts/
	#Code javascript des pages html
----my_components/
	#Composant crée pour être utilisé dans l'application
----stylesheets/
	#Code css des pages html



--routes/
	#Contient la définition des routes supportées par l'application. C'est ici que se situe la partie REST
----conf/
------conf.json
	#Fichier de configuration permettant  de ne pas reécrire les données redondante dans l'application
----handler/
------xxxx.js
	#Contient la logique applicative à appliquer lors de requêtes sur les routes. 



--app.js
	#C'est le fichier qui sera appelé par la commande node bin/www. C'est ici qu'on appellera les nouvelles routes de l'application et 
        #qu'on configurera certaines parties de l'application



--package.json
	#Fichier décrivant l'application



