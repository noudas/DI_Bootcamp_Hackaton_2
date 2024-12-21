// HTML Document

// Document Related
const wordTable = document.getElementById("word_table");
const spellForm = document.getElementById("spell_form");
const toggleCategoriesButton = document.getElementById('toggle_categories');

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
        <div class="enemy_info">
        <h2 class="enemy_name">${enemy.name}</h2>
        <p class="enemy_health"><strong>Health: </strong>${enemy.attributes.health}</p>
        <p class="enemy_attack"><strong>Attack: </strong>${enemy.attributes.attack}</p>
        <p class="enemy_weakness"><strong>Weakness: </strong>${enemy.attributes.weakness}</p>
        </div>
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
    try {
        const players = await getPlayer();
        
        if (players.length === 0) {
            console.warn('No players found');
            return;
        }
        
        const player = players[0];
        if (!player) {
            console.warn('First player is null or undefined');
            return;
        }
        
        if (playerXP) {
            playerXP.textContent = 'XP: ' + player.score;
        } else {
            console.error('playerXP element not found');
        }
    } catch (error) {
        console.error('Error getting player score:', error);
    }
};

const getSpell = () => {
    playerWord = spellInput.value
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
    const wordTable = document.getElementById('word_table'); // Ensure this element exists in your HTML
    
    if (categories) {
        const tHead = document.createElement('thead');
        const tRow = document.createElement('tr');
        
        // Create a header cell for each category
        Object.keys(categories).forEach(categoryName => {
            const tH = document.createElement('th');
            tH.innerHTML = `<strong>${categoryName}</strong>`;
            tRow.appendChild(tH);
        });
        tHead.appendChild(tRow);
        wordTable.appendChild(tHead);
        
        const tBody = document.createElement('tbody');
        const rowCount = Math.max(...Object.values(categories).map(category => category.length)); // Find the maximum number of words in a category
        
        for (let row = 0; row < rowCount; row++) {
            const tRowBody = document.createElement('tr');
            
            Object.keys(categories).forEach(categoryName => {
                const words = categories[categoryName];
                const tD = document.createElement('td');
                
                // Add word if it exists in this row, otherwise leave the cell empty
                if (row < words.length) {
                    tD.textContent = words[row];
                }
                
                tRowBody.appendChild(tD);
            });
            
            tBody.appendChild(tRowBody);
        }

        wordTable.appendChild(tBody);
    }
});


// Battle ARENA!
async function generateEnemy(clickedMonster) {
    try {
        const enemies = await getEnemy();
        if (!enemies) return;

        // Find the specific enemy based on the clickedMonster
        const enemy = enemies.find(e => e.name === clickedMonster);
        if (enemy) {
            const enemyCard = createEnemyCard(enemy);
            enemyCard.classList.add(`battle${enemy.name}`);

            // Append enemy card to the battle section
            battleSection.appendChild(enemyCard);

            // Create categories and append them below the enemy card
            const categories = await getCategories();
            if (categories) {
                const wordTable = document.getElementById('word_table');
                if (wordTable) {
                    wordTable.style.display = 'flex'; // Ensure categories are visible
                    wordTable.innerHTML = ''; // Clear existing categories (if any)
                    
                    Object.keys(categories).forEach(categoryName => {
                        const tHead = document.createElement('thead');
                        const tRow = document.createElement('tr');
                        const tH = document.createElement('th');
                        tH.innerHTML = `<strong>${categoryName}</strong>`;
                        tRow.appendChild(tH);
                        tHead.appendChild(tRow);
                        wordTable.appendChild(tHead);

                        const tBody = document.createElement('tbody');
                        const columnCount = 5;
                        const words = categories[categoryName];
                        const rowCount = Math.ceil(words.length / columnCount);

                        for (let row = 0; row < rowCount; row++) {
                            const tRowBody = document.createElement('tr');
                            for (let col = 0; col < columnCount; col++) {
                                const index = row * columnCount + col;
                                if (index < words.length) {
                                    const tD = document.createElement('td');
                                    tD.textContent = words[index];
                                    tRowBody.appendChild(tD);
                                }
                            }
                            tBody.appendChild(tRowBody);
                        }

                        wordTable.appendChild(tBody);
                    });
                    
                    // Append categories table to the battle section
                    battleSection.appendChild(wordTable);
                }
            }
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
        return data;
    } catch (error) {
        console.error('Error in playerAttack:', error.message);
        throw error;
    }
};

async function increasePlayerScore() {
    try {
        const players = await getPlayer();
        if (players.length === 0) return;
        const player = players[0];
        if (!player) return;

        const updatedScore = player.score + 1;

        // PATCH request to update the score on the backend
        const response = await fetch(`${playerAPIURL}${player.name}/score`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ points: 1 }) // Assuming the backend increments the score
        });

        if (!response.ok) {
            throw new Error(`Failed to update score: ${response.status}`);
        }

        // Update the UI with the new score
        const playerXPElement = document.getElementById("player_XP");
        if (playerXPElement) {
            playerXPElement.textContent = `XP: ${updatedScore}`;
        } else {
            console.warn("Player XP element not found in the DOM");
        }
    } catch (error) {
        console.error("Error increasing player score:", error);
    }
}

