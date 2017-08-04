/* @flow */
import express, {Router} from 'express';
import config from 'config';
import logger, {capitalizeFirstLetter} from '../utils';
import redis from '../redis';
import axios from 'axios';

const router = Router();
const CACHE_EXPIRE = config.get('redis.cacheExpire');

router.get('/', (req, res, next) => {
	res.json('api server running');
});

/* GET colors. */
router.get('/colors/:brand', (req, res, next) => {
	const brand = req.params.brand;
	if(config.has(brand))
	{
		const COLORS_URL = config.get((`${brand}.colorsUrl`));
		redis.getAsync(`${brand}Color`).then(reply => {
			if(reply){
				logger.info(`${brand}color cache hit`);
				res.json(JSON.parse(reply));
			}
			else {
				logger.info(`${brand}color cache miss`);
				axios({method: 'get', url: COLORS_URL}).then(response => {
					redis.setex(`${brand}Color`,CACHE_EXPIRE,JSON.stringify(response.data));
					res.json(response.data);
				}).catch((error) => {
					logger.error(`Failed to get url ${COLORS_URL}`);
				});
			}
		});
	}
	else {
		const err = new Error('Brand Not Found');
		err.status = 404;
		next(err);
	}
});

router.post('/search/:brand',(req, res, next) =>  {
	const brand = req.params.brand;
	if(config.has(brand))
	{
		const SEARCH_URL = config.get(`${brand}.search.url`);
		const SEARCH_FILTER = config.get(`${brand}.search.filter`);
		const ITEM_LIMIT = config.get(`${brand}.search.limit`);

		let postSearchUrl = SEARCH_URL;
		if(req.body && req.body.colors)
		{
			const arrColors = req.body.colors;
			logger.info('arrColors',arrColors);
			arrColors.forEach((color) => {
				postSearchUrl = postSearchUrl +  SEARCH_FILTER + capitalizeFirstLetter(color);
			});
		}

		logger.info(`${brand} postSearchUrl`,postSearchUrl);
		redis.getAsync(postSearchUrl).then(reply => {
			if(reply){
				logger.info(`${brand}search cache hit`);
				res.json(JSON.parse(reply));
			}
			else {
				logger.info(`${brand}search cache miss`);
				axios({method: 'post', url: postSearchUrl}).then(response => {
					logger.info('No of returned hits: ',response.data.hits.length);
					const hits =response.data.hits.slice(0,ITEM_LIMIT);
					redis.setex(postSearchUrl,CACHE_EXPIRE,JSON.stringify( hits));
					res.json(hits);
				}).catch((error) => {
					logger.error(`Failed to post url ${postSearchUrl}`);
				});
			}
		});

	}else {
		const err = new Error('Brand Not Found');
		err.status = 404;
		next(err);
	}
});

export default router;
