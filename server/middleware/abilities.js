const { AbilityBuilder, Ability } = require('@casl/ability');

const defineAbilitiesFor = (user) => {
  const { rules, can, cannot } = AbilityBuilder.extract();

  if (user) {
    if (user.isAdmin()) {
      can('manage', 'all');
    } else if (user.isUser()) {
      can(['read', 'create', 'delete', 'update'], 'Todo', { userId: user.id });
      can(['create', 'delete', 'update'], 'TodoItem', { 'todo.userId': user.id });
      can('read', 'User', { id: user.id });
      can('update', 'User', ['firstName', 'lastName', 'email', 'password'], { id: user.id });
    } else if (user.isDisabled()) {
      cannot('manage', 'all');
    }
  }

  return new Ability(rules);
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null);

module.exports = (req, res, next) => {
  req.ability = req.user.email ? defineAbilitiesFor(req.user) : ANONYMOUS_ABILITY;
  next();
};
