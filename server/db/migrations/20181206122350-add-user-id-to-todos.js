module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Todos',
      'userId',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId' 
        },
        onDelete: 'CASCADE'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Todos',
      'userId'
    );
  }
};
