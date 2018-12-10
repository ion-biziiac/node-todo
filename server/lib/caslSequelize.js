const { rulesToQuery } = require('@casl/ability/extra');
const ruleToQuery = (rule) => {
  if (JSON.stringify(rule.conditions).includes('"$all":')) {
    throw new Error('Sequelize does not support "$all" operator');
  }

  return rule.inverted ? { $not: rule.conditions } : rule.conditions;
};

module.exports = (ability, subject, action = 'read') => {
  return rulesToQuery(ability, action, subject, ruleToQuery);
};
