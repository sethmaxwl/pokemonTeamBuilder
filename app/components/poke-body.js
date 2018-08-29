import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';
export default Component.extend({
  currentTeam: computed(function(){
    return [];
  }),
  numGenerated: 0,
  shuffle(a){
    for (var i=a.length-1;i>0;i--){
        let j = Math.floor(Math.random() * (i + 1));
        let x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  },
  printTeam(){
    console.log(this.currentTeam);
  },
  actions:{
    generate(){
      this.set('numGenerated', 0);
      this.set('hasGenerated', true);
      var currGeneratedPoke;
      var generatedIDs = [];
      for(var i=0;i<6;i++){
        let randPokeID = Math.floor(1 + Math.random() * 801);
        let readyToInsert = false;
        while(!readyToInsert){
          let isPresent = false
          for(var i=0;i<generatedIDs.length;i++){
            if(randPokeID == generatedIDs[i]){
              isPresent = true;
            }
          }
          if(isPresent){
            randPokeID = Math.floor(1 + Math.random() * 801);
          }else{
            readyToInsert = true;
          }
        }
        generatedIDs.push(randPokeID);
        let randNatureID = Math.floor(1 + Math.random() * 24);
        let currPoke = "https://pokeapi.co/api/v2/pokemon/" + randPokeID;
        var self = this;
        let natures = ['hardy', 'bold', 'modest', 'calm', 'timid', 'lonely', 'docile', 'mild', 'gentle', 'hasty', 'adamant', 'impish', 'bashful', 'careful', 'jolly', 'naughty', 'lax', 'rash', 'quirky', 'naive', 'brave', 'relaxed', 'quiet', 'sassy', 'serious'];
        let currNature = natures[randNatureID];
        var self = this;
        $.getJSON(currPoke, function(poke){
          let pokeAbilityID = Math.floor(Math.random() * (poke.abilities.length));
          let pokeAbility = poke.abilities[pokeAbilityID].ability.name;
          let moves = [];
          let pickedMoves = [];
          for(var i=0;i<4;i++){
            let randMoveID = Math.floor(Math.random() * (poke.moves.length));
            let readyToInsert = false;
            while(!readyToInsert){
              let isPresent = false
              for(var i=0;i<pickedMoves.length;i++){
                if(randMoveID == pickedMoves[i]){
                  isPresent = true;
                }
              }
              if(isPresent){
                randMoveID = Math.floor(Math.random() * (poke.moves.length));
              }else{
                readyToInsert = true;
              }
            }
            moves.push(poke.moves[randMoveID].move.name);
            pickedMoves.push(randMoveID);
          }
          let statTotal = 510;
          let evs = [];
          for(var i=0;i<6;i++){
            if(statTotal > 252){
              let ev = Math.floor(Math.random() * 252);
              let offFour = ev % 4;
              ev = ev - offFour;
              evs.push(ev);
              statTotal -= ev;
            }else if(evs.length == 5){
              if(statTotal == 0){
                evs[4] -= 4;
                let ev = 4;
                evs.push(ev);
              }else{
                let ev = statTotal;
                let offFour = ev % 4;
                ev = ev - offFour;
                evs.push(ev);
                statTotal -= ev;
              }
            }else{
              let ev = Math.floor(Math.random() * statTotal);
              let offFour = ev % 4;
              ev = ev - offFour;
              evs.push(ev);
              statTotal -= ev;
            }
          }
          evs = self.shuffle(evs);
          let record = {
            name: poke.name,
            ability: pokeAbility,
            nature: currNature,
            move1: moves[0],
            move2: moves[1],
            move3: moves[2],
            move4: moves[3],
            hpEV: evs[0],
            atkEV: evs[1],
            defEV: evs[2],
            spaEV: evs[3],
            spdEV: evs[4],
            speEV: evs[5]
          };
          currGeneratedPoke = record;
        }).then(function(){
          self.currentTeam.push(currGeneratedPoke);
          self.numGenerated += 1;
          if(self.numGenerated == 6){
            self.printTeam();
          }
        });
      }

    }
  }
});
