
**Conseils**
=======
Au cours du développement de wasabi, des champs récupérés de lyrics wikia seront peut-être ajoutés. Si tel est le cas veillez à ajouter ces champs dans les objets correspondant aux modèles.

Il est conseillé de lire ce que fait chaque API avant de l'utiliser notamment celle concernant updatedb et createdb.

**Répertoires et fichiers du .gitignore**
=======
 Vous pouvez trouvez la listes des fichiers/dossiers non présent sur le git ici: https://github.com/fabrice126/wasabi_project/blob/master/.gitignore  :
1. `mongo/backup_mongo/*` : contient les dumps de la base de données wasabi
2. `mongo/deezer/*` : fichier csv contenant le matching de nos musiques avec les musiques chez deezer
3. `mongo/animux/*` : arborescence contenant les informations permettant d'aligner l'audio avec les lyrics
4. `mongo/discogs/*` : fichiers XML contenant la base de données discogs. A télécharger ici : http://data.discogs.com/ 
5. `public/my_components/MT5/multitrack/*` : environ 70 go de pistes audio démixées
6. `public/download/*` : environ 70 go de pistes audio démixées en .zip
7. `public/AmpSim3/*` : application AmpSim3
8. `public/AmpSimFA/*` : application AmpSimFa
9. `node_modules/*` : contient les modules node js. lancer `npm install` dans le dossier wasabi pour récupérer les modules du projet
10. `cert_https/*` : contient les certificats HTTPS de l'application
11. `routes/conf/login.json` : contient le login/password permettant d'accéder à certaines API
12. `routes/conf/confJwt.json` : contient la clés permettant de hasher le token JWT

**Comment lancer l'application sous windows**
=======
1. Récupérer l'application sur le GIT
2. Installer node js : *<a href="https://nodejs.org/en/" target="_blank">ici</a>*
3. Installer mongodb : version >= 3.2 : *<a href="https://www.mongodb.com/" target="_blank">ici</a>*  
*3.1.* lancer mongodb, voir : *"<a href="#mongodb--sous-windows">Comment lancer les bases de données>MongoDB sous Windows</a>"*  
*3.2.*  Importer la base de données wasabi : `cd wasabi_project/mongo/backup_mongo` et taper la commande `mongorestore dump_X` ou X est le nombre le plus grand (chaque dump possède un README). Vous devez demander le dossier `wasabi_project/mongo/backup_mongo` à l'admin du projet.  
*3.3.* (facultatif mais conseillé) Installer mongobooster : *<a href="https://mongobooster.com/" target="_blank">ici</a>*  
4. Installer elasticsearch: version >= 2.3 : *<a href="https://www.elastic.co/fr/products/elasticsearch" target="_blank">ici</a>*  
*4.1.* lancer elasticsearch, voir : *"<a href="#elasticsearch-sous-windows">Comment lancer les bases de données>Elasticsearch sous Windows</a>"*  
5. Lancer le serveur node js  
*5.1.* En ligne de commande : `cd C:/Users/user/Documents/wasabi_project`  
*5.2.* /!\ Par souci de sécurité le fichier contenant le login / mot de passe n'est pas sur le git vous devez donc ajouter `routes/conf/login.json` . Ce fichier contient le json suivant: `{"login": "ADemanderALAdmin","password": "ADemanderALAdmin"}`. Idem pour le fichier `routes/conf/confJwt.json`  contenant la clé des Tokens JWT ce fichier contient le json suivant :  `{"secretOrKey": "ADemanderALAdmin"}`  . Vous pouvez trouvez la listes des fichiers/dossiers non présent sur le git ici: https://github.com/fabrice126/wasabi_project/blob/master/.gitignore  
*5.3.* Voir la partie: *"<a href="#comment-installer-le-certificat-https">Comment installer un certificat https</a>"*  
*5.4.* taper la commande: `npm install`  cela installera les dépendances du projet  
*5.5.* taper la commande: `npm start`  
*5.6.* le serveur est maintenant lancé sur *http://localhost/* (dans le navigateur)  
6. Remplir la base de données d'elasticsearch : 
*6.1.* vérifiez dans `/routes/conf/conf.js`  que launch.env.dev_mode soit à true
*6.2.* Lancez ensuite l'api REST pour indexer les artistes: `http://127.0.0.1/createdb/createdbelasticsearchartist` et `http://127.0.0.1/createdb/createdbelasticsearchsong` pour indexer les musiques. Nous pouvons maintenant effectuer des recherches via la barre de recherche du site  


