

**API REST - SEARCH**
=======






## search/categorie/:nomCategorie/lettre/:lettre/page/:numPage
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
				: nomCategorie = {artists,albums,songs} <br>
				: lettre = {a-z} [aa-zz} <br>
				: numPage= {0 - x} <br>
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
				: collection = {artist,album,song} <br>
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






## search/producer/:producerName
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet d'avoir la liste des musiques d'un producteur</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/producer/Flemming%20Rasmussen
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: producerName = nom d'un producteur en base de données <br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : [{"_id":"5714dedb25ac0d8aee4ad81f","name":"Metallica","albumTitre":"...And Justice For All","titre":"...And Justice For All"},{"_id":"5714dedb25ac0d8aee4ad89d","name":"Metallica","albumTitre":"Singles","titre":"...And Justice For All"}]<br>
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






## search/recordlabel/:recordLabelName
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet d'avoir la liste des musiques d'un label d'enregistrement</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/recordlabel/Elektra%20Records
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: recordLabelName = nom d'un label d'enregistrement en base de données <br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : [{"_id":"5714dee025ac0d8aee4ea2d5","name":"Queen","albumTitre":"A Night At The Opera","titre":"'39"},{"_id":"5714dee025ac0d8aee4ea30a","name":"Queen","albumTitre":"Live Killers","titre":"'39"}]<br>
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






## search/genre/:genreName
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet d'avoir la liste des musiques appartenant à un genre</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/genre/Thrash%20metal
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: genreName = genre de musique en base de données <br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : [{"_id":"5714dec825ac0d8aee3bc6d3","name":"Body Count","albumTitre":"Body Count","titre":"Cop Killer"},{"_id":"5714dece25ac0d8aee403c97","name":"Drowning Pool","albumTitre":"Other Releases","titre":"Creeping Death"}]<br>
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






## search/recorded/:recordedName
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet d'avoir des musiques ayant les mêmes infos d'enregistrements</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/recorded/--01-28
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: recordedName = informations concernant l'enregistrement <br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : [{"_id":"5714dedb25ac0d8aee4ad81f","name":"Metallica","albumTitre":"...And Justice For All","titre":"...And Justice For All"}]<br>
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






## search/award/:awardName'
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet d'avoir des musiques ayant les mêmes infos d'enregistrements</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/award/Gold
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: awardName = {   "Diamond",    "Gold",    "Gold+Gold+Platinum",    "Gold+Silver",    "Million",    "Million2× Platinum",    "Multi Platinum",    "N/A",    "Platinum",    "Platinum+Gold",    "Platinum+Platinum",    "Silver",    "platinum"}<br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : [{"_id":"5714dedb25ac0d8aee4ad81f","name":"Metallica","albumTitre":"...And Justice For All","titre":"...And Justice For All"}]<br>
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






## search/writer/:writerName'
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet d'avoir des musiques écrites par le même compositeur / écrivain </td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/writer/Robin%20Gibb</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: writerName = nom du compositeur / écrivain de la musique <br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : [{"_id":"5714dec625ac0d8aee3acc1a","name":"Bee Gees","albumTitre":"Still Waters","titre":"Alone"},{"_id":"5714dec625ac0d8aee3accbb","name":"Bee Gees","albumTitre":"Their Greatest Hits: The Record","titre":"Alone"}]<br>
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






## search/format/:formatName
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet d'avoir les musiques sortie sur un format identique </td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/format/Gramophone%20record</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: formatName = {
    "12%22",   "12%22 maxi",    "12-inch single",    "2x7%22 single",    "45 RPM Single",    "45 tours",    "576i",    "7%22",    "7%22 maxi",    "7'' & 12'' single",    "78 tours",    "8%22 square vinyl",    "8-track tape",    "Airplay",    "Album",    "Atmosphere of Earth",    "Black-and-white",    "Box set",    "CD",    "CD Single",    "CD Video",    "CD single",    "CD-R",    "Cardsleeve",    "Cassette audio",    "Cassette single",    "Charity record",    "Christian country music",    "Compact Cassette",    "Compact Disc Digital Audio",    "Compact disc",    "Country music",    "DVD",    "DVD single",    "DataPlay",    "Digipak",    "Digital audio",    "Digital data",    "Digital distribution",    "Digital media",    "Digital recording",    "Disque compact",    "Disque microsillon",    "Disque optique",    "Download",    "DualDisc",    "Easy listening",    "Enhanced CD",    "Extended play",    "Extended play (musique)",    "Flexi disc",    "France",    "Germany",    "Gramophone record",    "Gramophone single",    "ITunes Store",    "Japan",    "K7",    "LP record",    "MP3",    "MPEG-4 Part 14",    "MPEG-4 Part 3",    "Maxi (musique)",    "Maxi 45 tours",    "Maxi single",    "Mini CD",    "Mini CD single",    "Music download",    "Music video",    "Picture disc",    "Promo CD single",    "Promotional recording",    "ROM cartridge",    "Radio",    "Radio Disney",    "Radiodiffusion",    "Reel-to-reel audio tape recording",    "Remix",    "Ringle",    "Ringtone",    "Rock music",    "Sampler album",    "Sencillo CD",    "Sencillo en CD",    "Single (music)",    "Single (musique)",    "Soul music",    "Soundtrack",    "Special edition",    "Streaming media",    "Super 45 tours",    "Téléchargement",    "Téléchargement de musique",    "USB",    "USB flash drive",    "United Kingdom",    "United States",    "Unusual types of gramophone records",    "VHS",    "Video clip",    "Vinyl",    "Vinyle 12%22"
} <br>
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : [{"_id":"5714dee725ac0d8aee54060e","name":"The Gaslight Anthem","albumTitre":"Handwritten","titre":"45"},{"_id":"5714decc25ac0d8aee3ed894","name":"David Bowie","albumTitre":"Heroes","titre":"Heroes"}]<br>
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






