const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const headerPage = {
        url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_by: {
            type: DataTypes.STRING,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deleted_by: {
            type: DataTypes.STRING,
            allowNull: true
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    };

    const options = {
        tableName: "header_pages",
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        paranoid: true,
        defaultScope: {
            attributes: {}
        }
    };

    return sequelize.define('header_pages', headerPage, options);
}