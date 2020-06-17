const mongosse = require('mongoose');
const { Schema } = mongosse;

let onlyLettersAllow = function(string){
    let myRegxp = /^[a-zñ\s]*$/i;
    return myRegxp.test(string)
};


const RoleSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name field is required"],
        unique: true,
        validate: {
            validator: onlyLettersAllow,
            message: props => `${props.value} is not a valid name, please insert only letters`
        }
    },
    permissions: {
        type: Array,
        required: [true, "Permissions field is required"]
    }
});

RoleSchema.pre('save', function (next) {
    this.permissions = this.permissions.map(permisssion => permisssion.toUpperCase());
    next();
});

module.exports = mongosse.model('Role', RoleSchema);