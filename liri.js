//Axios and Spotify npm package
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");

//fs is a core Node package for reading and writing files
var fs = require("fs");
var choice = process.argv[2];
var input = process.argv.slice(3).join(" ");

switch (choice) {
  case "concert-this":
    axios
      .get(
        "https://rest.bandsintown.com/artists/" +
          input +
          "/events?app_id=codingbootcamp"
      )
      .then(function(response) {
        for (var i = 0; i < response.data.length; i++) {
          console.log("\nEvent " + parseInt(i + 1) + ":");
          console.log("Venue: " + response.data[i].venue.name);
          console.log(
            "Location: " +
              response.data[i].venue.city +
              ", " +
              response.data[i].venue.country
          );
          console.log("Time: " + response.data[i].datetime);
        }
      });

    break;
  case "spotify-this-song":
    if (input === "") {
      input = "The Sign";
    }
    spotify.search({ type: "track", query: input, limit: 20 }, function(
      err,
      data
    ) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      for (var i = 2; i < Math.min(5, data.tracks.items.length); i++) {
        console.log("\nSong " + parseInt(i - 1) + ":");
        console.log("Artist(s): " + data.tracks.items[i].album.artists[0].name);
        console.log("Name: " + data.tracks.items[i].name);
        data.tracks.items[i].preview_url === null
          ? console.log("No Preview URL.")
          : console.log("Preview URL: " + data.tracks.items[i].preview_url);
        console.log("Album: " + data.tracks.items[i].album.name);
      }
    });
    break;

  case "movie-this":
    if (input === "") {
      input = "Mr. Nobody";
    }
    axios
      .get(
        "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=4cbdc417"
      )
      .then(function(response) {
        console.log("Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log(
          "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value
        );
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
      });
    break;

  case "do-what-it-says":
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }
      var textArr = data.split(",");
      spotify.search({ type: "track", query: textArr[1], limit: 20 }, function(
        err,
        data
      ) {
        if (err) {
          return console.log("Error occurred: " + err);
        }
        console.log("Artist(s): " + data.tracks.items[1].album.artists[0].name);
        console.log("Name: " + data.tracks.items[2].name);
        console.log("Preview URL: " + data.tracks.items[2].preview_url);
        console.log("Album: " + data.tracks.items[2].album.name);
      });
    });
    break;
  default:
    console.log("Invalid input.");
}
