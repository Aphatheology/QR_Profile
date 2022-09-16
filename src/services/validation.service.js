const Joi = require("joi");

exports.createProfile = Joi.object().keys({
    firstName: Joi.string().min(3).max(40).required(),
    lastName: Joi.string().min(3).max(40).required(),
});

// exports.updateProfile = Joi.object().keys({
//     firstName: Joi.string().min(3).max(40),
//     lastName: Joi.string().min(3).max(40),
// }).or('firstName', 'lastName');

// exports.searchId = Joi.object().keys({
//     id: Joi.string().alphanum().required(),
// });
