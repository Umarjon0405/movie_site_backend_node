const { User, Type, Movie } = require("../models")
const { sequelize } = require("../models")
const { response } = require('express')
const Joi = require('@hapi/joi');
const { Op, DataTypes } = require("sequelize");
const PG = require('../services/paginate')

module.exports.index = async (req, res) => {
    try {
        const type = await Type.findAll()
        res.status(200).send({data:type})
    } catch (error) {
        return res.json(error).status(400)
    }
}
module.exports.getActive = async (req, res) => {
    try {
        const type = await Type.findAll({where: {active: true}})
        res.status(200).send({data:type})
    } catch (error) {
        return res.json(error).status(400)
    }
}
module.exports.store = async (req, res) => {
    try {
        let { title } = req.body;
        const validator = typeValidator(({ title }))
        if (validator.error) {
            let message = validator.error.details.map(err => err.message);
            return res.status(400).send({
                message: "Please enter the details in full"
            })
        }
        let type = await Type.create({
            title
        });
        return res.send({data:type, message:"Saved"});
    } catch (error) {
        return res.json(error).status(400)
    }
}
module.exports.update = async (req, res) => {
    try {
        let type = await Type.findOne(
            { where: { id: req.params.id } }
        )
        type.title = req.body.title
        await type.save()
        return res.status(201).send({data: type, message: 'Amaliyot bajarildi!'})
    } catch (error) {
        return res.json(error).status(400)
    }
}
module.exports.updateActive = async (req, res) => {
    try {
        let type = await Type.findOne({ where: { id: req.params.id } })
        type.active = !type.active
        await type.save()
        return res.status(200).send({data:type, message: "Amaliyot bajarildi"})
    } catch (error) {
        return res.json(error).status(400)
    }
}
module.exports.delete = async (req, res) => {
    try {
        await Type.destroy({ where: { id: req.params.id } })
        return res.send({message:"Saved"}).status(200)
    } catch (error) {
        return res.json(error).status(400)
    }
}
typeValidator = (fields) => {
    const validatorSchema = {
        title: Joi.string().required(),
    }
    return Joi.validate(fields, validatorSchema);
}