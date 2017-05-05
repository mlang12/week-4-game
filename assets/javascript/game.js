$(document).ready(function(){
  "use strict";
  //Sets the initial global variables used to select sections of the DOM
  var secSelect = $(".selection");
  var secPlayer = $(".player");
  var secEnemies = $(".enemies");
  var secDefend = $(".defend");
  var secFight = $(".fight");
  var resetButton = $(".reset");
  var fightButton = $(".attack");
  var msg = $(".message");
  var msg2 = $(".message2");

  //The entire RPG game Object
  var game = {

    //The characters and their attributes
    characters: {
      han:{
        attack: 12,
        counterAttack: 12,
        hp: 100,
        alias: "Baby Han"
      },
      leia:{
        attack: 10,
        counterAttack: 10,
        hp: 110,
        alias: "Lil Leia"
      },
      darth: {
        attack: 25,
        counterAttack: 25,
        hp: 60,
        alias: "Darthy"
      },
      bobo: {
        attack: 15,
        counterAttack: 15,
        hp: 90,
        alias: "Bobo"
      }
    },

    //Vaiables used to determine game state and character status 
    mode: "select",  //modes: "select","enemy","fight","win","lose"
    player: "",
    enemies: [],
    currentEnemy: "",
    message: "",
    message2: "",
    playerColor: "#18d545",
    enemyColor: "#fd4242",
    defaultColor: "#f8f8f8",

    //Refreshes the page. No manual reset required since nothing in 
    //the game will 'persist' to the next 'round' like a win or loss counter
    reset: function(){
      location.reload(); 
    },

    //Initializes the game
    init: function(){
      //Set initial message and redraw
      this.message = "Select Your Character";
      this.message2 = "-***-";
      this.redraw();
    },

    //Function handles battle
    battle: function(){
      //Create each round attack result messages
      this.message = "You did " + this.characters[this.currentEnemy].alias + " " + this.characters[this.player].attack + " damage.";
      this.message2 = this.characters[this.currentEnemy].alias + " attacked you back for " + this.characters[this.currentEnemy].counterAttack + ".";

      //Attack exchange. Decrease health by opponent's attack and increase players attack
      this.characters[this.player].hp -= this.characters[this.currentEnemy].counterAttack;
      this.characters[this.currentEnemy].hp -= this.characters[this.player].attack;
      this.characters[this.player].attack += this.characters[this.player].counterAttack;
      this.redSplash()
    },

    //Function handles what happens when a character is clicked
    //Depending on the game state at that time
    play: function (chr){
      var _this = this; //Cache this
      var char = chr.attr("id"); //Get the id of clicked character tile

      //If the game is in select mode game assumes user selected a character
      if(this.mode === "select"){
        this.player = char; //Move selected character to the 'player'
        this.message = "Select who you want to battle against";
        this.message2 = "-***-";
        Object.keys(this.characters).forEach(function(nme){ //move all others to enemy array
          if(nme !== _this.player) {
            _this.enemies.push(nme);
          }
        });
        this.mode = "enemy"; //Transition to enemy mode
      }

      //If selection was made during enemy mode game assumes user selected who
      //they will do battle against
      else if (this.mode === "enemy"){

        if(this.enemies.indexOf(char) > -1){ //If user clicked tile is in the enemy array
          this.currentEnemy = char; //Move the selected character to the enemy currently in battle
          this.enemies.splice(this.enemies.indexOf(this.currentEnemy),1); //Remove that enemy from the enemy array
          this.message = "";
          this.message2 = "";
          this.mode = "fight"; //Transition to fight mode
        }
      }
    },

    //This function is called at the end of every user input received
    //and redraws the state of the game on the browser after each input
    redraw: function(){
      var _this = this; //Cache this

      //When the game is in select mode (this runs on startup) it hides all unused areas of the DOM
      if (this.mode === "select"){
        secPlayer.hide();
        secEnemies.hide();
        secDefend.hide();
        fightButton.hide();
        resetButton.hide();
        secFight.show();
        secSelect.show();
      }

      //Will run when mode is 'enemy.' Moves character and enemy tiles to proper locations
      //Hides the character seleciton section, buttons, and defend areas. Shows the enemy select
      //and player character sections. Sets up to wait for player to select battle opponent
      if(this.mode === "enemy"){
        $("#" + this.player).appendTo(secPlayer); //Move selected player to the player section
        $("#" + this.player).css("background-color", this.playerColor); //Color the player in playerColor

        this.enemies.forEach(function(en){
          $("#" + en).appendTo(secEnemies); //Moves all enemies to the enemy section of DOM
          $("#" + en).css("background-color", _this.enemyColor); //Colors enemies in enemy color
        });

        secSelect.hide();
        fightButton.hide();
        resetButton.hide();
        secDefend.hide();
        secEnemies.show();
        secPlayer.show();
      }

      //Runs when the game is in fight mode. Moves the selected current enemy to the defend area
      //Hides the enemy section and shows the fight button and defend areas of DOM
      if(this.mode === "fight"){
        $("#" + this.currentEnemy).appendTo(secDefend);
        //$("#" + this.currentEnemy).appendTo(enemyFight);
 
        secEnemies.hide();
        fightButton.show();
        secDefend.show();

      }

      //If the game has been won or lost hide the fight button and defend areas. Show the reset button.
      if(this.mode === "win" || this.mode === "lose"){
        $("#fightConsole").attr("id", "fightC")
        fightButton.hide();
        secDefend.hide();
        resetButton.show();
      }

      //Regardless of game mode update each character's stats on refresh and update the message texts
      Object.keys(this.characters).forEach(function(en){
        $("#" + en + " .hp").html("HP: " + _this.characters[en].hp);
        $("#" + en + " .atk").html("  ||  Atk: " + _this.characters[en].attack);
      });
      msg.html(this.message);
      msg2.html(this.message2);
    },

    //Checks if the state of the game is in 'win' or 'lose' state and
    //handles them. Otherwise does nothing.
    checkWin: function(){
      if(this.mode === "win"){
        this.message = "Yay! You won!";
      }

      if(this.mode === "lose"){
        this.message = "Your player, " + this.characters[this.player].alias + " has died.";
      }

      if(this.mode === "win" || this.mode === "lose"){
        this.message2 = "Please click restart to play again.";
      }

    },

    //Handles the state of the battle/game after exchange of attacks
    battleResult: function(){
      if(this.mode === "fight"){

        //If player has died
        if(this.characters[this.player].hp < 1){
          this.mode = "lose";
        }

        //If enemy has died and you didn't die first
        if(this.characters[this.currentEnemy].hp < 1 && this.mode !== "lose"){
          if(this.enemies.length === 0) {
            this.mode = "win";
          } else {
            this.mode = "enemy";
          }

          $("#" + this.currentEnemy).hide();
          this.message = "";
          this.message2 = "";
        }
      }
    },

    //Animates a splash of red on screen durring a fight
    redSplash: function() {
      $(".player").toggleClass("redSplash");
      $(".defend").toggleClass("redSplash");
      setTimeout(function(){
        $(".player").toggleClass("redSplash");
        $(".defend").toggleClass("redSplash");
      }, 100);
    }
  };  

  //Calls the game initializer
  game.init();

  //If one of the character boxes is selected it passes that element
  //to the game for handling
  $(".characters").click(function(){ 
    game.play($(this));
    game.redraw();
  });

  //if the attack button is clicked it passes that info to the game 
  //for handling then checks to see if game is over
  fightButton.click(function(){ 
    game.battle();
    game.battleResult();
    game.checkWin();
    game.redraw();
  });

  //If the reset button is hit it will refresh the page
  resetButton.click(function(){ 
    game.reset();
  });
});