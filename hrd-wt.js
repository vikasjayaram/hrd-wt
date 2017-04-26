"use strict";

 const jwt     = require('jsonwebtoken');
 const moment  = require('moment');
 const request = require('request');
 const express = require('express');
 const Webtask = require('webtask-tools');
 const async   = require('async');
 const _       = require('lodash');
 const app     = express();

 /*
 * Local variables
 */
 let accessToken = null;
 let lastLogin = null;

 app.get('/', function (req, res) {
   if (!req.query['domain']){ return res.status(401).json({ error: 'domain is required.'}); }
   const context = req.webtaskContext;
   context.domain = req.query.domain;
   async.waterfall([
     async.apply(getAccessToken, context),
     getConnections,
     filterConnection
   ], function (err, result) {
     if (err) return res.status(400).json({error: err});
     return res.status(200).json(result);
   });
 });

/*
* Request a Auth0 access token every 30 minutes
*/

function getAccessToken(context, cb) {
   if (!accessToken || !lastLogin || moment(new Date()).diff(lastLogin, 'minutes') > 30) {
     const options = {
       url: 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/oauth/token',
       json: {
         audience: 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/api/v2/',
         grant_type: 'client_credentials',
         client_id: context.data.CLIENT_ID,
         client_secret: context.data.CLIENT_SECRET
       }
     };

     return request.post(options, function(err, response, body){
       if (err) return cb(err);
       else {
         lastLogin = moment();
         accessToken = body.access_token;
         context.accessToken = accessToken;
         return cb(null, context);
       }
     });
   } else {
     return cb(null, context);
   }
 };

/*
* Get the connections read:connections scope
*/
function getConnections(context, cb){
   const options = {
     url: 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/api/v2/connections',
     json: true,
     headers: {
       authorization: 'Bearer ' + context.accessToken
     }
   };

  request.get(options, function(error, response, connections){
     return cb(error, context, connections);
   });
 };

function filterConnection(context, connections, cb) {
  //var con = connections.filter(c => c.options.domain_aliases).filter(el => el.options.domain_aliases.filter(d => d === context.domain).length > 0).shift();
  var con = 
    connections
    .filter(c=>c.strategy==='auth0')
    .filter(c=>c.options.domain_aliases)
    .filter(el=>el.options.domain_aliases.filter(d=>d===context.domain).length>0)
    .shift()
  cb(null, con);
}

module.exports = Webtask.fromExpress(app);