import express from 'express';
const router = express.Router();

/**
 * @api {get} apidoc/#api-Api_Fields-ALL_FIELDS_ARTIST All artist's fields
 * @apiVersion 1.0.0
 * @apiName ALL_FIELDS_ARTIST
 * @apiGroup Api Fields
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {String} _id Artist id
 * @apiSuccess {String} name Artist name
 * @apiSuccess {String} urlWikia url to lyricsWikia
 * @apiSuccess {String} urlWikipedia Artist urlWikipedia
 * @apiSuccess {String} urlOfficialWebsite Artist urlOfficialWebsite
 * @apiSuccess {String} urlFacebook Artist urlFacebook
 * @apiSuccess {String} urlMySpace Artist urlMySpace
 * @apiSuccess {String} urlTwitter Artist urlTwitter
 * @apiSuccess {String[]} locationInfo Artist locationInfo
 * @apiSuccess {String[]} genres Artist genres
 * @apiSuccess {String[]} labels Artist labels
 * 
 * @apiSuccess {Object[]} members Member object
 *  @apiSuccess {String} members.id_member_musicbrainz MusicBrainz ID
 *  @apiSuccess {String} members.name Member name
 *  @apiSuccess {String[]} members.instruments Member's instruments
 *  @apiSuccess {String} members.begin Member's begin
 *  @apiSuccess {String} members.end Member's end
 *  @apiSuccess {Boolean} members.ended Member's ended
 *  @apiSuccess {String} members.disambiguation Member's disambiguation
 *  @apiSuccess {String} members.type Member's type
 * 
 * @apiSuccess {Object[]} wordCount count all identical words for all musics of this artist
 *  @apiSuccess {String} wordCount._id A word
 *  @apiSuccess {Number} wordCount.value Number of this word
 * 
 * @apiSuccess {String} urlAmazon Artist urlAmazon
 * @apiSuccess {String} urlITunes Artist urlITunes
 * @apiSuccess {String} urlAllmusic Artist urlAllmusic
 * @apiSuccess {String} urlDiscogs Artist urlDiscogs
 * @apiSuccess {String} urlMusicBrainz Artist urlMusicBrainz
 * @apiSuccess {String} urlYouTube Artist urlYouTube
 * @apiSuccess {String} urlSpotify Artist urlSpotify
 * @apiSuccess {String} urlPureVolume Artist urlPureVolume
 * @apiSuccess {String} urlRateYourMusic Artist urlRateYourMusic
 * @apiSuccess {String} urlSoundCloud Artist urlSoundCloud
 * @apiSuccess {String} id_artist_musicbrainz Artist id_artist_musicbrainz
 * @apiSuccess {String} disambiguation Artist disambiguation
 * @apiSuccess {String} type Artist type : {Person, Orchestra, Group, Choir, Character, Other, ""}
 * @apiSuccess {String} gender Artist gender : {Male, Female, Other, ""}
 * 
 * @apiSuccess {Object} lifeSpan Object lifeSpan
 *  @apiSuccess {Boolean} lifeSpan.ended lifeSpan ended
 *  @apiSuccess {String} lifeSpan.begin lifeSpan begin
 *  @apiSuccess {String} lifeSpan.end lifeSpan end
 * 
 * @apiSuccess {Object} location Object location
 *  @apiSuccess {String} location.id_city_musicbrainz location id_city_musicbrainz
 *  @apiSuccess {String} location.country location country
 *  @apiSuccess {String} location.city location city
 * 
 * @apiSuccess {Object} endArea Object endArea
 *  @apiSuccess {String} endArea.id endArea id
 *  @apiSuccess {String} endArea.name endArea name
 *  @apiSuccess {String} endArea.disambiguation endArea disambiguation
 *
 * @apiSuccess {String} animux_path Artist animux path
 * @apiSuccess {String} rdf Artist rdf
 */

