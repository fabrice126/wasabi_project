# Introduction

Ce ReadMe a pour but de détailler les propriétés DBpédia que nous avons extrait.
Les requêtes peuvent être exécutées via l'application Corese que vous pourrez télécharger ici : wimmics.inria.fr/corese
## sparql_artist_data.rq

<center>
<table>
    <thead>
        <tr>
            <th>Propriété de l'artiste</th>
            <th align="center">Description</th>
            <th align="center">Type</th>
            <th align="center">Exemple</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>dc:subject</td>
            <td align="center">Correspond aux catégories de wikipédia</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/Category:American_hard_rock_musical_groups</td>
        </tr>
        <tr>
            <td>db-owl:genre</td>
            <td align="center">Le ou les différents genres musicaux du groupe</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/Hard_rock</td>
        </tr>
        <tr>
            <td>db-owl:associatedMusicalArtist</td>
            <td align="center">Le ou les différents groupes associés à l'artiste ou au groupe</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/Megadeth</td>
        </tr>
        <tr>
            <td>db-owl:activeYearsStartYear</td>
            <td align="center">La date de création du groupe</td>
            <td align="center">xsd:date</td>
            <td align="center">1983-01-01</td>
        </tr>
        <tr>
            <td>db-owl:abstract</td>
            <td align="center">Le résumé du groupe ou de l'artiste</td>
            <td align="center">String</td>
            <td align="center">
            Metallica is an American heavy metal band formed in Los Angeles, California. Metallica was formed in 1981...</td>
        </tr> 
        <tr>
            <td>db-owl:formerBandMember</td>
            <td align="center">Les anciens membres du groupe</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/Dave_Mustaine</td>
        </tr>
        <tr>
            <td>db-owl:bandMember</td>
            <td align="center">les membres actuel du groupe</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/Kirk_Hammett</td>
        </tr>
        <tr>
            <td>prop:birthName</td>
            <td align="center">Le nom de naissance de l'artiste</td>
            <td align="center">String</td>
            <td align="center">Jean-Philippe Smet</td>
        </tr>
        <tr>
            <td>prop:instrument</td>
            <td align="center">L'instrument de l'artiste</td>
            <td align="center">URI</td>
            <td align="center">http://fr.dbpedia.org/page/Guitare</td>
        </tr>
        <tr>
            <td>db-owl:birthDate</td>
            <td align="center">La date de naissance de l'artiste</td>
            <td align="center">xsd:date</td>
            <td align="center">1943-06-15</td>
        </tr>
    </tbody>
</table>
  <br>
<table>
    <thead>
        <tr>
            <th>Propriété du membre/ancien membre</th>
            <th align="center">Description</th>
            <th align="center">Type</th>
            <th align="center">Exemple</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>rdfs:label</td>
            <td align="center">Label correspondant au nom de la page</td>
            <td align="center">String</td>
            <td align="center">Kirk Hammett</td>
        </tr>
        <tr>
            <td>prop:birthName</td>
            <td align="center">Nom de naissance</td>
            <td align="center">String</td>
            <td align="center">Kirk Lee Hammett</td>
        </tr>
        <tr>
            <td>prop:instrument</td>
            <td align="center">Instrument(s) joué(s)</td>
            <td align="center">String</td>
            <td align="center">Guitar</td>
        </tr>
        <tr>
            <td>db-owl:abstract</td>
            <td align="center">Le résumé</td>
            <td align="center">String</td>
            <td align="center">Kirk Lee Hammett (born November 18, 1962) is the lead guitarist and songwriter for the heavy metal band Metallica...</td>
        </tr>
        <tr>
            <td>db-owl:activeYearsStartYear</td>
            <td align="center">Date de début d'activité</td>
            <td align="center">xsd:date</td>
            <td align="center">1979-01-01</td>
        </tr>        
        <tr>
            <td>dc:subject</td>
            <td align="center">Correspond aux catégories de wikipédia</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/Category:Exodus_(American_band)_members</td>
        </tr>
        <tr>
            <td>db-owl:birthDate</td>
            <td align="center">La date de naissance de l'artiste</td>
            <td align="center">xsd:date</td>
            <td align="center">1943-06-15</td>
        </tr>
    </tbody>
</table>
</center>

### Description des propriétés DBpédia à récupérer



## sparql_album_data.rq
<center>
<table>
    <thead>
        <tr>
            <th>Propriété d'une musique</th>
            <th align="center">Description</th>
            <th align="center">Type</th>
            <th align="center">Exemple</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>db-owl:writer</td>
            <td align="center">Label correspondant au nom de la page</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/James_Hetfield</td>
        </tr>
        <tr>
            <td>db-owl:abstract</td>
            <td align="center">Le résumé</td>
            <td align="center">String</td>
            <td align="center">"The God That Failed" is a song by American heavy metal band Metallica, from their 1991...</td>
        </tr>
        <tr>
            <td>db-owl:producer</td>
            <td align="center">Le ou les producteurs</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/Bob_Rock</td>
        </tr>
        <tr>
            <td>db-owl:genre</td>
            <td align="center">Le ou les genres</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/Speed_metal</td>
        </tr>
        <tr>
            <td>db-owl:recordLabel</td>
            <td align="center">Le ou les labels d'enregistrement</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/Elektra_Records</td>
        </tr>        
        <tr>
            <td>db-owl:album</td>
            <td align="center">Le ou les albums proposant cette musique</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/...And_Justice_for_All_(album)</td>
        </tr>
        <tr>
            <td>db-owl:runtime</td>
            <td align="center">La date de naissance de l'artiste</td>
            <td align="center">xsd:double</td>
            <td align="center">305.000000</td>
        </tr>
        <tr>
            <td>prop:recorded</td>
            <td align="center">Des informations diverses sur l'enregistrement</td>
            <td align="center">URI ou String</td>
            <td align="center">October 1990 – June 1991 at "One On One" studios, Los Angeles, California</td>
        </tr>
        <tr>
            <td>dc:subject</td>
            <td align="center">Correspond aux catégories de wikipédia</td>
            <td align="center">URI</td>
            <td align="center">http://dbpedia.org/page/Category:Grammy_Award_for_Best_Metal_Performance</td>
        </tr>
        <tr>
            <td>db-owl:format</td>
            <td align="center">Le format</td>
            <td align="center">URI ou String</td>
            <td align="center">http://dbpedia.org/resource/CD_single || Public radio</td>
        </tr>
        <tr>
            <td>db-owl:releaseDate</td>
            <td align="center">La date de sortie</td>
            <td align="center">xsd:date</td>
            <td align="center">1974-10-18</td>
        </tr>
        <tr>
            <td>prop:award</td>
            <td align="center">Les récompenses</td>
            <td align="center">String</td>
            <td align="center">Gold</td>
        </tr>
    </tbody>
</table>
</center>

## sparql_song_data.rq
