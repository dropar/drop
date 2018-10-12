const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const sessionStore = new SequelizeStore({db})
const PORT = process.env.PORT || 8080
const app = express()
const socketio = require('socket.io')



module.exports = app

// This is a global Mocha hook, used for resource cleanup.
// Otherwise, Mocha v4+ never quits after tests.
if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStore.stopExpiringSessions())
}

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets')

// passport registration
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  // compression middleware
  app.use(compression())

  //cross origin resource sharing middleware
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
   });

  // session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my best friend is Cody',
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  // auth and api routes
  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  // app.use((req, res, next) => {
  //   if (path.extname(req.path).length) {
  //     const err = new Error('Not found')
  //     console.log(req.path);
  //     err.status = 404
  //     next(err)
  //   } else {
  //     next()
  //   }
  // })

  app.use(express.static(path.join(__dirname, '..', 'public')))

  // get routes for non HTML assets
  app.get("/serviceWorker.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'serviceWorker.js'))
  })

  app.get("/manifest.json", (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'manifest.json'))
  })

  app.get("/public/assets/images/:iconName", (req, res) => {
    const iconName = req.params.iconName;
    res.sendFile(path.resolve(__dirname, '..', `public/assets/images/${iconName}`))
  });

  // app.get("/public/build.js", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, '..', 'public/build.js'));
  // })

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public/index.html'));
  })

  // app.get('/?*', (req, res) => {
  //   res.sendFile(path.resolve(__dirname, '..', 'public/templates/404.html'));
  // })

  app.get('/500', (req, res, next) => {
    console.log('at 500 page')
    try {
    Userx;
    } catch (err){
      next(err)
    }
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.log('in error')
    console.error(err)
    console.error(err.stack)
    // res.status(500);
    // res.send('500 reached');
    //res.status(500).send({status:'broken'});
    res.status(err.status || 500);
    //res.redirect('http://localhost:8080/?500')
    res.sendFile(path.resolve(__dirname, '..', 'public/templates/500.html'));
    //res.status(500).render('public/templates/500.html').send()
  })
}

//res.status(err.status || 500).send(error.status || 'internal server error')
// local https
// var fs = require('fs')
// var https = require('https')
// var certOptions = {
//   key: fs.readFileSync(path.resolve('cert/server.key')),
//   cert: fs.readFileSync(path.resolve('cert/server.crt'))
// }
// var server = https.createServer(certOptions, app).listen(443)

const startListening = () => {
  // start listening (and create a 'server' object representing our server)


  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )

  // http.createServer(app).listen(PORT);
  // https.createServer(certOptions, app).listen(443, () =>
  //   console.log(`Mixing it up on port ${3000}`)
  // )

  // set up our socket control center
  const io = socketio(server)
  require('./socket')(io)
}

let syncDb;

if (process.env.NODE_ENV === 'production') {
  syncDb = () => db.sync();
}
else {
  syncDb = () => console.log('db synced');
}

async function bootApp() {
  await sessionStore.sync()
  await syncDb()
  await createApp()
  await startListening()
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp()
} else {
  createApp()
}
