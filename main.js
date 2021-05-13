const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let isEndOfGame = false;
let moveCounter = 0; // to change psn of hat after every 10 moves.
let startTime;
let endTime;


//how to make the game better ;
// - use arrows instead of letters to move

//  codecademy ideas ;
// - 
// - add more holes after a certain time
// - improve your games graphics??
// - create a field validator to check whether the game can actually be solved.

class Field {
    constructor(arr = [[]]) {
        this.arr = arr;
        this.row = 0;
        this.column = 0;  
    }
    static generateField(width, height, percOfHoles) {
        // ive read that you should avoid using new Array. let arr = new Array(10, 20, 30) would create a new array filled with those values, however using just one value eg 10, will produce an array with 10 empty elements. This can help us in this case.
        let arr = new Array(height).fill(0).map(el => new Array(width));//was struggling with this so this line copied from codecademy. solution
        const randomise = (num) => {
            return Math.floor(Math.random()*num)
        }
        //fills field with fieldCharacters
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                arr[i][j] = fieldCharacter;
            }
        }
        // randomly places holes
        let numOfHoles = (width * height)/100 * percOfHoles;
        while(numOfHoles > 0) {
            arr[randomise(height)][randomise(width)] = hole;
            numOfHoles--;
        } 
        // puts pathCharacter at top left of grid
        arr[0][0] = pathCharacter;
        // randomises location of hat
        arr[randomise(height)][randomise(width)] = hat;
    
        return arr;
    }

    randomiseHat(height, width) {
        outer:for (let i = 0; i < height; i++) {
            inner:for (let j = 0; j < width; j++) {
                if (this.arr[i][j] === hat) {
                    this.arr[i][j] = fieldCharacter;
                    break outer; //breaks out of outer loop once hat is found.
                }
            }
        }
        
        this.arr[Math.floor(Math.random()*height)][Math.floor(Math.random()*width)] = hat;//could have made randomise() a method
    }

    fieldValidator() {
    
        //tests whether field can be solved - something to come back to
        //IDEAS
        // 1 - produce all co-ordinates of holes - no go area
        // 2 - produce all co-ordinates of outofbounds - no go area
        // 3 - give co-ordinates of hat
        // 4 - move into empty field space If(arr[i][j] === 'field character'); generated arr[i][j] will have to be within ONE move of the current psn.
        // 5 - record own trail as no go area 
    }
    

    print() {
        // prints array as a string to the console, this will need to be done after each move.
        process.stdout.write('\x1Bc');//clears the console before each print
        this.arr.forEach(row => {
            console.log(row.join(""));
        })
    }

    getPosition() {
       // return the current position of the player;
        return this.arr[this.row][this.column];
    }


    move() {
        //changes row and column coordinates 
        let validDir = false;
        while(!validDir){
            let dir = prompt(`Which way do you want to move? Please type either l, r, u or d :`);
        
            if(dir === "l") {
                this.column -=1;
                validDir = true;
                
            } else if (dir === "r") {
                    this.column +=1;
                    validDir = true;
                
            } else if(dir ==="u") {
                this.row -=1;
                validDir = true;
                
            } else if (dir === "d") {
                this.row +=1;
                validDir = true;
                
            }else {
                // this msg doesnt show as it goes straight to the prompt
                "Please enter a valid direction!";
            }
        }
    }

    assessMove() {
        //if pathCharacter goes out of game area, game is over.
        if(this.column < 0 ||this.column > this.arr[0].length -1 || this.row < 0 || this.row > this.arr.length -1)  {
            isEndOfGame = true;
            console.log("You have moved out of the game area - GAME OVER!");
        }
        // if pathCharacter encounters another pathCharacter(its own trail) it cannot move
        else if(this.getPosition() === pathCharacter) {
            isEndOfGame = true;
            console.log("You have hit your own trail - GAME OVER!");
        }
        //if pathCharacter encounters a O, console.log("You fell down a hole, unlucky")
        else if(this.getPosition() === hole) {
            isEndOfGame = true;
            console.log("You have fallen down a hole - GAME OVER!");
        }
        //if pathCharacter finds the ^, console.log("You found your hat, well done! You completed the game")
        else if (this.getPosition() === hat) {
            isEndOfGame = true;
            this.getMyTime("end")
            let points =  100000 - (endTime - startTime);
            console.log("You have found your hat! Well done! You completed the game.");
            console.log(`You scored ${points} points!`);
        } else {
            moveCounter++;
            this.arr[this.row][this.column] = pathCharacter; // doesnt like this.getPosition() = pathCharacter for some reason.
        }
    }

    getMyTime(time) {
        // provides a start and end time to calculate a score.
        if(time === "start") {
            startTime = new Date().getTime();
        } else if (time === "end") {
            endTime = new Date().getTime();
        }
    }

    playAgain(name) {
        let playAgainDecisionMade = false;
        while(!playAgainDecisionMade) {
        let playAgain = prompt(`${name} thanks for playing, would you like to play again? Please type either y or n :`);
        if(playAgain === "y") {
            Field.playGame();
            playAgainDecisionMade = true;
        } else if (playAgain === "n"){
            playAgainDecisionMade = true;
            console.log(`Bye ${name}!`);
        } 
        }
    }

    static playGame() {
        moveCounter = 0;
        isEndOfGame = false;
        let name = prompt("Hi What is your name? :");
        // w = prompt(`${name}, please type the width you'd like you game area to be :`);
        // h = prompt(`Now please type the height :`);
        const myField = new Field(Field.generateField(20, 20, 20));
        myField.print();
        console.log(`Hi ${name}, lets play Find Your Hat!`);
        let hardMode = prompt(`${name}, would you like to play hard mode? Please type either y or n :`)
        console.log(`Move the * to find the ^ avoiding the O's, and stay in the game area! The quicker you find your hat, the more points you get....GO!`);
        myField.getMyTime("start");
        while(!isEndOfGame) {
            myField.move()
            myField.assessMove()
            if (hardMode === "y") {
                // moves psn of hat if moveCounter % random num out of 10 equals 0;
                if(moveCounter % Math.ceil(Math.random()*10) === 0) {
                    myField.randomiseHat(myField.arr.length, myField.arr[0].length);
                }
            } else if(hardMode === "n") {
                // moves psn of hat every 10 moves
                if(moveCounter % 10 === 0) {
                    myField.randomiseHat(myField.arr.length, myField.arr[0].length);
                }
            }
            if(!isEndOfGame) {
                myField.print();
            }
        }
    
        setTimeout(function(){myField.playAgain(name)}, 2000); // something i found out, when using setTimeout with a function, the function you want to run, in this case playAgain() has to go inside another function!
        //setTimeout(this.playAgain.bind(this,[name]), 2000) IMPORTANT - this is an example of using this inside a timeout function with bind.
    }   
}

Field.playGame();

