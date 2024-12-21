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
    playerHealth.textContent = 'Health: ' + player.health;
};

const getPlayerScore = async () => {
    const players = await getPlayer()
    const player = players[0]
    if (!player) return;
    playerXP.textContent = 'XP: ' + player.score;
}
const getSpell = () => {
    playerWord = spellInput.value
    console.log(playerWord);
    return playerWord
};



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



// Battle ARENA!
async function generateEnemy(clickedMonster) {
    try {
        const enemies = await getEnemy();
        if (!enemies) return;

        // Find the specific enemy based on the clickedMonster
        const enemy = enemies.find(e => e.name === clickedMonster);
        if (enemy) {
            const enemyCard = createEnemyCard(enemy);
            enemyCard.classList.add(`battle${enemy.name}`)

            battleSection.appendChild(enemyCard);
        } else {
            console.error(`Enemy with name "${clickedMonster}" not found.`);
        }
    } catch (error) {
        console.error("Error generating enemy:", error);
    }
}

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

const checkEnemyAliveBattle = async () => {
    try {
        const enemies = await getEnemy();
        if (!enemies) return;

        // Find the currently battled enemy
        const enemy = enemies.find(e => e.name === clickedMonster);

        // Check if the enemy exists and has met the lose condition
        if (enemy && enemy.attributes.lose_condition) {
            const battleCard = document.querySelector(`.${enemy.name}`);
            if (battleCard) {
                battleCard.remove(); // Remove the battle card
                console.log(`Enemy ${enemy.name} has been defeated!`);
                setTimeout(() => {
                    winMessage()
                }, 1000);
            }
        }
    } catch (error) {
        console.error("Error checking enemy status in battle:", error);
    }
};

const winMessage = () => {
    // Create a container for the win message
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("win-message");

    // Create the win text
    const messageText = document.createElement("h2");
    messageText.textContent = "You killed the enemy!";

    // Optionally, create a button to return to the main menu or restart the battle
    const restartButton = document.createElement("button");
    restartButton.textContent = "Continue";
    restartButton.classList.add("restart-button");
    restartButton.addEventListener("click", () => {
        // Reset battle and navigate back to the main screen
        messageContainer.remove();
        monsterSection.style.display = "block";
        battleSection.style.display = "none";
    });

    // Append text and button to the container
    messageContainer.appendChild(messageText);
    messageContainer.appendChild(restartButton);

    // Add the win message to the DOM
    document.body.appendChild(messageContainer);

    // Optionally style the message for better visibility
    messageContainer.style.position = "fixed";
    messageContainer.style.top = "50%";
    messageContainer.style.left = "50%";
    messageContainer.style.transform = "translate(-50%, -50%)";
    messageContainer.style.padding = "20px";
    messageContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    messageContainer.style.color = "white";
    messageContainer.style.textAlign = "center";
    messageContainer.style.borderRadius = "10px";
};



//Event Listeners
spellBtn.addEventListener('click', function(event){
    event.preventDefault()
    getPlayerHP();
    getPlayerScore();
    playerAttack(clickedMonster)
    spellInput.value = ''
});

cardContainer.addEventListener('click', function(event) {
    const clickedCard = event.target.closest('.enemy_card');
    if (clickedCard) {
        clickedMonster = clickedCard.classList[1];
        generateEnemy(clickedMonster)
        getPlayerHP();
        getPlayerScore();
        console.log("Clicked Monster:", clickedMonster);
    }
    monsterSection.style.display = "none";
    battleSection.style.display = "block";
});


// Intervals
// Run every 200ms
setInterval(( checkEnemyAlive, checkEnemyAliveBattle ), 200);
