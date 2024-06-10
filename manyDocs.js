const express = require('express')
const {connectToDb ,getDb} =require('./db')
//init app
//middleware
const app = express()
const PORT = '3000'

//db connection
let db
connectToDb((err) =>{
  if(!err){
    app.listen(PORT, ()=>{
        console.log(`App listening on port ${PORT}`)
    })
    db = getDb()
  }
})

//ROUTES
app.get('/books',(req,res) =>{
 let books = []

    db.collection('books')
     .find()//cursor toArray & forEach
     .sort({author:1})
     .forEach(book => books.push(book))
     .then (() =>{
        res.status(200).json(books)
     })
     .catch( () =>{
        res.status(500).json({error:'Could not fetch the documents'})
     })

    //res.json({msg:"Welcome to the API"})
})