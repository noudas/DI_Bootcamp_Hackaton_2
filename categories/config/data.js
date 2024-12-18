// const knex = require("knex");
require("dotenv").config();



// const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

// const db = knex({
//   client: "pg",
//   connection: {
//     host: PGHOST,
//     port: PGPORT,
//     user: PGUSER,
//     database: PGDATABASE,
//     password: PGPASSWORD,
//     ssl: { rejectUnauthorized: false },
//   },
// });


const categories = {
    food: [
        "Apple",
        "Banana",
        "Carrot",
        "Doughnut",
        "Eggplant",
        "French fries",
        "Grapes",
        "Hamburger",
        "Ice cream",
        "Jalapeño",
        "Kale",
        "Lasagna",
        "Muffin",
        "Noodles",
        "Omelette",
        "Pizza",
        "Quinoa",
        "Sushi",
        "Tacos",
        "Yogurt"
    ],
    nouns: [
        "Apple",
        "Book",
        "Chair",
        "Dog",
        "Elephant",
        "Flower",
        "Guitar",
        "House",
        "Island",
        "Jacket",
        "Kite",
        "Lamp",
        "Mountain",
        "Notebook",
        "Ocean",
        "Pencil",
        "Queen",
        "Robot",
        "Star",
        "Tree"
    ],
    sports: [
        "Baseball",
        "Basketball",
        "Cricket",
        "Diving",
        "Football",
        "Golf",
        "Gymnastics",
        "Handball",
        "Ice hockey",
        "Judo",
        "Karate",
        "Lacrosse",
        "Marathon",
        "Netball",
        "Rugby",
        "Sailing",
        "Tennis",
        "Volleyball",
        "Wrestling",
        "Yoga"
    ]}


module.exports={categories}