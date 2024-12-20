const playerHealth = document.getElementById("player_health")
const playerXP = document.getElementById("player_XP")
const cardContainer = document.getElementById("card_container")
const spellForm = document.getElementById("spell_form")
const spellInput = document.getElementById("spell_input")
const spellBtn = document.getElementById("spell_btn")
const wordTable = document.getElementById("word_table")
const monsterSection = document.getElementById("MonsterCards")
const selectedMonster = ""

const playerAPIURL = 'http://localhost:5000/player/';
const catApiUrl = 'http://localhost:5000/categories/'
const enemiesApiUrl = 'http://localhost:5000/enemies/'


const monsters = [
    "https://robohash.org/P1Q.png?set=set2&size=150x150",
    "https://robohash.org/NHX.png?set=set2&size=150x150",
    "https://robohash.org/TVH.png?set=set2&size=150x150",
    "https://robohash.org/XEG.png?set=set2&size=150x150",
    "https://robohash.org/VVN.png?set=set2&size=150x150"
]
let imgIndex = 0
let playerWord = ''

spellBtn.addEventListener('click', function(event){
    event.preventDefault()
    playerWord = spellInput.value
    spellInput.value = ''
    console.log(playerWord);
});


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


const getEnemy = async () => {
    try {
        const response = await fetch(enemiesApiUrl);
        if (!response.ok) {
            throw new Error("Error fetching enemies");
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch enemies:", error);
    }
};

const createEnemyCard = (enemy) => {
    const enemyCard = document.createElement('div');
    enemyCard.classList.add('enemy_card', `${enemy.name}`);

    const enemyImg = document.createElement('img');
    enemyImg.classList.add('enemy_img');
    enemyImg.src = monsters[imgIndex++];

    const enemyName = document.createElement('h2');
    enemyName.classList.add('enemy_name');
    enemyName.textContent = enemy.name;

    const enemyHealth = document.createElement('p');
    enemyHealth.classList.add('enemy_health');
    enemyHealth.textContent = `Health: ${enemy.attributes.health}`;

    const enemyAttack = document.createElement('p');
    enemyAttack.classList.add('enemy_attack');
    enemyAttack.textContent = `Attack: ${enemy.attributes.attack}`;

    const enemyWeakness = document.createElement('p');
    enemyWeakness.classList.add('enemy_weakness');
    enemyWeakness.textContent = `Weakness: ${enemy.attributes.weakness}`;

    // Append all child elements to the enemy card
    enemyCard.append(enemyImg, enemyName, enemyHealth, enemyAttack, enemyWeakness);

    // Attach click event listener
    enemyCard.addEventListener('click', () => {
        selectedMonster = enemy.name;
    });

    return enemyCard;
};

const renderEnemies = async () => {
    const enemies = await getEnemy();
    if (!enemies) return;

    enemies.forEach(enemy => {
        const enemyCard = createEnemyCard(enemy);
        cardContainer.appendChild(enemyCard);
    });
};

// Call renderEnemies to initialize
renderEnemies();


async function playerAttack(enemyName, playerWord) {
    try {
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
}

const checkEnemyAlive = async () => {
    try {
        const enemies = await getEnemy();
        if (enemies) {
            enemies.forEach(enemy => {
                if (enemy.attributes.lose_condition) {
                    const enemyCard = document.querySelector(`.${enemy.name}`);
                    if (enemyCard) {
                        enemyCard.style.display = "none"; // Hide the card
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error checking enemy status:", error);
    }
};

setInterval(checkEnemyAlive, 500);
