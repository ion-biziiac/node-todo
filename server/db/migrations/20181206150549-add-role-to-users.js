module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Users',
      'role',
      {
        allowNull: false,
        type: Sequelize.ENUM('user', 'admin', 'disabled'),
        defaultValue: 'user'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Users',
      'role'
    );
  }
};
