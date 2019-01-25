const express = require('express');
const passport = require('passport');
const buildUrl = require('build-url');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

function serializeCallback(user, cb) {
    cb(null, user);
}

function connectCallback(req, accessToken, refreshToken, profile, cb) {
    const user = {
        refreshToken,
        accessToken,
        profile,
        state: req.query.state
    };

    return cb(null, user);
}

function googleConnect(req, res, next) {
    return passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/plus.business.manage',
            'https://www.googleapis.com/auth/userinfo.profile'],
        state: JSON.stringify(req.query),
        accessType: 'offline',
        prompt: 'consent',
    })(req, res, next);
}

function facebookConnect(req, res, next) {
    return passport.authenticate('facebook', {
        authType: 'reauthenticate',
        scope: ['manage_pages', 'publish_pages', 'public_profile'],
        state: JSON.stringify(req.query),
    })(req, res, next);
}

function getQueryParams(state) {
    delete state.url;
    delete state.path;

    return state;
}

function connectSocialCallback(tokenType) {
    return (req, res) => {
        const state = JSON.parse(req.user.state);

        const url = buildUrl(state.url, {
            path: state.path ? ('#' + state.path) : undefined,
            queryParams: {
                [tokenType]: req.user[tokenType],
                ...getQueryParams(state),
            }
        });

        res.redirect(url);
    }
}

function expressSocialMiddleware(options) {
    const router = express.Router();

    passport.serializeUser(serializeCallback);
    passport.deserializeUser(serializeCallback);

    passport.use(new GoogleStrategy({
        ...options.google,
        passReqToCallback: true
    }, connectCallback));

    passport.use(new FacebookStrategy({
        ...options.facebook,
        passReqToCallback: true
    }, connectCallback));

    router.use(passport.initialize());
    router.use(passport.session());

    router.get('/google', googleConnect);

    router.get('/facebook', facebookConnect);

    router.get('/google/callback', passport.authenticate('google', {
        failureRedirect: '/google'
    }), connectSocialCallback('refreshToken'))

    router.get('/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/facebook'
    }), connectSocialCallback('accessToken'));

    return router;
}

module.exports = expressSocialMiddleware;