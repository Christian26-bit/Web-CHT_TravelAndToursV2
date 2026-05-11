'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Booking, { foreignKey: 'BookingID' });
    }
  }

  Payment.init({
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'paymentId'
    },
    BookingID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'bookingId',
      references: {
        model: 'booking',
        key: 'BookingID'
      }
    },
    Amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'amount'
    },
    PaymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'paymentDate'
    },
    Method: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: 'method'
    },
    Status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
      defaultValue: 'PENDING',
      field: 'status'
    },
    ReferenceNumber: {
      type: DataTypes.STRING(100),
      field: 'referenceNumber'
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payment',
    timestamps: false,
  });

  return Payment;
};