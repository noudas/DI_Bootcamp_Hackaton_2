
// const { categories } = require('../categories/config/data.js')

const playerHealth = document.getElementById("player_health")
const playerXP = document.getElementById("player_XP")
const cardContainer = document.getElementById("card_container")
const spellForm = document.getElementById("spell_form")
const spellInput = document.getElementById("spell_input")
const spellBtn = document.getElementById("spell_btn")
const wordTable = document.getElementById("word_table")


const apiUrl ='http://localhost:5000/api/categories'

const getCategories = () => {
    
    return fetch(apiUrl)
            .then((response) => {
                if(response.ok){
                    return response.json()
                } else {
                    throw new Error("Error fetching categories")
                }
            })
            .catch(function (error) {
                console.log(error)
            });
}



getCategories().then(categories =>{
    if(categories){
        Object.keys(categories).forEach(categoryName => {
            const tHead = document.createElement('thead')
            const tRow = document.createElement('tr')
            const tH = document.createElement('th')
            
            tH.innerHTML = `<strong>${categoryName}</strong>`
            tRow.appendChild(tH)
            tHead.appendChild(tRow)
            wordTable.appendChild(tHead)
            
            const tBody = document.createElement('tbody')
            const columnCount = 5
            const words = categories[categoryName]
            const rowCount = Math.ceil( words.length / columnCount);
            
            
        
            for (let row = 0; row < rowCount; row++) {
                const tRowBody = document.createElement('tr')
                for(let col = 0 ; col < columnCount; col++){
                    const index = row* columnCount + col
                    if (index < words.length){
                        const tD = document.createElement('td')
                        tD.textContent= words[index]
                        tRowBody.appendChild(tD)
                    }
                }
                tBody.appendChild(tRowBody)
            }
            
            wordTable.appendChild(tBody)
        
           });
            
    }
})


