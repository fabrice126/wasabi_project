# Introduction

Ce ReadMe a pour but de détailler les propriétés DBpédia que nous avons extraites.
Les requêtes peuvent être exécutées via l'application Corese que vous pourrez télécharger ici : http://wimmics.inria.fr/corese
# Description des propriétés DBpédia récupérées
## infos_artist.js

</style>
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
            <td>db-owl:bandMember</td>
            <td align="center">les membres actuel du groupe</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Kirk_Hammett</td>
        </tr>
            <tr>
            <td>db-owl:abstract</td>
            <td align="center">Le résumé du groupe ou de l'artiste ou des membres du groupe ou des anciens membres du groupe</td>
            <td align="center">String</td>
            <td>
            Metallica is an American heavy metal band formed in Los Angeles, California. Metallica was formed in 1981...</td>
        </tr> 
        <tr>
            <td>db-owl:genre</td>
            <td align="center">Le ou les différents genres musicaux du groupe</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Hard_rock</td>
        </tr>
        <tr>
            <td>db--owl:recordLabel</td>
            <td align="center">Les labels d'enregistrement du groupe</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Virgin_Records</td>
        </tr>
         <tr>
            <td>db-owl:activeYearsStartYear</td>
            <td align="center">La date de création du groupe ou la date d'entrée des membres du groupe ou des anciens membres du groupe</td>
            <td align="center">xsd:date</td>
            <td>1983-01-01</td>
        </tr>
        <tr>
            <td>db-owl:associatedMusicalArtist</td>
            <td align="center">Le ou les différents groupes associés à l'artiste ou au groupe</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Megadeth</td>
        </tr>
        <tr>
            <td>dc:subject</td>
            <td align="center">Correspond aux catégories de wikipédia du groupe/artiste ou des membres du groupe ou des anciens membres du groupe</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Category:American_hard_rock_musical_groups</td>
        </tr>            
        <tr>
            <td>prop:birthName</td>
            <td align="center">Le nom de naissance de l'artiste ou des membres du groupe ou des anciens membres du groupe</td>
            <td align="center">String</td>
            <td>Jean-Philippe Smet</td>
        </tr>
        <tr>
            <td>prop:instrument</td>
            <td align="center">L'instrument de l'artiste ou des membres du groupe ou des anciens membres du groupe</td>
            <td align="center">URI</td>
            <td>http://fr.dbpedia.org/page/Guitare</td>
        </tr>
        <tr>
            <td>db-owl:birthDate</td>
            <td align="center">La date de naissance de l'artiste</td>
            <td align="center">xsd:date</td>
            <td>1943-06-15</td>
        </tr>    
        <tr>
            <td>db-owl:formerBandMember</td>
            <td align="center">Les anciens membres du groupe</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Dave_Mustaine</td>
        </tr> 
        <tr>
            <td>rdfs:label</td>
            <td align="center">Le label de la page DBpédia des membres du groupe ou des anciens membres du groupe </td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Dave_Mustaine</td>
        </tr>
    </tbody>
</table>
<br>





