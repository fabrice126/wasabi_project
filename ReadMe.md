
**Conseils**
=======
Au cours du développement de wasabi, des nouveaux champs seront certainement ajoutés. Si tel est le cas veillez à ajouter ces champs dans les objets correspondant aux modèles mongoose.

Il est conseillé de lire ce que fait chaque API avant de l'utiliser notamment celle concernant `/updatedb` et `/createdb`.

**Répertoires et fichiers du .gitignore**
=======
 Vous pouvez trouvez la listes des fichiers/dossiers non présent sur le git ici: https://github.com/fabrice126/wasabi_project/blob/master/.gitignore  :
1. `mongo/backup_mongo/*` : contient les dumps de la base de données wasabi
2. `mongo/deezer/*` : fichier csv contenant le matching de nos musiques avec les musiques de Deezer (fichier généré par Deezer)
3. `mongo/animux/*` : arborescence contenant les informations permettant d'aligner l'audio avec les lyrics
4. `mongo/discogs/*` : fichiers XML contenant la base de données Discogs. A télécharger ici : http://data.discogs.com/ 
5. `public/my_components/MT5/multitrack/*` : environ 70 go de pistes audio démixées
6. `public/download/*` : environ 70 go de pistes audio démixées en .zip
7. `public/AmpSim3/*` : application AmpSim3 de Michel Buffa
8. `public/AmpSimFA/*` : application AmpSimFa de Michel Buffa
9. `node_modules/*` : contient les modules Node-JS. Vous devez lancer la commande `npm install` dans le dossier wasabi pour récupérer les modules du projet (dépendances du fichier package.json)
10. `cert_https/*` : contient les certificats HTTPS de l'application
11. `routes/conf/login.json` : contient le login/password permettant d'accéder à certaines APIs
12. `routes/conf/confJwt.json` : contient la clé permettant de hasher le token JWT

**Comment lancer l'application sous windows**
=======
1. Récupérer l'application sur le GIT
2. Installer Node-JS : *<a href="https://nodejs.org/en/" target="_blank">ici</a>*
3. Installer mongodb : version >= 3.2 : *<a href="https://www.mongodb.com/" target="_blank">ici</a>*  
*3.1.* Lancer mongodb, voir : *"<a href="#mongodb--sous-windows">Comment lancer les bases de données>MongoDB sous Windows</a>"*  
*3.2.*  Importer la base de données wasabi : `cd wasabi_project/mongo/backup_mongo` et taper la commande `mongorestore dump_X` ou X est le nombre le plus grand (chaque dump possède un README). Vous devez demander le dossier `wasabi_project/mongo/backup_mongo` à l'admin du projet.  
*3.3.* (Facultatif mais conseillé) Installer mongobooster : *<a href="https://mongobooster.com/" target="_blank">ici</a>*  
4. Installer elasticsearch : version >= 2.3 : *<a href="https://www.elastic.co/fr/products/elasticsearch" target="_blank">ici</a>*  
*4.1.* Lancer elasticsearch, voir : *"<a href="#elasticsearch-sous-windows">Comment lancer les bases de données>Elasticsearch sous Windows</a>"*  
5. Lancer le serveur Node-JS  
*5.1.* En ligne de commande : `cd path/to/wasabi_project`  
*5.2.* /!\ Par souci de sécurité le fichier contenant le login / mot de passe n'est pas sur le git vous devez donc créer le fichier `routes/conf/login.json` . Ce fichier contient le json suivant : `{"login": "ADemanderALAdmin","password": "ADemanderALAdmin"}`. Idem pour le fichier `routes/conf/confJwt.json`  contenant la clé des Tokens JWT ce fichier contient le json suivant :  `{"secretOrKey": "ADemanderALAdmin"}`  . Vous pouvez trouver la listes des fichiers/dossiers non présent sur le git ici : https://github.com/fabrice126/wasabi_project/blob/master/.gitignore  
*5.3.* Voir la partie : *"<a href="#comment-installer-le-certificat-https">Comment installer un certificat https</a>"*  
*5.4.* Taper la commande : `npm install`  (cela installera les dépendances du package.json)  
*5.5.* Taper la commande : `npm start`  (cela exécutera la commande npm start du package.json)  
*5.6.* Le serveur est maintenant lancé sur *https://localhost/* (dans le navigateur)  
6. Remplir la base de données d'elasticsearch :  
*6.1.* Vérifiez dans `/routes/conf/conf.js`  que `launch.env.dev_mode` soit à true  
*6.2.* Lancez ensuite l'api REST pour indexer les artistes : `https://127.0.0.1/createdb/createdbelasticsearchartist` et `https://127.0.0.1/createdb/createdbelasticsearchsong` pour indexer les musiques. Nous pouvons maintenant effectuer des recherches via la barre de recherche du site  

