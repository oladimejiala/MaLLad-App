document.addEventListener('DOMContentLoaded', function() {
    // Game state with enhanced health education elements
    const gameState = {
        players: {
            player1: { position: 1, isActive: true },
            player2: { position: 1, isActive: false }
        },
        gameOver: false,
        diceValue: 0,
        malariaPositions: {
            25: 5,
            42: 20,
            55: 35,
            70: 50,
            85: 60,
            98: 40
        },
        ladderPositions: {
            3: 22,
            11: 30,
            17: 45,
            28: 52,
            37: 65,
            47: 75,
            63: 80,
            73: 92
        },
        educationTips: {
            5: {
                title: "Sleep Under LLINs",
                content: `<img src="https://via.placeholder.com/400x200?text=Family+Sleeping+Under+Bed+Net" alt="Family under bed net">
                          <p>Always sleep under a Long-Lasting Insecticidal Net (LLIN) to protect yourself from mosquito bites. Nets kill mosquitoes on contact and provide a physical barrier.</p>`
            },
            22: {
                title: "Use Insecticides",
                content: `<img src="https://via.placeholder.com/400x200?text=Spraying+Insecticide" alt="Insecticide spraying">
                          <p>Use approved insecticides in your home. Indoor Residual Spraying (IRS) kills mosquitoes that land on walls and ceilings.</p>`
            },
            30: {
                title: "Report to Health Center",
                content: `<img src="https://via.placeholder.com/400x200?text=Visit+Health+Center" alt="Health center visit">
                          <p>If you have fever, chills, or other malaria symptoms, report immediately to your nearest health center for testing.</p>`
            },
            45: {
                title: "Take ACTs Properly",
                content: `<img src="https://via.placeholder.com/400x200?text=Taking+Medication" alt="Taking medication">
                          <p>If diagnosed with malaria, complete the full dose of Artemisinin-based Combination Therapy (ACT) as prescribed by your health worker.</p>`
            },
            52: {
                title: "Remove Stagnant Water",
                content: `<img src="https://via.placeholder.com/400x200?text=Clearing+Stagnant+Water" alt="Removing stagnant water">
                          <p>Eliminate mosquito breeding sites by removing stagnant water around your home in containers, gutters, and puddles.</p>`
            },
            65: {
                title: "Pregnant Women Protection",
                content: `<img src="https://via.placeholder.com/400x200?text=Pregnant+Woman+with+Net" alt="Pregnant woman with net">
                          <p>Pregnant women should sleep under LLINs and take Intermittent Preventive Treatment (IPTp) to protect themselves and their babies.</p>`
            },
            75: {
                title: "Community Prevention",
                content: `<img src="https://via.placeholder.com/400x200?text=Community+Cleanup" alt="Community cleanup">
                          <p>Work with your community to organize regular cleanups and malaria prevention activities. Together we can eliminate malaria!</p>`
            },
            92: {
                title: "Malaria-Free Future",
                content: `<img src="https://via.placeholder.com/400x200?text=Happy+Healthy+Family" alt="Healthy family">
                          <p>By following all prevention methods and proper treatment, we can create a malaria-free future for our children!</p>`
            }
        }
    };

    // DOM elements
    const board = document.getElementById('board');
    const diceElement = document.getElementById('dice');
    const rollBtn = document.getElementById('rollBtn');
    const statusElement = document.getElementById('status');
    const winMessageElement = document.getElementById('winMessage');
    const player1Info = document.querySelector('.player1-info');
    const player2Info = document.querySelector('.player2-info');
    const educationModal = document.getElementById('educationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    // Initialize the board with education tips
    function initializeBoard() {
        board.innerHTML = '';
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                let cellNumber;
                if (row % 2 === 0) {
                    cellNumber = 100 - (row * 10 + col);
                } else {
                    cellNumber = 100 - (row * 10 + (9 - col));
                }
                
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.number = cellNumber;
                
                const cellNumberElement = document.createElement('div');
                cellNumberElement.className = 'cell-number';
                cellNumberElement.textContent = cellNumber;
                cell.appendChild(cellNumberElement);
                
                // Add malaria or ladder
                if (gameState.malariaPositions[cellNumber]) {
                    cell.classList.add('malaria');
                    const icon = document.createElement('div');
                    icon.className = 'malaria-icon';
                    icon.innerHTML = '🦟';
                    cell.appendChild(icon);
                } else if (gameState.ladderPositions[cellNumber]) {
                    cell.classList.add('ladder');
                    const icon = document.createElement('div');
                    icon.className = 'ladder-icon';
                    icon.innerHTML = '🪜';
                    cell.appendChild(icon);
                }
                
                // Add education tip markers
                if (gameState.educationTips[cellNumber]) {
                    const tipMarker = document.createElement('div');
                    tipMarker.className = 'education-tip';
                    tipMarker.textContent = 'i';
                    tipMarker.title = 'Health Education Tip';
                    tipMarker.addEventListener('click', () => showEducationTip(cellNumber));
                    cell.appendChild(tipMarker);
                }
                
                board.appendChild(cell);
            }
        }
        
        updatePlayerPositions();
    }

    // Update player positions on the board
    function updatePlayerPositions() {
        // Remove all player elements
        document.querySelectorAll('.player').forEach(el => el.remove());
        
        // Add players to their current positions
        for (const player in gameState.players) {
            const position = gameState.players[player].position;
            const cell = document.querySelector(`.cell[data-number="${position}"]`);
            
            if (cell) {
                const playerElement = document.createElement('div');
                playerElement.className = `player ${player}`;
                playerElement.textContent = player === 'player1' ? '1' : '2';
                cell.appendChild(playerElement);
            }
        }
    }

    // Show education tip
    function showEducationTip(cellNumber) {
        const tip = gameState.educationTips[cellNumber];
        modalTitle.textContent = tip.title;
        modalBody.innerHTML = tip.content;
        educationModal.style.display = 'flex';
    }

    // Close education modal
    modalClose.addEventListener('click', () => {
        educationModal.style.display = 'none';
    });

    // Roll the dice
    function rollDice() {
        if (gameState.gameOver) return;
        
        rollBtn.disabled = true;
        diceElement.textContent = '...';
        
        // Animate dice roll
        let rolls = 0;
        const maxRolls = 10;
        const rollInterval = setInterval(() => {
            gameState.diceValue = Math.floor(Math.random() * 6) + 1;
            diceElement.textContent = gameState.diceValue;
            rolls++;
            
            if (rolls >= maxRolls) {
                clearInterval(rollInterval);
                setTimeout(movePlayer, 500);
            }
        }, 100);
    }

    // Move the active player
    function movePlayer() {
        const activePlayer = gameState.players.player1.isActive ? 'player1' : 'player2';
        let newPosition = gameState.players[activePlayer].position + gameState.diceValue;
        
        // Check for win
        if (newPosition >= 100) {
            newPosition = 100;
            gameState.gameOver = true;
            declareWinner(activePlayer);
        } else {
            // Check for malaria or ladder
            if (gameState.malariaPositions[newPosition]) {
                newPosition = gameState.malariaPositions[newPosition];
                statusElement.textContent = `Oops! ${activePlayer.replace('player', 'Player ')} got bitten by malaria!`;
            } else if (gameState.ladderPositions[newPosition]) {
                newPosition = gameState.ladderPositions[newPosition];
                statusElement.textContent = `Yay! ${activePlayer.replace('player', 'Player ')} climbed a ladder of prevention!`;
            }
            
            gameState.players[activePlayer].position = newPosition;
            updatePlayerPositions();
            
            // Show education tip if landing on one
            if (gameState.educationTips[newPosition]) {
                showEducationTip(newPosition);
            }
            
            if (gameState.diceValue !== 6) {
                switchTurn();
            } else {
                statusElement.textContent = `${activePlayer.replace('player', 'Player ')} rolled a 6 and gets another turn!`;
                rollBtn.disabled = false;
            }
        }
        
        if (!gameState.gameOver && gameState.diceValue !== 6) {
            rollBtn.disabled = false;
        }
    }

    // Switch turns between players
    function switchTurn() {
        gameState.players.player1.isActive = !gameState.players.player1.isActive;
        gameState.players.player2.isActive = !gameState.players.player2.isActive;
        
        if (gameState.players.player1.isActive) {
            statusElement.className = 'status player1-turn';
            statusElement.textContent = "Player 1's Turn";
            player1Info.classList.add('active');
            player2Info.classList.remove('active');
        } else {
            statusElement.className = 'status player2-turn';
            statusElement.textContent = "Player 2's Turn";
            player1Info.classList.remove('active');
            player2Info.classList.add('active');
        }
    }

    // Declare the winner
    function declareWinner(winner) {
        winMessageElement.textContent = `🎉 ${winner.replace('player', 'Player ')} wins! 🎉`;
        statusElement.textContent = 'Game Over!';
        rollBtn.disabled = true;
        
        // Highlight winner
        if (winner === 'player1') {
            winMessageElement.style.color = 'var(--player1-color)';
        } else {
            winMessageElement.style.color = 'var(--player2-color)';
        }
    }

    // Event listeners
    rollBtn.addEventListener('click', rollDice);
    diceElement.addEventListener('click', function() {
        if (!rollBtn.disabled) rollDice();
    });

    // Initialize the game
    initializeBoard();
    player1Info.classList.add('active');
});
