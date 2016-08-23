
**Comment lancer l'application sous windows**
=======
1. Récupérer l'application sur le GIT
2. Installer node js : *https://nodejs.org/en/*
3. Installer mongodb : version >= 3.2 : *https://www.mongodb.com/*  
*3.1.* (facultatif mais conseillé) Installer robomongo : *https://robomongo.org/*
4. Installer elasticsearch: version >= 2.3 : *https://www.elastic.co/fr/products/elasticsearch*
5. Lancer le serveur  
*5.1.* en ligne de commande : `cd C:/Users/user/Documents/wasabi_project`  
*5.2.* taper la commande : `node bin/www`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*5.2.1.* Si ça ne fonctionne pas : taper `npm install` en ligne commande dans le projet wasabi (voir 5.1.)  
*5.3.* le serveur est maintenant lancé sur *http://localhost/* (dans le navigateur)

**Comment lancer l'application sous RedHat/Linux Centos 7 (serveur)**
=======
1. Récupérer l'application sur le GIT  
*1.1.* taper la commande : `sudo yum install git` et vérifier qu'il s'est bien installé : `git --version`  
*1.2.* taper la commande : `git clone https://github.com/fabrice126/wasabi_project.git`  
*1.3.* /!\ les dumps de la base de données ne sont pas sur le git le clone ne les télechargera pas vous devez donc mettre les dumps de la base de données dans le dossier `backup_mongo` créer donc ce dossier dans `wasabi_project/mongo/` pour cela rendez-vous dans le bon dossier `cd wasabi_project/mongo/` puis tapez la commande : `mkdir backup_mongo`. Placer les dumps à cet endroit  
*1.4.* Dans le dossier `wasabi_project/mongo/` créer le répertoire backup_mongo_tmp `mkdir backup_mongo_tmp`  
*1.5.* /!\ Par soucis de sécurité le fichier contenant le login / mot de passe n'est pas sur le git vous devez donc ajouter `login.json` dans le répertoire `routes/conf`. Ce fichier contient ce json: `{"login": "ADemander","password": "ADemander"}`
2. Installer node js : *https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora*
3. Installer mongodb : version >= 3.2 : *https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/*  
4. Installer elasticsearch: version >= 2.3 : *https://www.elastic.co/guide/en/elasticsearch/reference/master/rpm.html*
5. Lancer le serveur  
*5.1.* en ligne de commande : `cd C:/Users/user/Documents/wasabi_project`  
*5.2.* taper la commande : `node bin/www`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*5.2.1.* Si ça ne fonctionne pas : taper `npm install` en ligne commande dans le projet wasabi (voir 5.1.)  
*5.3.* le serveur est maintenant lancé et accessible via l'URL à demander au chef du projet

**Comment lancer les bases de données**
=======
## MongoDB sous Linux RedHat/Centos 7

- Lancer MongoDB : `mongod --dbpath /var/lib/mongo`

## MongoDB  sous Windows

- En console tapez: `mongod` 

## Elasticsearch sous Linux RedHat/Centos 7

- Pour lancer elasticsearch : `service elasticsearch start`
- Pour arrêter elasticsearch : `service elasticsearch stop` 

## Elasticsearch sous Windows

- Lancer le fichier `elasticsearch.bat` dans le dossier `bin` de  votre répertoire elasticsearch ou chercher via la barre de recherche windows `elasticsearch.bat`

**Architecture du code:**
=======
## bin/
**Permet de lancer l'application:** `node  bin/www`   



## mongo/
#### mongo/backup_mongo/  
**Contient les dumps de l'application :**  
**Convention de nommage des dumps :**  Le dump courant est le dump avec le numéro le plus élevé `dump_x`, le `dump_x-2` sera plus ancien que le `dump_x-1`  

**Créer un dump de la base de données :**   

 1. Assurez-vous que mongodb est actif pour cela taper en ligne de commande `mongod`
 
 2. Rendez-vous dans le répertoire des dumps `(mongo/backup_mongo/)` en ligne de commande
 
 3. Lancer la commande `mongodump --out dump_x+1` par exemple: si le dernier dump a pour nom `dump_5` lancer la commande `mongodump --out dump_6` pour créer un nouveau dump, un dossier `dump_6` sera crée. Vous pouvez aussi lancer la commande `mongodump` pour créer un dump nommé `dump`. Restaurer la base de données via un dump
 
 4. Rendez-vous dans le répertoire des dumps `(mongo/backup_mongo/)` en ligne de commande
 
 5. (Facultatif) Si vous n'avez rien a garder dans la base actuel vous pouvez la drop :  
 *5.1.* Taper en ligne de commande `mongo wasabi` pour avoir accès a la base de données wasabi  
 *5.2.* Taper en ligne de commande `db.dropDatabase()` afin de supprimer la base de données wasabi  

 6. Lancer la commande `mongorestore dump_6` pour restaurer la base de données wasabi (données + index)  



#### mongo/request_mongo/  
**Contient des requêtes utiles :**
Si la base de données est recréée de zéro via le web-service `/createdb` elle contiendra:  
Une collection artist contenant des documents représentant un artiste avec ses albums et ses musiques, il faudra donc lancer :  

 1. Les fichiers ci-dessous via la commande mongodb `load("FichierMongoDB.js");` pour cela:  
 	*1.1.* Assurez-vous que mongodb est lancé avec la commande `mongod`  
 	*1.2.* Aller dans votre répertoire `mongo/request_mongo` en ligne commande et tapez la commande `mongo wasabi`, vous devriez être connecté à la base de données  
 	*1.3.* Lancer la commande `load("MonFichier.js");` exemple `load("FindSameDocument.js");`  
 	*1.4.* Vous pouvez aussi lancer ces scripts via une interface graphique tel que robomongo: *https://robomongo.org*  
 
 2.  Le fichier `FindSameDocument.js` dans mongo afin de trouver les documents en double (ayant le même nom d'artiste car un nom d'artiste est unique en base de données, cf : comme dans lyrics wikia) dans la base de 	données

 3.  Le fichier `ConstructBDAfterCreate.js` dans mongodb afin de créer :  
 	*3.1.* Une collection artist contenant uniquement les informations relatives à l'artiste (sans le champ album)  
	*3.2.* Une collection album contenant les informations relatives à l'album  
 	*3.3.* Une collection song contenant les informations relatives à la musique  
 	*3.4.* Les index des collections artist, album et song  
 
 4.  Le fichier `RefArtistInAlbum.js` permettant d'ajouter une référence d'artiste dans un document album(~2 minutes) et de créer l'index sur ce champ
 
 5.  Le fichier `RefAlbumInSong.js` permettant d'ajouter une référence d'album dans un document song(~20 minutes) et de créer l'index sur ce champ
 
 6.  Le fichier `WordCount_Artist.js` faisant le word count des lyrics pour chaque artist (~3 heures d’exécution)(afin de voir les termes les plus utilisés par un artiste)
 
 7.  Le fichier `WordCount_Album.js` faisant le word count des lyrics pour chaque album (~10 heures d’exécution) (afin de voir les termes les plus utilisés dans un album)
 
 8.  Le fichier `WordCount_Song.js` faisant le word count des lyrics pour chaque song (afin de voir les termes les plus utilisés dans une musique)

 9.  Le web service `extractdbpedia/artist` permettant d'extraire le RDF des artistes ayant un lien vers Wikipédia. Ce web service envoie des requêtes SPARQL sur DBpédia afin d'obtenir le RDF de l'artiste. Un champ rdf contenant le RDF de l'artiste est ensuite ajouté en base de données (durée: plusieurs heures)
 
 10.  Le web service `extractdbpedia/album` permettant d'extraire le RDF des musiques ayant un lien vers Wikipédia. Ce web service envoie des requêtes sparql sur DBpédia afin d'obtenir le RDF de la musique. Un champ rdf contenant le RDF de la musique est ensuite ajouté en base de données (durée: plusieurs heures)
 
 11.  Le web service `extractdbpedia/song` permettant d'extraire le RDF des albums ayant un lien vers wikipédia. Ce web service envoie des requêtes sparql sur DBpédia afin d'obtenir le RDF de l'album. Un champ rdf contenant le RDF de l'album est ensuite ajouté en base de données (durée: plusieurs heures)
 
 12.  le web service `extractdbpedia/artist/createfields` transforme les propriétés de notre champ RDF en propriétés dans notre base de données
 
 13.  le web service `extractdbpedia/album/createfields` transforme les propriétés de notre champ RDF en propriétés dans notre base de données
 
 14.  le web service `extractdbpedia/song/createfields` transforme les propriétés de notre champ RDF en propriétés dans notre base de données
 
 15.  le fichier `CreateIndexAfterDBpediaExtraction` ce fichier permet de créer les index des nouveaux champs insérés dans la base de données
 
 16.  le fichier `Create_IsClassic_Field` permettant grâce aux subjects des musiques récupérées sur DBpédia de savoir si la musique est un classique
 

#### mongo/sparql/
**Contient les requêtes sparql utilisées par l'application pour l'extraction du RDF pour les :**  

 - Artistes: sparql_artist_data.rq  
 - Albums: sparql_album_data.rq 
 - Musiques: sparql_song_data.rq 
 

## node_modules/
**Contient les modules installés dans node js. exemple :le module require('express') sera dans ce répertoire**  



## public/
#### public/bower-components/  
	Composant téléchargé afin de les utiliser dans l'application

#### public/img/  
	Les images du projet

#### public/javascripts/ 
	Code javascript des pages html

#### public/my_components/  
	Composant crée pour être utilisé dans l'application  

#### public/stylesheets/  
	Code css des pages html 
	 

## routes/
	Contient la définition des routes supportées par l'application. C'est ici que se situe la partie REST  
#### routes/conf/  
	conf.json : Fichier de configuration permettant  de ne pas réécrire les données redondante dans l'application  
#### routes/handler/  
	xxxx.js : Contient la logique applicative à appliquer lors de requêtes sur les routes.   
	




## app.js
	C'est le fichier qui sera appelé par la commande node bin/www. C'est ici qu'on appellera les nouvelles routes de l'application et qu'on configurera certaines parties de l'application  
	



## package.json
	Fichier décrivant l'application, c'est aussi le gestionnaire de dépendance de node js. 
	



