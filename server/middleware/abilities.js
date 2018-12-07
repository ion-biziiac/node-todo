const { AbilityBuilder, Ability } = require('@casl/ability');

const defineAbilitiesFor = (user) => {
  const { rules, can, cannot } = AbilityBuilder.extract();

  cannot('read', 'all');
  cannot('manage', 'all')

  if (user) {
    if (user.isAdmin()) {
      can('manage', 'all');
    } else {
      can(['read', 'create', 'delete', 'update'], 'Todo', { userId: user.id });
      can(['read', 'create', 'delete', 'update'], 'TodoItem', { "todo.userId": user.id });
      can(['read', 'update'], 'User', { id: user.id });
    }
  }

  return new Ability(rules);
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null);

module.exports = (req, res, next) => {
  req.ability = req.user.email ? defineAbilitiesFor(req.user) : ANONYMOUS_ABILITY;
  next();
};
