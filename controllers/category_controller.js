const { Category } = require('../models')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

module.exports.index =async (req, res) => {
    try {
        const category = await Category.findAll();
        return res.send({data:catergory}).status(400);
    } catch (error) {
        return res.send(error).status(400);
    }
}
module.exports.store = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.send({message:"Please enter full details"})
        }
        const title = req.body.title;
        const category = await Category.create({
            title
        })    
        return res.send({data: category, message:"Saved"})
    } catch (error) {
        return res.send(error).status(400)
    }
}
module.exports.update = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.send({message:"Please enter full details"})
        }
        const title = req.body.title;
        const category = await Category.update({
            title
        },
            {
            where:{id: req.params.id}
        })    
        return res.send({data: category, message:"Saved"})
    } catch (error) {
        return res.send(error).status(400)
    }
}
module.exports.updateActive = async (req, res) => {
    try {
        let category = await Category.findOne({ where: { id: req.params.id } })
        let updateCategory = Category.update(
            {active:!category.active},    
            { where: { id: req.params.id } }
        )
        return res.send(updateCategory)
    } catch (error) {
        return res.json(error).status(400)
    }
}
module.exports.delete = async (req, res) => {
    try {
        await Category.destroy({ where: { id: req.params.id } })
        return res.send({message:"Saved"}).status(200)
    } catch (error) {
        return res.json(error).status(400)
    }
}