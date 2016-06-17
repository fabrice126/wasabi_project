

**API REST**
=======


## /search/categorie/:nomCategorie/lettre/:lettre/page/:numPage

<table>
	<tbody>
		<tr>
			<th>Description</th><td>Récupère le nom des catégories par lettre et numéro de page</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/categorie/artists/lettre/a/page/2
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>DATA PARAMS</th>
			<td> 
				: nomCategorie = [artists,albums,songs] <br>
				: lettre = [a-z] [aa-zz] <br>
				: numPage= [0 - x] <br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET:  {"artists":[{"_id":"56d7e91b6b60c09814f93e4a","name":"A"},{"_id":"56d7e91c6b60c09814f93e4c","name":"A (エース) (ACE)"}], "nbcount":"count","limit":200}<br>
			</td>
		</tr>
		<tr>
			<th>ERROR RESPONSE</th>
			<td> 
				Code : 404<br>
				Content GET: [{"error":"Page not found"}]<br>
			</td>
		</tr>
	</tbody>
</table>

## search/category/:collection/:categoryName

<table>
	<tbody>
		<tr>
			<th>Description</th><td>Récupère les objets correspondant à la catégorie choisie</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/category/song/1988%20albums
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>DATA PARAMS</th>
			<td> 
				: collection = [artist,album,song] <br>
				: categoryName = {Categories présentes sur Wikipèdia}<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET:  [{"_id":"5714dedb25ac0d8aee4ad81f","name":"Metallica","albumTitre":"...And Justice For All","titre":"...And Justice For All"},{"_id":"5714dedb25ac0d8aee4ad89d","name":"Metallica","albumTitre":"Singles","titre":"...And Justice For All"},{"_id":"5714dedb25ac0d8aee4ad820","name":"Metallica","albumTitre":"...And Justice For All","titre":"Eye Of The Beholder"},{"_id":"5714dedb25ac0d8aee4ad89b","name":"Metallica","albumTitre":"Singles","titre":"Eye Of The Beholder"}]<br>
			</td>
		</tr>
		<tr>
			<th>ERROR RESPONSE</th>
			<td> 
				Code : 404<br>
				Content GET: [{"error":"Page not found"}]<br>
			</td>
		</tr>
	</tbody>
</table>

## search/dbinfo

<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet d'avoir des informations sur la quantitée de données dans la base</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/dbinfo
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : {"nbArtist":77490,"nbAlbum":208717,"nbSong":2098719}<br>
			</td>
		</tr>
		<tr>
			<th>ERROR RESPONSE</th>
			<td> 
				Code : 404<br>
				Content GET: [{"error":"Page not found"}]<br>
			</td>
		</tr>
	</tbody>
</table>


## search/artist/:artistName

<table>
	<tbody>
		<tr>
			<th>Description</th><td>Récupère la discographie d'un artiste</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search//artist/Metallica
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>DATA PARAMS</th>
			<td> 
				: artistName = Nom d'un artiste <br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET :{"_id":"56d93d84ce06f50c0fed8747","name":"Metallica", "urlWikipedia":"http://en.wikipedia.org/wiki/Metallica", "urlOfficialWebsite":"http://www.metallica.com/", "urlFacebook":"http://www.facebook.com/metallica", "urlMySpace":"https://myspace.com/Metallica", "urlTwitter":"http://twitter.com/metallica", "locationInfo":["United States","California","Los Angeles"], "activeYears":"","genres":["Heavy Metal","Thrash Metal"],"labels":["Elektra","Megaforce Records","Mercury Records","Warner Bros. Records"], "members":[{"name":" James Hetfield","instruments":["lead vocals"," rhythm guitar "],"activeYears":["1981-present"]}, {"name":" Kirk Hammett","instruments":["lead guitar "],"activeYears":["1983-present"]},{"name":" Robert Trujillo","instruments":["bass "], "activeYears":["2003-present"]},{"name":" Lars Ulrich","instruments":["drums"," percussion "],"activeYears":["1981-present"]}],"formerMembers":[{"name":" Dave Mustaine","instruments":["lead guitar"," backing vocals "],"activeYears":["1981-1983"]},{"name":" Ron McGovney","instruments":["bass "],"activeYears":["1981-1982"]},{"name":" Cliff Burton (Deceased)","instruments":["bass"," backing vocals "], "activeYears":["1982-1986"]},{"name":" Jason Newsted","instruments":["bass"," backing vocals "],"activeYears":["1986-2001"]}], "albums":[{"_id":"5714debe25ac0d8aee36b66e", "name":"Metallica","titre":"Lulu", "dateSortie":"2011","genre":"", "length":"","id_artist":"56d93d84ce06f50c0fed8747","songs":[{"_id":"5714dedb25ac0d8aee4ad88d", "position":0,"titre":"Lou Reed & Metallica:Brandenburg Gate"}, {"_id":"5714dedb25ac0d8aee4ad88e","position":1,"titre":"Lou Reed & Metallica:The View"}]}]}<br>
			</td>
		</tr>
		<tr>
			<th>ERROR RESPONSE</th>
			<td> 
				Code : 404<br>
				Content GET: [{"error":"Page not found"}]<br>
			</td>
		</tr>
	</tbody>
