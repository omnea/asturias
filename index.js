const express = require('express');

const expressSocialMiddleware = require('./middleware');

const app = express();

app.use('/', expressSocialMiddleware({
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
    },
    facebook: {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
    }
}));

app.listen(process.env.PORT, () =>
    console.log(`Asturias server running on port: ${process.env.PORT}`
));
