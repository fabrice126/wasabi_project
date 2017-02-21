define({ "api": [
  {
    "type": "get",
    "url": "apidoc/#api-Api_Fields-ALL_FIELDS_ALBUM",
    "title": "All album's fields",
    "version": "1.0.0",
    "name": "ALL_FIELDS_ALBUM",
    "group": "Api_Fields",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Album id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titre",
            "description": "<p>Album titre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dateSortie",
            "description": "<p>Album dateSortie</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "genre",
            "description": "<p>Album genre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "length",
            "description": "<p>Album length</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id_artist",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlAlbum",
            "description": "<p>url to lyricsWikia</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlWikipedia",
            "description": "<p>url to wikipedia</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "wordCount",
            "description": "<p>count all identical words for all musics of this album</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "wordCount._id",
            "description": "<p>A word</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "wordCount.value",
            "description": "<p>Number of this word</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rdf",
            "description": "<p>Album rdf</p>"
          }
        ]
      }
    },
    "filename": "routes/api/doc/api_doc.js",
    "groupTitle": "Api_Fields"
  },
  {
    "type": "get",
    "url": "apidoc/#api-Api_Fields-ALL_FIELDS_ARTIST",
    "title": "All artist's fields",
    "version": "1.0.0",
    "name": "ALL_FIELDS_ARTIST",
    "group": "Api_Fields",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlWikia",
            "description": "<p>url to lyricsWikia</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlWikipedia",
            "description": "<p>Artist urlWikipedia</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlOfficialWebsite",
            "description": "<p>Artist urlOfficialWebsite</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlFacebook",
            "description": "<p>Artist urlFacebook</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlMySpace",
            "description": "<p>Artist urlMySpace</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlTwitter",
            "description": "<p>Artist urlTwitter</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "locationInfo",
            "description": "<p>Artist locationInfo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "activeYears",
            "description": "<p>Artist activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "genres",
            "description": "<p>Artist genres</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "labels",
            "description": "<p>Artist labels</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "members",
            "description": "<p>Members object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "members.name",
            "description": "<p>Members name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "members.instruments",
            "description": "<p>Members instruments</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "members.activeYears",
            "description": "<p>Members activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "formerMembers",
            "description": "<p>FormerMembers object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "formerMembers.name",
            "description": "<p>FormerMembers name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "formerMembers.instruments",
            "description": "<p>FormerMembers instruments</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "formerMembers.activeYears",
            "description": "<p>FormerMembers activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "wordCount",
            "description": "<p>count all identical words for all musics of this artist</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "wordCount._id",
            "description": "<p>A word</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "wordCount.value",
            "description": "<p>Number of this word</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rdf",
            "description": "<p>Artist rdf</p>"
          }
        ]
      }
    },
    "filename": "routes/api/doc/api_doc.js",
    "groupTitle": "Api_Fields"
  },
  {
    "type": "get",
    "url": "apidoc/#api-Api_Fields-ALL_FIELDS_SONG",
    "title": "All song's fields",
    "version": "1.0.0",
    "name": "ALL_FIELDS_SONG",
    "group": "Api_Fields",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Song id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "position",
            "description": "<p>Track number</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albumTitre",
            "description": "<p>Album title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lengthAlbum",
            "description": "<p>Album length</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "dateSortieAlbum",
            "description": "<p>Album release</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titre",
            "description": "<p>Song titre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlSong",
            "description": "<p>Url to lyricsWikia</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lyrics",
            "description": "<p>Song lyrics</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlWikipedia",
            "description": "<p>Song urlWikipedia</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id_album",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rdf",
            "description": "<p>Song rdf</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "format",
            "description": "<p>Song format</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "genre",
            "description": "<p>Song genre</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "producer",
            "description": "<p>Song producer</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "recordLabel",
            "description": "<p>Song recordLabel</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "writer",
            "description": "<p>Song writer</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "recorded",
            "description": "<p>Song recorded</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "abstract",
            "description": "<p>Song abstract</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "releaseDate",
            "description": "<p>Song release date</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "runtime",
            "description": "<p>Song runtime</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "award",
            "description": "<p>Song award</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "subject",
            "description": "<p>Song subject</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "wordCount",
            "description": "<p>Count all identical words for this music</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "wordCount._id",
            "description": "<p>A word</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "wordCount.value",
            "description": "<p>Number of this word</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlYoutube",
            "description": "<p>Song urlYoutube</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isClassic",
            "description": "<p>Song isClassic</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "multitrack_path",
            "description": "<p>Song multitrack_path</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "multitrack_file",
            "description": "<p>Song multitrack_file</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlITunes",
            "description": "<p>Song urlITunes</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlAmazon",
            "description": "<p>Song urlAmazon</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlGoEar",
            "description": "<p>Song urlGoEar</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlSpotify",
            "description": "<p>Song urlSpotify</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlAllmusic",
            "description": "<p>Song urlAllmusic</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlMusicBrainz",
            "description": "<p>Song urlMusicBrainz</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlHypeMachine",
            "description": "<p>Song urlHypeMachine</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlLastFm",
            "description": "<p>Song urlLastFm</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlPandora",
            "description": "<p>Song urlPandora</p>"
          }
        ]
      }
    },
    "filename": "routes/api/doc/api_doc.js",
    "groupTitle": "Api_Fields"
  },
  {
    "type": "get",
    "url": "api/v1/album/id/:id",
    "title": "Get an album document by id",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/api/v1/album/id/5714debe25ac0d8aee36b664",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetAlbumById",
    "group": "Api_v1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>album's id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response for an artist:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"5714debe25ac0d8aee36b664\",\n    \"name\": \"Metallica\",\n    \"titre\": \"Master Of Puppets\",\n    \"dateSortie\": \"1986\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Master_of_Puppets\",\n    \"genre\": \"Thrash Metal\",\n    \"length\": \"54:46\",\n    \"urlAlbum\": \"http://lyrics.wikia.com/Metallica:Master_Of_Puppets_%281986%29\",\n    \"id_artist\": \"56d93d84ce06f50c0fed8747\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>The id is not valid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response invalid ObjectId:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"You must type a valid ObjectId\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response internal error:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"An internal error occurred\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/api_v1.js",
    "groupTitle": "Api_v1"
  },
  {
    "type": "get",
    "url": "api/v1/artist/name/:artistName",
    "title": "Get an artist document by artistName",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/api/v1/artist/name/Metallica",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetArtistByArtistName",
    "group": "Api_v1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "artistName",
            "description": "<p>artist's name</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response for an artist:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"56d93d84ce06f50c0fed8747\",\n    \"name\": \"Metallica\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Metallica\",\n    \"urlOfficialWebsite\": \"http://www.metallica.com/\",\n    \"urlFacebook\": \"http://www.facebook.com/metallica\",\n    \"urlMySpace\": \"https://myspace.com/Metallica\",\n    \"urlTwitter\": \"http://twitter.com/metallica\",\n    \"locationInfo\": [\"United States\", \"California\", \"Los Angeles\"],\n    \"urlWikia\": \"Metallica\",\n    \"activeYears\": \"\",\n    \"genres\": [\"Heavy Metal\", \"Thrash Metal\"],\n    \"labels\": [\"Elektra\", \"Megaforce Records\", \"Mercury Records\", \"Warner Bros. Records\"],\n    \"members\": [{\n        \"name\": \" James Hetfield\",\n        \"instruments\": [\"lead vocals\", \" rhythm guitar \"],\n        \"activeYears\": [\"1981-present\\n\"]\n        }, {\n        \"name\": \" Kirk Hammett\",\n        \"instruments\": [\"lead guitar \"],\n        \"activeYears\": [\"1983-present\\n\"]\n    }],\n    \"formerMembers\": [{\n        \"name\": \" Dave Mustaine\",\n        \"instruments\": [\"lead guitar\", \" backing vocals \"],\n        \"activeYears\": [\"1981-1983\\n\"]\n        }, {\n        \"name\": \" Ron McGovney\",\n        \"instruments\": [\"bass \"],\n        \"activeYears\": [\"1981-1982\\n\"]\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>the database does not respond.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response internal error:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"An internal error occurred\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/api_v1.js",
    "groupTitle": "Api_v1"
  },
  {
    "type": "get",
    "url": "api/v1/artist/id/:id",
    "title": "Get an artist document by id",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/api/v1/artist/id/56d93d84ce06f50c0fed8747",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetArtistById",
    "group": "Api_v1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>artist's id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response for an artist:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"56d93d84ce06f50c0fed8747\",\n    \"name\": \"Metallica\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Metallica\",\n    \"urlOfficialWebsite\": \"http://www.metallica.com/\",\n    \"urlFacebook\": \"http://www.facebook.com/metallica\",\n    \"urlMySpace\": \"https://myspace.com/Metallica\",\n    \"urlTwitter\": \"http://twitter.com/metallica\",\n    \"locationInfo\": [\"United States\", \"California\", \"Los Angeles\"],\n    \"urlWikia\": \"Metallica\",\n    \"activeYears\": \"\",\n    \"genres\": [\"Heavy Metal\", \"Thrash Metal\"],\n    \"labels\": [\"Elektra\", \"Megaforce Records\", \"Mercury Records\", \"Warner Bros. Records\"],\n    \"members\": [{\n        \"name\": \" James Hetfield\",\n        \"instruments\": [\"lead vocals\", \" rhythm guitar \"],\n        \"activeYears\": [\"1981-present\\n\"]\n        }, {\n        \"name\": \" Kirk Hammett\",\n        \"instruments\": [\"lead guitar \"],\n        \"activeYears\": [\"1983-present\\n\"]\n    }],\n    \"formerMembers\": [{\n        \"name\": \" Dave Mustaine\",\n        \"instruments\": [\"lead guitar\", \" backing vocals \"],\n        \"activeYears\": [\"1981-1983\\n\"]\n        }, {\n        \"name\": \" Ron McGovney\",\n        \"instruments\": [\"bass \"],\n        \"activeYears\": [\"1981-1982\\n\"]\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>The id is not valid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response invalid ObjectId:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"You must type a valid ObjectId\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response internal error:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"An internal error occurred\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/api_v1.js",
    "groupTitle": "Api_v1"
  },
  {
    "type": "get",
    "url": "api/v1/artist_all/id/:id",
    "title": "Get songs of each album of the artist having this id",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/api/v1/artist_all/id/56d93d84ce06f50c0fed8747",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetArtistByIdWithAlbumsAndSongs",
    "group": "Api_v1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>artist's id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response for an artist:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"56d93d84ce06f50c0fed8747\",\n    \"name\": \"Metallica\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Metallica\",\n    \"urlOfficialWebsite\": \"http://www.metallica.com/\",\n    \"urlFacebook\": \"http://www.facebook.com/metallica\",\n    \"urlMySpace\": \"https://myspace.com/Metallica\",\n    \"urlTwitter\": \"http://twitter.com/metallica\",\n    \"locationInfo\": [\"United States\", \"California\", \"Los Angeles\"],\n    \"urlWikia\": \"Metallica\",\n    \"activeYears\": \"\",\n    \"genres\": [\"Heavy Metal\", \"Thrash Metal\"],\n    \"labels\": [\"Elektra\", \"Megaforce Records\", \"Mercury Records\", \"Warner Bros. Records\"],\n    \"members\": [{\n        \"name\": \" James Hetfield\",\n        \"instruments\": [\"lead vocals\", \" rhythm guitar \"],\n        \"activeYears\": [\"1981-present\\n\"]\n        }, {\n        \"name\": \" Kirk Hammett\",\n        \"instruments\": [\"lead guitar \"],\n        \"activeYears\": [\"1983-present\\n\"]\n    }],\n    \"formerMembers\": [{\n        \"name\": \" Dave Mustaine\",\n        \"instruments\": [\"lead guitar\", \" backing vocals \"],\n        \"activeYears\": [\"1981-1983\\n\"]\n        }, {\n        \"name\": \" Ron McGovney\",\n        \"instruments\": [\"bass \"],\n        \"activeYears\": [\"1981-1982\\n\"]\n    }],\n    \"albums\": [{\n        \"_id\": \"5714debe25ac0d8aee36b662\",\n        \"name\": \"Metallica\",\n        \"titre\": \"Kill 'Em All\",\n        \"dateSortie\": \"1983\",\n        \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Kill_%27Em_All\",\n        \"genre\": \"Thrash Metal\",\n        \"length\": \"51:14\",\n        \"urlAlbum\": \"http://lyrics.wikia.com/Metallica:Kill_%27Em_All_%281983%29\",\n        \"id_artist\": \"56d93d84ce06f50c0fed8747\",\n        \"songs\": [{\n            \"_id\": \"5714dedb25ac0d8aee4ad800\",\n            \"position\": 0,\n            \"titre\": \"Hit The Lights\",\n            \"urlSong\": \"http://lyrics.wikia.com/Metallica:Hit_The_Lights\",\n            \"lyrics\": \"No life till leather, we&apos;re gonna kick some ass tonight We got the metal madness...\",\n            \"urlWikipedia\": \"\",\n            \"id_album\": \"5714debe25ac0d8aee36b662\",\n            \"urlYoutube\": \"\",\n            \"isClassic\": false,\n            \"multitrack_path\": \"M Multitracks/Metallica - Hit The Lights\",\n            \"urlITunes\": \"https://itunes.apple.com/us/album/id167352861?i=167352894\",\n            \"urlAmazon\": \"http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6X8%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8\",\n            \"urlGoEar\": \"http://goear.com/listen.php?v=41b192c\",\n            \"urlSpotify\": \"https://play.spotify.com/track/4Pn6l1ZzsYFrx64h1gWTyy\",\n            \"urlAllmusic\": \"http://www.allmusic.com/song/mt0034723664\",\n            \"urlMusicBrainz\": \"http://musicbrainz.org/recording/8467f4e7-ef5b-458c-bbc5-6727d9f2252d\"\n        }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad801\",\n            \"position\": 1,\n            \"titre\": \"The Four Horsemen\",\n            \"urlSong\": \"http://lyrics.wikia.com/Metallica:The_Four_Horsemen\",\n            \"lyrics\": \"By the last breath, the fourth winds blow Better raise your ears...\",\n            \"urlWikipedia\": \"http://en.wikipedia.org/wiki/The_Mechanix\",\n            \"id_album\": \"5714debe25ac0d8aee36b662\",\n            \"format\": [],\n            \"genre\": [\"Thrash metal\", \"Speed metal\"],\n            \"producer\": [\"Dave Mustaine\"],\n            \"recordLabel\": [\"Combat Records\"],\n            \"writer\": [],\n            \"recorded\": [\"December 1984 – January 1985 at Indigo Ranch Studios in Malibu, California\"],\n            \"abstract\": \"Killing Is My Business... and Business Is Good! is the debut studio album by American thrash metal band Megadeth. It was released on June 12, 1985...\",\n            \"releaseDate\": [\"1985-06-12\"],\n            \"runtime\": [\"1870.0\"],\n            \"award\": [],\n            \"subject\": [\"1985 debut albums\", \"Megadeth albums\", \"Combat Records albums\"],\n            \"urlYoutube\": \"\",\n            \"isClassic\": false,\n            \"urlITunes\": \"https://itunes.apple.com/us/album/id167352861?i=167352995\",\n            \"urlAmazon\": \"http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6ZG%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8\",\n            \"urlGoEar\": \"http://goear.com/listen.php?v=2bc44cf\",\n            \"urlAllmusic\": \"http://www.allmusic.com/song/mt0010502640\",\n            \"urlMusicBrainz\": \"http://musicbrainz.org/recording/20826102-147b-4376-a1f3-72c25bfd43cd\"\n        }]\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>The id is not valid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response invalid ObjectId:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"You must type a valid ObjectId\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response internal error:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"An internal error occurred\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/api_v1.js",
    "groupTitle": "Api_v1"
  },
  {
    "type": "get",
    "url": "api/v1/artist/name/:memberName",
    "title": "Get an artist document by memberName",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/api/v1/member/Bruce%20Dickinson",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetArtistByMember",
    "group": "Api_v1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "memberName",
            "description": "<p>artist's name</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response for an artist:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"56d8432453a7ddfc01f96c1f\",\n    \"name\": \"Iron Maiden\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Iron_Maiden\",\n    \"urlOfficialWebsite\": \"http://www.ironmaiden.com/\",\n    \"urlFacebook\": \"https://www.facebook.com/ironmaiden\",\n    \"urlMySpace\": \"https://myspace.com/ironmaiden\",\n    \"urlTwitter\": \"https://twitter.com/ironmaiden\",\n    \"locationInfo\": [\"England\", \"London\"],\n    \"urlWikia\": \"Iron_Maiden\",\n    \"activeYears\": \"\",\n    \"genres\": [\"Heavy Metal\"],\n    \"labels\": [\"Atlantic Records\", \"EMI\", \"Elektra\", \"Epic Records\"],\n    \"members\": [{\n        \"name\": \"Bruce Dickinson\",\n        \"instruments\": [\"lead vocals \"],\n        \"activeYears\": [\"1982-1993\", \" 1999-present\\n\"]\n    }],\n    \"formerMembers\": [{\n        \"name\": \"Paul Day\",\n        \"instruments\": [\"lead vocals \"],\n        \"activeYears\": [\"1975-1976\\n\"]\n    }, {\n        \"name\": \"Denis Wilcock\",\n        \"instruments\": [\"lead vocals \"],\n        \"activeYears\": [\"1976-1977\\n\"]\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>the database does not respond.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response internal error:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"An internal error occurred\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/api_v1.js",
    "groupTitle": "Api_v1"
  },
  {
    "type": "get",
    "url": "api/v1/artist_all/name/:name",
    "title": "Get songs of each album of the artist having this name",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/api/v1/artist_all/name/Metallica",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetArtistByNameWithAlbumsAndSongs",
    "group": "Api_v1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>artist's name</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response for an artist:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"56d93d84ce06f50c0fed8747\",\n    \"name\": \"Metallica\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Metallica\",\n    \"urlOfficialWebsite\": \"http://www.metallica.com/\",\n    \"urlFacebook\": \"http://www.facebook.com/metallica\",\n    \"urlMySpace\": \"https://myspace.com/Metallica\",\n    \"urlTwitter\": \"http://twitter.com/metallica\",\n    \"locationInfo\": [\"United States\", \"California\", \"Los Angeles\"],\n    \"urlWikia\": \"Metallica\",\n    \"activeYears\": \"\",\n    \"genres\": [\"Heavy Metal\", \"Thrash Metal\"],\n    \"labels\": [\"Elektra\", \"Megaforce Records\", \"Mercury Records\", \"Warner Bros. Records\"],\n    \"members\": [{\n        \"name\": \" James Hetfield\",\n        \"instruments\": [\"lead vocals\", \" rhythm guitar \"],\n        \"activeYears\": [\"1981-present\\n\"]\n        }, {\n        \"name\": \" Kirk Hammett\",\n        \"instruments\": [\"lead guitar \"],\n        \"activeYears\": [\"1983-present\\n\"]\n    }],\n    \"formerMembers\": [{\n        \"name\": \" Dave Mustaine\",\n        \"instruments\": [\"lead guitar\", \" backing vocals \"],\n        \"activeYears\": [\"1981-1983\\n\"]\n        }, {\n        \"name\": \" Ron McGovney\",\n        \"instruments\": [\"bass \"],\n        \"activeYears\": [\"1981-1982\\n\"]\n    }],\n    \"albums\": [{\n        \"_id\": \"5714debe25ac0d8aee36b662\",\n        \"name\": \"Metallica\",\n        \"titre\": \"Kill 'Em All\",\n        \"dateSortie\": \"1983\",\n        \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Kill_%27Em_All\",\n        \"genre\": \"Thrash Metal\",\n        \"length\": \"51:14\",\n        \"urlAlbum\": \"http://lyrics.wikia.com/Metallica:Kill_%27Em_All_%281983%29\",\n        \"id_artist\": \"56d93d84ce06f50c0fed8747\",\n        \"songs\": [{\n            \"_id\": \"5714dedb25ac0d8aee4ad800\",\n            \"position\": 0,\n            \"titre\": \"Hit The Lights\",\n            \"urlSong\": \"http://lyrics.wikia.com/Metallica:Hit_The_Lights\",\n            \"lyrics\": \"No life till leather, we&apos;re gonna kick some ass tonight We got the metal madness...\",\n            \"urlWikipedia\": \"\",\n            \"id_album\": \"5714debe25ac0d8aee36b662\",\n            \"urlYoutube\": \"\",\n            \"isClassic\": false,\n            \"multitrack_path\": \"M Multitracks/Metallica - Hit The Lights\",\n            \"urlITunes\": \"https://itunes.apple.com/us/album/id167352861?i=167352894\",\n            \"urlAmazon\": \"http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6X8%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8\",\n            \"urlGoEar\": \"http://goear.com/listen.php?v=41b192c\",\n            \"urlSpotify\": \"https://play.spotify.com/track/4Pn6l1ZzsYFrx64h1gWTyy\",\n            \"urlAllmusic\": \"http://www.allmusic.com/song/mt0034723664\",\n            \"urlMusicBrainz\": \"http://musicbrainz.org/recording/8467f4e7-ef5b-458c-bbc5-6727d9f2252d\"\n        }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad801\",\n            \"position\": 1,\n            \"titre\": \"The Four Horsemen\",\n            \"urlSong\": \"http://lyrics.wikia.com/Metallica:The_Four_Horsemen\",\n            \"lyrics\": \"By the last breath, the fourth winds blow Better raise your ears...\",\n            \"urlWikipedia\": \"http://en.wikipedia.org/wiki/The_Mechanix\",\n            \"id_album\": \"5714debe25ac0d8aee36b662\",\n            \"format\": [],\n            \"genre\": [\"Thrash metal\", \"Speed metal\"],\n            \"producer\": [\"Dave Mustaine\"],\n            \"recordLabel\": [\"Combat Records\"],\n            \"writer\": [],\n            \"recorded\": [\"December 1984 – January 1985 at Indigo Ranch Studios in Malibu, California\"],\n            \"abstract\": \"Killing Is My Business... and Business Is Good! is the debut studio album by American thrash metal band Megadeth. It was released on June 12, 1985...\",\n            \"releaseDate\": [\"1985-06-12\"],\n            \"runtime\": [\"1870.0\"],\n            \"award\": [],\n            \"subject\": [\"1985 debut albums\", \"Megadeth albums\", \"Combat Records albums\"],\n            \"urlYoutube\": \"\",\n            \"isClassic\": false,\n            \"urlITunes\": \"https://itunes.apple.com/us/album/id167352861?i=167352995\",\n            \"urlAmazon\": \"http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6ZG%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8\",\n            \"urlGoEar\": \"http://goear.com/listen.php?v=2bc44cf\",\n            \"urlAllmusic\": \"http://www.allmusic.com/song/mt0010502640\",\n            \"urlMusicBrainz\": \"http://musicbrainz.org/recording/20826102-147b-4376-a1f3-72c25bfd43cd\"\n        }]\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>The id is not valid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response invalid ObjectId:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"You must type a valid ObjectId\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response internal error:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"An internal error occurred\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/api_v1.js",
    "groupTitle": "Api_v1"
  },
  {
    "type": "get",
    "url": "api/v1/artist_all/:start",
    "title": "Get songs of each album of each artist",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/api/v1/artist_all/72000",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetArtistsWithAlbumsAndSongs",
    "group": "Api_v1",
    "description": "<p>This api return the first 200 artist documents for instance wasabi.i3s.unice.fr/api/v1/artist_all/72000 will return all artists between [72000 and 72200[</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "start",
            "description": "<p>Where we want to start the extraction, there are currently 77492 artists in our database .</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response for an artist:",
          "content": "HTTP/1.1 200 OK\n[{\n    \"_id\": \"56d93d84ce06f50c0fed8747\",\n    \"name\": \"Metallica\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Metallica\",\n    \"urlOfficialWebsite\": \"http://www.metallica.com/\",\n    \"urlFacebook\": \"http://www.facebook.com/metallica\",\n    \"urlMySpace\": \"https://myspace.com/Metallica\",\n    \"urlTwitter\": \"http://twitter.com/metallica\",\n    \"locationInfo\": [\"United States\", \"California\", \"Los Angeles\"],\n    \"urlWikia\": \"Metallica\",\n    \"activeYears\": \"\",\n    \"genres\": [\"Heavy Metal\", \"Thrash Metal\"],\n    \"labels\": [\"Elektra\", \"Megaforce Records\", \"Mercury Records\", \"Warner Bros. Records\"],\n    \"members\": [{\n        \"name\": \" James Hetfield\",\n        \"instruments\": [\"lead vocals\", \" rhythm guitar \"],\n        \"activeYears\": [\"1981-present\\n\"]\n        }, {\n        \"name\": \" Kirk Hammett\",\n        \"instruments\": [\"lead guitar \"],\n        \"activeYears\": [\"1983-present\\n\"]\n    }],\n    \"formerMembers\": [{\n        \"name\": \" Dave Mustaine\",\n        \"instruments\": [\"lead guitar\", \" backing vocals \"],\n        \"activeYears\": [\"1981-1983\\n\"]\n        }, {\n        \"name\": \" Ron McGovney\",\n        \"instruments\": [\"bass \"],\n        \"activeYears\": [\"1981-1982\\n\"]\n    }],\n    \"albums\": [{\n        \"_id\": \"5714debe25ac0d8aee36b662\",\n        \"name\": \"Metallica\",\n        \"titre\": \"Kill 'Em All\",\n        \"dateSortie\": \"1983\",\n        \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Kill_%27Em_All\",\n        \"genre\": \"Thrash Metal\",\n        \"length\": \"51:14\",\n        \"urlAlbum\": \"http://lyrics.wikia.com/Metallica:Kill_%27Em_All_%281983%29\",\n        \"id_artist\": \"56d93d84ce06f50c0fed8747\",\n        \"songs\": [{\n            \"_id\": \"5714dedb25ac0d8aee4ad800\",\n            \"position\": 0,\n            \"titre\": \"Hit The Lights\",\n            \"urlSong\": \"http://lyrics.wikia.com/Metallica:Hit_The_Lights\",\n            \"lyrics\": \"No life till leather, we&apos;re gonna kick some ass tonight We got the metal madness...\",\n            \"urlWikipedia\": \"\",\n            \"id_album\": \"5714debe25ac0d8aee36b662\",\n            \"urlYoutube\": \"\",\n            \"isClassic\": false,\n            \"multitrack_path\": \"M Multitracks/Metallica - Hit The Lights\",\n            \"urlITunes\": \"https://itunes.apple.com/us/album/id167352861?i=167352894\",\n            \"urlAmazon\": \"http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6X8%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8\",\n            \"urlGoEar\": \"http://goear.com/listen.php?v=41b192c\",\n            \"urlSpotify\": \"https://play.spotify.com/track/4Pn6l1ZzsYFrx64h1gWTyy\",\n            \"urlAllmusic\": \"http://www.allmusic.com/song/mt0034723664\",\n            \"urlMusicBrainz\": \"http://musicbrainz.org/recording/8467f4e7-ef5b-458c-bbc5-6727d9f2252d\"\n        }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad801\",\n            \"position\": 1,\n            \"titre\": \"The Four Horsemen\",\n            \"urlSong\": \"http://lyrics.wikia.com/Metallica:The_Four_Horsemen\",\n            \"lyrics\": \"By the last breath, the fourth winds blow Better raise your ears...\",\n            \"urlWikipedia\": \"http://en.wikipedia.org/wiki/The_Mechanix\",\n            \"id_album\": \"5714debe25ac0d8aee36b662\",\n            \"format\": [],\n            \"genre\": [\"Thrash metal\", \"Speed metal\"],\n            \"producer\": [\"Dave Mustaine\"],\n            \"recordLabel\": [\"Combat Records\"],\n            \"writer\": [],\n            \"recorded\": [\"December 1984 – January 1985 at Indigo Ranch Studios in Malibu, California\"],\n            \"abstract\": \"Killing Is My Business... and Business Is Good! is the debut studio album by American thrash metal band Megadeth. It was released on June 12, 1985...\",\n            \"releaseDate\": [\"1985-06-12\"],\n            \"runtime\": [\"1870.0\"],\n            \"award\": [],\n            \"subject\": [\"1985 debut albums\", \"Megadeth albums\", \"Combat Records albums\"],\n            \"urlYoutube\": \"\",\n            \"isClassic\": false,\n            \"urlITunes\": \"https://itunes.apple.com/us/album/id167352861?i=167352995\",\n            \"urlAmazon\": \"http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6ZG%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8\",\n            \"urlGoEar\": \"http://goear.com/listen.php?v=2bc44cf\",\n            \"urlAllmusic\": \"http://www.allmusic.com/song/mt0010502640\",\n            \"urlMusicBrainz\": \"http://musicbrainz.org/recording/20826102-147b-4376-a1f3-72c25bfd43cd\"\n        }]\n    }]\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>isn't a number or is negative.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"Page not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response internal error:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"An internal error occurred\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/api_v1.js",
    "groupTitle": "Api_v1"
  },
  {
    "type": "get",
    "url": "api/v1/song/id/:id",
    "title": "Get a song document by id",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/api/v1/song/id/5714dedb25ac0d8aee4ad810",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetSongById",
    "group": "Api_v1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>song's id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response for an artist:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"5714dedb25ac0d8aee4ad810\",\n    \"name\": \"Metallica\",\n    \"position\": 2,\n    \"albumTitre\": \"Ride The Lightning\",\n    \"lengthAlbum\": \"47:26\",\n    \"dateSortieAlbum\": \"1984\",\n    \"titre\": \"For Whom The Bell Tolls\",\n    \"urlSong\": \"http://lyrics.wikia.com/Metallica:For_Whom_The_Bell_Tolls\",\n    \"lyrics\": \"Make his fight on the hill in the early day Constant chill deep inside...\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/For_Whom_the_Bell_Tolls_(Metallica_song)\",\n    \"id_album\": \"5714debe25ac0d8aee36b663\",\n    \"format\": [],\n    \"genre\": [\"Heavy metal music\"],\n    \"producer\": [\"Metallica\", \"Flemming Rasmussen\"],\n    \"recordLabel\": [\"Elektra Records\"],\n    \"writer\": [\"James Hetfield\", \"Lars Ulrich\", \"Cliff Burton\"],\n    \"recorded\": [\"--02-20\"],\n    \"abstract\": \"\\\"For Whom the Bell Tolls\\\" is a song by American thrash metal band Metallica...\", \n    \"releaseDate\": [\"1985-08-31\"],\n    \"runtime\": [\"310.0\"],\n    \"award\": [],\n    \"subject\": [\"Songs written by James Hetfield\", \"1985 singles\", \"Songs written by Lars Ulrich\", \"Elektra Records singles\", \"Metallica songs\", \"1984 songs\", \"Anti-war songs\", \"Songs written by Cliff Burton\"],\n    \"urlYoutube\": \"\",\n    \"isClassic\": false,\n    \"multitrack_path\": \"M Multitracks/Metallica - For Whom The Bell Tolls\",\n    \"urlITunes\": \"https://itunes.apple.com/us/album/id167353139?i=167353334\",\n    \"urlAmazon\": \"http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB0012235Q6%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8\",\n    \"urlGoEar\": \"http://goear.com/listen.php?v=c6e3d05\",\n    \"urlSpotify\": \"https://play.spotify.com/track/4hOohf45f0JtxYKNsEAIOV\",\n    \"urlAllmusic\": \"http://www.allmusic.com/song/mt0031988990\",\n    \"urlMusicBrainz\": \"http://musicbrainz.org/recording/0f65985f-4ab2-4416-87eb-ccfd1ac4eb89\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>The id is not valid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response invalid ObjectId:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"You must type a valid ObjectId\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response internal error:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"An internal error occurred\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api/v1/api_v1.js",
    "groupTitle": "Api_v1"
  },
  {
    "type": "get",
    "url": "search/artist_id/:artistId/album_id/:albumId",
    "title": "Get infos about album by id",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/artist_id/56d93d84ce06f50c0fed8747/album_id/5714debe25ac0d8aee36b664",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetInfosAlbumByAlbumId",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "artistId",
            "description": "<p>An artist name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "albumId",
            "description": "<p>An album title of artistName.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlWikipedia",
            "description": "<p>Artist urlWikipedia</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlOfficialWebsite",
            "description": "<p>Artist urlOfficialWebsite</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlFacebook",
            "description": "<p>Artist urlFacebook</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlMySpace",
            "description": "<p>Artist urlMySpace</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlTwitter",
            "description": "<p>Artist urlTwitter</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "locationInfo",
            "description": "<p>Artist locationInfo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "activeYears",
            "description": "<p>Artist activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "genres",
            "description": "<p>Artist genres</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "labels",
            "description": "<p>Artist labels</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "members",
            "description": "<p>Members object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "members.name",
            "description": "<p>Members name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "members.instruments",
            "description": "<p>Members instruments</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "members.activeYears",
            "description": "<p>Members activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "formerMembers",
            "description": "<p>FormerMembers object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "formerMembers.name",
            "description": "<p>FormerMembers name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "formerMembers.instruments",
            "description": "<p>FormerMembers instruments</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "formerMembers.activeYears",
            "description": "<p>FormerMembers activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rdf",
            "description": "<p>Artist rdf</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "albums",
            "description": "<p>Album object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums._id",
            "description": "<p>Album id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.titre",
            "description": "<p>Album titre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.dateSortie",
            "description": "<p>Album dateSortie</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.genre",
            "description": "<p>Album genre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.length",
            "description": "<p>Album length</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.id_artist",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.rdf",
            "description": "<p>Album rdf</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "albums.songs",
            "description": "<p>Song object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs._id",
            "description": "<p>Song id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "albums.songs.position",
            "description": "<p>Song position</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.titre",
            "description": "<p>Song titre</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"56d93d84ce06f50c0fed8747\",\n    \"name\": \"Metallica\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Metallica\",\n    \"urlOfficialWebsite\": \"http://www.metallica.com/\",\n    \"urlFacebook\": \"http://www.facebook.com/metallica\",\n    \"urlMySpace\": \"https://myspace.com/Metallica\",\n    \"urlTwitter\": \"http://twitter.com/metallica\",\n    \"locationInfo\": [\"United States\", \"California\", \"Los Angeles\"],\n    \"activeYears\": \"\",\n    \"genres\": [\"Heavy Metal\", \"Thrash Metal\"],\n    \"labels\": [\"Elektra\", \"Megaforce Records\", \"Mercury Records\", \"Warner Bros. Records\"],\n    \"members\": [{\n        \"name\": \" James Hetfield\",\n        \"instruments\": [\"lead vocals\", \" rhythm guitar \"],\n        \"activeYears\": [\"1981-present\\n\"]\n    }, {\n        \"name\": \" Kirk Hammett\",\n        \"instruments\": [\"lead guitar \"],\n        \"activeYears\": [\"1983-present\\n\"]\n    }],\n    \"formerMembers\": [{\n        \"name\": \" Dave Mustaine\",\n        \"instruments\": [\"lead guitar\", \" backing vocals \"],\n        \"activeYears\": [\"1981-1983\\n\"]\n    }, {\n        \"name\": \" Ron McGovney\",\n        \"instruments\": [\"bass \"],\n        \"activeYears\": [\"1981-1982\\n\"]\n    }],\n    \"rdf\": \" 1963-03-04 Jason Curtis Newsted Bass, guitar ...\",\n    \"albums\": {\n        \"_id\": \"5714debe25ac0d8aee36b664\",\n        \"name\": \"Metallica\",\n        \"titre\": \"Master Of Puppets\",\n        \"dateSortie\": \"1986\",\n        \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Master_of_Puppets\",\n        \"genre\": \"Thrash Metal\",\n        \"length\": \"54:46\",\n        \"id_artist\": \"56d93d84ce06f50c0fed8747\",\n        \"rdf\": \" Gold Platinum Master of Puppets is the third studio album by American heavy metal band Metallica... \",\n        \"songs\": [{\n            \"_id\": \"5714dedb25ac0d8aee4ad816\",\n            \"position\": 0,\n            \"titre\": \"Battery\"\n            }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad817\",\n            \"position\": 1,\n            \"titre\": \"Master Of Puppets\"\n            }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad818\",\n            \"position\": 2,\n            \"titre\": \"The Thing That Should Not Be\"\n            }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad819\",\n            \"position\": 3,\n            \"titre\": \"Welcome Home (Sanitarium)\"\n        }]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>You must type a valid ObjectId.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"You must type a valid ObjectId\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"Album not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"Artist not found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/artist/:artistName/album/:albumName",
    "title": "Get infos about album",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/artist/Metallica/album/Master%20Of%20Puppets",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetInfosAlbumByAlbumName",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "artistName",
            "description": "<p>An artist name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "albumName",
            "description": "<p>An album title of artistName.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlWikipedia",
            "description": "<p>Artist urlWikipedia</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlOfficialWebsite",
            "description": "<p>Artist urlOfficialWebsite</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlFacebook",
            "description": "<p>Artist urlFacebook</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlMySpace",
            "description": "<p>Artist urlMySpace</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlTwitter",
            "description": "<p>Artist urlTwitter</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "locationInfo",
            "description": "<p>Artist locationInfo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "activeYears",
            "description": "<p>Artist activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "genres",
            "description": "<p>Artist genres</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "labels",
            "description": "<p>Artist labels</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "members",
            "description": "<p>Members object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "members.name",
            "description": "<p>Members name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "members.instruments",
            "description": "<p>Members instruments</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "members.activeYears",
            "description": "<p>Members activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "formerMembers",
            "description": "<p>FormerMembers object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "formerMembers.name",
            "description": "<p>FormerMembers name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "formerMembers.instruments",
            "description": "<p>FormerMembers instruments</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "formerMembers.activeYears",
            "description": "<p>FormerMembers activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rdf",
            "description": "<p>Artist rdf</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "albums",
            "description": "<p>Album object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums._id",
            "description": "<p>Album id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.titre",
            "description": "<p>Album titre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.dateSortie",
            "description": "<p>Album dateSortie</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.genre",
            "description": "<p>Album genre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.length",
            "description": "<p>Album length</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.id_artist",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.rdf",
            "description": "<p>Album rdf</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "albums.songs",
            "description": "<p>Song object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs._id",
            "description": "<p>Song id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "albums.songs.position",
            "description": "<p>Song position</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.titre",
            "description": "<p>Song titre</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"56d93d84ce06f50c0fed8747\",\n    \"name\": \"Metallica\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Metallica\",\n    \"urlOfficialWebsite\": \"http://www.metallica.com/\",\n    \"urlFacebook\": \"http://www.facebook.com/metallica\",\n    \"urlMySpace\": \"https://myspace.com/Metallica\",\n    \"urlTwitter\": \"http://twitter.com/metallica\",\n    \"locationInfo\": [\"United States\", \"California\", \"Los Angeles\"],\n    \"activeYears\": \"\",\n    \"genres\": [\"Heavy Metal\", \"Thrash Metal\"],\n    \"labels\": [\"Elektra\", \"Megaforce Records\", \"Mercury Records\", \"Warner Bros. Records\"],\n    \"members\": [{\n        \"name\": \" James Hetfield\",\n        \"instruments\": [\"lead vocals\", \" rhythm guitar \"],\n        \"activeYears\": [\"1981-present\\n\"]\n    }, {\n        \"name\": \" Kirk Hammett\",\n        \"instruments\": [\"lead guitar \"],\n        \"activeYears\": [\"1983-present\\n\"]\n    }],\n    \"formerMembers\": [{\n        \"name\": \" Dave Mustaine\",\n        \"instruments\": [\"lead guitar\", \" backing vocals \"],\n        \"activeYears\": [\"1981-1983\\n\"]\n    }, {\n        \"name\": \" Ron McGovney\",\n        \"instruments\": [\"bass \"],\n        \"activeYears\": [\"1981-1982\\n\"]\n    }],\n    \"rdf\": \" 1963-03-04 Jason Curtis Newsted Bass, guitar ...\",\n    \"albums\": {\n        \"_id\": \"5714debe25ac0d8aee36b664\",\n        \"name\": \"Metallica\",\n        \"titre\": \"Master Of Puppets\",\n        \"dateSortie\": \"1986\",\n        \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Master_of_Puppets\",\n        \"genre\": \"Thrash Metal\",\n        \"length\": \"54:46\",\n        \"id_artist\": \"56d93d84ce06f50c0fed8747\",\n        \"rdf\": \" Gold Platinum Master of Puppets is the third studio album by American heavy metal band Metallica... \",\n        \"songs\": [{\n            \"_id\": \"5714dedb25ac0d8aee4ad816\",\n            \"position\": 0,\n            \"titre\": \"Battery\"\n            }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad817\",\n            \"position\": 1,\n            \"titre\": \"Master Of Puppets\"\n            }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad818\",\n            \"position\": 2,\n            \"titre\": \"The Thing That Should Not Be\"\n            }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad819\",\n            \"position\": 3,\n            \"titre\": \"Welcome Home (Sanitarium)\"\n        }]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>albumName was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"Album not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"Artist not found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/artist/:artistName",
    "title": "Get infos about artist",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/artist/Metallica",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetInfosArtistByArtistName",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "artistName",
            "description": "<p>An artist name.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlWikipedia",
            "description": "<p>Artist urlWikipedia</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlOfficialWebsite",
            "description": "<p>Artist urlOfficialWebsite</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlFacebook",
            "description": "<p>Artist urlFacebook</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlMySpace",
            "description": "<p>Artist urlMySpace</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "urlTwitter",
            "description": "<p>Artist urlTwitter</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "locationInfo",
            "description": "<p>Artist locationInfo</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "activeYears",
            "description": "<p>Artist activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "genres",
            "description": "<p>Artist genres</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "labels",
            "description": "<p>Artist labels</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "members",
            "description": "<p>Members object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "members.name",
            "description": "<p>Members name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "members.instruments",
            "description": "<p>Members instruments</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "members.activeYears",
            "description": "<p>Members activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "formerMembers",
            "description": "<p>FormerMembers object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "formerMembers.name",
            "description": "<p>FormerMembers name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "formerMembers.instruments",
            "description": "<p>FormerMembers instruments</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "formerMembers.activeYears",
            "description": "<p>FormerMembers activeYears</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rdf",
            "description": "<p>Artist rdf</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "albums",
            "description": "<p>Album object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums._id",
            "description": "<p>Album id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.titre",
            "description": "<p>Album titre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.dateSortie",
            "description": "<p>Album dateSortie</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.genre",
            "description": "<p>Album genre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.length",
            "description": "<p>Album length</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.id_artist",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "albums.songs",
            "description": "<p>Song object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs._id",
            "description": "<p>Song id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "albums.songs.position",
            "description": "<p>Song position</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.titre",
            "description": "<p>Song titre</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"56d93d84ce06f50c0fed8747\",\n    \"name\": \"Metallica\",\n    \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Metallica\",\n    \"urlOfficialWebsite\": \"http://www.metallica.com/\",\n    \"urlFacebook\": \"http://www.facebook.com/metallica\",\n    \"urlMySpace\": \"https://myspace.com/Metallica\",\n    \"urlTwitter\": \"http://twitter.com/metallica\",\n    \"locationInfo\": [\"United States\", \"California\", \"Los Angeles\"],\n    \"activeYears\": \"\",\n    \"genres\": [\"Heavy Metal\", \"Thrash Metal\"],\n    \"labels\": [\"Elektra\", \"Megaforce Records\", \"Mercury Records\", \"Warner Bros. Records\"],\n    \"members\": [{\n        \"name\": \" James Hetfield\",\n        \"instruments\": [\"lead vocals\", \" rhythm guitar \"],\n        \"activeYears\": [\"1981-present\\n\"]\n    }],\n    \"formerMembers\": [{\n        \"name\": \" Dave Mustaine\",\n        \"instruments\": [\"lead guitar\", \" backing vocals \"],\n        \"activeYears\": [\"1981-1983\\n\"]\n    }],\n    \"rdf\": \" 1963-03-04 Jason Curtis Newsted Bass, guitar, drums, vocals Jason Newsted Jason Curtis Newsted (born March 4, 1963) is an American metal musician, known for playing bass guitar with the bands Metallica (in which he did occasional lead vocals) ...\",\n    \"albums\": [{\n        \"_id\": \"5714debe25ac0d8aee36b664\",\n        \"name\": \"Metallica\",\n        \"titre\": \"Master Of Puppets\",\n        \"dateSortie\": \"1986\",\n        \"genre\": \"Thrash Metal\",\n        \"length\": \"54:46\",\n        \"id_artist\": \"56d93d84ce06f50c0fed8747\",\n        \"songs\": [{\n            \"_id\": \"5714dedb25ac0d8aee4ad816\",\n            \"position\": 0,\n            \"titre\": \"Battery\"\n            }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad817\",\n            \"position\": 1,\n            \"titre\": \"Master Of Puppets\"\n            }, {\n            \"_id\": \"5714dedb25ac0d8aee4ad81d\",\n            \"position\": 7,\n            \"titre\": \"Damage, Inc.\"\n        }]\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>The artistName was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\":\"Artist not found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/artist/:artistName/album/:albumName/song/:songName",
    "title": "Get infos about song by song name",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/artist/Metallica/album/Master%20Of%20Puppets/song/Master%20Of%20Puppets",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetInfosSongBySongName",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "artistName",
            "description": "<p>An artist name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "albumName",
            "description": "<p>An album title of artistName.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "songName",
            "description": "<p>A song title of songName.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "albums",
            "description": "<p>Album object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums._id",
            "description": "<p>Album id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "albums.songs",
            "description": "<p>Song object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs._id",
            "description": "<p>Song id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "albums.songs.position",
            "description": "<p>Song position</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.albumTitre",
            "description": "<p>Album titre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.lengthAlbum",
            "description": "<p>Album lengthAlbum</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.dateSortieAlbum",
            "description": "<p>Song dateSortieAlbum</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.titre",
            "description": "<p>Song titre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.lyrics",
            "description": "<p>Song lyrics</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlWikipedia",
            "description": "<p>Song urlWikipedia</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.id_album",
            "description": "<p>Song id_album</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.rdf",
            "description": "<p>Song rdf</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.format",
            "description": "<p>Song format</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.genre",
            "description": "<p>Song genre</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.producer",
            "description": "<p>Song producer</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.recordLabel",
            "description": "<p>Song recordLabel</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.writer",
            "description": "<p>Song writer</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.recorded",
            "description": "<p>Song recorded</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.abstract",
            "description": "<p>Song abstract</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.releaseDate",
            "description": "<p>Song releaseDate</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.runtime",
            "description": "<p>Song runtime</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.award",
            "description": "<p>Song award</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.subject",
            "description": "<p>Song subject</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "albums.songs.isClassic",
            "description": "<p>Song isClassic</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlYoutube",
            "description": "<p>Song urlYoutube</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.multitrack_path",
            "description": "<p>Song multitrack_path</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.multitrack_file",
            "description": "<p>Song multitrack_file</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlITunes",
            "description": "<p>Song urlITunes</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlAmazon",
            "description": "<p>Song urlAmazon</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlGoEar",
            "description": "<p>Song urlGoEar</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlSpotify",
            "description": "<p>Song urlSpotify</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlAllmusic",
            "description": "<p>Song urlAllmusic</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlMusicBrainz",
            "description": "<p>Song urlMusicBrainz</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlHypeMachine",
            "description": "<p>Song urlHypeMachine</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlLastFm",
            "description": "<p>Song urlLastFm</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlPandora",
            "description": "<p>Song urlPandora</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response for an artist:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"56d93d84ce06f50c0fed8747\",\n    \"name\": \"Metallica\",\n    \"albums\": {\n        \"_id\": \"5714debe25ac0d8aee36b664\",\n        \"titre\": \"Master Of Puppets\",\n        \"songs\": {\n            \"_id\": \"5714dedb25ac0d8aee4ad817\",\n            \"name\": \"Metallica\",\n            \"position\": 1,\n            \"albumTitre\": \"Master Of Puppets\",\n            \"lengthAlbum\": \"54:46\",\n            \"dateSortieAlbum\": \"1986\",\n            \"titre\": \"Master Of Puppets\",\n            \"lyrics\": \"End of passion play, crumbling away<br>I&apos;m your source of self-destruction...\",\n            \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Master_of_Puppets_(song)\",\n            \"id_album\": \"5714debe25ac0d8aee36b664\",\n            \"rdf\": \"<?xml version='1.0' encoding='utf-8' ?><rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'  xmlns:rdfs='http://www.w3.org/2000/01/rdf-schema#' xmlns:dct='http://purl.org/dc/terms/' xmlns:dbp='http://dbpedia.org/property/' xmlns:dbo='http://dbpedia.org/ontology/' >   <rdf:Description rdf:about='http://dbpedia.org/resource/Master_of_Puppets_(song)'><dct:subject rdf:resource='http://dbpedia.org/resource/Category:Songs_written_by_Lars_Ulrich' />     <dct:subject rdf:resource='http://dbpedia.org/resource/Category:Metallica_songs' /><dct:subject rdf:resource='http://dbpedia.org/resource/Category:Elektra_Records_singles' /></rdf:Description> </rdf:RDF>\",\n            \"format\": [\"Gramophone record\", \"12-inch single\"],\n            \"genre\": [\"Thrash metal\", \"Progressive metal\"],\n            \"producer\": [\"Flemming Rasmussen\"],\n            \"recordLabel\": [\"Elektra Records\", \"Music for Nations\"],\n            \"writer\": [\"Cliff Burton\", \"Lars Ulrich\", \"James Hetfield\", \"Kirk Hammett\"],\n            \"recorded\": [\"1985\"],\n            \"abstract\": \"\\\"Master of Puppets\\\" is a song by the American heavy metal band Metallica...\",\n            \"releaseDate\": [\"1986-07-02\"],\n            \"runtime\": [\"516.0\"],\n            \"award\": [],\n            \"subject\": [\"Songs written by Lars Ulrich\", \"Metallica songs\", \"Elektra Records singles\", \"Songs written by Cliff Burton\", \"Songs about drugs\", \"Songs written by James Hetfield\", \"Songs written by Kirk Hammett\", \"1986 singles\"],\n            \"urlYoutube\": \"\",\n            \"isClassic\": false,\n            \"multitrack_path\": \"M Multitracks/Metallica - Master Of Puppets\",\n            \"urlITunes\": \"https://itunes.apple.com/us/album/id167353581?i=167353601\",\n            \"urlAmazon\": \"http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122A546%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8\",\n            \"urlGoEar\": \"http://goear.com/listen.php?v=afd1e62\",\n            \"urlSpotify\": \"https://play.spotify.com/track/6NwbeybX6TDtXlpXvnUOZC\",\n            \"urlAllmusic\": \"http://www.allmusic.com/song/mt0002228132\",\n            \"urlMusicBrainz\": \"http://musicbrainz.org/recording/49b8371f-156a-41e8-92c9-8cd899235b90\"\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>The artistName was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response for artist not found:",
          "content": "HTTP/1.1 404 Artist Not Found\n{\n    \"error\": \"Artist not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response for album not found:",
          "content": "HTTP/1.1 404 Album Not Found\n{\n    \"error\": \"Album not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response for song not found:",
          "content": "HTTP/1.1 404 Song Not Found\n{\n    \"error\": \"Song not found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/dbinfo",
    "title": "Get number of artist,album,song",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/dbinfo",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetNumberOfArtistAlbumSong",
    "group": "Search",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "nbArtist",
            "description": "<p>The number of occurrences found</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "nbAlbum",
            "description": "<p>The number of occurrences found</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "nbSong",
            "description": "<p>The number of occurrences found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"nbArtist\":77492,\n    \"nbAlbum\":208743,\n    \"nbSong\":2099289\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/count/:collection/:fieldName/:fieldValue",
    "title": "Get number of :fieldValue",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/count/song/award/Platinum\nwasabi.i3s.unice.fr/search/count/album/genre/Alternative%20Rock",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetNumberOfFieldValue",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "collection",
            "description": "<p>{artist, album, song}</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fieldName",
            "description": "<p>a field name in the database</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fieldValue",
            "description": "<p>a value of a field in the database</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "count",
            "description": "<p>The number of occurrences found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"count\":3366\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/categorie/:nomCategorie/lettre/:lettre/page/:numPage",
    "title": "Get page information",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/categorie/artists/lettre/b/page/5",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetPageByCategory",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nomCategorie",
            "description": "<p>{artists,albums,songs}.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lettre",
            "description": "<p>Une ou deux lettres.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "numPage",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response for an artist:",
          "content": "HTTP/1.1 200 OK\n{\n    \"limit\": 200,\n    \"artists\": [{\n            \"_id\": \"56d843ec53a7ddfc01f96d17\",\n            \"name\": \"J\"\n        },\n        {\n            \"_id\": \"56d843ed53a7ddfc01f96d18\",\n            \"name\": \"J Alvarez\"\n        }\n    ]\n}",
          "type": "json"
        },
        {
          "title": "Success-Response for an album:",
          "content": "HTTP/1.1 200 OK\n{\n    \"limit\": 200,\n    \"albums\": [{\n            \"_id\": \"5714debb25ac0d8aee34e3a7\",\n            \"name\": \"Agnetha Fältskog\",\n            \"titleAlbum\": \"A\"\n        },\n        {\n            \"_id\": \"5714debb25ac0d8aee355421\",\n            \"name\": \"Cass McCombs\",\n            \"titleAlbum\": \"A\"\n        }\n    ]\n}",
          "type": "json"
        },
        {
          "title": "Success-Response for a song:",
          "content": "HTTP/1.1 200 OK\n{\n    \"limit\": 200,\n    \"songs\": [{\n            \"_id\": \"5714dec325ac0d8aee3859f9\",\n            \"name\": \"Addict\",\n            \"albumTitre\": \"Come On Sun\",\n            \"titleSong\": \"K\"\n        },\n        {\n            \"_id\": \"5714dec325ac0d8aee3804f5\",\n            \"name\": \"A\",\n            \"albumTitre\": \"A Vs. Monkey Kong\",\n            \"titleSong\": \"A\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>The nomCategorie or lettre or numPage was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"Page not found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/artist_id/:artistId/album_id/:albumId/song_id/:songId",
    "title": "Get Page information",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/artist_id/56d93d84ce06f50c0fed8747/album_id/5714debe25ac0d8aee36b664/song_id/5714dedb25ac0d8aee4ad817",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetPageSongByID",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "artistId",
            "description": "<p>Artist's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "albumId",
            "description": "<p>Album's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "songId",
            "description": "<p>Song's id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Artist id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "albums",
            "description": "<p>Album object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums._id",
            "description": "<p>Album id</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "albums.songs",
            "description": "<p>Song object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs._id",
            "description": "<p>Song id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.name",
            "description": "<p>Artist name</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "albums.songs.position",
            "description": "<p>Song position</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.albumTitre",
            "description": "<p>Album titre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.lengthAlbum",
            "description": "<p>Album lengthAlbum</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.dateSortieAlbum",
            "description": "<p>Song dateSortieAlbum</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.titre",
            "description": "<p>Song titre</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.lyrics",
            "description": "<p>Song lyrics</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlWikipedia",
            "description": "<p>Song urlWikipedia</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.id_album",
            "description": "<p>Song id_album</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.rdf",
            "description": "<p>Song rdf</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.format",
            "description": "<p>Song format</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.genre",
            "description": "<p>Song genre</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.producer",
            "description": "<p>Song producer</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.recordLabel",
            "description": "<p>Song recordLabel</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.writer",
            "description": "<p>Song writer</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.recorded",
            "description": "<p>Song recorded</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.abstract",
            "description": "<p>Song abstract</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.releaseDate",
            "description": "<p>Song releaseDate</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.runtime",
            "description": "<p>Song runtime</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.award",
            "description": "<p>Song award</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "albums.songs.subject",
            "description": "<p>Song subject</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "albums.songs.isClassic",
            "description": "<p>Song isClassic</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlYoutube",
            "description": "<p>Song urlYoutube</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.multitrack_path",
            "description": "<p>Song multitrack_path</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.multitrack_file",
            "description": "<p>Song multitrack_file</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlITunes",
            "description": "<p>Song urlITunes</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlAmazon",
            "description": "<p>Song urlAmazon</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlGoEar",
            "description": "<p>Song urlGoEar</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlSpotify",
            "description": "<p>Song urlSpotify</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlAllmusic",
            "description": "<p>Song urlAllmusic</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlMusicBrainz",
            "description": "<p>Song urlMusicBrainz</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlHypeMachine",
            "description": "<p>Song urlHypeMachine</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlLastFm",
            "description": "<p>Song urlLastFm</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albums.songs.urlPandora",
            "description": "<p>Song urlPandora</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"56d93d84ce06f50c0fed8747\",\n    \"name\": \"Metallica\",\n    \"albums\": {\n    \"_id\": \"5714debe25ac0d8aee36b664\",\n    \"titre\": \"Master Of Puppets\",\n    \"songs\": {\n        \"_id\": \"5714dedb25ac0d8aee4ad817\",\n        \"name\": \"Metallica\",\n        \"position\": 1,\n        \"albumTitre\": \"Master Of Puppets\",\n        \"lengthAlbum\": \"54:46\",\n        \"dateSortieAlbum\": \"1986\",\n        \"titre\": \"Master Of Puppets\",\n        \"lyrics\": \"End of passion play, crumbling away I&apos;m your source ...\",\n        \"urlWikipedia\": \"http://en.wikipedia.org/wiki/Master_of_Puppets_(song)\",\n        \"id_album\": \"5714debe25ac0d8aee36b664\",\n        \"rdf\": \"Some RDF...\",\n        \"format\": [\"Gramophone record\", \"12-inch single\"],\n        \"genre\": [\"Thrash metal\", \"Progressive metal\"],\n        \"producer\": [\"Flemming Rasmussen\"],\n        \"recordLabel\": [\"Elektra Records\", \"Music for Nations\"],\n        \"writer\": [\"Cliff Burton\", \"Lars Ulrich\", \"James Hetfield\", \"Kirk Hammett\"],\n        \"recorded\": [\"1985\"],\n        \"abstract\": \"\\\"Master of Puppets\\\" is a song by the American heavy metal ...\",\n        \"releaseDate\": [\"1986-07-02\"],\n        \"runtime\": [\"516.0\"],\n        \"award\": [],\n        \"subject\": [\"Songs written by Lars Ulrich\", \"Metallica songs\", \"Elektra Records singles\", \"Songs written by Cliff Burton\", \"Songs about drugs\", \"Songs written by James Hetfield\", \"Songs written by Kirk Hammett\", \"1986 singles\"],\n        \"urlYoutube\": \"\",\n        \"isClassic\": false,\n        \"multitrack_path\": \"M Multitracks/Metallica - Master Of Puppets\",\n        \"urlITunes\": \"https://itunes.apple.com/us/album/id167353581?i=167353601\",\n        \"urlAmazon\": \"http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122A546%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8\",\n        \"urlGoEar\": \"http://goear.com/listen.php?v=afd1e62\",\n        \"urlSpotify\": \"https://play.spotify.com/track/6NwbeybX6TDtXlpXvnUOZC\",\n        \"urlAllmusic\": \"http://www.allmusic.com/song/mt0002228132\",\n        \"urlMusicBrainz\": \"http://musicbrainz.org/recording/49b8371f-156a-41e8-92c9-8cd899235b90\"\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>The ObjectId is not valid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"You must type a valid ObjectId\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"Artist not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"Album not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"Song not found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/award/:awardName",
    "title": "Get songs by awardName",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/award/Platinum",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetSongsByAwardName",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "awardName",
            "description": "<p>{undefined,Diamond, Gold,Gold+Gold+Platinum,Gold+Silver,Million,Million2× Platinum, Multi Platinum,N/A,Platinum,Platinum+Gold, Platinum+Platinum&quot;,&quot;Platinumref|The Platinum award for &quot;Summertime Sadness&quot; in the United States represents sales of both the original version and the Cedric Gervais remix.|group=&quot;note&quot;|name=RIAA, Silver,platinum,—,−}.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the song.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Band name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albumTitre",
            "description": "<p>Album title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titre",
            "description": "<p>Song title.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n    \"_id\": \"5714ded425ac0d8aee459dfe\",\n    \"name\": \"Jay-Z\",\n    \"albumTitre\": \"The Blueprint²: The Gift & The Curse\",\n    \"titre\": \"'03 Bonnie & Clyde\"\n}, {\n    \"_id\": \"5714dee025ac0d8aee4ea2d5\",\n    \"name\": \"Queen\",\n    \"albumTitre\": \"A Night At The Opera\",\n    \"titre\": \"'39\"\n}]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/category/:collection/:categoryName",
    "title": "Get category",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/category/song/Songs%20written%20by%20Cliff%20Burton",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetSongsByCategory",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "collection",
            "description": "<p>{artists,albums,songs}.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "categoryName",
            "description": "<p>category is the subject field in the database.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the song.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Band name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albumTitre",
            "description": "<p>Album title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titre",
            "description": "<p>Song title.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n    \"_id\": \"5714dece25ac0d8aee403c97\",\n    \"name\": \"Drowning Pool\",\n    \"albumTitre\": \"Other Releases\",\n    \"titre\": \"Creeping Death\"\n}, {\n    \"_id\": \"5714dedb25ac0d8aee4ad814\",\n    \"name\": \"Metallica\",\n    \"albumTitre\": \"Ride The Lightning\",\n    \"titre\": \"Creeping Death\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "error",
            "description": "<p>The collection was not found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"error\": \"Page not found\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/format/:formatName",
    "title": "Get songs by formatName",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/format/Gramophone%20record\nwasabi.i3s.unice.fr/search/format/CD%20single",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetSongsByFormatName",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "formatName",
            "description": "<p>a writer name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the song.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Band name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albumTitre",
            "description": "<p>Album title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titre",
            "description": "<p>Song title.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n    \"_id\": \"5714dee725ac0d8aee54060e\",\n    \"name\": \"The Gaslight Anthem\",\n    \"albumTitre\": \"Handwritten\",\n    \"titre\": \"\\\"45\\\"\"\n}, {\n    \"_id\": \"5714decc25ac0d8aee3ed894\",\n    \"name\": \"David Bowie\",\n    \"albumTitre\": \"\\\"Heroes\\\"\",\n    \"titre\": \"\\\"Heroes\\\"\"\n}]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/genre/:genreName",
    "title": "Get songs by genre",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/genre/Thrash%20metal",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetSongsByGenre",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "genreName",
            "description": "<p>songs having this genre.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the song.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Band name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albumTitre",
            "description": "<p>Album title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titre",
            "description": "<p>Song title.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n    \"_id\": \"5714dedb25ac0d8aee4ad81f\",\n    \"name\": \"Metallica\",\n    \"albumTitre\": \"...And Justice For All\",\n    \"titre\": \"...And Justice For All\"\n}, {\n    \"_id\": \"5714dedb25ac0d8aee4aa923\",\n    \"name\": \"Megadeth\",\n    \"albumTitre\": \"Endgame\",\n    \"titre\": \"Dialectic Chaos\"\n}]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/producer/:producerName",
    "title": "Get songs by producer",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/producer/Flemming%20Rasmussen",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetSongsByProducer",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "producerName",
            "description": "<p>producer name.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the song.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Band name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albumTitre",
            "description": "<p>Album title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titre",
            "description": "<p>Song title.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n    \"_id\": \"5714dedb25ac0d8aee4ad81f\",\n    \"name\": \"Metallica\",\n    \"albumTitre\": \"...And Justice For All\",\n    \"titre\": \"...And Justice For All\"\n}, {\n    \"_id\": \"5714dedb25ac0d8aee4ad89d\",\n    \"name\": \"Metallica\",\n    \"albumTitre\": \"Singles\",\n    \"titre\": \"...And Justice For All\"\n}]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/recordlabel/:recordLabelName",
    "title": "Get songs by recordLabel",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/recordlabel/Elektra%20Records",
        "type": "get"
      }
    ],
    "version": "1.0.0",
    "name": "GetSongsByRecordLabel",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "recordLabelName",
            "description": "<p>a record label name.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the song.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Band name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albumTitre",
            "description": "<p>Album title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titre",
            "description": "<p>Song title.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n    \"_id\": \"5714dee025ac0d8aee4ea2d5\",\n    \"name\": \"Queen\",\n    \"albumTitre\": \"A Night At The Opera\",\n    \"titre\": \"'39\"\n}, {\n    \"_id\": \"5714dee025ac0d8aee4ea30a\",\n    \"name\": \"Queen\",\n    \"albumTitre\": \"Live Killers\",\n    \"titre\": \"'39\"\n}]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/recorded/:recordedName",
    "title": "Get songs by recordedName",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/recorded/1985\nwasabi.i3s.unice.fr/search/recorded/--06-16",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetSongsByRecordedName",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "recordedName",
            "description": "<p>The field may assume different values.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the song.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Band name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albumTitre",
            "description": "<p>Album title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titre",
            "description": "<p>Song title.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n    \"_id\": \"5714dec325ac0d8aee388df2\",\n    \"name\": \"Aimee Mann\",\n    \"albumTitre\": \"Ultimate Collection\",\n    \"titre\": \"'Til Tuesday:Voices Carry\"\n}, {\n    \"_id\": \"5714decf25ac0d8aee41bd1c\",\n    \"name\": \"Feargal Sharkey\",\n    \"albumTitre\": \"Feargal Sharkey\",\n    \"titre\": \"A Good Heart\"\n}]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "search/writer/:writerName",
    "title": "Get songs by writerName",
    "examples": [
      {
        "title": "Example usage: ",
        "content": "wasabi.i3s.unice.fr/search/writer/Lars%20Ulrich",
        "type": "json"
      }
    ],
    "version": "1.0.0",
    "name": "GetSongsByWriterName",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "writerName",
            "description": "<p>a writer name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>id of the song.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Band name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "albumTitre",
            "description": "<p>Album title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "titre",
            "description": "<p>Song title.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n    \"_id\": \"5714dedb25ac0d8aee4ad8ae\",\n    \"name\": \"Metallica\",\n    \"albumTitre\": \"Singles\",\n    \"titre\": \"Better Than You\"\n}, {\n    \"_id\": \"5714dedb25ac0d8aee4ad83c\",\n    \"name\": \"Metallica\",\n    \"albumTitre\": \"Load\",\n    \"titre\": \"Bleeding Me\"\n}]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/search.js",
    "groupTitle": "Search"
  }
] });
