
# express-social-middleware

## Description

- Express Middleware for connecting to Facebook and Google.

```javascript
    const expressSocialMiddleware = require('express-social-middleware');

    ...

    app.use('/', expressSocialMiddleware({
        google: {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK,
        },
        facebook: {
            clientID: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
            callbackURL: FACEBOOK_CALLBACK,
        }
    }));
```

## Install

```bash
    $ npm install --save express-social-middleware
```

## Endpoints

**/google**
**/facebook**
- query parameters:
    - url: final redirection url.
        - path: extra url information.
        - ...other: You can add some extra query parameters.
        
**/google/callback**
**/facebook/callback**
- it will redirect automaticaly to the url set on the first call with the refreshToken/accessToken included.

## Examples

1. **/google?url=https://someurl.com&bar=123&baz=abc**

    generates -> https://someurl.com?bar=123&baz=abc&refreshToken=XXXXX

2. **/google?url=https://someurl.com&path=/section/123&bar=123&baz=abc**

    generates -> https://someurl.com/#/section/123?bar=123&baz=abc&refreshToken=XXXXX
