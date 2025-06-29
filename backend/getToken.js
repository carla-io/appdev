// const fs = require('fs');
// const readline = require('readline');
// const { google } = require('googleapis');

// const credentials = require('./config/googleCalendar.json');
// const { client_secret, client_id, redirect_uris } = credentials.web;

// const oAuth2Client = new google.auth.OAuth2(
//   client_id,
//   client_secret,
//   redirect_uris[0] // "http://localhost:5173/admin"
// );

// const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// const authUrl = oAuth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: SCOPES,
// });

// console.log('Authorize this app by visiting this URL:\n', authUrl);

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.question('\nEnter the code from that page here: ', (code) => {
//   rl.close();
//   oAuth2Client.getToken(code).then(({ tokens }) => {
//     fs.writeFileSync('token.json', JSON.stringify(tokens));
//     console.log('✅ Token stored to token.json');
//   }).catch(err => console.error('❌ Error retrieving access token', err));
// });
