1-
2-Lancer le serveur
	2.1 - node ./bin/www
3-http://localhost:3000/ (dans le navigateur)
4-Pour recuperer l'ensemble des paroles clicker sur le bouton EXTRACTION OF LYRICS
5-Pour recuperer les donnees relatives au texte et les enregistrer dans le local Storage clicker sur le bouton EXTRACTION OF BABEL'S DATA
6-Pour afficher les donnees clicker sur le bouton SHOW EXTRACTED INFORMATIONS
7-
8-


Architecture :

--bin/
----www
	#Permet de lancer l'application, lié avec le fichier package.json propriété start:"node ./bin/www"
--node_modules/
	#Contient les modules installés dans node js. exemple :le module require('express') sera dans ce répertoire
--routes/
	#Contient la définition des routes supportées par l'application.
----conf/
------conf.json
	#Fichier de configuration permettant  de ne pas reécrire les données redondante dans l'application
----handler/
------codesMetiers.js
	#Contient la logique applicative à appliquer lors de requêtes sur les routes. 
--view/
	#Contientre les modèles de vues (templates) servant à produire les pages html. 
--app.js
	#Permet de lancer l'application, lié avec le fichier package.json propriété main:"/lib/app.js"
--package.json
	#Fichier décrivant l'application

--public/
----images
	#Les images du projet
----javascripts
	#Code javascript des pages html
----libraries
	#Les differentes libraries
----stylesheets
	#Code css des pages html