**Comment lancer l'application sous RedHat/Linux Centos 7 (serveur - uniquement en cas de ré-installation)**
=======
1. Récupérer l'application sur le GIT  
*1.1.*  Taper la commande : `sudo yum install git` et vérifier qu'il s'est bien installé : `git --version`  
*1.2.* Taper la commande : `git clone https://github.com/fabrice126/wasabi_project.git`  
*1.3.* /!\ Les dumps de la base de données ne sont pas sur le git. Mettre les dumps de la base de données dans le dossier `backup_mongo`. Créer le dossier dans `wasabi_project/mongo/` pour cela rendez-vous dans le bon dossier `cd wasabi_project/mongo/` puis tapez la commande : `mkdir backup_mongo`. Placer les dumps à cet endroit (conseil : envoyer les dumps via *<a href="https://filezilla-project.org/" target="_blank">filezilla</a>*)  
*1.4.* /!\ Par souci de sécurité le fichier contenant le login / mot de passe n'est pas sur le git. Vous devez donc créer `routes/conf/login.json` . Ce fichier contient le json suivant : `{"login": "ADemanderALAdmin","password": "ADemanderALAdmin"}`. Idem pour le fichier `routes/conf/confJwt.json` contenant la clé des Tokens JWT ce fichier contient le json suivant :  `{"secretOrKey": "ADemanderALAdmin"}`. Vous pouvez trouver la liste des fichiers/dossiers non présents sur le git ici : https://github.com/fabrice126/wasabi_project/blob/master/.gitignore  
2. Installer Node-JS : *<a href="https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora" target="_blank">ici</a>*
3. Installer mongodb : version >= 3.2 : *<a href="https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/" target="_blank">ici</a>*  
*3.1.* Lancer mongodb, voir : *"<a href="#mongodb-sous-linux-redhatcentos-7">Comment lancer les bases de données>MongoDB sous Linux RedHat/Centos 7</a>"*
4. Installer elasticsearch: version >= 2.3 : *<a href="https://www.elastic.co/guide/en/elasticsearch/reference/master/rpm.html" target="_blank">ici</a>*  
*4.1.* Lancer elasticsearch, voir : *"<a href="#elasticsearch-sous-linux-redhatcentos-7">Comment lancer les bases de données>Elasticsearch sous Linux RedHat/Centos 7</a>"*
5. Installer le module Node-JS: PM2 dans le répertoire wasabi_project : `npm install pm2 -g`  
*5.1.* Infos utiles sur PM2: log, start, restart, associer un compte pm2 à un serveur : *<a href="http://pm2.keymetrics.io/docs/usage/quick-start/" target="_blank">ici</a>* 
6. Lancer le serveur  
*6.1.* En ligne de commande : `cd /home/user/wasabi_project`  
*6.2.* Dans le dossier `wasabi_project` lancez la commande `npm install` pour installer les dépendances du projet  
*6.3.* Taper la commande : `npm run start-pm2`  
*6.4.* Le serveur est maintenant lancé et accessible sur https://wasabi.i3s.unice.fr
7. Remplir la base de données d'elasticsearch:  
*7.1.* Vérifiez dans `/routes/conf/conf.js`que `launch.env.dev_mode` soit à true  
*7.2.* Utiliser l'API pour indexer les noms des artistes `/createdb/createdbelasticsearchartist`, nous pouvons maintenant chercher les artistes dans la barre de recherche  
*7.3.* Lancer l'API`/createdb/createdbelasticsearchsong` pour indexer les noms des musiques avec les noms des artistes et les noms des albums ainsi nous pourrons chercher une musique par son title + nom d'album + nom d'artiste

**Connexion et gestion du serveur wasabi**
=======