**Comment lancer l'application sous RedHat/Linux Centos 7 (serveur - uniquement en cas de ré-installation)**
=======
1. Récupérer l'application sur le GIT  
*1.1.*  Taper la commande : `sudo yum install git` et vérifier qu'il s'est bien installé : `git --version`  
*1.2.* Taper la commande : `git clone https://github.com/fabrice126/wasabi_project.git`  
*1.3.* /!\ les dumps de la base de données ne sont pas sur le git. Mettre les dumps de la base de données dans le dossier `backup_mongo`. Créer le dossier dans `wasabi_project/mongo/` pour cela rendez-vous dans le bon dossier `cd wasabi_project/mongo/` puis tapez la commande : `mkdir backup_mongo`. Placer les dumps à cet endroit (conseil: envoyer les dumps via filezilla)  
*1.4.* Dans le dossier `wasabi_project/mongo/` créer le répertoire backup_mongo_tmp. Taper la commande : `mkdir backup_mongo_tmp`  
*1.5.* /!\ Par souci de sécurité le fichier contenant le login / mot de passe n'est pas sur le git vous devez donc ajouter `routes/conf/login.json` . Ce fichier contient le json suivant: `{"login": "ADemanderALAdmin","password": "ADemanderALAdmin"}`. Idem pour le fichier routes/conf/confJwt.json contenant la clé des Tokens JWT ce fichier contient le json suivant :  `{"secretOrKey": "ADemanderALAdmin"}`. Vous pouvez trouvez la listes des fichiers/dossiers non présent sur le git ici: https://github.com/fabrice126/wasabi_project/blob/master/.gitignore  
2. Installer node js : *<a href="https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora" target="_blank">ici</a>*
3. Installer mongodb : version >= 3.2 : *<a href="https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/" target="_blank">ici</a>*  
*3.1.* lancer mongodb, voir : *"<a href="#mongodb-sous-linux-redhatcentos-7">Comment lancer les bases de données>MongoDB sous Linux RedHat/Centos 7</a>"*
4. Installer elasticsearch: version >= 2.3 : *<a href="https://www.elastic.co/guide/en/elasticsearch/reference/master/rpm.html" target="_blank">ici</a>*  
*4.1.* lancer elasticsearch, voir : *"<a href="#elasticsearch-sous-linux-redhatcentos-7">Comment lancer les bases de données>Elasticsearch sous Linux RedHat/Centos 7</a>"*
5. Installer le module node js PM2 dans le répertoire wasabi_project : `npm install pm2 -g`  
*5.1.* infos utiles sur PM2: log, start, restart, associer un compte pm2 à un serveur ... : *<a href="http://pm2.keymetrics.io/docs/usage/quick-start/" target="_blank">ici</a>* 
6. Lancer le serveur  
*6.1.* en ligne de commande : `cd C:/Users/user/Documents/wasabi_project`  
*6.2.* taper la commande : `pm2 start --interpreter babel-node bin/www --watch --log-date-format="YYYY-MM-DD HH:mm Z"`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*6.2.1.* Si ça ne fonctionne pas : taper `npm install` en ligne commande dans le projet wasabi afin d'installer les dépendances (voir 6.1.)  
*6.3.* le serveur est maintenant lancé et accessible via l'URL du projet wasabi (à demander au chef du projet)
7. Remplir la base de données d'elasticsearch: 
*7.1.* vérifiez dans `/routes/conf/conf.js`que launch.env.dev_mode soit à true
*7.2.* Utiliser l'api REST pour indexer les noms des artistes http://urldusite/createdb/createdbelasticsearchartist et http://urldusite/createdb/createdbelasticsearchsong pour indexer les noms des musiques avec les noms des artistes et les noms des albums ainsi nous pourrons chercher une musique par son title + nom d'album + nom d'artiste.

