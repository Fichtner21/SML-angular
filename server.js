const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { Issuer } = require('openid-client');
const { custom } = require('openid-client');

const port = 4500;
const googleClientId = '326844544836-6tqb426dh5sl8opmnh7difha0t0lgq9t.apps.googleusercontent.com';
const googleClientSecret = 'wlauIAKP0iwRz6l9V_1N3O5o';
const redirectUri = 'http://localhost:4500/';

app.use(cors());
app.use(bodyParser.json());

let client = '';
(async () => {
  const oidcIssuer = await Issuer.discover('https://accounts.google.com');
  client = new oidcIssuer.Client({
    client_id: googleClientId,
    client_secret: googleClientSecret,
    redirect_uris: [redirectUri],
    response_types: ['code'],
  });
})();

app.get('/dashboard', (req, res) => {
  const authUrl = client.authorizationUrl({
    scope: [
      'openid',
      'profile',
      'email',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/script.scriptapp',
      'https://www.googleapis.com/auth/script.external_request',
    ],
  });
  res.redirect(authUrl);
});

app.get('/', async (req, res) => {
  const params = client.callbackParams(req);
  const tokenSet = await client.callback(
    redirectUri,
    params,
    custom({
      authorizationParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    })
  );

  // Here you can use the tokenSet to make requests to the Google API
  // using the granted scopes.
  console.log(tokenSet);
  res.send('Authorization successful!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// const express = require('express');
// const cors = require('cors');
// const { Issuer, Strategy } = require('openid-client');
// const session = require('express-session');

// // Konfiguracja Google OAuth2
// const CLIENT_ID = '326844544836-6tqb426dh5sl8opmnh7difha0t0lgq9t.apps.googleusercontent.com';
// const CLIENT_SECRET = 'wlauIAKP0iwRz6l9V_1N3O5o';
// const REDIRECT_URI = 'http://localhost:4500/dashboard';
// const SCOPES = ['openid profile email https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.scriptapp https://www.googleapis.com/auth/script.external_request'
// ];

// // Inicjalizacja serwera Express.js
// const app = express();
// app.use(express.static('dist/SML-angular'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Konfiguracja CORS
// app.use(cors(

//   // origin: 'http://localhost:4500/dashboard',
//   // methods: 'HEAD,PUT,PATCH,POST,DELETE',
//   // allowedHeaders: ['Content-Type', 'Authorization'],
// ));

// app.use(session({
//   secret: 'some secret', // klucz tajny używany do szyfrowania ciasteczek
//   resave: false, // czy ciasteczka mają być zapisywane na dysku, nawet jeśli się nie zmieniły
//   saveUninitialized: true, // czy tworzyć nową sesję, jeśli użytkownik nie ma jeszcze ciasteczka z identyfikatorem sesji
// }));

// // Obsługa uwierzytelniania Google OAuth2
// let client;
// Issuer.discover('https://accounts.google.com')
//   .then((issuer) => {
//     client = new issuer.Client({
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       redirect_uris: [REDIRECT_URI],
//       response_types: ['code']
//     });
//   });

// app.get('/dashboard', async (req, res) => {
//   const getLogin = new Promise((resolve, reject) => {
//     const params = client.callbackParams(req);
//     return resolve(params) 
//   })

//   await getLogin 
//   console.log('PARAMS => ', getLogin)
//   const tokenSet = await client.callback(REDIRECT_URI, getLogin, { code_verifier: req.session.code_verifier });
  
//   // Tutaj możesz zapisać tokeny w bazie danych lub ciasteczkach
//   console.log('tokenSet => ', tokenSet);

//   const authorizationUrl = client.authorizationUrl({
//     scope: SCOPES,
//     state: req.query.redirect || '/dashboard'
//   });

//   console.log('authorizationUrl => ', authorizationUrl)
//   res.redirect(authorizationUrl);
// });

// // app.get('/callback', async (req, res) => {
// //   const params = client.callbackParams(req);
// //   const tokenSet = await client.callback(REDIRECT_URI, params, { code_verifier: req.session.code_verifier });

// //   // Tutaj możesz zapisać tokeny w bazie danych lub ciasteczkach
// //   console.log(tokenSet);

// //   res.redirect('/');
// // });

// // Uruchamianie serwera
// const port = process.env.PORT || 4500;
// app.listen(port, () => {
//   console.log(`Serwer jest uruchomiony na porcie ${port}.`);
// });