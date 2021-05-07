const express = require('express');
const cors = require('cors');
const spotifyWebApiNode = require('spotify-web-api-node');

// creating the express server
const server = express();
server.use(cors());
server.use(express.json());

// wrapper for Spotify Web API
// used to simplify authentication
const spotifyApi = new spotifyWebApiNode({
    redirectUri: 'http://localhost:3000',
    clientId: '8fdd97d3ea674907a02f38f39f755391',
    clientSecret: ''
})

server.post('/login', (req, res) => {
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

server.post('/refresh', (req, res) => {
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

server.listen(3001);