require("dotenv").config();


var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request"); 
var fs= require("fs");
var keys = require("./keys.js");


//var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var valueArray = [];
var inputCommand = process.argv[2];
var commandParam = process.argv[3];



switch (inputCommand) {
    case "my-tweets" : callingTwitter() ;
    break;

    case "spotify-this-song" : callingSpotify(commandParam);
    break;

    case "movie-this" : movie(commandParam);
    break;

    case "do-what-it-says" : doWhatItSays();
    break; 
};


// my-tweets 
function callingTwitter() {
    var params = {screen_name: 'jincygeorge8388', count: 20, exclude_replies:true, trim_user:true};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
				if (!error) {
					//console.log(tweets);
					tweetsArray = tweets;

					for(i=0; i<tweetsArray.length; i++){
						console.log("Created at: " + tweetsArray[i].created_at);
						console.log("Text: " + tweetsArray[i].text);
						console.log('--------------------------------------');
					}
				}
				else{
					console.log(error);
				}
	});
      
};

//spotify 
function callingSpotify(commandParam){
    //var spotify = new Spotify(keys.spotifyKeys);
    
    if (!commandParam){
        commandParam = 'The Sign';
    }
    spotify.search({ type: 'track', query: commandParam }, function(err, data) {
        if (err){
            console.log('Error occurred: ' + err);
            return;
        }



        var song = data.tracks.items[0];
        console.log("------Artists-----");
        for(i=0; i<song.artists.length; i++){
            console.log(song.artists[i].name);
        }
    
        console.log("------Song Name-----");
        console.log(song.name);
    
        console.log("-------Preview Link-----");
        console.log(song.preview_url);
    
        console.log("-------Album-----");
        console.log(song.album.name);


});
};

//movie 
function movie(commandParam) {
    var queryUrl = "http://www.omdbapi.com/?t=" + commandParam + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function(error, response, body) {
		if (!commandParam){
        	commandParam = 'Mr. Nobody';
    	}
		if (!error && response.statusCode === 200) {

		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		}
	});


};

//doWhatItSays

function doWhatItSays() {
    fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		// Then split it by commas (to make it more readable)
		var dataArr = data.split(",");

		// Each command is represented. Because of the format in the txt file, remove the quotes to run these commands. 
		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			callingSpotify(songcheck);
		} else if (dataArr[0] === "my-tweets") {
			
			callingTwitter();
		} else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		} 
		
  	});
}