## search/count/:collection/:lettre
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet de compter le nombre d'artiste/album/musique commençant par la lettre en paramétre </td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/count/Songs/A</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
				: collection = {Artists, Albums, Songs} <br>
                : lettre = {a-z, A-Z, 0-9} <br> 
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : {"count":5257}<br>
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






## search/count/:collection/:fieldName/:fieldValue
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet de compter le nombre d'occurrence d'un attribut ayant une valeur dans une collection </td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/count/song/award/Gold</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
        <tr>
			<th>DATA PARAMS</th>
			<td> 
            	: collection = {artist, album, song}
				: fieldName = champ existant dans la collection : collection <br>
                : fieldValue = valeur de l'attribut : fieldName <br> 
			</td>
		</tr>
		<tr>
			<th>SUCCESS RESPONSE</th>
			<td> 
				Code : 200 <br>
				Content GET : {"count":5659}<br>
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
			<th>URL</th><td>http://127.0.0.1/search/artist/Metallica
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
			<th>METHOD</th><td>GET, PUT</td>
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
			<th>METHOD</th><td>GET, PUT</td>
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






## search/artist_id/:artistId/album_id/:albumId/song_id/:songsId
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Récupère les informations d'une musique</td>
		</tr>
		<tr>
			<th>URL</th><td>http://127.0.0.1/search/artist_id/56d93d84ce06f50c0fed8747/album_id/5714debe25ac0d8aee36b665/song_id/5714dedb25ac0d8aee4ad81f
			</td>
		</tr>
		<tr>
			<th>METHOD</th><td>GET</td>
		</tr>
		<tr>
			<th>DATA PARAMS</th>
			<td> 
				: artistId = id d'un artiste <br>
				: albumId = id d'un album de l'artiste<br>
                : songId = id d'une musique de l'album<br>
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












**API REST - CREATEDB (INACTIF EN PRODUCTION)**
=======






## createdb/
<table>
	<tbody>
		<tr>
			<th>Description</th><td>Permet de créer entierement la base de données en allant récupérer les discographies des artistes sur lyrics wikia. Une fois que la base de données sera créée, voir <a href="https://github.com/fabrice126/wasabi_project/blob/master/ReadMe.md#mongorequest_mongo">comment compléter la base Wasabi avec les requêtes mongo</a> et avec l'API <a href="https://github.com/fabrice126/wasabi_project/blob/master/routes/ReadMe.md#createdbcreatedbelasticsearchartist">createdb/createdbelasticsearchartist</a> et <a href="https://github.com/fabrice126/wasabi_project/blob/master/routes/ReadMe.md#createdbcreatedbelasticsearchsong">createdb/createdbelasticsearchsong</a>
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
		<tr>
			<th>Description</th><td>Permet d'ajouter la discographie d'un artiste dans notre base de données en allant l'extraire de lyrics wikia.<br>
			Lorsqu'un artiste est ajouté, il est recommandé d’exécuter <a href="https://github.com/fabrice126/wasabi_project/blob/master/ReadMe.md#mongorequest_mongo">les requêtes de 6 à 16 </a> (la 1,2,3,4 étant déjà réalisé automatiquement par l'API)<br> 
			Vous devez aussi ajouter ce nouvel artiste à la base de données elasticsearch via : <a href="https://github.com/fabrice126/wasabi_project/blob/master/routes/ReadMe.md#createdbcreatedbelasticsearchartist">createdb/createdbelasticsearchartist</a> et <a href="https://github.com/fabrice126/wasabi_project/blob/master/routes/ReadMe.md#createdbcreatedbelasticsearchsong">createdb/createdbelasticsearchsong</a>
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
			<td> 
				: urlArtist = urlLyricsWikia de l'artiste à ajouter exemple: pour ce lien http://lyrics.wikia.com/wiki/Linkin_Park , : urlArtist = Linkin_Park ce qui nous donnera le lien suivant : http://127.0.0.1/createdb/add/Linkin_Park<br>
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
