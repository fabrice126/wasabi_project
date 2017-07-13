module.exports = {
    "http": {
        "public": "/../public/",
        "mime": {
            "css": "text/css",
            "gif": "image/gif",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "js": "application/javascript",
            "ttf": "font/ttf",
            "png": "image/png",
            "html": "text/html"
        },
        "limit_request": {
            "api": {
                "windowMs": 60000, // 60 secondes 
                "max": 30, // limit each IP to x requests per windowMs 
                "delayMs": 0 // disable delaying - full speed until the max limit is reached
            },
            "search": {
                "windowMs": 60000, // 60 secondes 
                "max": 30, // limit each IP to x requests per windowMs 
                "delayMs": 0 // disable delaying - full speed until the max limit is reached
            },
            "login": {
                "windowMs": 60000 * 2, // 60 secondes 
                "max": 5, // limit each IP to x requests per windowMs 
                "delayMs": 0, // disable delaying - full speed until the max limit is reached
                message: "Sorry, the maximum limit of try has been reached. Try again in 2 minutes",
            }
        },
        "error": {
            "global_404": {
                "error": "Page not found"
            },
            "artist_404": {
                "error": "Artist not found"
            },
            "album_404": {
                "error": "Album not found"
            },
            "song_404": {
                "error": "Song not found"
            },
            "objectid_404": {
                "error": "You must type a valid ObjectId"
            },
            "internal_error_404": {
                "error": "An internal error occurred"
            },
            "musicbrainz_error_404": {
                "error": "Resource unavailable on MusicBrainz"
            },
            "deezer_error_404": {
                "error": "Resource unavailable on Deezer"
            },
            "user": {
                "authentication": {
                    "success": false,
                    "error": "Authentication failed. User not found."
                },
                "login_password": {
                    "success": false,
                    "message": "Wrong password or email."
                },
                "mail_exist": {
                    "success": false,
                    "message": "That email address already exists."
                }
            },
            "put": {
                "general": {
                    "success": false,
                    "message": "You cannot edit if you are not logged in"
                },
                "artist": {
                    "success": false,
                    "message": "You cannot edit artist if you are not logged in"
                },
                "album": {
                    "success": false,
                    "message": "You cannot edit album if you are not logged in"
                },
                "song": {
                    "success": false,
                    "message": "You cannot edit song if you are not logged in"
                }
            }
        },
        "valid": {
            "send_message_ok": {
                "message": "OK"
            },
            "user": {
                "user_created": {
                    "success": true,
                    "message": "Successfully created new user."
                }
            }
        }
    },
    "https": {
        "wasabi_key": "cert_https/wasabi_i3s_unice_fr.key",
        "wasabi_csr": "cert_https/wasabi_i3s_unice_fr.csr",
        "wasabi_crt": "cert_https/wasabi_i3s_unice_fr.crt",
        "digi_crt": "cert_https/DigiCertCA.crt"
    },
    "database": {
        "mongodb_connect": "mongodb://localhost:27017/wasabi",
        "mongodb_option": {
            server: {
                socketOptions: {
                    socketTimeoutMS: 999999
                }
            }
        },
        "collection_artist": "artist",
        "collection_album": "album",
        "collection_song": "song",
        "elasticsearch_connect": "localhost:9200",
        "elasticsearch_url": "http://127.0.0.1:9200/",
        "index_artist": "idx_artists",
        "index_song": "idx_songs",
        "index_type_artist": "artist",
        "index_type_song": "song",
    },
    "MT5": {
        "TRACKS_PATH": "public/my_components/MT5/multitrack/",
        "TRACKS_URL": "multitrack/"
    },
    "multitracks": {
        "path_windows": "E:/Multitracks downloadees + MT5 multitracks/",
        "path_linux": "./public/my_components/MT5/multitrack/"

    },
    "request": {
        "limit": 200,
        "limit_search_bar": 12,
        "projection": {
            "search": {
                "get_artist": {
                    "artist": {
                        "urlWikia": 0,
                        "wordCount": 0,
                        "animux_path": 0,
                        "disambiguation": 0,
                        "endArea.disambiguation": 0,
                        "endArea.id": 0,
                        "id_artist_musicbrainz": 0,
                        "location.id_city_musicbrainz": 0,
                        "members.disambiguation": 0,
                        "members.id_member_musicbrainz": 0,
                        "members.type": 0,
                        "type": 0
                    },
                    "album": {
                        "id_artist": 1,
                        "name": 1,
                        "publicationDate": 1,
                        "title": 1,
                        "cover.medium": 1
                    },
                    "song": {
                        "position": 1,
                        "title": 1
                    }
                },
                "get_album": {
                    "artist": {
                        "name": 1
                    },
                    "album": {
                        "urlAlbum": 0,
                        "wordCount": 0,
                        "disambiguation": 0,
                        "id_album_musicbrainz": 0
                    },
                    "song": {
                        "position": 1,
                        "title": 1
                    }
                },
                "get_song": {
                    "artist": {
                        "name": 1
                    },
                    "album": {
                        "title": 1
                    },
                    "song": {
                        "urlSong": 0,
                        "wordCount": 0,
                        "animux_content": 0,
                        "animux_path": 0,
                        "availableCountries": 0,
                        "deezer_mapping": 0,
                        "disambiguation": 0,
                        "id_song_musicbrainz": 0
                    }
                }
            }
        }
    },
    "passport": {
        "auth": {
            "jwt": {
                session: false
            }
        }
    },
    "launch": {
        "env": {
            "prod": "production",
            "dev": "development",
            "dev_mode": true
        }
    }
};