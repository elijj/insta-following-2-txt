const path = require('path');
var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');

const { username, password } = require('./cookies/credentials.json');
const Client = require('instagram-private-api').V1;

const device = new Client.Device(username);
const storage = new Client.CookieFileStorage(path.join(__dirname, 'cookies', `${username}.json`));

var logger = fs.createWriteStream('user.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

var session = Client.Session.create(device, storage, username, password)
  .then((session) => {
    //return [session, Client.Account.searchForUser(session, 'natgeo')]; // natgeo this time :)
  	//return [Feed.AccountFollowers(session, '787132')];
  	return [session,session.getAccount()]
  })
  .spread((session, account) => {
    console.log(account.id);
    return new Client.Feed.AccountFollowing(session, account.id);
  })
  .then((feed) => {
    feed.get()
		.then(function(d){

			d.forEach(function(user){
				logger.write(user.params.username + ',')
			})
			console.log(d.length)
			//console.log(d)
			//console.log(feed.isMoreAvailable())
	
		})
  })
/*

var session = new Client.Session(device, storage)

var account = session.getAccount()

var feed = new Client.Feed.AccountFollowers(session, '7855687');


feed.get()
.then(function(d){

	d.forEach(function(user){
		console.log(user.params)
	})
	console.log(d.length)
})*/