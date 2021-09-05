'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const server = express();
server.use(cors());
const axios = require ('axios');
const PORT = process.env.PORT;

mongoose.connect(`${process.env.MONGO_LINK}`, {useNewUrlParser: true, useUnifiedTopology: true});


server.get('/movies2',handleGetMovieData);

const movieSchema = new mongoose.Schema({
    title: String,
    overview:String
  });

  const moviesModel = mongoose.model('movies', movieSchema);
  let arr =[];


async function handleGetMovieData (req,res) {
    let query = req.query.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_KEY}&query=${query}`
    let movieData= await axios.get(url);
    console.log('hhhhhhhhhhhhh',movieData.data);
    movieData.data.results.map(movie=>{
        let newMovie=new movies (movie.title,movie.overview);
        arr.push(newMovie);

    })
    res.send(arr);
    seedMovieData()

}

function seedMovieData () {
    arr.map(item=>{
    const movie = new moviesModel({
        title:item.title,
        overview:item.overview
    
        })
        movie.save();
    })

}

class movies {
    constructor(movieName, overview){
        this.movieName=movieName;
        this.overview=overview;
    }
}

server.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
});


