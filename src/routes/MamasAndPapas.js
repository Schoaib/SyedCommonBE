/* @flow */
import express, {Router} from 'express';
import axios from 'axios';
import config from 'config';
import redis from '../redis';
import {capitalizeFirstLetter} from '../utils';

const router = Router();
const COLORS_URL = config.get('MamasAndPapas.colorsUrl');
const CACHE_EXPIRE = config.get('redis.cacheExpire');
const SEARCH_URL = config.get('MamasAndPapas.search.url');
const SEARCH_FILTER = config.get('MamasAndPapas.search.filter');
const ITEM_LIMIT = config.get('MamasAndPapas.search.limit');

/* GET colors. */
router.get('/colors', (req, res, next) => {
	redis.get('MamasAndPapasColor', (err, reply) => {
		if(reply){
			res.json(reply);
		}
		else {
			axios({method: 'get', url: COLORS_URL}).then(response => {
				redis.setex('MamasAndPapasColor',CACHE_EXPIRE, response.data);
				res.json(response.data);
			}).catch((error) => {
				next(error);
			});
		}
	});

});

router.post('/search',(req, res, next) =>  {
	let postSearchUrlUrl = SEARCH_URL;
	if(req.body && req.body.color)
	{
		postSearchUrlUrl = SEARCH_URL + SEARCH_FILTER + capitalizeFirstLetter(req.body.color);
	}
	console.log('postSearchUrlUrl',postSearchUrlUrl);
	redis.get('MamasAndPapasSearchUrl', (err, reply) => {
		if(reply){
			res.json(reply);
		}
		else {
			axios({method: 'post', url: postSearchUrlUrl}).then(response => {
				let hits =response.data.hits.slice(0,ITEM_LIMIT);
				redis.setex('MamasAndPapasSearchUrl',CACHE_EXPIRE, hits);
				res.json(hits);
			}).catch((error) => {
				next(error);
			});
		}
	});
});


export default router;
