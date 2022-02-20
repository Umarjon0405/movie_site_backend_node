const express = require("express")
const { sequelize } = require('./models')
const app = express()
const cors = require('cors')
const auth = require('./middleware/auth')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

app.disable('etag'); //

app.use(express.json())
app.use(cors())

app.use(express.static(__dirname + '/movies'));
app.use('/movies', express.static('movies'));
app.use(fileUpload({
    createParentPath: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const movie_routes = require('./routes/movie.routes')
const auth_routes = require('./routes/auth.routes')
const user_routes = require('./routes/user.routes')
const type_routes = require('./routes/type.routes')
const category_routes = require('./routes/category.routes')

// Auth
app.use('/login', auth_routes);

// for movies
app.use('/api/movies', movie_routes);
app.use('/api/types', type_routes);
// app.use('/api/categories', auth, category_routes);

// for user
app.use('/api/users', auth, user_routes);



app.listen(process.env.NODE_PORT, `${process.env.NODE_IS_HOST}`, async () => {
    try {
        await sequelize.authenticate()

    } catch (error) {
        console.log('Error occured while syncing models with database', error)
    }
    console.log(`Server is running on ${process.env.NODE_PORT} PORT`);
})