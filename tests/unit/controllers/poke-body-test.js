import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | poke-body', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:poke-body');
    assert.ok(controller);
  });
});

moduleFor('controller:poke-body', 'poke-body Controller',{
  needs: ['service:currentTeam']
});