## infos_album.js
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
            <td>db-owl:abstract</td>
            <td align="center">Le résumé de l'album et/ou du producteur</td>
            <td align="center">String</td>
            <td>Kirk Lee Hammett (born November 18, 1962) is the lead guitarist and songwriter for the heavy metal band Metallica...</td>
        </tr>
        <tr>
            <td>db-owl:artist</td>
            <td align="center">Les artistes/groupes ayant participés à l'album</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/The_Beatles</td>
        </tr>        
        <tr>
            <td>db-owl:genre</td>
            <td align="center">Le ou les différents genres musicaux de l'album</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Hard_rock</td>
        </tr>        
        <tr>
            <td>db-owl:producer</td>
            <td align="center">Le ou les différents producteurs de l'album</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/George_Martin</td>
        </tr>        
        <tr>
            <td>db-owl:recordDate</td>
            <td align="center">La date d'enregistrement de l'album</td>
            <td align="center">xsd:date</td>
            <td>1988-05-01</td>
        </tr>        
        <tr>
            <td>db-owl:recordLabel</td>
            <td align="center">Le label d'enregistrement de l'album et/ou du producteur si ce dernier est un artiste avec un label d'enregistrement</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Elektra_Records</td>
        </tr>        
        <tr>
            <td>db-owl:releaseDate</td>
            <td align="center">Date de sortie de l'album</td>
            <td align="center">xsd:date</td>
            <td>1988-06-05</td>
        </tr>
        <tr>
            <td>db-owl:runtime</td>
            <td align="center">Durée(s) de l'album</td>
            <td align="center">xsd:double</td>
            <td>3929.000000</td>
        </tr>
        <tr>
            <td>dc:subject</td>
            <td align="center">Correspond aux catégories de wikipédia de l'album et/ou du producteur</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Category:Exodus_(American_band)_members</td>
        </tr>
                <tr>
            <td>dc:subject</td>
            <td align="center">Correspond aux catégories de wikipédia</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Category:Exodus_(American_band)_members</td>
        </tr>
        <tr>
            <td>prop:award</td>
            <td align="center">La ou les récompenses de l'album</td>
            <td align="center">String</td>
            <td>Gold</td>
        </tr>        
        <tr>
            <td>prop:studio</td>
            <td align="center">La ou les récompenses de l'album</td>
            <td align="center">String</td>
            <td>One on One Recording Studios in Los Angeles</td>
        </tr>
        <tr>
            <td>db-owl:associatedMusicalArtist</td>
            <td align="center">Les artistes associés au producteur</td>
            <td align="center">String</td>
            <td>One on One Recording Studios in Los Angeles</td>
        </tr>        
        <tr>
            <td>db-owl:occupation</td>
            <td align="center">Les activités du producteur</td>
            <td align="center">String</td>
            <td>One on One Recording Studios in Los Angeles</td>
        </tr>
        
    </tbody>
</table>
</center>





## infos_song.js

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
            <td>http://dbpedia.org/page/James_Hetfield</td>
        </tr>
        <tr>
            <td>db-owl:abstract</td>
            <td align="center">Le résumé</td>
            <td align="center">String</td>
            <td>"The God That Failed" is a song by American heavy metal band Metallica, from their 1991...</td>
        </tr>
        <tr>
            <td>db-owl:producer</td>
            <td align="center">Le ou les producteurs</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Bob_Rock</td>
        </tr>
        <tr>
            <td>db-owl:genre</td>
            <td align="center">Le ou les genres</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Speed_metal</td>
        </tr>
        <tr>
            <td>db-owl:recordLabel</td>
            <td align="center">Le ou les labels d'enregistrement</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Elektra_Records</td>
        </tr>        
        <tr>
            <td>db-owl:album</td>
            <td align="center">Le ou les albums proposant cette musique</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/...And_Justice_for_All_(album)</td>
        </tr>
        <tr>
            <td>db-owl:runtime</td>
            <td align="center">La date de naissance de l'artiste</td>
            <td align="center">xsd:double</td>
            <td>305.000000</td>
        </tr>
        <tr>
            <td>prop:recorded</td>
            <td align="center">Des informations diverses sur l'enregistrement</td>
            <td align="center">URI ou String</td>
            <td>October 1990 – June 1991 at "One On One" studios, Los Angeles, California</td>
        </tr>
        <tr>
            <td>dc:subject</td>
            <td align="center">Correspond aux catégories de wikipédia</td>
            <td align="center">URI</td>
            <td>http://dbpedia.org/page/Category:Grammy_Award_for_Best_Metal_Performance</td>
        </tr>
        <tr>
            <td>db-owl:format</td>
            <td align="center">Le format</td>
            <td align="center">URI ou String</td>
            <td>http://dbpedia.org/resource/CD_single || Public radio</td>
        </tr>
        <tr>
            <td>db-owl:releaseDate</td>
            <td align="center">La date de sortie</td>
            <td>xsd:date</td>
            <td>1974-10-18</td>
        </tr>
        <tr>
            <td>prop:award</td>
            <td align="center">Les récompenses</td>
            <td align="center">String</td>
            <td>Gold</td>
        </tr>
    </tbody>
</table>
</center>


