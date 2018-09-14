import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';
import { capitalize } from '@ember/string';
export default Component.extend({
  currentTeam: computed(function(){
    return [];
  }),
  exportable: '',
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
  renderTeam(){
    this.set('loading', false);
    this.set('hasGenerated', true);
    var curr = this.currentTeam;
    let exp = '';
    for(var i=0;i<6;i++){
      exp += curr[i].displayName + "\nAbility: " + curr[i].ability +"\nEVs: " + curr[i].hpEV + " HP / " + curr[i].atkEV + " Atk / " + curr[i].defEV + " Def / " + curr[i].spaEV + " SpA / " + curr[i].spdEV + " SpD / " + curr[i].speEV + " Spe\n";
      exp += curr[i].nature.capitalize() + " Nature\n- " + curr[i].displayM1 + "\n- " + curr[i].displayM2 + "\n- " + curr[i].displayM3 + "\n- " + curr[i].displayM4 + "\n\n";
    }
    this.set('exportable', exp);
    console.log(this.currentTeam);
  },
  actions:{
    generate(){
      this.set('loading', true);
      this.set('numGenerated', 0);
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
              evs.push(ev);
              statTotal -= ev;
            }else if(evs.length == 5){
              if(statTotal == 0){
                evs[4] -= 1;
                let ev = 1;
                evs.push(ev);
              }else{
                let ev = statTotal;
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
          let showName = poke.name.capitalize();
          showName.replace('-', ' ');
          let showAbility = pokeAbility.capitalize();
          showAbility.replace('-', ' ');
          let showM1 = moves[0];
          showM1.replace('-', ' ');
          showM1.capitalize();
          let showM2 = moves[1];
          showM2.replace('-', ' ');
          showM2.capitalize();
          let showM3 = moves[2];
          showM3.replace('-', ' ');
          showM3.capitalize();
          let showM4 = moves[3];
          showM4.replace('-', ' ');
          showM4.capitalize();
          evs = self.shuffle(evs);
          let currSprite;
          if(randPokeID < 10){
            currSprite = 'https://www.serebii.net/sunmoon/pokemon/00' + randPokeID + '.png';
          }else if(randPokeID < 100){
            currSprite = 'https://www.serebii.net/sunmoon/pokemon/0' + randPokeID + '.png';
          }else if(randPokeID == 717){
            currSprite = 'https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/normal/yveltal.png';
          }else{
            currSprite = 'https://www.serebii.net/sunmoon/pokemon/' + randPokeID + '.png'
          }
          let record = {
            name: poke.name,
            displayName: showName,
            sprite: currSprite,
            ability: pokeAbility,
            displayAbility: showAbility,
            nature: currNature,
            move1: moves[0],
            displayM1: showM1,
            move2: moves[1],
            displayM2: showM2,
            move3: moves[2],
            displayM3: showM3,
            move4: moves[3],
            displayM4: showM4,
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
            self.renderTeam();
          }
        });
      }

    }
  }
});
