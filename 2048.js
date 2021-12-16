const board = document.querySelector('.board');
const scoreBoard = document.querySelector('.score');
const gameover = document.querySelector('.gameOver');
const colors = ['blue','green','red','coral','violet','royalblue','brown','crimson','darksalmon','darkslateblue','hotpink','magenta','olive','palegreen','orchid'];

let tiles; 
let previousTiles;
let score;
let previousScore;

start();

/**
 * Hide the game over screen.
 * Initializes tiles, previousTile, score, and previousScore.
 * Generates two tiles.
 * Renders the board.
 */
function start() {
    //initializing variables and calling functions

    gameover.classList.remove('show');
    tiles = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    previousTiles = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    score = 0;
    previousScore = 0;
    generateTile();
    generateTile();
    render();

}

// Call control whenever a key is pressed.
window.addEventListener('keydown', control);

/**
 * Moves in a direction or undoes an action based 
 *   on e.key.
 * 
 * Generates a new tile if the board changed and 
 *  isn't full.
 * 
 * Renders the board.
 * 
 * Reveals the game over screen if the game is over.
 * @param {*} e 
 */
function control(e) {
    //first, we check for undo

    if(e.key==='u'){
        undo();
        render();
        return;
    }

    //any other keys other than arrows will not work

    let possible = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
    if(possible.indexOf(e.key)===-1){
        return;
    }

    //board is moved, new tiles are generated and gameover is checked.
    move(e.key);
    if(!full()){
        generateTile();
    }    
    render();
    if(gameOver()){
        gameover.classList.add('show');
    }
}

/**
 * Returns true if tiles is full; false otherwise.
 * tiles is considered full if it doesn't contain a 0.
 */
function full() {
    //iterates through all tiles to check if they are filled
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(tiles[i][j]===0){
                return false;
            }
        }
    }
    return true;
}

/**
 * Inserts a tile into a randomly selected empty spot in tiles.
 * 80% chance to generate a '2' tile
 * 20% chance to generate a '4' tile
 */
function generateTile() {
    // first, we generate a list of all tiles that are empty. 
    let emptyCells = [];
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(tiles[i][j]===0){
                emptyCells.push([i,j]);
            }
        }
    }

    //we randomly choose one of the tiles and then randomly place a 4 or 2
    let index = Math.floor(Math.random()*emptyCells.length);
    if(Math.random()>0.8){
        tiles[emptyCells[index][0]][emptyCells[index][1]] = 4;
    }else{
        tiles[emptyCells[index][0]][emptyCells[index][1]] = 2;
    }
}

/**
 * Saves the elements from tiles into previousTiles.
 * Moves in the specified direction by delegating the
 *   move to moveVertical or moveHorizontal.
 * @param {*} direction 
 */
function move(direction) {
    //we copy the previous states into the variables
    previousScore = score;
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            previousTiles[i][j] = tiles[i][j];
        }
    }
    //we call appropriate helper functions
    if(direction==='ArrowUp'){
        moveVertical(true);
    }else if(direction==='ArrowDown'){
        moveVertical(false);
    }else if(direction==='ArrowLeft'){
        moveHorizontal(false);
    }else if(direction==='ArrowRight'){
        moveHorizontal(true);
    }
}

/**
 * Moves tiles in the specified horizontal direction.
 * 
 * Equal adjacent pairs of tiles in the same row will 
 *   be combined.
 * When tiles are combined, score will increase by
 *  an amount equal to the new tile that was created.
 * 
 * @param {*} right true if moving right; false otherwise
 */
function moveHorizontal(right) {
    if(right){
        //moves all the zeroes away and brings the other numbers together

        for(let i = 0; i < 4; i++){
            for(let j = 3; j >= 0; j--){
                if(tiles[i][j]===0){
                    continue;
                }
                let k = j;
                while(k<3 && tiles[i][k+1]===0){
                    tiles[i][k+1] = tiles[i][k];
                    tiles[i][k]=0;
                    k++;
                }
            }
        }

        //combines numbers if its possible
        for(let i = 0; i < 4; i++){
            for(let j = 3; j>0; j--){
                if(tiles[i][j]===tiles[i][j-1]){
                    score += tiles[i][j]*2;
                    tiles[i][j] = tiles[i][j]*2;
                    tiles[i][j-1] = 0;
                }
            }
        }

        //moves away any extra zeroes after the numbers are combined
        for(let i = 0; i < 4; i++){
            for(let j = 3; j >= 0; j--){
                if(tiles[i][j]===0){
                    continue;
                }
                let k = j;
                while(k<3 && tiles[i][k+1]===0){
                    tiles[i][k+1] = tiles[i][k];
                    tiles[i][k]=0;
                    k++;
                }
            }
        }
        
    }else{
        //same process as above
        for(let i = 0; i < 4; i++){
            for(let j = 0; j <= 3; j++){
                if(tiles[i][j]===0){
                    continue;
                }
                let k = j;
                while(k>0 && tiles[i][k-1]===0){
                    tiles[i][k-1] = tiles[i][k];
                    tiles[i][k]=0;
                    k--;
                }
            }
        }

        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 3; j++){
                if(tiles[i][j]===tiles[i][j+1]){
                    score += tiles[i][j]*2;
                    tiles[i][j] = tiles[i][j]*2;
                    tiles[i][j+1]=0;
                }
            }
        }

        for(let i = 0; i < 4; i++){
            for(let j = 0; j <= 3; j++){
                if(tiles[i][j]===0){
                    continue;
                }
                let k = j;
                while(k>0 && tiles[i][k-1]===0){
                    tiles[i][k-1] = tiles[i][k];
                    tiles[i][k]=0;
                    k--;
                }
            }
        }
    }
}

