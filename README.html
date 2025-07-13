<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>เกม XO สุดเจ๋ง!</title>
    <link href="https://fonts.googleapis.com/css2?family=Mitr:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* สไตล์ CSS */
        body {
            font-family: 'Mitr', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #a8e063, #56ab2f);
            margin: 0;
            color: #333;
            overflow: hidden;
            position: relative;
        }

        body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)"/><line x1="10" y1="90" x2="90" y2="10" stroke="rgba(255,255,255,0.05)" stroke-width="2"/><line x1="10" y1="10" x2="90" y2="90" stroke="rgba(255,255,255,0.05)" stroke-width="2"/></svg>') center/cover no-repeat;
            opacity: 0.2;
            z-index: -1;
        }

        .container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
            padding: 30px 40px;
            text-align: center;
            max-width: 90%;
            width: 450px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 25px;
            font-size: 2.5em;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .game-info {
            font-size: 1.2em;
            margin-bottom: 20px;
            color: #555;
            min-height: 24px; /* เพื่อป้องกันการกระโดดของเลย์เอาต์ */
        }

        .modes {
            margin-bottom: 25px;
        }

        .mode-button {
            background-color: #3498db;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .mode-button:hover {
            background-color: #2980b9;
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .mode-button.active {
            background-color: #27ae60;
            transform: scale(1.05);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .game-board {
            display: grid;
            grid-template-columns: repeat(3, 100px);
            grid-template-rows: repeat(3, 100px);
            gap: 8px;
            margin: 25px auto;
            width: 316px; /* 3*100px + 2*8px */
            background-color: #ecf0f1;
            padding: 8px;
            border-radius: 15px;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
            position: relative;
        }

        .cell {
            width: 100px;
            height: 100px;
            background-color: #ffffff;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 4em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            color: #34495e;
            user-select: none; /* ป้องกันการเลือกข้อความ */
        }

        .cell:hover:not(.x):not(.o) {
            background-color: #e0e0e0;
            transform: scale(1.02);
        }

        .cell.x {
            color: #e74c3c; /* แดง */
        }

        .cell.o {
            color: #2ecc71; /* เขียว */
        }

        .cell.win {
            background-color: #f1c40f; /* เหลือง */
            animation: winAnimation 0.6s ease-in-out infinite alternate;
        }

        @keyframes winAnimation {
            from { transform: scale(1); box-shadow: 0 4px 15px rgba(241, 196, 15, 0.6); }
            to { transform: scale(1.05); box-shadow: 0 8px 25px rgba(241, 196, 15, 0.8); }
        }

        .reset-button {
            background-color: #e74c3c;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 25px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .reset-button:hover {
            background-color: #c0392b;
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        /* Responsive Design */
        @media (max-width: 500px) {
            .container {
                padding: 20px 25px;
                width: 95%;
            }
            h1 {
                font-size: 2em;
            }
            .game-board {
                grid-template-columns: repeat(3, 80px);
                grid-template-rows: repeat(3, 80px);
                width: 260px; /* 3*80px + 2*8px */
            }
            .cell {
                width: 80px;
                height: 80px;
                font-size: 3em;
            }
            .mode-button, .reset-button {
                padding: 10px 20px;
                font-size: 1em;
            }
            .modes {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .mode-button {
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>เกม XO</h1>
        <div class="modes">
            <button class="mode-button active" id="playerVsPlayer">ผู้เล่น vs ผู้เล่น</button>
            <button class="mode-button" id="playerVsBot">ผู้เล่น vs บอท</button>
        </div>
        <div class="game-info" id="gameInfo">ตาของ: X</div>
        <div class="game-board" id="gameBoard">
            <div class="cell" data-index="0"></div>
            <div class="cell" data-index="1"></div>
            <div class="cell" data-index="2"></div>
            <div class="cell" data-index="3"></div>
            <div class="cell" data-index="4"></div>
            <div class="cell" data-index="5"></div>
            <div class="cell" data-index="6"></div>
            <div class="cell" data-index="7"></div>
            <div class="cell" data-index="8"></div>
        </div>
        <button class="reset-button" id="resetButton">เริ่มเกมใหม่</button>
    </div>

    <script>
        // โค้ด JavaScript
        const cells = document.querySelectorAll('.cell');
        const gameInfo = document.getElementById('gameInfo');
        const resetButton = document.getElementById('resetButton');
        const playerVsPlayerBtn = document.getElementById('playerVsPlayer');
        const playerVsBotBtn = document.getElementById('playerVsBot');
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // แนวนอน
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // แนวตั้ง
            [0, 4, 8], [2, 4, 6]            // แนวทแยง
        ];

        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let gameActive = true;
        let isPlayerVsBotMode = false;

        function initializeGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            gameInfo.textContent = `ตาของ: ${currentPlayer}`;
            cells.forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('x', 'o', 'win');
                cell.addEventListener('click', handleCellClick, { once: true });
            });
            playerVsPlayerBtn.classList.remove('active');
            playerVsBotBtn.classList.remove('active');
            if (isPlayerVsBotMode) {
                playerVsBotBtn.classList.add('active');
            } else {
                playerVsPlayerBtn.classList.add('active');
            }
        }

        function handleCellClick(e) {
            const clickedCell = e.target;
            const clickedCellIndex = parseInt(clickedCell.dataset.index);

            if (board[clickedCellIndex] !== '' || !gameActive) {
                return;
            }

            makeMove(clickedCell, clickedCellIndex, currentPlayer);
            checkResult();

            if (gameActive && isPlayerVsBotMode && currentPlayer === 'O') {
                setTimeout(botMove, 700); // หน่วงเวลาให้บอทคิด 0.7 วินาที
            }
        }

        function makeMove(cellElement, index, player) {
            board[index] = player;
            cellElement.textContent = player;
            cellElement.classList.add(player.toLowerCase());
            // ลบ event listener เพื่อไม่ให้คลิกซ้ำได้
            cellElement.removeEventListener('click', handleCellClick);
        }

        function changePlayer() {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            gameInfo.textContent = `ตาของ: ${currentPlayer}`;
        }

        function checkResult() {
            let roundWon = false;
            for (let i = 0; i < winningConditions.length; i++) {
                const winCondition = winningConditions[i];
                let a = board[winCondition[0]];
                let b = board[winCondition[1]];
                let c = board[winCondition[2]];

                if (a === '' || b === '' || c === '') {
                    continue;
                }
                if (a === b && b === c) {
                    roundWon = true;
                    // ทำเครื่องหมายเซลล์ที่ชนะ
                    winCondition.forEach(index => {
                        cells[index].classList.add('win');
                    });
                    break;
                }
            }

            if (roundWon) {
                gameInfo.textContent = `ผู้เล่น ${currentPlayer} ชนะ!`;
                gameActive = false;
                return;
            }

            let roundDraw = !board.includes('');
            if (roundDraw) {
                gameInfo.textContent = `เสมอ!`;
                gameActive = false;
                return;
            }

            changePlayer();
        }

        function botMove() {
            let availableCells = [];
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    availableCells.push(i);
                }
            }

            if (availableCells.length === 0) return; // ไม่มีช่องว่างเหลือ

            // กลยุทธ์บอท (ง่ายๆ):
            // 1. ตรวจสอบว่าบอทสามารถชนะได้หรือไม่
            for (let i = 0; i < winningConditions.length; i++) {
                const [a, b, c] = winningConditions[i];
                if (board[a] === 'O' && board[b] === 'O' && board[c] === '' && availableCells.includes(c)) {
                    makeMove(cells[c], c, 'O');
                    checkResult();
                    return;
                }
                if (board[a] === 'O' && board[c] === 'O' && board[b] === '' && availableCells.includes(b)) {
                    makeMove(cells[b], b, 'O');
                    checkResult();
                    return;
                }
                if (board[b] === 'O' && board[c] === 'O' && board[a] === '' && availableCells.includes(a)) {
                    makeMove(cells[a], a, 'O');
                    checkResult();
                    return;
                }
            }

            // 2. ตรวจสอบว่าผู้เล่นกำลังจะชนะหรือไม่ (และบล็อก)
            for (let i = 0; i < winningConditions.length; i++) {
                const [a, b, c] = winningConditions[i];
                if (board[a] === 'X' && board[b] === 'X' && board[c] === '' && availableCells.includes(c)) {
                    makeMove(cells[c], c, 'O');
                    checkResult();
                    return;
                }
                if (board[a] === 'X' && board[c] === 'X' && board[b] === '' && availableCells.includes(b)) {
                    makeMove(cells[b], b, 'O');
                    checkResult();
                    return;
                }
                if (board[b] === 'X' && board[c] === 'X' && board[a] === '' && availableCells.includes(a)) {
                    makeMove(cells[a], a, 'O');
                    checkResult();
                    return;
                }
            }

            // 3. ถ้าไม่มีการชนะหรือบล็อกที่ชัดเจน ให้เลือกมุม (ถ้าว่าง)
            const corners = [0, 2, 6, 8];
            for (let i = 0; i < corners.length; i++) {
                if (board[corners[i]] === '' && availableCells.includes(corners[i])) {
                    makeMove(cells[corners[i]], corners[i], 'O');
                    checkResult();
                    return;
                }
            }

            // 4. เลือกตรงกลาง (ถ้าว่าง)
            if (board[4] === '' && availableCells.includes(4)) {
                makeMove(cells[4], 4, 'O');
                checkResult();
                return;
            }

            // 5. ถ้าไม่มีเงื่อนไขข้างต้น ให้เลือกเซลล์ว่างแบบสุ่ม
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const botChosenIndex = availableCells[randomIndex];
            makeMove(cells[botChosenIndex], botChosenIndex, 'O');
            checkResult();
        }


        // Event Listeners
        playerVsPlayerBtn.addEventListener('click', () => {
            isPlayerVsBotMode = false;
            initializeGame();
        });

        playerVsBotBtn.addEventListener('click', () => {
            isPlayerVsBotMode = true;
            initializeGame();
        });

        resetButton.addEventListener('click', initializeGame);

        // เริ่มต้นเกมเมื่อโหลดหน้า
        initializeGame();

    </script>
</body>
</html>
