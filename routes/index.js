'use strict';

const unirest = require('unirest');
const qs = require('qs');
const auth = require('../auth.json');

const default_options = {
    search_games: {
        fields: 'name,aggregated_rating,rating,rating_count,cover',
        filter: {
            rating_count: {
                exists: true
            }
        },
        limit: '5',
        offset: '',
        order: 'rating_count:desc',
        search: ''
    },

    search_games_gb: {
        api_key: auth.giantbomb.key,
        format: 'json',
        field_list: 'id,name',
        limit: 1,
        resources: 'game'
    },

    search_game: {
        api_key: auth.giantbomb.key,
        format: 'json',
        field_list: 'id,name,releases,deck'
    },

    search_reviews: {
        api_key: auth.giantbomb.key,
        format: 'json',
        field_list: 'site_detail_url,game,deck,reviewer,score',
        limit: 2,
    }
}

module.exports = function (req, res) {
    if (Object.keys(req.query).length > 0) search_games(req, res, {
        search_games: {
            fields: default_options.search_games.fields,
            filter: default_options.search_games.filter,
            limit: (typeof req.query['limit'] !== 'undefined') ? req.query['limit'] : default_options.search_games.limit,
            offset: (typeof req.query['offset'] !== 'undefined') ? req.query['offset'] : default_options.search_games.offset,
            order: default_options.search_games.order,
            search: (typeof req.query['search'] !== 'undefined') ? req.query['search'] : default_options.search_games.search
        },

        search_games_gb: default_options.search_games_gb,
        search_game: default_options.search_game,
        search_reviews: default_options.search_reviews
    });
    else search_games(req, res, default_options);
}

function search_games(req, res, options) { // entrypoint function: level 1
    function return_result(result) { // callback which links to the next level of the chain
        search_games_gb(req, res, options, {
            games: result
        }); // next level
    }

    clear(options.search_games);

    var query = qs.stringify(options.search_games);
    var url = auth.igdb.endpoint + 'games/?' + query;
    get_request(url, return_result);
}

function search_games_gb(req, res, options, results) { // midway function: level 2
    var return_results = {};
    var return_reviews = {};

    results.game_details = {}
    results.reviews = {};
    clear(options.search_games_gb);
    clear(options.search_reviews);

    for (var i = 0; i < results.games.length; i++) {
        return_reviews[i] = {
            id: i,
            process: function (game_details, review, id) { // callback linking down two levels of chain
                results.game_details[id] = game_details;
                results.reviews[id] = review.results;
                if (Object.keys(results.reviews).length === Object.keys(results.games).length) display_page(req, res, results); // end chain and display page
            }
        }

        return_results[i] = function (result, id) { // callback which links to the next level of the chain
            console.log(return_reviews);
            search_game(req, res, options, result.results, return_reviews[id]) // next level
        }

        options.search_games_gb.query = '"' + results.games[i].name + '"';

        var query = qs.stringify(options.search_games_gb);
        var url = auth.giantbomb.endpoint + 'search/?' + query;
        get_request(url, return_results[i], i);
    }
}

function search_game(req, res, options, game_search, callback) {  // midway function: level 3
    function return_result(result) { // callback which links to the next level of the chain
        search_reviews(req, res, options, result.results, callback) // next level
    }

    clear(options.search_reviews);

    var query = qs.stringify(options.search_game);
    var url = auth.giantbomb.endpoint + 'game/3030-' + game_search[Object.keys(game_search)[0]].id + '?' + query;
    get_request(url, return_result);
}

function search_reviews(req, res, options, game_details, callback) { // midway function: level 4
    function return_result(result) { // callback which links to the next level of the chain
        search_steam(req, res, options, game_details, result, callback);
    }

    if (typeof game_details.releases === 'undefined') search_steam(req, res, options, game_details, { results: [ {deck: 'No reviews found!'}] }, callback);
    else {
        options.search_reviews.filter = 'object:3050-' + game_details.releases[Object.keys(game_details.releases)[0]].id;
        var query = qs.stringify(options.search_reviews);
        var url = auth.giantbomb.endpoint + 'user_reviews/?' + query;
        get_request(url, return_result);
    }
}

function search_steam(req, res, options, game_details, review, callback) { // midway function: level 5
    function return_result(result) { // callback which links to the next level of the chain
        var appid = 'none';

        for (var i = 0; i < result['applist']['apps'].length; i++) {
            if (result['applist']['apps'][i].name === game_details.name) appid = result['applist']['apps'][i]['appid'];
        }

        game_details.appid = appid;
        callback.process(game_details, review, callback.id) // return back to level 2
    }
    var url = auth.steamweb.endpoint + 'ISteamApps/GetAppList/v2/?format=\'json\''
    get_request(url, return_result);
}

function display_page(req, res, parameters) { // endpoint function
    res.render('index.ejs', parameters);
}


// ----- helper functions -----

function get_request(url, callback, id) { // returns the specified page
    function return_result(result) {
        console.log(url);
        console.log('\x1b[91mSTATUS CODE --- ' + result.status + '\x1b[32m');
        if (id !== '' || typeof id !== 'undefined') callback(result.body, id)
        else callback(result.body);
    }
    if (url.includes(auth.igdb.endpoint)) {
        unirest.get(url)
            .header('X-Mashape-Key', auth.igdb.key.testing)
            .header('Accept', 'application/json')
            .end(function (result) {
                return_result(result);
            });
    } else if (url.includes(auth.giantbomb.endpoint)) {
        unirest.get(url)
            .header('User-Agent', 'Bot for Giant Bomb to get reviews for games.')
            .end(function (result) {
                return_result(result);
            });
    } else {
        unirest.get(url)
            .end(function (result) {
                return_result(result);
            });
    }
}

function clear(array) { // remove any blank entries before stringifying a query
    for (var i in array) {
        if (array[i] === null || array[i] === undefined || array[i] === '') {
            delete array[i];
        }
    }

    return array;
}