/**
 * @api {get} apidoc/#api-Api_Fields-ALL_FIELDS_ALBUM All album's fields
 * @apiVersion 1.0.0
 * @apiName ALL_FIELDS_ALBUM
 * @apiGroup Api Fields
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} _id Album id
 * @apiSuccess {String} name Artist name
 * @apiSuccess {String} title Album title
 * @apiSuccess {String} publicationDate Album publicationDate
 * @apiSuccess {String} genre Album genre
 * @apiSuccess {String} length Album length
 * @apiSuccess {String} id_artist Artist id
 * @apiSuccess {String} urlAlbum url to lyricsWikia
 * @apiSuccess {String} urlWikipedia url to wikipedia
 * @apiSuccess {String} urlITunes url to urlITunes
 * @apiSuccess {String} urlAmazon url to urlAmazon
 * @apiSuccess {String} urlSpotify url to urlSpotify
 * @apiSuccess {String} urlAllmusic url to urlAllmusic
 * @apiSuccess {String} urlMusicBrainz url to urlMusicBrainz
 * @apiSuccess {String} urlDiscogs url to urlDiscogs
 * 
 * @apiSuccess {Object[]} wordCount count all identical words for all musics of this album
 *  @apiSuccess {String} wordCount._id A word
 *  @apiSuccess {Number} wordCount.value Number of this word
 * 
 * @apiSuccess {String} rdf Album rdf
 */

/**
 * @api {get} apidoc/#api-Api_Fields-ALL_FIELDS_SONG All song's fields
 * @apiVersion 1.0.0
 * @apiName ALL_FIELDS_SONG
 * @apiGroup Api Fields
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} _id Song id
 * @apiSuccess {String} name Artist name
 * @apiSuccess {Number} position Track number
 * @apiSuccess {String} albumTitle Album title
 * @apiSuccess {String} lengthAlbum Album length
 * @apiSuccess {String} publicationDateAlbum Album release
 * @apiSuccess {String} title Song title
 * @apiSuccess {String} urlSong Url to lyricsWikia
 * @apiSuccess {String} lyrics Song lyrics
 * @apiSuccess {String} language_detect Song language
 * @apiSuccess {String} urlWikipedia Song urlWikipedia
 * @apiSuccess {String} id_album Artist id
 * @apiSuccess {String} rdf Song rdf
 * @apiSuccess {String[]} format Song format
 * @apiSuccess {String[]} genre Song genre
 * @apiSuccess {String[]} producer Song producer
 * @apiSuccess {String[]} recordLabel Song recordLabel
 * @apiSuccess {String[]} writer Song writer
 * @apiSuccess {String[]} recorded Song recorded
 * @apiSuccess {String} abstract Song abstract
 * @apiSuccess {String[]} releaseDate Song release date
 * @apiSuccess {String[]} runtime Song runtime
 * @apiSuccess {String[]} award Song award
 * @apiSuccess {String[]} subject Song subject
 *
 * @apiSuccess {Object[]} wordCount Count all identical words for this music
 *  @apiSuccess {String} wordCount._id A word
 *  @apiSuccess {Number} wordCount.value Number of this word
 * 
 * @apiSuccess {Boolean} isClassic Song isClassic
 * @apiSuccess {String} urlYouTube Song urlYouTube
 * @apiSuccess {String} multitrack_path Song multitrack_path
 * @apiSuccess {String} multitrack_file Song multitrack_file
 * @apiSuccess {String} urlITunes Song urlITunes
 * @apiSuccess {String} urlAmazon Song urlAmazon
 * @apiSuccess {String} urlGoEar Song urlGoEar
 * @apiSuccess {String} urlSpotify Song urlSpotify
 * @apiSuccess {String} urlAllmusic Song urlAllmusic
 * @apiSuccess {String} urlMusicBrainz Song urlMusicBrainz
 * @apiSuccess {String} urlHypeMachine Song urlHypeMachine
 * @apiSuccess {String} urlLastFm Song urlLastFm
 * @apiSuccess {String} urlPandora Song urlPandora
 * @apiSuccess {String} animux_path Song animux path
 * @apiSuccess {String} animux_content Song animux content
 */

export default router;