**Connexion et gestion du serveur wasabi**
=======

- Vous pouvez vous connecter sur le serveur via putty :  *<a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">ici</a>* ou avec la commande SSH 
- Une fois connecté au serveur entrez votre login / mot de passe (à demander à l'admin)
- Une fois connecté sur le compte taper : `sudo su` et `screen -r` (*<a href="https://doc.ubuntu-fr.org/screen" target="_blank">documentation de screen</a>*) afin de restaurer les diverses sessions de ligne de commande
- Vous pouvez naviguer entre ces sessions via `ctrl + a + n`
- Le logiciel `htop` sera lancé (l'équivalent du gestionnaire de tâche windows)
- Les logs du serveur seront aussi lancé dans une autre session (LOGS obtenus via PM2)
- Mongodb sera lancé.
- La commande `pm2 start --interpreter babel-node bin/www --watch --log-date-format="YYYY-MM-DD HH:mm Z"` sera aussi lancé 
- D'autres sessions peuvent aussi être lancés mais n'ont pas de réelle importance


**Connexion et gestion du serveur contenant le blog wasabi**
=======

- Vous pouvez vous connecter sur le serveur via putty :  *<a href="http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html" target="_blank">ici</a>* ou avec la commande SSH 
- Une fois connecté au serveur entrez votre login / mot de passe (à demander à l'admin)
- Une fois connecté sur le compte taper : `sudo su` et `screen -r` (*<a href="https://doc.ubuntu-fr.org/screen" target="_blank">documentation de screen</a>*) afin de restaurer les diverses sessions de ligne de commande
- Vous pouvez naviguer entre ces sessions via `ctrl + a + n`
- Le logiciel `htop` sera lancé (l'équivalent du gestionnaire de tâche windows)
- Ce serveur contient dans `/home/user/dump_mongo_wasabi` les anciens dump de la base de données
- Le serveur contient un site wordpress, pour le démarrer (si lampp n'est pas actif) vous devez vous rendre dans `/opt/lampp` et lancer la commande `./lampp start`
- Lien utile : http://sharadchhetri.com/2014/03/24/install-xampp-centosrhel-6-5/ 
- Information utiles : par défaut, l'accès à la base de données du blog wasabi n'est pas possible depuis le web. Pour changer ce comportement vous devez vous rendre dans `/opt/lampp/etc/extra/httpd-xampp.conf` et remplacer `Require local` par `Require all granted` dans `<LocationMatch>`
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

- voir : https://musicbrainz.org/doc/MusicBrainz_Server/Setup, lorsque bin/reindex est exécuté, vous pouvez lancer des requêtes via l'API Musicbrainz local

**Comment générer la documentation des APIs**
=======
Nous utilisons http://apidocjs.com/ pour décrire nos APIs et générer leurs documentations. Pour cela: 

- rendez-vous sur le répertoire racine du projet: `wasabi_project`
- lancez la commande: `npm run apidoc` plus d'informations: <a href="http://apidocjs.com/#run" target="_blank">ici</a> 
cela générera la documentation des APIs contenu dans le dossier `wasabi_project/routes` dans le dossier `wasabi_project/apidoc` 

**Comment installer le certificat HTTPS**
=======
Un dossier `wasabi_project/cert_https` doit être créé afin d'y ajouter les certificats fournis par le projet. Ces certificats seront utilisés dans le fichier `bin/www` 
`const options = {
key: fs.readFileSync('./' + config.https.wasabi_key),
cert: fs.readFileSync('./' + config.https.wasabi_crt)
}`

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
 
 3. Lancer la commande `mongodump --out dump_x+1` par exemple: si le dernier dump a pour nom `dump_5` lancez la commande `mongodump --out dump_6` pour créer un nouveau dump. Un dossier `dump_6` sera crée. Vous pouvez aussi lancer la commande `mongodump` pour créer un dump nommé `dump` et ensuite le renommer.
 
 **Restaurer la base de données via un dump :**
 1. Rendez-vous dans le répertoire des dumps `(mongo/backup_mongo/)` en ligne de commande

 2. (Facultatif) Si vous n'avez rien a garder dans la base actuel vous pouvez la drop :  
 *2.1.* Taper en ligne de commande `mongo wasabi` pour avoir accès a la base de données wasabi  
 *2.2.* Taper en ligne de commande `db.dropDatabase()` afin de supprimer la base de données wasabi  
 
 3. Lancer la commande `mongorestore dump_6` pour restaurer la base de données wasabi



#### mongo/request_mongo/  
**Contient des requêtes utiles :**
Si la base de données est recréée de zéro via le web-service `/createdb` elle contiendra:  
Une collection artist contenant des documents représentant un artiste avec ses albums et ses musiques, il faudra donc lancer :  

 1. Les fichiers ci-dessous via la commande mongodb `load("FichierMongoDB.js");` pour cela:  
 	*1.1.* Assurez-vous que mongodb est lancé avec la commande `mongod`  
 	*1.2.* Aller dans votre répertoire `mongo/request_mongo` en ligne commande et tapez la commande `mongo wasabi`, vous devriez être connecté à la base de données  
 	*1.3.* Lancer la commande `load("MonFichier.js");` exemple `load("FindSameDocument.js");`  
 	*1.4.* Vous pouvez aussi lancer ces scripts via une interface graphique tel que mongobooster : *<a href="https://mongobooster.com/" target="_blank">ici</a>*  
 
 2.  Le fichier `FindSameDocument.js` dans mongo afin de trouver les documents en double (ayant le même nom d'artiste car un nom d'artiste est unique en base de données, cf : comme dans lyrics wikia) dans la base de	données

 3.  [doit être exécuté après 2.] Le fichier `ConstructBDAfterCreate.js` dans mongodb afin de créer :  
 	*3.1.* Une collection `artist` contenant uniquement les informations relatives à l'artiste  
	*3.2.* Une collection `album` contenant les informations relatives à l'album  
 	*3.3.* Une collection `song` contenant les informations relatives à la musique  
 	*3.4.* Les index des collections `artist`, `album` et `song`  
 
 4.  [doit être exécuté après 3.] Le fichier `RefArtistInAlbum.js` permettant d'ajouter une référence d'artiste dans un document album(~2 minutes) et de créer l'index sur ce champ
 
 5.  [doit être exécuté après 4.] Le fichier `RefAlbumInSong.js` permettant d'ajouter une référence d'album dans un document song(~20 minutes) et de créer l'index sur ce champ
 
 6.  [doit être exécuté après 5.] Le fichier `WordCount_Artist.js` faisant le word count des lyrics pour chaque artist (~3 heures d’exécution)(afin de voir les termes les plus utilisés par artistes)
 
 7.  [doit être exécuté après 5.] Le fichier `WordCount_Album.js` faisant le word count des lyrics pour chaque album (~10 heures d’exécution) (afin de voir les termes les plus utilisés dans un album)
 
 8.  [doit être exécuté après 5.] Le fichier `WordCount_Song.js` faisant le word count des lyrics pour chaque song (afin de voir les termes les plus utilisés dans une musique)

 9.  [doit être exécuté après 5 et en mode `development`.] Le web service `extractdbpedia/artist` permettant d'extraire le RDF des artistes ayant un lien vers Wikipédia. Ce web service envoie des requêtes SPARQL sur DBpédia afin d'obtenir le RDF de l'artiste. Un champ rdf contenant le RDF de l'artiste est ensuite ajouté en base de données (durée: plusieurs heures)
 
 10.  [doit être exécuté après 5 et en mode `development`.] Le web service `extractdbpedia/album` permettant d'extraire le RDF des musiques ayant un lien vers Wikipédia. Ce web service envoie des requêtes sparql sur DBpédia afin d'obtenir le RDF de la musique. Un champ rdf contenant le RDF de la musique est ensuite ajouté en base de données (durée: plusieurs heures)
 
 11.  [doit être exécuté après 5 et en mode `development`.] Le web service `extractdbpedia/song` permettant d'extraire le RDF des albums ayant un lien vers wikipédia. Ce web service envoie des requêtes sparql sur DBpédia afin d'obtenir le RDF de l'album. Un champ rdf contenant le RDF de l'album est ensuite ajouté en base de données (durée: plusieurs heures)
 
 12.  [doit être exécuté après 9 et en mode `development`.] le web service `extractdbpedia/createfields/artist` transforme les propriétés de notre champ RDF en propriétés dans notre base de données
 
 13.  [doit être exécuté après 10 et en mode `development`.] le web service `extractdbpedia/createfields/album` transforme les propriétés de notre champ RDF en propriétés dans notre base de données
 
 14.  [doit être exécuté après 11 et en mode `development`.] le web service `extractdbpedia/createfields/song` transforme les propriétés de notre champ RDF en propriétés dans notre base de données
 
 15.  [doit être exécuté après 14.] le fichier `CreateIndexAfterDBpediaExtraction` ce fichier permet de créer les index des nouveaux champs insérés dans la base de données
 
 16.  [doit être exécuté après 15.] le fichier `Create_IsClassic_Field` permettant grâce aux subjects des musiques récupérées du rdf de savoir si la musique est un classique
 
 17. [doit être exécuté après 6 et en mode `development`.] le web service `updatedb/multitrackspath` ajoute la propriété multitrackspath dans notre base de données. Ce web service a besoin des musiques multitrack sur la machine ou est lancé cette API
 
 18. [doit être exécuté après 6 et en mode `development` **avec le serveur MusicBrainz local actif**.] Le web service `updatedb/musicbrainz/artist` 
 
 19. [doit être exécuté après 6 et en mode `development` **avec le serveur MusicBrainz local actif**.] Le web service `updatedb/musicbrainz/album` 
 
 20. [doit être exécuté après 6 et en mode `development` **avec le serveur MusicBrainz local actif**.] Le web service `updatedb/musicbrainz/song` 
 
 21. [doit être exécuté après 6 et en mode `development`.] Vous devez avoir le fichier `mongo/deezer/track_dz_wasabi_viaproduct.csv`  contenant le mapping entre les IDs de nos musiques et les IDs des musiques chez Deezer. Le web service `updatedb/deezer/create_mapping` permettra de créer un champ `deezer_mapping`  dans la collection song.  
 
 22. [doit être exécuté après 21 et en mode `development`.] Le web service `updatedb/deezer/song` permet de récupérer des informations sur les musiques ayant un champs deezer_mapping non vide via l'API de Deezer.

#### mongo/sparql/
**Contient les requêtes sparql utilisées par l'application pour l'extraction du RDF pour les :**  

 - Artistes: sparql_artist_data.rq  
 - Albums: sparql_album_data.rq 
 - Musiques: sparql_song_data.rq 
 

## node_modules/
**Contient les modules installés dans node js. exemple :le module require('express') sera dans ce répertoire**  



## public/
#### public/bower-components/  
	Composants téléchargés afin de les utiliser dans l'application

#### public/img/  
	Les images du projet

#### public/my_components/  
	Composant crée pour être utilisé dans l'application  
 
	 

## routes/
	Contient la définition des routes supportées par l'application. C'est ici que se situe l'API REST  
#### routes/conf/  
	conf.js : Fichier de configuration permettant  de ne pas réécrire les données redondantes dans l'application  
#### routes/handler/  
	xxxx.js : Contient la logique applicative à appliquer lors de requêtes sur les routes.   
	




## app.js
	C'est le fichier qui sera appelé par la commande node bin/www. C'est ici qu'on appellera les nouvelles routes de l'application et qu'on configurera certaines parties de l'application  
	



## package.json
	Fichier décrivant l'application, c'est aussi le gestionnaire de dépendance de node js. 
	

