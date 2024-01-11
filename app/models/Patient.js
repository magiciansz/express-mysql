const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Patient = sequelize.define(
  "Patient",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          format: "YYYY-MM-DD",
          strictMode: true,
        },
        isBeforeToday(date) {
          if (new Date(date) >= new Date()) {
            throw new Error("The date must be before today.");
          }
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
    },
    sex: {
      type: DataTypes.ENUM,
      values: ["M", "F"],
      validate: {
        isValidGender(gender) {
          if (!((gender === "M") | (gender === "F"))) {
            throw new Error("The gender is not valid.");
          }
        },
      },
    },
    left_eye_image: {
      type: DataTypes.STRING,
      validate: {
        isURL: {
          require_tld: false,
        },
      },
    },
    right_eye_image: {
      type: DataTypes.STRING,
      validate: {
        isURL: {
          require_tld: false,
        },
      },
    },
    left_diabetic_retinopathy_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    right_diabetic_retinopathy_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    left_ocular_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    right_ocular_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    left_glaucoma_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    right_glaucoma_prob: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: {
          min: 0.0,
          max: 1.0,
        },
      },
    },
    doctor_notes: {
      type: DataTypes.STRING,
    },
    report_link: {
      type: DataTypes.STRING,
      validate: {
        isURL: {
          require_tld: false,
        },
      },
    },
    visit_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  },
  {
    tableName: "PatientTbl",
    hooks: {
      beforeUpdate: async (record) => {
        record.setDataValue("version", record.dataValues.version + 1);
        record.setDataValue("visit_date", Sequelize.fn("NOW"));
        const ageDate = new Date(Date.now() - new Date(record.date_of_birth));
        record.setDataValue("age", Math.abs(ageDate.getUTCFullYear() - 1970));
      },
      beforeCreate: async (record) => {
        const ageDate = new Date(Date.now() - new Date(record.date_of_birth));
        record.setDataValue("age", Math.abs(ageDate.getUTCFullYear() - 1970));
      },
      afterUpdate: async (record, options) => {
        const { transaction } = options;
        await afterCreateUpdateHandler(record, transaction);
      },
    },
  }
);

Patient.isDuplicate = async function (name, date_of_birth) {
  const patient = await Patient.findOne({
    where: { name: name, date_of_birth: date_of_birth },
  });
  return patient !== null;
};

module.exports = Patient;
