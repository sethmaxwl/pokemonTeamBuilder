import DS from 'ember-data';

export default DS.Model.extend({
  pokeID: DS.attr('number'),
  name: DS.attr('string'),
  ability: DS.attr('string'),
  nature: DS.attr('string'),
  move1: DS.attr('string'),
  move2: DS.attr('string'),
  move3: DS.attr('string'),
  move4: DS.attr('string'),
  hpEV: DS.attr('number'),
  atkEV: DS.attr('number'),
  defEV: DS.attr('number'),
  spaEV: DS.attr('number'),
  spdEV: DS.attr('number'),
  speEV: DS.attr('number'),
  currentTeam: Ember.inject.service()
});
