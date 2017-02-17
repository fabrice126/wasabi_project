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
 * @apiSuccess {String} activeYears Artist activeYears
 * @apiSuccess {String[]} genres Artist genres
 * @apiSuccess {String[]} labels Artist labels
 * 
 * @apiSuccess {Object[]} members Members object
 *  @apiSuccess {String} members.name Members name
 *  @apiSuccess {String[]} members.instruments Members instruments
 *  @apiSuccess {String[]} members.activeYears Members activeYears
 * 
 * @apiSuccess {Object[]} formerMembers FormerMembers object
 *  @apiSuccess {String} formerMembers.name FormerMembers name
 *  @apiSuccess {String[]} formerMembers.instruments FormerMembers instruments
 *  @apiSuccess {String[]} formerMembers.activeYears FormerMembers activeYears
 * 
 *
 * @apiSuccess {Object[]} wordCount count all identical words for all musics of this artist
 *  @apiSuccess {String} wordCount._id A word
 *  @apiSuccess {Number} wordCount.value Number of this word
 * 
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
 * @apiSuccess {String} titre Album titre
 * @apiSuccess {String} dateSortie Album dateSortie
 * @apiSuccess {String} genre Album genre
 * @apiSuccess {String} length Album length
 * @apiSuccess {String} id_artist Artist id
 * @apiSuccess {String} urlAlbum url to lyricsWikia
 * @apiSuccess {String} urlWikipedia url to wikipedia
 * @apiSuccess {Object[]} wordCount count all identical words for all musics of this album
 *  @apiSuccess {String} wordCount._id A word
 *  @apiSuccess {Number} wordCount.value Number of this word
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
 * @apiSuccess {String} albumTitre Album title
 * @apiSuccess {String} lengthAlbum Album length
 * @apiSuccess {String} dateSortieAlbum Album release
 * @apiSuccess {String} titre Song titre
 * @apiSuccess {String} urlSong Url to lyricsWikia
 * @apiSuccess {String} lyrics Song lyrics
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
 * @apiSuccess {String} urlYoutube Song urlYoutube
 * @apiSuccess {Boolean} isClassic Song isClassic
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
 * 
 */

export default router;