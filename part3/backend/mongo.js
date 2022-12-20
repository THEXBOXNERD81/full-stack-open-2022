const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  console.log(process.argv); 
  process.exit(1)
}

const password = process.argv[2]



const url = `mongodb+srv://TheNerd81:${password}@cluster0.r07il3v.mongodb.net/noteApp?retryWrites=true&w=majorityy`

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')


  })
    Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
    })
  
