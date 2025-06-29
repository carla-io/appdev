// const { google } = require('googleapis');
// const path = require('path');
// const fs = require('fs');
// const Task = require('../models/Task');

// // Load client secrets
// const credentials = JSON.parse(fs.readFileSync('./config/googleCalendar.json'));
// const { client_secret, client_id, redirect_uris } = credentials.web;


// const oAuth2Client = new google.auth.OAuth2(
//   client_id, client_secret, redirect_uris[0]
// );

// // Load token
// oAuth2Client.setCredentials(
//   JSON.parse(fs.readFileSync('process.')) // This comes after OAuth process
// );

// const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// async function addEventToCalendar({ summary, description, startDateTime, endDateTime }) {
//   const event = {
//     summary,
//     description,
//     start: {
//       dateTime: startDateTime,
//       timeZone: 'Asia/Manila',
//     },
//     end: {
//       dateTime: endDateTime,
//       timeZone: 'Asia/Manila',
//     },
//   };

//   try {
//     const response = await calendar.events.insert({
//       calendarId: 'primary',
//       resource: event,
//     });
//     return response.data;
//   } catch (err) {
//     console.error('Error creating Google Calendar event:', err);
//     throw err;
//   }
// }

// module.exports = { addEventToCalendar };
