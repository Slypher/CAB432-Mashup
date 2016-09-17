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
        limit: '2',
        offset: '',
        order: 'aggregated_rating:desc',
        search: ''
    },

    search_games_gb: {
        api_key: auth.giantbomb.key,
        format: 'json',
        field_list: 'site_detail_url,id,name,deck,api_detail_url',
        limit: 2,
        resources: 'game'
    },

    search_reviews: {
        api_key: auth.giantbomb.key,
        format: 'json',
        field_list: 'site_detail_url,game,deck,reviewer,score',
        limit: 2,
    }
}

module.exports = function (req, res) {
    if (req.query['fields']) search_games(req, res, {
        search_games: {
            fields: req.query['fields'],
            filter: req.query['filter'],
            limit: req.query['limit'],
            offset: req.query['offset'],
            order: req.query['order'],
            search: req.query['search']
        },

        search_reviews: default_options.search_games_gb
    });
    else search_games(req, res, default_options);
}

function search_games(req, res, options) { // entrypoint function: level 1
    function return_result(req, res, result) { // callback which links to the next level of the chain
        //display_page(req, res, {games: result});
        search_reviews(req, res, options, {
            games: result
        }); // next level
    }

    clear(options.search_games);

    var query = qs.stringify(options.search_games);
    var url = auth.igdb.endpoint + 'games/?' + query;
    get_request(req, res, url, return_result);
}
``
var total_results;

function search_reviews(req, res, options, results) { // midway function: level 2
    total_results = results;
    total_results.game_search = {};
    total_results.reviews = {};

    function return_search_result(req, res, result) { // callback which links to the next level of the chain
        total_results.game_search[Object.keys(total_results.game_search).length] = result.results;

        var query = qs.stringify(options.search_reviews);
        var url = auth.giantbomb.endpoint + 'reviews/3030-' + result.results[result.results.length - 1].id + '/?' + query;
        get_request(req, res, url, return_review_result);
    }

    function return_review_result(req, res, result) { // callback which links to the next level of the chain
        total_results.reviews[Object.keys(total_results.reviews).length] = result.results;
        if (Object.keys(total_results.reviews).length == total_results.games.length) display_page(req, res, total_results); // next level
    }

    clear(options.search_games_gb);
    clear(options.search_reviews);

    for (var i = 0; i < total_results.games.length; i++) {
        options.search_games_gb.query = '"' + total_results.games[i].name + '"';

        var query = qs.stringify(options.search_games_gb);
        var url = auth.giantbomb.endpoint + 'search/?' + query;
        get_request(req, res, url, return_search_result);
    }


}


function display_page(req, res, parameters) { // endpoint function: level 3
    console.log('\n\x1b[91m-----PARAMETERS-----\x1b[32m')
    console.log(parameters);
    console.log(parameters.game_search['0'], parameters.game_search['1']);
    console.log(parameters.reviews['0'], parameters.reviews['1']);
    res.render('index.ejs', parameters);
}


// ----- helper functions -----

function get_request(req, res, url, callback) { // returns the specified page
    function return_result(result) {
        console.log('\n\x1b[91mSTATUS CODE --- ' + result.status + '\x1b[32m\n');

        //if (result.body.results) for (var i = 0; i < result.body.results.length; i++) console.log(Object.getOwnPropertyNames(result.body.results[i]));
        //else for (var i = 0; i < result.body.length; i++) console.log(Object.getOwnPropertyNames(result.body[i]));
        console.log(result.body);
        callback(req, res, result.body);
    }
    console.log(url);
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