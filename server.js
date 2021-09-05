'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const server = express();
server.use(cors());
const axios = require ('axios');
const PORT = process.env.PORT;
server.use(express.json());


mongoose.connect(`${process.env.MONGO_LINK}`, {useNewUrlParser: true, useUnifiedTopology: true});


server.get('/movies2',handleGetMovieData);
server.post('/addmovies',handleAddingData);
server.delete('/deletemovies/:movieID', deletingData);
server.put('/updatemovies/:movieID',handleUpdatingData);

const movieSchema = new mongoose.Schema({
    title: String,
    overview:String,
    email:String
  });

  const moviesModel = mongoose.model('movies', movieSchema);
  let arr =[];


async function handleGetMovieData (req,res) {
    let query = req.query.query;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_KEY}&query=${query}`
    let movieData= await axios.get(url);
    console.log('hhhhhhhhhhhhh',movieData.data);
    movieData.data.results.map(movie=>{
        let newMovie=new movies (movie.title,movie.overview,'tasneem.alabsi@gmail.com');
        arr.push(newMovie);

    })
    res.send(arr);
    // seedMovieData()

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

async function handleAddingData(req,res){
try {
    let {title,overview,email} = req.body

    await moviesModel.create({title:title,overview:overview,email:email});

    moviesModel.find({email},function(error,movieData){
        if (error) {
            console.log('error in getting the data');
        }
        else {
            res.send(movieData)
        }
    })}
    catch (error) {
        console.log(error);
    }

}

 function deletingData (req,res){

    let email = req.query.email;
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',email);
    let movieID = req.params.movieID;
    console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',movieID);
    
    moviesModel.remove({_id:movieID},(error,movieData1)=>{
        if (error) {
            console.log('error in deleting the data');
        }
        else {
            res.send(movieData1)
        }
    })
    moviesModel.find({email},function(error,movieData){
        if(error){
            console.log('error in getting the data after delete');
        }
        else {
            res.send(movieData);
        }
    })
}

//  function handleDeletingData(req,res) {
    
//     let email= req.query.email;
//     console.log(req.params);
//     let movieID = req.params.movieID;
//     console.log(movieID);
    
    
//     moviesModel.remove({_id:movieID},(error,movieData1)=>{
//         if(error) {
//             console.log('error in deleteing the data',error)
//             // console.log();
//         } else {
//             console.log('data deleted', movieData1)
//              moviesModel.find({email}, function (error, movieData) {
//                 if (error) {
//                     console.log('error in getting the data')
//                 } else {
//                     res.send(movieData)
//                 }
//             })
//         }
//     })
  
//   }

function handleUpdatingData (req,res){
    let {title, overview, email}=req.body;
    let movieID = req.params.movieID;
    moviesModel.findOne({_id:movieID},(error,movieInfo)=>{
        movieInfo.title=title;
        movieInfo.overview=overview;
        movieInfo.email=email;
        movieInfo.save()
        .then(()=>{
            moviesModel.find({email},function(error,movieData){
                if (error) {
                    console.log('error in updating the data');
                }
                else {
                    res.send(movieData);
                }
            })
        })
    })
}


class movies {
    constructor(title, overview,email){
        this.title=title;
        this.overview=overview;
        this.email=email;
    }
}


server.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
});


