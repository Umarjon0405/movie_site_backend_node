const { User, Category, MovieCategory, Type, MoviePath, Movie } = require("../models")
const { sequelize } = require("../models")
const { response } = require('express')
const bcrypt = require('bcrypt')
const Joi = require('@hapi/joi')
const _ = require('lodash')
const { Op, DataTypes, where } = require("sequelize");
const PG = require('../services/paginate')
const { union } = require("lodash")

module.exports.index = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude :['password']
            }
        })
        req.data = users
        res.status(200).send(PG.paginate(req))
    } catch (error) {
        return res.status(400).json(error)
    }
}
module.exports.store = async (req, res) => {
    
    if (!req.user.admin) {
        return res.send({ message: "You can not create user" }).status(409)
    }
    const transaction = await sequelize.transaction();
    try {
        const { full_name, username, password } = req.body
        const validator = userValidation(({ full_name, username, password }))
        if (validator.error) {
            // let message = validator.error.details.map(err => err.message);
            return res.status(400).send({
                message: "Please enter the details in full"
            })
        }
        let hashPassword = await bcrypt.hash(password.toString(), await bcrypt.genSalt(10))
        const user = await User.create({
            full_name,
            username,
            password: hashPassword,
        },{transaction})
        user.password = undefined
        await transaction.commit();
        res.status(201).send({
            message: "Foydalanuvchi yaratildi",
            object: user
        })
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({message:error})
    }
}
userValidation = (fields) => {
    const validatorSchema = {
        full_name: Joi.string().required().min(3),
        username: Joi.string().required().min(3),
        password: Joi.string().required().min(3),
    }
    return Joi.validate(fields, validatorSchema);
}
module.exports.update = async (req, res) => {
    if (!req.user.admin) {
        return res.status(409).send({message: "you can not update"})
    }
    const transaction = await sequelize.transaction();
    try {
        const { full_name, username, password } = req.body
        const validator = userValidation(({ full_name, username, password }))
        if (validator.error) {
            // let message = validator.error.details.map(err => err.message);
            return res.status(400).send({
                message: "Please enter the details in full"
            })
        }
        let hashPassword = await bcrypt.hash(password.toString(), await bcrypt.genSalt(10))
        const user = await User.update(
            {
            full_name,
            username,
            password: hashPassword, },
            {
                where: {id: req.params.id}
            },{transaction})
        user.password = undefined
        await transaction.commit();
        res.status(201).send({
            message: "User have been update",
            object: user
        })
    } catch (error) {
        await transaction.rollback();
        return res.json({message:error}).status(400)
    }
}
module.exports.delete = async (req, res) => {
    if (!req.user.admin) {
        return res.status(409).send({message: "You can not delete"})
    }
    const transaction = await sequelize.transaction();
    try {
        await User.destroy({where: { id: req.params.id }});
        await transaction.commit();
        return res.send({message: "The user just deleted"}).status(200);
    } catch (error) {
        await transaction.rollback();
        return res.json(error).status(500)
    }
}

module.exports.admin = async (req, res) => {
    if (!req.user.admin) {
        return res.status(409).send({message: "you can not update"})
    }
    const transaction = await sequelize.transaction();
    try {
        const old_user = await User.findOne({ where: { id: req.params.id } });
        old_user.admin = !old_user.admin;
        await old_user.save();
        await transaction.commit();
        return res.send({message: "The user just updated"}).status(200);
    } catch (error) {
        await transaction.rollback();
        return res.json(error).status(500)
    }
}