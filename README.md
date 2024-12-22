# DI_Bootcamp_Hackaton_2: Language Learning RPG

**Language Learning RPG** is a gamified language-learning application that uses RPG and dungeon crawler elements to make vocabulary acquisition engaging and fun. Players battle enemies by using their knowledge of words, blending educational goals with the excitement of gameplay.

---

## Table of Contents
- [About the Project](#about-the-project)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Code Overview](#code-overview)
  - [Key Classes](#key-classes)
  - [Controllers](#controllers)
  - [Routes](#routes)
  - [Server Configuration](#server-configuration)
  - [Frontend Overview](#frontend-overview)
  - [Utils](#utils)
  - [Word Categories](#word-categories)

---

## About the Project
Language Learning RPG is designed to help users improve their vocabulary by challenging them to defeat enemies in a dungeon crawler-style game. Players type words based on categories to launch attacks, making learning immersive and interactive.

---

## Folder Structure
The project is organized into the following structure:

    /config data.js           -> Hardcoded category data 
        entityClass.js        -> Parent class for the Enemy and Player 
        enemyClass.js         -> Class for creating the Enemy 
        playerClass.js        -> Class for creating the Player

    /controllers
        catControllers.js     -> Category controller 
        enemyController.js    -> Enemy controller 
        playerController.js   -> Player controller

    /routes 
        catRouter.js          -> Routes for category-related operations 
        enemyRouter.js        -> Routes for enemy-related operations 
        playerRouter.js       -> Routes for player-related operations

    /public 
        battle.css            -> Styles for the battle screen 
        style.css             -> General styles for the project 
        script.js             -> Frontend interactions with the backend and DOM 
        index.html            -> Main HTML file for the project

    /utils 
        enemyGenerator.js     -> Generates enemies on the screen 
        wordChecker.js        -> Checks word validity and determines attack strength

    .gitignore                -> Specifies files to be ignored by Git package.json # Project dependencies and scripts 
    server.js                 -> Connects frontend and backend

---

## Installation

Clone the repository:
   ```bash
   git clone https://github.com/noudas/DI_Bootcamp_Hackaton_2.git
   cd DI_Bootcamp_Hackaton_2
   ```

Install dependencies:

```bash
npm install
```

Run the server:

``` bash
node server.js
```

---

## Usage
* Open your browser and navigate to http://localhost:5000 (or the port specified in your configuration).
* Start the game by choosing an enemy.
* Enter words in the input field to attack enemies.
* Defeat enemies to progress through the dungeon and learn new words!

---

## Features
* Interactive Gameplay: Defeat enemies by typing valid words from a selected category.
* Customizable Vocabulary: Expand or modify word categories using the backend data.js file.
* Responsive Design: Styled with CSS to enhance the user experience.
* Dynamic Enemy Generation: New enemies are generated dynamically for each battle.
* Word Validation: Ensures that words entered by the player are valid for the chosen category.

---

## Code Overview

**Key Classes**
bash´´´
Entity (Base Class): Handles shared properties and methods for both Player and Enemy classes, including health, attack power, and win/lose conditions.
Player: Extends Entity and adds specific features like score tracking and player-specific actions.
Enemy: Extends Entity and includes additional properties such as weaknesses and methods for handling enhanced damage.
´´´

**Controllers**
bash´´´
Category Controller: Manages the operations related to word categories, including retrieving, adding, and deleting categories.
Enemy Controller: Handles the creation and actions of enemies, including generating enemies, dealing damage, healing, and handling attack behaviors.
Player Controller: Manages player-related operations, including health, score tracking, and resetting player stats.
´´´

Routes
Category Routes (catRouter.js):

GET /: Retrieve all categories.
GET /:category: Retrieve all words within a specific category.
POST /: Add a new category.
DELETE /:category: Delete a category.

Enemy Routes (enemyRouter.js):
POST /create: Create a single enemy.
POST /generate: Generate multiple enemies.
GET /:name: Retrieve details of an enemy by name.
PATCH /:name/damage: Apply damage to an enemy.
PATCH /:name/heal: Heal an enemy.
POST /:name/attack: Perform an attack from an enemy on the player.
GET /:name/death: Check if the enemy has died.
GET /:name/win: Check if the enemy has won.
DELETE /:name: Delete an enemy.

Player Routes (playerRouter.js):

GET /: Retrieve all players.
POST /create: Create a new player.
GET /:name: Retrieve details of a player by name.
PATCH /:name/score: Add score to a player.
PATCH /:name/damage: Apply damage to a player.
PATCH /:name/heal: Heal a player.
GET /:name/win: Check if the player has won.
GET /:name/death: Check if the player has died.
PATCH /:name/restart: Reset player stats.

Server Configuration
The server.js file serves as the entry point for the application, connecting the backend to the frontend.

Middleware:
express.static: Serves static files (like images, styles, etc.) from the public folder.
body-parser: Parses incoming requests, including JSON and URL-encoded data.
cors: Enables Cross-Origin Resource Sharing.

Routes:
/categories: Handles all category-related requests.
/players: Manages all player-related operations.
/enemies: Manages all enemy-related operations.

Health Check:
Endpoint: /healthcheck to verify server status.
Response: Returns a 200 status with a success message to confirm the server is up.

Error Handling:
Middleware captures errors and sends back a 500 status with an error message.

Frontend Overview
index.html: The main interface for the game, including:
A navigation bar displaying the game title.
Sections for monster cards and the battle interface.
Monster Cards Section: Displays available enemies with their stats.
Battle Section: Contains player stats, a spell input form, and buttons for healing and toggling categories.
Key Frontend Functions
Enemy Management: Dynamically fetch and display enemies using getEnemy(), createEnemyCard(), and renderEnemies(). Track defeated enemies and battle progress.

Player Interactions: Fetch player data and update stats like health and experience points. Manage player actions such as healing and casting spells.

Battle Management: Handles spell casting, tracks battle events, and manages enemy attacks and win/loss conditions.

Example of spell casting event listener:

javascript
Copiar código
spellBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    await playerAttack(clickedMonster);
    await enemyAttack();
    await checkWinCondition();
    spellInput.value = '';
});
Utils
Enemy Generator (enemyGenerator.js): Creates random enemies with unique properties like stats, images, and weaknesses.
Word Checker (wordChecker.js): Validates the player's word input against categories and calculates attack damage based on word length.