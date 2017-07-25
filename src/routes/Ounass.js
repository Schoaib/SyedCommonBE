/* @flow */
import express, {Router} from 'express';
import axios from 'axios';
import config from 'config';
import redis from '../redis';
import {capitalizeFirstLetter} from '../utils';

const router = Router();
const COLORS_URL = config.get('Ounass.colorsUrl');
const CACHE_EXPIRE = config.get('redis.cacheExpire');
const SEARCH_URL = config.get('Ounass.search.url');
const SEARCH_FILTER = config.get('Ounass.search.filter');
const ITEM_LIMIT = config.get('Ounass.search.limit');

/* GET colors. */
router.get('/colors', (req, res, next) => {
	redis.get('OunassColor', (err, reply) => {
		if(reply){
			console.log('color cache hit');
			res.json(JSON.parse(reply));
		}
		else {
			console.log('color cache hit');
			axios({method: 'get', url: COLORS_URL}).then(response => {
				redis.set('OunassColor', JSON.stringify(response.data));
				res.json(response.data);
			}).catch((error) => {
				next(error);
			});
		}
	});

});

router.post('/search',(req, res, next) =>  {
	let postSearchUrl = SEARCH_URL;
	if(req.body && req.body.color)
	{
		postSearchUrl = SEARCH_URL + SEARCH_FILTER + capitalizeFirstLetter(req.body.color);
	}
	console.log('postSearchUrl',postSearchUrl);
	redis.get(postSearchUrl, (err, reply) => {
		if(reply){
			console.log('search cache hit')
			res.json(JSON.parse(reply));
		}
		else {
			console.log('search cache miss')
			axios({method: 'post', url: postSearchUrl}).then(response => {
				let hits =response.data.hits.slice(0,ITEM_LIMIT);
				redis.setex(postSearchUrl,CACHE_EXPIRE,JSON.stringify( hits));
				res.json(hits);
			}).catch((error) => {
				next(error);
			});
		}
	});
});


export default router;
