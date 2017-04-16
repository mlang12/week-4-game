
//get user selection
//move that selection to player section
//move remaining tiles to enemies section
//get user enemy selection
//move that enemy to the defend area
//make the attach button trigger a fight operation
//  -- adjust each players life based on attack strength
//  -- 
$(document).ready(function(){
  var secSelect = $(".selection")
  var secPlayer = $(".player")
  var secEnemies = $(".enemies")
  var secDefend = $(".defend")
  var game = {
    characters: {
      han:{
        attack: 6,
        hp: 100,
        defaultHp: 100
      },
      leia:{
        attack: 5,
        hp: 110,
        defaultHp: 110
      },
      darth: {
        attack: 8,
        hp: 85,
        defaultHp: 85
      },
      bobo: {
        attack: 7,
        hp: 90,
        defaultHp: 90
      }
    },
    modes: ["select","enemy","fight","win","lose"],
    mode: 'select',
    player: '',
    enemies: [],
    currentEnemy: '',

    reset: function(){
      this.player = ""
      this.characters.han.hp = this.characters.han.defaultHp
      this.characters.leia.hp = this.characters.leia.defaultHp
      this.characters.darth.hp = this.characters.darth.defaultHp
      this.characters.bobo.hp = this.characters.bobo.defaultHp

    },

    attack: function(){

    },

    play: function (chr){
      var _this = this //cache this
      var char = chr.attr("id")
      if(this.mode === 'select'){
        this.player = char; //Move selected character to the 'player'
        Object.keys(this.characters).forEach(function(nme){ //move all others to enemy
          if(nme !== _this.player) {
            _this.enemies.push(nme);
          };
        });
        this.mode = "enemy"
        this.redraw();
      } else if (this.mode === "enemy"){
        //If selection was for an enemy set to the current enemey
        console.log(this.player, this.enemies)
        if(this.enemies.indexOf(char) > -1){
          this.currentEnemy = char;
          this.enemies.splice(this.enemies.indexOf(this.currentEnemy),1);
          this.mode = "fight"
          this.redraw();
        }
      }
    },

    redraw: function(){
      //if(this.mode === "enemy"){
        $("#" + this.player).appendTo(secPlayer)

        this.enemies.forEach(function(en){
          $("#" + en).appendTo(secEnemies);
        });

        $("#" + this.currentEnemy).appendTo(secDefend);
      //}          
    }
  }  

  game.reset()

  //If one of the character boxes is selected it passes that element
  //to the game for handling
  $('.characters').click(function(){ 
    game.play($(this))
  })

  //if the attach button is clicked it passes that info to the game 
  //for handling
  $('.attack').click(function(){ 
    game.attack()
  })

  //If the reset button is hit it will trigger a game reset
  $('.restart').click(function(){ 
    game.reset()
  })


})