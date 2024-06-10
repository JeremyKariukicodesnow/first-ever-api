const express = require('express')
const {connectToDb ,getDb} =require('./db')
const {ObjectId} = require('mongodb')
//init app
//middleware
const app = express()
const PORT = '3000'
app.use(express.json())

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
//pagination
const page =req.query.p || 0
const booksPerPage = 3

 let books = []

    db.collection('books')
     .find()//cursor toArray & forEach
     .sort({author:1})
     .skip(page * booksPerPage)
     .limit(booksPerPage)
     .forEach(book => books.push(book))
     .then (() =>{
        res.status(200).json(books)
     })
     .catch( () =>{
        res.status(500).json({error:'Could not fetch the documents'})
     })

    //res.json({msg:"Welcome to the API"})
})

//fetching single document
app.get('/books/:id',(req , res) => {

    if(ObjectId.isValid(req.params.id)){
        const bookId = req.params.id;

        db.collection('books')
         .findOne({_id:new ObjectId(bookId)})
         .then(doc =>{
             res.status(200).json(doc)
         })
         .catch(err =>{
             res.status(500).json({error:'could not fetch documents'})
         })
    }else{
        res.status(500).json({error:"not valid document id"})
    }
    
})

//post
app.post('/books' ,(req,res) => {
  const book = req.body

  db.collection('books')
   .insertOne(book)
   .then(result => {
    res.status(201).json(result)
   })
   .catch(err =>{
    res.status(500).json({error:'could nt create new document'})
   })
})

//delete 

app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;

    if (ObjectId.isValid(bookId)) {
        db.collection('books')
            .deleteOne({ _id: new ObjectId(bookId) })
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Book not found' });
                }
                res.status(200).json({ message: 'Document deleted', result });
            })
            .catch(err => {
                res.status(500).json({ error: 'Could not delete document' });
            });
    } else {
        res.status(400).json({ error: 'Invalid id format' });
    }
});

//patch request(for updating)
app.patch('/books/:id', (req,res) => {
    const updates =req.body

    const bookId = req.params.id;

    if (ObjectId.isValid(bookId)) {
        db.collection('books')
            .updateOne({ _id: new ObjectId(bookId) }, {$set: updates})
            .then(result => {
                res.status(200).json({ message: 'Document updated', result });
            })
            .catch(err => {
                res.status(500).json({ error: 'Could not update document' });
            });
    } else {
        res.status(400).json({ error: 'Invalid id format' });
    }
})
