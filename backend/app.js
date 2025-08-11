import express from 'express';
import { createServer } from 'node:http'
import multer from 'multer'
import { Server } from 'socket.io';
import { getParameters } from './aws.js';

if (process.env.CLOUD === 'aws') {
    getParameters(process.env['SSM_PARAMETER_PATH']).then(() => {
        console.log("Parameters loaded from AWS SSM");
        startservice();
    }).catch((error) => {
        console.error(error.message);
        startservice();
    })

} else {
    console.log("No AWS SSM parameters to load, starting service...");
    startservice();
}

async function startservice() {
    //Import authentication modules here
    // e.g import { authenticateToken } from './auth.js';
    let { authenticateToken, login, registerUser } = await import('./auth.js');

    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
        path: "/api/socketio/"
    });
    const upload = multer()

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json());

    app.get('/api', (req, res) => {
        res.json({ "message": "/api endpoint", "status": "true" })
    });

    app.get('/api/test', (req, res) => {
        res.json({ "message": "Test endpoint", "status": "true", "test": process.env.TEST || 'NOT_FOUND' });
    });

    app.post('/api/login', upload.none(), login);

    app.post('/api/register', upload.none(), registerUser);

    app.get('/api/auth', authenticateToken, async (req, res) => {
        res.status(200).json({ "message": "Authenticated", "user": req.user });
    });

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('private message', (msg)=>{
            io.emit('private message', {sender: "Server", msg: "echo -> "+msg})
        })
        if (process.env.NODE_ENV === "development") {
          socket.onAny((event, ...args) => {
            console.log(event, args);
          });
        }
    })


    const PORT = process.env.PORT || 4000;

    server.listen(PORT, () => {
        console.log(`API server is running on port ${PORT}`);
    });
}