</table>

## search/artist/:artistName/album/:albumName

<table>
	<tbody>
		<tr>
			<th>Description</th><td>Récupère les musiques d'un album</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/artist/Metallica/album/...And%20Justice%20For%20All
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>DATA PARAMS</th>
			<td> 
				: artistName = Nom d'un artiste <br>
				: albumName = Nom d'un album de l'artiste<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : {"_id":"56d93d84ce06f50c0fed8747","name":"Metallica", "urlWikipedia":"http://en.wikipedia.org/wiki/Metallica", "urlOfficialWebsite":"http://www.metallica.com/", "urlFacebook":"http://www.facebook.com/metallica", "urlMySpace":"https://myspace.com/Metallica" ,"urlTwitter":"http://twitter.com/metallica", "locationInfo":["United States","California","Los Angeles"],"urlWikia":"Metallica","activeYears":"", "genres":["Heavy Metal","Thrash Metal"], "labels":["Elektra","Megaforce Records", "Mercury Records","Warner Bros. Records"], "members":[{"name":" James Hetfield","instruments":["lead vocals"," rhythm guitar "],"activeYears":["1981-present\n"]},{"name":" Kirk Hammett","instruments":["lead guitar "],"activeYears":["1983-present\n"]},{"name":" Robert Trujillo","instruments":["bass "],"activeYears":["2003-present\n"]},{"name":" Lars Ulrich","instruments":["drums"," percussion "],"activeYears":["1981-present\n"]}],"formerMembers":[{"name":" Dave Mustaine","instruments":["lead guitar"," backing vocals "],"activeYears":["1981-1983\n"]},{"name":" Ron McGovney","instruments":["bass "],"activeYears":["1981-1982\n"]},{"name":" Cliff Burton (Deceased)","instruments":["bass"," backing vocals "],"activeYears":["1982-1986\n"]},{"name":" Jason Newsted","instruments":["bass"," backing vocals "],"activeYears":["1986-2001\n"]}] ,"songs":[{"_id":"5714dedb25ac0d8aee4ad81e","position":0,"titre":"Blackened"},{"_id":"5714dedb25ac0d8aee4ad81f","position":1,"titre":"...And Justice For All"},{"_id":"5714dedb25ac0d8aee4ad820","position":2,"titre":"Eye Of The Beholder"},{"_id":"5714dedb25ac0d8aee4ad821","position":3,"titre":"One"},{"_id":"5714dedb25ac0d8aee4ad822","position":4,"titre":"The Shortest Straw"},{"_id":"5714dedb25ac0d8aee4ad823","position":5,"titre":"Harvester Of Sorrow"},{"_id":"5714dedb25ac0d8aee4ad824","position":6,"titre":"The Frayed Ends Of Sanity"},{"_id":"5714dedb25ac0d8aee4ad825","position":7,"titre":"To Live Is To Die"},{"_id":"5714dedb25ac0d8aee4ad826","position":8,"titre":"Dyers Eve"}]}}<br>
			</td>
		</tr>
		<tr>
			<th>ERROR RESPONSE</th>
			<td> 
				Code : 404<br>
				Content GET: [{"error":"Page not found"}]<br>
			</td>
		</tr>
	</tbody>
</table>

## search/artist/:artistName/album/:albumName/song/:songsName

