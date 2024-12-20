// HTML Document

// Document Related
const wordTable = document.getElementById("word_table");
const spellForm = document.getElementById("spell_form");

// Player Related
const playerHealth = document.getElementById("player_health");
const playerXP = document.getElementById("player_XP");
const spellInput = document.getElementById("spell_input");
const spellBtn = document.getElementById("spell_btn");

// Monster Related
const cardContainer = document.getElementById("card_container");
const monsterSection = document.getElementById("MonsterCards");
const battleSection = document.getElementById("Battle");
const selectedMonster = "";

// APIs URLs
const playerAPIURL = 'http://localhost:5000/players/';
const catApiUrl = 'http://localhost:5000/categories/';
const enemiesApiUrl = 'http://localhost:5000/enemies/';




//Monster Cards
const monsters = [
    "https://robohash.org/P1Q.png?set=set2&size=150x150",
    "https://robohash.org/NHX.png?set=set2&size=150x150",
    "https://robohash.org/TVH.png?set=set2&size=150x150",
    "https://robohash.org/XEG.png?set=set2&size=150x150",
    "https://robohash.org/VVN.png?set=set2&size=150x150"
]
let imgIndex = 0
let clickedMonster

// Fetch enemies from the API
const getEnemy = async () => {
    try {
        const response = await fetch(enemiesApiUrl);
        if (!response.ok) throw new Error("Error fetching enemies");
        return response.json();
    } catch (error) {
        console.error("Failed to fetch enemies:", error);
        return null; // Return null to handle gracefully when fetch fails
    }
};

// Create an enemy card element
const createEnemyCard = (enemy) => {
    const enemyCard = document.createElement('div');
    enemyCard.classList.add('enemy_card', enemy.name);

    enemyCard.innerHTML = `
        <img class="enemy_img" src="${monsters[imgIndex++]}" alt="${enemy.name}">
        <h2 class="enemy_name">${enemy.name}</h2>
        <p class="enemy_health">Health: ${enemy.attributes.health}</p>
        <p class="enemy_attack">Attack: ${enemy.attributes.attack}</p>
        <p class="enemy_weakness">Weakness: ${enemy.attributes.weakness}</p>
    `;

    enemyCard.addEventListener('click', () => {
        selectedMonster = enemy.name;
    });

    return enemyCard;
};

// Render all enemies
const renderEnemies = async () => {
    const enemies = await getEnemy();
    if (!enemies) return;

    const fragment = document.createDocumentFragment();
    enemies.forEach(enemy => {
        const enemyCard = createEnemyCard(enemy);
        fragment.appendChild(enemyCard);
    });
    cardContainer.appendChild(fragment); // Add all cards at once for better performance
};

// Check if enemies are alive and hide defeated ones
const checkEnemyAlive = async () => {
    const enemies = await getEnemy();
    if (!enemies) return;

    enemies.forEach(enemy => {
        if (enemy.attributes.lose_condition) {
            const enemyCard = document.querySelector(`.${enemy.name}`);
            if (enemyCard) enemyCard.style.display = "none";
        }
    });
};

// Initialize by rendering enemies
renderEnemies();



// Player
// Fetch player from the API
const getPlayer = async () => {
    try {
        const response = await fetch(playerAPIURL);
        if (!response.ok) throw new Error("Error fetching players");
        return response.json();
    } catch (error) {
        console.error("Failed to fetch players:", error);
        return null; // Return null to handle gracefully when fetch fails
    }
};

let playerWord = ''

const getPlayerHP = async () => {
    const players = await getPlayer()
    const player = players[0]
    if (!player) return;
    playerHealth.textContent += ' ' + player.health;
};

const getPlayerScore = async () => {
    const players = await getPlayer()
    const player = players[0]
    if (!player) return;
    playerXP.textContent += ' ' + player.score;
}
const getSpell = () => {
    playerWord = spellInput.value
    return playerWord
};


getPlayerHP();
getPlayerScore();



// Categories
// Fetch categories from the API
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
};

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




async function playerAttack(enemyName) {
    try {
        const playerWord = getSpell();

        const response = await fetch(`${enemiesApiUrl}/${enemyName}/damage`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ word: playerWord }), // Include the 'word' in the body
        });

        if (!response.ok) {
            throw new Error(`Something went wrong: ${response.status}`);
        }

        const data = await response.json();
        console.log('Enemy damaged:', data);
        return data;
    } catch (error) {
        console.error('Error in playerAttack:', error.message);
        throw error;
    }
};


//Event Listeners
spellBtn.addEventListener('click', function(event){
    event.preventDefault()
    
    spellInput.value = ''
    console.log(playerWord);
});

cardContainer.addEventListener('click', function(event) {
    const clickedCard = event.target.closest('.enemy_card');
    if (clickedCard) {
        const clickedMonster = clickedCard.classList[1];
        console.log("Clicked Monster:", clickedMonster);
    }
    monsterSection.style.display = "none";
    battleSection.style.display = "block";
});


// Intervals
// Run every 500ms
setInterval(( checkEnemyAlive ), 500);
