# MAPS SYNC

Project for KMS Lighthouse frontend sync event.

## Purpose of this project

This project is designed to demonstrate typical use cases of online maps. Part of the report on the subject of online 
maps.

## How to start

0. Make sure, that `node.js` (tested with v16) and `yarn` (tested with 1.22) are installed. Or you can use 
   `docker` (tested with 20.10.22) and `docker-compose` (tested with 2.14.1); 

1. Acquire your maptiler key by registering account at [maptiler cloud](https://cloud.maptiler.com/);

2. Create a copy of `config.example.json` named `config.json`. Replace `get-your-key-at-maptiler-dot-com` with key, 
   acquired in first step;

3. Run `yarn install` and `yarn start` or `docker-compose run builder`;

4. Open `docs/maps-sync/1.0.0/index.html` in your browser.

## What's next

After you opened `index.html` you will see tutorials dropdown on the left side of page. Click it and then 
select tutorial you want to see.

## How build works

The main idea of this project is to use jsdoc functionality to build pages, where you can see both: source code
and working map, that is created by this source code. To achieve this, we are using next things:

1. `gulp-change` plugin - to inject contents of `*.ts` into corresponding html for tutorials. And also, we are inserting 
   relative link to builded bundle, that contains code, that will be executed in this tutorial;
   
2. `webpack` - to build tutorials bundle;
   
3. `jsdoc` - to generate tutorials pages from intermediates, created by `gulp-change`;
   
4. And `gulp-run` and other gulp tasks - to put this all together in one yarn command.

## License

This project is licensed under MIT license. Except geo data, used in tutorials (data located in `assets` and `public`
catalogs). 

Sources of geodata used in tutorials displayed in builded tutorials in corresponding attributions fields.
