import { sequelize } from '../configs/database';
import { Model, DataTypes, Sequelize } from 'sequelize';

class ContactModel extends Model {
    declare id: number;
    declare phoneNumber: string | null;
    declare email: string | null;
    declare linkedId: number | null;
    declare linkPrecedence: 'secondary' | 'primary';
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date | null;
}

ContactModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Contacts', key: 'id' }
    },
    linkPrecedence: {
        type: DataTypes.ENUM('secondary', 'primary'),
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'Contacts'
});

// Sync models with database, creating the table if it doesn't exist
sequelize.sync();

export default ContactModel;
