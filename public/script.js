
// const { categories } = require('../categories/config/data.js')

const playerHealth = document.getElementById("player_health")
const playerXP = document.getElementById("player_XP")
const cardContainer = document.getElementById("card_container")
const spellForm = document.getElementById("spell_form")
const spellInput = document.getElementById("spell_input")
const spellBtn = document.getElementById("spell_btn")
const wordTable = document.getElementById("word_table")
const selectedMonster = ""

const catApiUrl = 'http://localhost:5000/categories/'
const enemiesApiUrl = 'http://localhost:5000/enemies/'


const monsters = [
    "https://robohash.org/P1Q.png?set=set2&size=150x150",
    "https://robohash.org/NHX.png?set=set2&size=150x150",
    "https://robohash.org/TVH.png?set=set2&size=150x150",
    "https://robohash.org/XEG.png?set=set2&size=150x150",
    "https://robohash.org/VVN.png?set=set2&size=150x150"
]
let imgIndex =0
let playerWord =  ''


spellBtn.addEventListener('click', function(event){
    event.preventDefault()
    playerWord = spellInput.value
    spellInput.value = ''
    console.log(playerWord);
    
})



const getCategories = () => {

    return fetch(catApiUrl)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("Error fetching categories")
            }
        })
        .catch(function (error) {
            console.log(error)
        });
}



getCategories().then(categories => {
    if (categories) {
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
            const rowCount = Math.ceil(words.length / columnCount);



            for (let row = 0; row < rowCount; row++) {
                const tRowBody = document.createElement('tr')
                for (let col = 0; col < columnCount; col++) {
                    const index = row * columnCount + col
                    if (index < words.length) {
                        const tD = document.createElement('td')
                        tD.textContent = words[index]
                        tRowBody.appendChild(tD)
                    }
                }
                tBody.appendChild(tRowBody)
            }

            wordTable.appendChild(tBody)

        });

    }
})


const getEnemy = () => {

    return fetch(enemiesApiUrl)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("Error fetching enemies")
            }
        })
        .catch(function (error) {
            console.log(error)
        });
}

getEnemy().then(enemies => {
    if (enemies) {
        enemies.forEach(enemy => {
            //create card
            const enemyCard = document.createElement('div')
            enemyCard.classList.add('enemy_card')
            // create img element
            const enemyImg = document.createElement('img')// add later
            enemyImg.classList.add('enemy_img')
            enemyImg.src= monsters[imgIndex++]

            // create name element and initialise
            const enemyName = document.createElement('h2')
            enemyName.classList.add('enemy_name')
            enemyName.textContent = `${enemy.name}`

            //create health element  and initialise
            const enemyHealth = document.createElement('p')
            enemyHealth.classList.add('enemy_health')
            enemyHealth.textContent = `Health: ${enemy.attributes.health}`

            //create attack element and initialise
            const enemyAttack = document.createElement('p')
            enemyAttack.classList.add('enemy_attack')
            enemyAttack.textContent = `Attack: ${enemy.attributes.attack}`

            //create weakness element and initialise
            const enemyWeakness = document.createElement('p')
            enemyWeakness.classList.add('enemy_weakness')
            enemyWeakness.textContent = `Weekness: ${enemy.attributes.weakness}`

            // Append elements to card
            enemyCard.appendChild(enemyImg)
            enemyCard.appendChild(enemyName)
            enemyCard.appendChild(enemyHealth)
            enemyCard.appendChild(enemyAttack)
            enemyCard.appendChild(enemyWeakness)

            cardContainer.appendChild(enemyCard)

            enemyCard.addEventListener('click', function(){
                selectedMonster = enemy.name

            }
        )
        })

    }



})