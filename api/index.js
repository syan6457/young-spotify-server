const express = require('express');
const cors = require('cors');
const spotifyWebApiNode = require('spotify-web-api-node');

// creating an express server
const server = express();
server.use(cors());
server.use(express.json());

// wrapper for Spotify Web API
// used to simplify authentication
const spotifyApi = new spotifyWebApiNode({
    redirectUri: 'https://young-spotify.vercel.app/',
    clientId: '8fdd97d3ea674907a02f38f39f755391',
    clientSecret: process.env.CLIENT_SECRETE
})

// Spotify Login
server.post('/api/login', (req, res) => {
    const code = req.body.code;

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch((error) => {
            res.sendStatus(400);
        })
})

// Refresh Access Token
server.post('/api/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;

    // supplying the wrapper the refresh token
    spotifyApi.setRefreshToken(refreshToken);

    spotifyApi.refreshAccessToken().then(data => {
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in
        })
    }).catch((error) => {
        res.sendStatus(400);
    })
})

server.get('/', (req, res) => {
    res.send('Welcome to a (almost) blank webpage.')
})

module.exports = server;