let processedEnemies = new Set();
const checkEnemyAliveBattle = async () => {
    try {
        const enemies = await getEnemy();
        if (!enemies) return;

        // Find the currently battled enemy
        const enemy = enemies.find(e => e.name === clickedMonster);

        if (enemy && enemy.attributes.lose_condition && !processedEnemies.has(enemy.name)) {
            processedEnemies.add(enemy.name); // Mark as processed
            const battleCard = document.querySelector(`.${enemy.name}`);
            if (battleCard) {
                battleCard.remove(); // Remove the battle card
                console.log(`Enemy ${enemy.name} has been defeated!`);

                // Increase player score
                await increasePlayerScore();

                // Delayed action
                setTimeout(async () => {
                    await enemyKilled();
                }, 1000);
            }
        }
    } catch (error) {
        console.error("Error checking enemy status in battle:", error);
    }
};

const enemyKilled = () => {
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
        monsterSection.style.display = "flex";
        battleSection.style.display = "none";
    });

    // Append text and button to the container
    messageContainer.appendChild(messageText);
    messageContainer.appendChild(restartButton);

    // Add the win message to the DOM
    document.body.appendChild(messageContainer);
};


const enemyAttack = async () => {
    try {
        const enemies = await getEnemy();
        if (!enemies) {
            console.warn("No enemies available.");
            return;
        }

        const players = await getPlayer();
        const player = players[0];
        if (!player) {
            console.warn("No player found.");
            return;
        }
        const playerName = player.name;

        const enemy = enemies.find(e => e.name === clickedMonster);
        if (!enemy) {
            console.warn(`Enemy ${clickedMonster} not found.`);
            return;
        }

        // Simulate the enemy's attack on the player
        const response = await fetch(`/enemies/${enemy.name}/attack`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ playerName: playerName }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Result ", result);

        if (result.message && result.message.includes('attacked')) {
            console.log(`Enemy ${enemy.name} attacked:`, result);
            const playerHealthElement = document.querySelector(".player_health");
            if (playerHealthElement) {
                playerHealthElement.textContent = `Health: ${result.result.player.health}`;
            }
        } else {
            console.error("Enemy attack failed:", result.error || "Unknown error");
        }
    } catch (error) {
        console.error("Error in enemy attack:", error);
    }
};

const getEnemyHP = async () => {
    try {
        const enemies = await getEnemy();
        if (!enemies) {
            console.warn("No enemies available.");
            return;
        }
        
        const enemy = enemies.find(e => e.name === clickedMonster);
        if (!enemy) {
            console.warn(`Enemy ${clickedMonster} not found.`);
            return;
        }

        const enemyHealth = document.querySelector(`.battle${clickedMonster} .enemy_health`);
        if (enemyHealth && enemyHealth.parentNode) {
            enemyHealth.textContent = 'Health: ' + enemy.attributes.health;
        } else {
            console.warn("Enemy health element not found.");
        }

    } catch (error) {
        console.error("Error in enemy get HP:", error);
    }
};


//Event Listeners
spellBtn.addEventListener('click', async function(event) {
    event.preventDefault();
    await playerAttack(clickedMonster);
    await enemyAttack();
    spellInput.value = '';
});



cardContainer.addEventListener('click', function(event) {
    const clickedCard = event.target.closest('.enemy_card');
    if (clickedCard) {
        clickedMonster = clickedCard.classList[1];
        generateEnemy(clickedMonster);
        getPlayerHP();
        getPlayerScore();
        console.log("Clicked Monster:", clickedMonster);
    }
    monsterSection.style.display = "none";
    battleSection.style.display = "flex";
});

toggleCategoriesButton.addEventListener('click', () => {
    if (wordTable.style.display === 'none') {
        wordTable.style.display = 'flex'; // Show table
    } else {
        wordTable.style.display = 'none'; // Hide table
    }
});


// Intervals
// Run every 200ms
checkEnemyAlive();
setInterval(() => {
    checkEnemyAlive();
    checkEnemyAliveBattle();
    getPlayerHP();
    getPlayerScore();
    getEnemyHP();
}, 400);