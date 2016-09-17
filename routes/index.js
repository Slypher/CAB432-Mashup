'use strict';

const unirest = require('unirest');
const qs = require('qs');
const auth = require('../auth.json');

module.exports = function (req, res) {
    console.log(req.query);
    if (req.query['fields']) search_games(req, res, {
        fields: req.query['fields'],
        filter: req.query['filter'],
        limit: req.query['limit'],
        offset: req.query['offset'],
        order: req.query['order'],
        search: req.query['search']
    });
    else search_games(req, res, {
        fields: '*',
        filter: {
            rating_count: {
                exists: true
            }
        },
        limit: '1',
        offset: '',
        order: 'aggregated_rating:desc',
        search: ''
    });
}

function search_games(req, res, options) {
    for (var i in options) {
        if (options[i] === null || options[i] === undefined || options[i] === '') {
            delete options[i];
        }
    }

    var query = qs.stringify(options);
    var url = auth.igdb.endpoint + 'games/?' + query;
    console.log(url);
    unirest.get(url)
        .header('X-Mashape-Key', auth.igdb.key.testing)
        .header('Accept', 'application/json')
        .end(function (result) {
            console.log(result.headers['x-ratelimit-requests-remaining'] + ' remaining requests\n', result.body);
            if (result.body.screenshots) for (var i = 0; i < result.body.screenshots; i++) console.log(result.body.screenshots[i])
            res.render('index.ejs', { games: result.body });
        });
}