const {Type, MoviePath, Movie } = require("../models")
const { sequelize } = require("../models")
const Joi = require('@hapi/joi');
const { Op } = require("sequelize");
const PG = require('../services/paginate')
const fs = require("fs");
const url = require('url');

module.exports.index = async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    let type_id = queryObject.type_id;
    let search = queryObject.search || '';
    let check = 0
    check = type_id > 0 ?  {type_id: type_id} : {}
    
    try {
        const movies = await Movie.findAll({
            include: [
                {
                    model: Type,
                    as: 'type',
                    required: true,
                    attributes: ['id', 'title']
                }

            ],
            attributes: {
                exclude :['type_id']
            },
            where:{ title: { [Op.like]: `%${search}%` }, ...check},
            order: [
                ['id', 'DESC']
            ],
        })
        req.data = movies
        return res.json(PG.paginate(req)).status(200)
    } catch (error) {
        return res.json(error).status(400)
    }
}
module.exports.getLast = async (req, res) => {
    
    try {
        const movies = await Movie.findAll({
            include: [
                {
                    model: Type,
                    as: 'type',
                    required: true,
                    attributes: ['id', 'title']
                }

            ],
            attributes: {
                exclude :['type_id']
            },
            limit: 5,
            order: [
                ['id', 'DESC']
            ],
        })

        return res.json({data: movies}).status(200)
    } catch (error) {
        return res.json(error).status(400)
    }
}
module.exports.getActive = async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    let type_id = queryObject.type_id;
    let search = queryObject.search || '';
    let check = 0
    check = type_id > 0 ?  {type_id: type_id} : {}
    try {
        const movies = await Movie.findAll({
            include: [
                {
                    model: Type,
                    as: 'type',
                    required: true,
                    attributes: ['id', 'title']
                }

            ],
            attributes: {
                exclude :['type_id']
            },
            where: {active: true, ...check,  title: { [Op.like]: `%${search}%` },},
            order: [
                ['id', 'DESC']
            ],
        })
        req.data = movies
        return res.json(PG.paginate(req)).status(200)
    } catch (error) {
        return res.json(error).status(400)
    }
}
module.exports.show = async (req, res) => {
    try {
        const movie = await Movie.findOne({
            include: [
                {
                    model: MoviePath,
                    as: 'movie_path',
                    required: true,
                    attributes: ['id', 'path', 'movie_id']
                },
                {
                    model: Type,
                    as: 'type',
                    required: true,
                    attributes: ['id', 'title']
                }
            ],
            where : {id: req.params.id}
        })
        return res.status(200).send(movie);
    } catch (error) {
        
        return res.status(400).json({message:error})
    }
}
module.exports.playVideo = async (req, res) => {
    try {

        let videoPath = await MoviePath.findOne({
            where : {id: req.params.id}
        })
        videoPath = videoPath.path;
        // Ensure there is a range given for the video
        const range = req.headers.range;
        if (!range) {
            res.status(400).send("Requires Range header");
        }

        // get video stats (about 61MB)
        const videoSize = fs.statSync(`${videoPath}`).size;

        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        // Create headers
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": `${videoPath}`,
        };

        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);

        // create video read stream for this particular chunk
        const videoStream = fs.createReadStream(videoPath, { start, end });

        // Stream the video chunk to the client
        videoStream.pipe(res);
    } catch (error) {
        return  res.status(400).send({error});
    }
    

}
module.exports.store = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let { title, description, type_id } = req.body;
        const validator = movieValidation(({ title, description, type_id }))
        if (validator.error) {
            // let message = validator.error.details.map(err => err.message);
            return res.status(400).send({
                message: "Malumotlarni to'liq va to'g'ri kiriting",
                error: validator.error
            })
        }
        let movie = req.files.movie;
        let movieImg = req.files.movie_img;
        if (!movie || !movieImg) {
            return res.status(400).send({
                message: "Malumotlarni to'liq va to'g'ri kiriting"
            })
        }
        let movieUrl = 'movies/' + Math.floor(Math.random() * 1000) + movie.name;
        movie.mv(movieUrl);

        let movieImgUrl = './movies/' + Math.floor(Math.random() * 1000) + movieImg.name;
        movieImg.mv(movieImgUrl);

        let createMovie = await Movie.create({
            title,
            description,
            type_id,
            image_path: movieImgUrl
        }, { transaction })
        await MoviePath.create({
            path: movieUrl,
            movie_id: createMovie.id
        }, {transaction})
        await transaction.commit();
        return res.send({message: "Malumot saqlandi"}).status(200);
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({message:error})
    }
}
movieValidation = (fields) => {
    const validatorSchema = {
        description: Joi.string().required().min(10),
        title: Joi.string().required().min(3),
        type_id: Joi.number().required(),
    }
    return Joi.validate(fields, validatorSchema);
}