/**
 * Moves tiles in the specified vertical direction.
 * 
 * Equal adjacent pairs of tiles in the same column will 
 *   be combined.
 * When tiles are combined, score will increase by
 *  an amount equal to the new tile that was created.
 * 
 * @param {*} down true if moving down; false otherwise 
 */
function moveVertical(down) {
    // same process as used for moveHorizontal except the indices are altered. 
    if(!down){
        for(let j = 0; j < 4; j++){
            for(let i = 3; i >= 0; i--){
                if(tiles[i][j]===0){
                    continue;
                }
                let k = i;
                while(k<3 && tiles[k+1][j]===0){
                    tiles[k+1][j] = tiles[k][j];
                    tiles[k][j]=0;
                    k++;
                }
            }
        }
        for(let j = 0; j < 4; j++){
            for(let i = 3; i>0; i--){
                if(tiles[i][j]===tiles[i-1][j]){
                    score += tiles[i][j]*2;
                    tiles[i][j] = tiles[i][j]*2;
                    tiles[i-1][j] = 0;
                }
            }
        }

        for(let j = 0; j < 4; j++){
            for(let i = 3; i >= 0; i--){
                if(tiles[i][j]===0){
                    continue;
                }
                let k = i;
                while(k<3 && tiles[k+1][j]===0){
                    tiles[k+1][j] = tiles[k][j];
                    tiles[k][j]=0;
                    k++;
                }
            }
        }
    }else{
        for(let j = 0; j < 4; j++){
            for(let i = 0; i <= 3; i++){
                if(tiles[i][j]===0){
                    continue;
                }
                let k = i;
                while(k>0 && tiles[k-1][j]===0){
                    tiles[k-1][j] = tiles[k][j];
                    tiles[k][j]=0;
                    k--;
                }
            }
        }

        for(let j = 0; j < 4; j++){
            for(let i = 0; i < 3; i++){
                if(tiles[i][j]===tiles[i+1][j]){
                    score += tiles[i][j]*2;
                    tiles[i][j] = tiles[i][j]*2;
                    tiles[i+1][j]=0;
                }
            }
        }

        for(let j = 0; j < 4; j++){
            for(let i = 0; i <= 3; i++){
                if(tiles[i][j]===0){
                    continue;
                }
                let k = i;
                while(k>0 && tiles[k-1][j]===0){
                    tiles[k-1][j] = tiles[k][j];
                    tiles[k][j]=0;
                    k--;
                }
            }
        }
    }
}

/**
 * Undo the last action by saving previousTiles back
 *  into tiles and previousScore back into score;
 */
function undo() {
    //sets tiles and score to previous state
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            tiles[i][j] = previousTiles[i][j];
        }
    }
    score = previousScore;
}

/**
 * Returns true if tiles and previousTiles contain 
 *   different elements; false otherwise.
 */
function changed() {
    //iterates through each element and checks if they are identical
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(tiles[i][j]!==previousTiles[i][j]){
                return true;
            }
        }
    }
    return false;
}

/**
 * Returns true if the game is over; false otherwise
 * The game is over if the board is full and no adjacent
 *   tiles can be combined.
 */
function gameOver() {
    //checks if the board is full yet
    if(!full()){
        return false;
    }

    //if there are any equal tiles next to each other, returns false
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(i<3 && tiles[i][j]===tiles[i+1][j]){
                return false;
            }
            if(j<3 && tiles[i][j]===tiles[i][j+1]){
                return false;
            }
        }
    }
    return true;
}

/**
 * Render the board by looping through tiles, creating
 *  a div for each tile with the class 'tile' and appending
 *  it to board.
 */
function render() {
    // Clear the current board

    // Loop through tiles
            // Create a div element called tile
            // Assign the value to tile
            // Assign a font size to tile
            // Assign a color to tile
            // Add 'tile' to tile's class list
            // Append tile to board

    // Assign score to scoreBoard
    board.innerHTML = '';

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            let div = document.createElement('div');
            if(tiles[i][j]!==0)
                div.innerHTML = tiles[i][j];

            //manually scales the font size of a tile
            div.style.fontSize  = 1000/(10+(''+tiles[i][j]).length)+'px';
            //gets a color from colors array based on log base 2 indexing;
            div.style.background = colors[getBaseLog(2,tiles[i][j])-1];
            div.style.color = 'white';
            div.classList.add('tile');
            board.append(div); 
        }
    }
    scoreBoard.innerHTML = score;

}

/**
 * Finds the exponent z given x and y.
 * Example:
 *  x <-- 2
 *  y <-- 8
 * 
 *  2^z = 8
 * 
 * This function is useful when scaling the tile
 *   colors based on the tile value.
 * 
 * @param {*} x 
 * @param {*} y 
 */
function getBaseLog(x, y) {
    return Math.floor(Math.log(y)/Math.log(x));
}