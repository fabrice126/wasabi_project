**API REST - CREATEDB (INACTIF EN PRODUCTION)**
=======






## createdb/
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet de créer entierement la base de données en allant récupérer les discographies des artistes sur lyrics wikia. Une fois que la base de données est créée, voir <a href="https://github.com/fabrice126/wasabi_project/blob/master/ReadMe.md#mongorequest_mongo">comment compléter la base Wasabi avec les requêtes mongo</a> et avec l'API <a href="https://github.com/fabrice126/wasabi_project/blob/master/routes/ReadMe.md#createdbcreatedbelasticsearchartist">createdb/createdbelasticsearchartist</a> et <a href="https://github.com/fabrice126/wasabi_project/blob/master/routes/ReadMe.md#createdbcreatedbelasticsearchsong">createdb/createdbelasticsearchsong</a>
			</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/createdb
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : { status: "OK" }
			</td>
		</tr>
	</tbody>
</table>  






## createdb/add/elasticsearch/artist/:_id
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet d'ajouter un nouveau document artist dans la base de données elasticsearch, le nouveau document sera ainsi requêtable via la barre de recherche
			</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/createdb/add/elasticsearch/artist/57c92566e5c453a411c771f4
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : { status: "OK" }
			</td>
		</tr>
	</tbody>
</table>  






## createdb/add/elasticsearch/song/:_id
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet d'ajouter un nouveau document musique dans la base de données elasticsearch, le nouveau document sera ainsi requêtable via la barre de recherche
			</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/createdb/add/elasticsearch/song/57c92566e5c453a411c771f6
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : { status: "OK" }
			</td>
		</tr>
	</tbody>
</table>  






## createdb/add/:urlArtist
<table>
	<tbody>
		<tr style="color:red;">
			<th>TODO</th><td><b>Cette API utilise d'autres API de WASABI vous devez donc commenter<pre><code>app.use(basicAuth(login.login, login.password));</code></pre> dans <pre><code>app.js</code></pre> avant de lancer une requête pour ne pas être bloqué par l'authentification</b>
			</td>
		</tr>
		<tr>
			<th>Description</th><td>Permet d'ajouter la discographie d'un artiste dans notre base de données en allant l'extraire de lyrics wikia.<br> 
			Cette fonction utilise plusieurs API notamment pour extraire: <br>
				- les données RDF des artistes/albums/musiques ayant un lien vers Wikipédia  <br>
				- L'extraction des données du RDF afin de l'ajouter à la collection song <br>
				- L'ajout des artistes et musiques à elasticsearch afin de mettre à jour le moteur de recherche <br>
				- L'update du champs isClassic (song) à true si les données extraits du champ RDF font de la musique un classique
			</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/createdb/add/Linkin_Park
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> : urlArtist = urlLyricsWikia de l'artiste à ajouter exemple: pour ce lien http://lyrics.wikia.com/wiki/Linkin_Park , : urlArtist = Linkin_Park ce qui nous donnera le lien suivant : http://127.0.0.1/createdb/add/Linkin_Park<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : { status: "OK" }
			</td>
		</tr>
	</tbody>
</table>






## createdb/createdbelasticsearchartist
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Une fois la base de données créees : si l'index elasticsearch existe déjà il est supprimé, on insérera ensuite les champs de la collection 'artist'  pertinent pour une recherche avec autocomplétion </td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/createdb/createdbelasticsearchartist
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>






## createdb/createdbelasticsearchsong
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Une fois la base de données créees : si l'index elasticsearch existe déjà il est supprimé, on insérera ensuite les champs de la collection 'song'  pertinent pour une recherche avec autocomplétion </td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/createdb/createdbelasticsearchsong
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>












**API REST - UPDATEDB (INACTIF EN PRODUCTION)**
=======






## updatedb/artist
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet de mettre à jour les informations existantes dans la collection 'artist' en allant faire l'extraction sur lyrics wikia</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/updatedb/artist
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>






## updatedb/artist/:artistName
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet de mettre à jour les informations d'un artist existantes dans la collection 'artist' en allant faire l'extraction sur lyrics wikia</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/updatedb/artist/Metallica
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: artistName = nom de l'artiste dans la base de données qu'on veut mettre à jour<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>

## updatedb/song
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet de mettre à jour les informations existantes dans la collection 'song' en allant faire l'extraction sur lyrics wikia</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/updatedb/song
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>






## updatedb/song/isclassic/:_id
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet de mettre à jour le document correspondant à :_id en modifiant la valeur de la propriété isClassic si nécessaire</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/updatedb/song/isclassic/57c92593e5c453a411c77257
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: _id = ObjectId MongoDB d'un document song<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>






## updatedb/wordcount/:collection/:_id
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet créer le champ wordCount pour le document correspondant à :_id présent dans la collection :collection</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/updatedb/wordcount/song/57c92593e5c453a411c77257
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
            	: collection = {artist,album,song}<br>
				: _id = ObjectId MongoDB d'un document song<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>












**API REST - EXTRACTDBPEDIA (INACTIF EN PRODUCTION)**
=======






## extractdbpedia/:collection
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Une fois la base de données créees : permet de récupérer sur DBpédia les 'artist','album','song' dont le document contient une URL vers Wikipèdia</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/extractdbpedia/artist
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: collection = {artist,album,song}<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>






## extractdbpedia/add/:collection/:_id
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Une fois la base de données créées : permet de récupérer sur DBpédia les 'artist','album' ou 'song' du document dont l'_id est passé en paramètre </td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/extractdbpedia/add/artist/57c92593e5c453a411c77256
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: collection = {artist,album,song}<br>
				: _id = ObjectId MongoDB d'un document artist, album, song<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>






## extractdbpedia/createfields/artist
<table>
	<tbody>
    	<tr>
			<th>TODO</th><td> <b>Cette API n'est pas implémenté</b> </td>
		</tr>
		<tr>
			<th>Description</th><td>Après avoir effectué extractdbpedia/artist : permet d'inserer dans notre base de données les informations contenues dans le RDF de chaque artiste</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/extractdbpedia/createfields/artist
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>






## extractdbpedia/createfields/album
<table>
	<tbody>
    	<tr>
			<th>TODO</th><td> <b>Cette API n'est pas implémenté</b> </td>
		</tr>
		<tr>
			<th>Description</th><td>Après avoir effectué extractdbpedia/album : permet d'inserer dans notre base de données les informations contenues dans le RDF de chaque album</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/extractdbpedia/createfields/album
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>






## extractdbpedia/createfields/song
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Après avoir effectué extractdbpedia/song : permet d'inserer dans notre base de données les informations contenues dans le RDF de chaque musiques</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/extractdbpedia/createfields/song
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>






## extractdbpedia/createfields/song/:_id
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Après avoir effectué extractdbpedia/song (une fois que le document à un attribut nommé : 'rdf') : permet d’insérer dans notre base de données les informations contenues dans le RDF de la musique ayant son _id passé en paramètre </td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/extractdbpedia/createfields/song/57c92593e5c453a411c77257
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: _id= ObjectId MongoDB d'un document song<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : "OK"
			</td>
		</tr>
	</tbody>
</table>
