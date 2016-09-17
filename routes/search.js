'use strict';

const unirest = require('unirest');
const qs = require('qs');
const auth = require('../auth.json');

var search_reviews = {
        api_key: auth.giantbomb.key,
        format: 'json',
        field_list: 'name,id,reviews,deck,api_detail_url',
        limit: 2
    }

module.exports = function (req, res) {
    var query = qs.stringify(search_reviews);
    var url = auth.giantbomb.endpoint + 'game/3030-24035/?' + query;
    unirest.get(url)
        .header('User-Agent', 'Bot for Giant Bomb to get reviews for games.')
        .end(function (result) {
            console.log(result.body);
            console.log(result.body.results.reviews);
            res.render('index.ejs', {games: [ { name: 'dummy game' } ], reviews: result.body.results})
        });
}