<table>
	<tbody>
		<tr>
			<th>Description</th><td>Récupère les informations d'une musique</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/artist/Metallica/album/...And%20Justice%20For%20All/song/...And%20Justice%20For%20All
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>DATA PARAMS</th>
			<td> 
				: artistName = Nom d'un artiste <br>
				: albumName = Nom d'un album de l'artiste<br>
                : songsName = Nom d'une musique de l'album<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : {
                "_id": "56d93d84ce06f50c0fed8747",
                "name": "Metallica",
                "albums": {
                "_id": "5714debe25ac0d8aee36b665",
                "titre": "...And Justice For All",
                "songs": {
                "_id": "5714dedb25ac0d8aee4ad81f",
                "name": "Metallica",
                "position": 1,
                "albumTitre": "...And Justice For All",
                "lengthAlbum": "65:33",
                "dateSortieAlbum": "1988",
                "titre": "...And Justice For All",
                "lyrics": "Halls of justice painted green, money talking...",
                "urlWikipedia ": "http : //en.wikipedia.org/wiki/...And_Justice_for_All_(song)",
                "id_album": "5714debe25ac0d8aee36b665"
                }
                }
                }}}}<br>
			</td>
		</tr>
		<tr>
			<th>ERROR RESPONSE</th>
			<td> 
				Code : 404<br>
				Content GET: [{"error":"Page not found"}]<br>
			</td>
		</tr>
	</tbody>
</table>


## search/fulltext/:searchText

<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet de rechercher un artiste ou une musique</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/fulltext/Metallica
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>DATA PARAMS</th>
			<td> 
				: searchText = artiste ou musique à rechercher <br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : [{"name":"Metallica"},{"name":"Metallica","albumTitre":"Metallica","titre":"Enter Sandman","id":"5714dedb25ac0d8aee4ad827"},{"name":"Metallica","albumTitre":"Metallica","titre":"The Unforgiven","id":"5714dedb25ac0d8aee4ad82a"},{"name":"Metallica","albumTitre":"Metallica","titre":"Of Wolf And Man","id":"5714dedb25ac0d8aee4ad82f"},{"name":"Metallica","albumTitre":"Metallica","titre":"The God That Failed","id":"5714dedb25ac0d8aee4ad830"},{"name":"Metallica","albumTitre":"Metallica","titre":"Holier Than Thou","id":"5714dedb25ac0d8aee4ad829"},{"name":"Metallica","albumTitre":"Metallica","titre":"Wherever I May Roam","id":"5714dedb25ac0d8aee4ad82b"},{"name":"Metallica","albumTitre":"Metallica","titre":"Through The Never","id":"5714dedb25ac0d8aee4ad82d"},{"name":"Metallica","albumTitre":"Metallica","titre":"My Friend Of Misery","id":"5714dedb25ac0d8aee4ad831"},{"name":"Metallica","albumTitre":"Metallica","titre":"Sad But True","id":"5714dedb25ac0d8aee4ad828"},{"name":"Metallica","albumTitre":"Metallica","titre":"Don't Tread On Me","id":"5714dedb25ac0d8aee4ad82c"},{"name":"Metallica","albumTitre":"Metallica","titre":"Nothing Else Matters","id":"5714dedb25ac0d8aee4ad82e"}]<br>
			</td>
		</tr>
		<tr>
			<th>ERROR RESPONSE</th>
			<td> 
				Code : 404<br>
				Content GET: [{"error":"Page not found"}]<br>
			</td>
		</tr>
	</tbody>
</table>

## search/more/:searchText 

<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet de rechercher un artiste ou une musique en affichant tous les résultats</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/more/Metallica
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>DATA PARAMS</th>
			<td> 
				: searchText = artiste ou musique à rechercher <br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : [{"name":"Metallica"},{"name":"Metallica","albumTitre":"Metallica","titre":"Enter Sandman","id":"5714dedb25ac0d8aee4ad827"},{"name":"Metallica","albumTitre":"Metallica","titre":"The Unforgiven","id":"5714dedb25ac0d8aee4ad82a"},{"name":"Metallica","albumTitre":"Metallica","titre":"Of Wolf And Man","id":"5714dedb25ac0d8aee4ad82f"}, ... , ... , ... , ... , ... , ...]<br>
			</td>
		</tr>
		<tr>
			<th>ERROR RESPONSE</th>
			<td> 
				Code : 404<br>
				Content GET: [{"error":"Page not found"}]<br>
			</td>
		</tr>
	</tbody>
</table>





	
