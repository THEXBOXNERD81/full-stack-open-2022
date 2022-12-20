const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  console.log(process.argv); 
  process.exit(1)
}

const password = process.argv[2]

const Name = process.argv[3]

const Number = process.argv[4]


const url = `mongodb+srv://TheNerd81:${password}@cluster0.r07il3v.mongodb.net/phonebookApp?retryWrites=true&w=majorityy`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (Name && Number) {
    mongoose
      .connect(url)
      .then((result) => {
        console.log('connected')
    
        const person = new Person({
          name: Name,
          number: Number,
        })
    
        return person.save()
      })
      .then(() => {
        console.log(`added ${Name} number ${Number} to the phonebook`)
        return mongoose.connection.close()
      })
      .catch((err) => console.log(err))
}
else {
    mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')
    })
        Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
        })
  
}


  
