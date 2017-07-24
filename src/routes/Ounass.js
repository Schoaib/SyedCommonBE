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
			res.json(reply);
		}
		else {
			axios({method: 'get', url: COLORS_URL}).then(response => {
				redis.setex('OunassColor',CACHE_EXPIRE, response.data);
				res.json(response.data);
			}).catch((error) => {
				next(error);
			});
		}
	});

});

router.post('/search',(req, res, next) =>  {
	let postSEARCH_URLUrl = SEARCH_URL;
	if(req.body && req.body.color)
	{
		postSEARCH_URLUrl = SEARCH_URL + SEARCH_FILTER + capitalizeFirstLetter(req.body.color);
	}
	redis.get('OunassSEARCH_URL', (err, reply) => {
		if(reply){
			res.json(reply);
		}
		else {
			axios({method: 'post', url: postSEARCH_URLUrl}).then(response => {
				let hits =response.data.hits.slice(0,ITEM_LIMIT);
				redis.setex('OunassSEARCH_URL',CACHE_EXPIRE, hits);
				res.json(hits);
			}).catch((error) => {
				next(error);
			});
		}
	});
});


export default router;
