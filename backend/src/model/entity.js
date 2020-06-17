const mongosse = require('mongoose');
const { Schema } = mongosse;

let onlyLettersAllow = function(string){
    let myRegxp = /^[a-zñ\s]*$/i;
    return myRegxp.test(string)
};

let validatePermissions = function (array) {
    array.forEach(item => {
        if(!onlyLettersAllow(item)){
            return false;
        }
    });
    return true;
};

const EntitySchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
        validate: {
            validator: onlyLettersAllow,
            message: props => `${props.value} is not a valid name, please insert only letters`
        }
    },
    permissions: {
        type: Array,
        required: [true, "Permissions is required"],
        validate: {
            validator: validatePermissions,
            message: props => `${props.value} is not a valid name, please insert only letters`
        }
    }
});

EntitySchema.pre('save', function (next) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    this.permissions = this.permissions.map(permisssion => permisssion.charAt(0).toUpperCase() + permisssion.slice(1));
    next();
});

module.exports = mongosse.model('Entity', EntitySchema);