- Vous pouvez vous connecter sur le serveur via putty :  *<a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">ici</a>* ou avec la commande SSH 
- Une fois connecté au serveur entrez votre login / mot de passe (à demander à l'admin)
- Une fois connecté sur le compte taper : `sudo su` et `screen -D -r` (*<a href="https://doc.ubuntu-fr.org/screen" target="_blank">documentation de screen</a>*) afin de restaurer les diverses sessions de ligne de commande
- Vous pouvez naviguer entre ces sessions via `ctrl + a + n` (next screen) ou `ctrl + a + p` (previous screen)
- Le logiciel `htop` sera lancé (l'équivalent du gestionnaire de tâche windows)
- Les logs du serveur seront aussi lancés dans une autre session (LOGS obtenus via PM2)
- Mongodb sera lancé.
- La commande `npm run start-pm2` sera aussi lancé 
- D'autres sessions peuvent aussi être lancés mais n'ont pas de réelle importance

**Connexion et gestion du serveur contenant le blog wasabi**
=======

- Vous pouvez vous connecter sur le serveur via putty :  *<a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">ici</a>* ou avec la commande SSH 
- Une fois connecté au serveur entrez votre login / mot de passe (à demander à l'admin)
- Une fois connecté sur le compte taper : `sudo su` et `screen -D -r` (*<a href="https://doc.ubuntu-fr.org/screen" target="_blank">documentation de screen</a>*) afin de restaurer les diverses sessions de ligne de commande
- Vous pouvez naviguer entre ces sessions via `ctrl + a + n`
- Le logiciel `htop` sera lancé (l'équivalent du gestionnaire de tâche windows)
- Ce serveur contient dans `/home/user/dump_mongo_wasabi` les anciens dumps de la base de données
- Le serveur contient un site wordpress, pour le démarrer (si lampp n'est pas actif) vous devez vous rendre dans `/opt/lampp` et lancer la commande `./lampp start`
- Lien utile : http://sharadchhetri.com/2014/03/24/install-xampp-centosrhel-6-5/ 
- Informations utiles : par défaut, l'accès à la base de données du blog wasabi n'est pas possible depuis le web. Pour changer ce comportement vous devez vous rendre dans `/opt/lampp/etc/extra/httpd-xampp.conf` et remplacer `Require local` par `Require all granted` dans `<LocationMatch>`
**Comment lancer les bases de données**
=======
## MongoDB sous Linux RedHat/Centos 7

- Lancer MongoDB : `mongod --dbpath /var/lib/mongo`

## MongoDB  sous Windows

- En console taper: `mongod` 

## Elasticsearch sous Linux RedHat/Centos 7

- Pour lancer elasticsearch : `service elasticsearch start`
- Pour arrêter elasticsearch : `service elasticsearch stop` 

## Elasticsearch sous Windows

- Lancer le fichier `elasticsearch.bat` dans le dossier `bin` de  votre répertoire elasticsearch ou chercher via la barre de recherche windows `elasticsearch.bat`

## Musicbrainz en local

- Voir : https://musicbrainz.org/doc/MusicBrainz_Server/Setup, lorsque bin/reindex est exécuté, vous pouvez lancer des requêtes via l'API Musicbrainz local

**Comment générer la documentation des APIs**
=======
Nous utilisons http://apidocjs.com/ pour décrire nos APIs et générer leurs documentations. Pour cela : 

- Rendez-vous sur le répertoire racine du projet : `wasabi_project`
- Lancez la commande : `npm run apidoc` plus d'informations : <a href="http://apidocjs.com/#run" target="_blank">ici</a> 
cela générera la documentation des APIs contenues dans le dossier `wasabi_project/routes` dans le dossier `wasabi_project/apidoc` 

**Comment installer le certificat HTTPS**
=======
Un dossier `wasabi_project/cert_https` doit être créé afin d'y ajouter les certificats fournis par le projet. Ces certificats seront utilisés dans le fichier `bin/www`
`{
key: fs.readFileSync('./' + config.https.wasabi_key),
cert: fs.readFileSync('./' + config.https.wasabi_crt)
ca: fs.readFileSync('./' + config.https.digi_crt)
}`

**Architecture du code:**
=======
## bin/www
** Permet configurer les listeners du server **    

## mongo/
#### mongo/backup_mongo/  
**Contient les dumps de l'application**  
**Convention de nommage des dumps :** 
Le dump courant est le dump avec le numéro le plus élevé `dump_x`, le `dump_x-2` sera plus ancien que le `dump_x-1` . Chaque dump contient un `readme` contenant les nouveaux champs ajoutés dans la base de données.

**Créer un dump de la base de données :**   

 1. Assurez-vous que mongodb est actif pour cela taper en ligne de commande `mongod`
 2. Rendez-vous dans le répertoire des dumps `mongo/backup_mongo/` en ligne de commande 
 3. Lancer la commande `mongodump --out dump_x+1` par exemple : si le dernier dump a pour nom `dump_5` lancez la commande `mongodump --out dump_6` pour créer un nouveau dump. Un dossier `dump_6` sera créé. Vous pouvez aussi lancer la commande `mongodump` pour créer un dump nommé `dump` et ensuite le renommer.
 
**Restaurer la base de données via un dump :**
 1. Rendez-vous dans le répertoire des dumps `mongo/backup_mongo/` en ligne de commande
 2. (Facultatif) Si vous n'avez rien à garder dans la base actuelle vous pouvez la drop :  
 *2.1.* Taper en ligne de commande `mongo wasabi` pour avoir accès à la base de données wasabi  
 *2.2.* Taper en ligne de commande `db.dropDatabase()` afin de supprimer la base de données wasabi  
 3. Lancer la commande `mongorestore path/to/dump_6` pour restaurer la base de données wasabi

#### mongo/request_mongo/  
**Contient des requêtes utiles**
Si la base de données est recréée de zéro via le web-service `/createdb` elle contiendra :  
Une collection artist une collection album et une collection song, il faudra donc lancer :  

 1. Les fichiers ci-dessous via la commande mongodb `load("FichierMongoDB.js");` pour cela:  
 	*1.1.* Assurez-vous que mongodb est lancé avec la commande `mongod`  
 	*1.2.* Allez dans votre répertoire `mongo/request_mongo` en ligne commande et tapez la commande `mongo wasabi`, vous devriez être connecté à la base de données  
 	*1.3.* Lancer la commande `load("MonFichier.js");` exemple `load("FindSameDocument.js");`  
 	*1.4.* Vous pouvez aussi lancer ces scripts via une interface graphique tel que mongobooster : *<a href="https://mongobooster.com/" target="_blank">ici</a>*  
 
 2.  Le fichier `findSameDocument.js` dans mongo afin de trouver les documents en double (ayant le même nom d'artiste car un nom d'artiste est unique en base de données, cf : comme dans lyrics wikia) dans la base de	données

 3.  [doit être exécuté après 2.] Le fichier `ConstructBDAfterCreate.js` dans mongodb afin de créer les index des collections `artist`, `album` et `song`  
  
 4.  Si besoin - [doit être exécuté après 3.] Le fichier `WordCount_Artist.js` faisant le word count des lyrics pour chaque artist (~3 heures d’exécution)(afin de voir les termes les plus utilisés par artistes)
 
 5.  Si besoin - [doit être exécuté après 3.] Le fichier `WordCount_Album.js` faisant le word count des lyrics pour chaque album (~10 heures d’exécution) (afin de voir les termes les plus utilisés dans un album)
 
 6.  Si besoin - [doit être exécuté après 3.] Le fichier `WordCount_Song.js` faisant le word count des lyrics pour chaque song (afin de voir les termes les plus utilisés dans une musique)

 7.  [doit être exécuté après 3 et en mode `development`.] Le web service `extractdbpedia/artist` permettant d'extraire le RDF des artistes ayant un lien vers Wikipédia. Ce web service envoie des requêtes SPARQL sur DBpédia afin d'obtenir le RDF de l'artiste. Un champ rdf contenant le RDF de l'artiste est ensuite ajouté en base de données (durée: plusieurs heures)
 
 8.  [doit être exécuté après 3 et en mode `development`.] Le web service `extractdbpedia/album` permettant d'extraire le RDF des musiques ayant un lien vers Wikipédia. Ce web service envoie des requêtes sparql sur DBpédia afin d'obtenir le RDF de la musique. Un champ rdf contenant le RDF de la musique est ensuite ajouté en base de données (durée: plusieurs heures)
 
 9.  [doit être exécuté après 3 et en mode `development`.] Le web service `extractdbpedia/song` permettant d'extraire le RDF des albums ayant un lien vers wikipédia. Ce web service envoie des requêtes sparql sur DBpédia afin d'obtenir le RDF de l'album. Un champ rdf contenant le RDF de l'album est ensuite ajouté en base de données (durée: plusieurs heures)
 
 10.  [doit être exécuté après 9 et en mode `development`.] le web service `extractdbpedia/createfields/song` transforme les propriétés de notre champ RDF en propriétés dans notre base de données
 
 11.  [doit être exécuté après 10.] le fichier `CreateIndexAfterDBpediaExtraction` ce fichier permet de créer les index des nouveaux champs insérés dans la base de données
 
 12.  [doit être exécuté après 11.] le fichier `Create_IsClassic_Field` permettant grâce aux subjects des musiques récupérées du rdf de savoir si la musique est un classique
 
 13. [doit être exécuté après 12 et en mode `development`.] le web service `updatedb/multitrackspath` ajoute la propriété multitrackspath dans notre base de données. Ce web service a besoin des musiques multitrack sur la machine ou est lancé cette API
 
 14. [doit être exécuté après 6 et en mode `development` **avec le serveur MusicBrainz local actif**.] Le web service `updatedb/musicbrainz/artist` 
 
 15. [doit être exécuté après 6 et en mode `development` **avec le serveur MusicBrainz local actif**.] Le web service `updatedb/musicbrainz/album` 
 
 16. [doit être exécuté après 6 et en mode `development` **avec le serveur MusicBrainz local actif**.] Le web service `updatedb/musicbrainz/song` 

 17. [doit être exécuté après 6 et en mode `development` **avec le serveur MusicBrainz local actif**.] Le web service `updatedb/musicbrainz/artist/member` 
 
 18. [doit être exécuté après 17 et en mode `development`.] Vous devez avoir le fichier `mongo/deezer/track_dz_wasabi_viaproduct.csv`  contenant le mapping entre les IDs de nos musiques et les IDs des musiques chez Deezer. Le web service `updatedb/deezer/create_mapping` permettra de créer un champ `deezer_mapping`  dans la collection song.  
 
 19. [doit être exécuté après 18 et en mode `development`.] Le web service `updatedb/deezer/song` permet de récupérer des informations sur les musiques ayant un champs deezer_mapping non vide via l'API de Deezer.

 20. [doit être exécuté après 19 et en mode `development`.] Le web service `/deezer/check_and_update_id/artist` permet d'associer le bon id d'un artist pour une musique donnée

 21. [doit être exécuté après 20 et en mode `development`.] Le web service `updatedb/deezer/artist` permet de récupérer des informations sur les artistes ayant un champs deezer_mapping non vide via l'API de Deezer.

 22. [doit être exécuté après 21 et en mode `development`.] Le web service `/deezer/check_and_update_id/album` permet d'associer le bon id d'un album pour une musique donnée

 23. [doit être exécuté après 22 et en mode `development`.] Le web service `updatedb/deezer/album` permet de récupérer des informations sur les albums ayant un champ deezer_mapping non vide via l'API de Deezer.

 24. [doit être exécuté après 23 et en mode `development`.] Le web service `updatedb/discogs/artist` permet de mettre à jour les artistes ayant un lien vers discogs.

 25. [doit être exécuté après 24 et en mode `development`.] Le web service `updatedb/discogs/artist/members` permet de mettre à jour les membres ayant un lien vers discogs.

 26. [doit être exécuté après 25 et en mode `development`.] Le web service `updatedb/discogs/add/artist/id` permet d'ajouter le champ id de discogs correspondant à l'artiste.

 27. [doit être exécuté après 26 et en mode `development`.] Le web service `updatedb/discogs/add/album/id` permet d'ajouter le champ id de discogs correspondant à l'album.

 28. [doit être exécuté après 27 et en mode `development`.] Le web service `updatedb/discogs/add/artist/members/id` permet d'ajouter le champ id de discogs correspondant aux membres.
 
 29. [doit être exécuté après 28 et en mode `development`.] Le web service `updatedb/discogs/album` permet de mettre à jour les albums ayant un lien vers discogs.

 30. [doit être exécuté après 29 et en mode `development`.] Le web service `updatedb/equipboard/try_tor` permet de tester que la connection vers TOR fonctionne.

 31. [doit être exécuté après 30 et en mode `development`.] Le web service `updatedb/equipboard/add/artist/members/url_equipboard` permet de créer à partir du nom d'un membre son url vers equipboard.

 32. [doit être exécuté après 31 et en mode `development`.] Le web service `updatedb/equipboard/artist/equipment` permet de récupérer des informations conernant les equipements des membres.

 33. [doit être exécuté après 32 et en mode `development`.] Le web service `updatedb/equipboard/artist/equipment/description` permet de récupérer des informations conernant les descriptions.

 34. [doit être exécuté après 33 et en mode `development`.] Le web service `updatedb/animux/remove_accent/artist` permet de créer un champ contenant le nom de l'artiste sans accent.

 35. [doit être exécuté après 34 et en mode `development`.] Le web service `updatedb/animux/remove_accent/song` permet de créer un champ contenant le nom de la musique sans accent.

 36. [doit être exécuté après 35 et en mode `development`.] Le web service `updatedb/animux/sanitize_rename/artist` permet de nettoyer les noms des dossiers et de fichiers de l'arborescence animux.

 37. [doit être exécuté après 36 et en mode `development`.] Le web service `updatedb/animux/create_mapping/artist` permet de faire le matching entre les artistes wasabi et les artistes animux.

 38. [doit être exécuté après 37 et en mode `development`.] Le web service `updatedb/animux/create_mapping/artist/not_found` permet d'améliorer le matching entre les artistes wasabi et les artistes animux.

 39. [doit être exécuté après 38 et en mode `development`.] Le web service `updatedb/lyrics/language_detect` permet de créer un nouveau champ dans la collection 'song' contenant la langue de la musique.

 40. [doit être exécuté après 39 et en mode `development`.] Le web service `updatedb/create_stats/lyrics/language/popularity` permet de créer une collection recensant les langues les plus utilisées dans wasabi.

 41. [doit être exécuté après 40 et en mode `development`.] Le web service `updatedb/create_stats/properties/artist/count` permet de créer une collection recensant les propriétés de la collection 'artist'

 42. [doit être exécuté après 41 et en mode `development`.] Le web service `updatedb/create_stats/properties/album/count` permet de créer une collection recensant les propriétés de la collection 'album'

 43. [doit être exécuté après 42 et en mode `development`.] Le web service `updatedb/create_stats/properties/song/count` permet de créer une collection recensant les propriétés de la collection 'song'

 44. [doit être exécuté après 43 et en mode `development`.] le web service `extractdbpedia/createfields/artist` transforme les propriétés de notre champ RDF en propriétés dans notre base de données
 
 45. TODO [doit être exécuté après 44 et en mode `development`.] le web service `extractdbpedia/createfields/album` transforme les propriétés de notre champ RDF en propriétés dans notre base de données

#### mongo/sparql/
**Contient les requêtes sparql utilisées par l'application pour l'extraction du RDF pour les :**  

 - Artistes: sparql_artist_data.rq  
 - Albums: sparql_album_data.rq 
 - Musiques: sparql_song_data.rq 
 
 
## node_modules/
	Contient les dépendances des modules Node-JS 
	
## cert_https/
	contient les certificats https

## model/
	Contient les modèles de la base de données 
	
## public/
#### public/bower-components/  
	Composants téléchargés afin de les utiliser dans l'application
#### public/img/  
	Les images du projet
#### public/my_components/  
	Composant créé pour être utilisé dans l'application  
 
## routes/
	Contient la définition des routes supportées par l'application. C'est ici que se situe l'API REST  
#### routes/conf/  
	conf.js : Fichier de configuration permettant de ne pas réécrire les données redondantes dans l'application  
#### routes/handler/  
	xxxx.js : Contient la logique applicative à appliquer lors de requêtes sur les routes.
#### routes/api  
	Contient les APIs du projet
#### routes/api_search/  
	Contient les APIs utilisées sur le site web https://wasabi.i3s.unice.fr 
#### routes/api_createdb/  
	Contient les APIs utilisées pour la création de la base de données wasabi
#### routes/api_updatedb/     
	Contient les APIs utilisées pour mettre à jour la base de données wasabi
#### routes/api_MT5/     
	Contient les APIs utilisées pour l'application MT5 de Michel Buffa
#### routes/api_jwt/     
	Contient les APIs utilisées l'authentification à wasabi
#### routes/api_extractdbpedia/   
	Contient les APIs utilisées extraire les données de DBpedia

## app.js
	C'est le fichier qui sera appelé par la commande node bin/www. C'est ici qu'on appellera les nouvelles routes de l'application et qu'on configurera certaines parties de l'application  
	
## package.json
	Fichier décrivant l'application, c'est aussi le gestionnaire de dépendance de Node-JS. 
	

