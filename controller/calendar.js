const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    '29794430040-a3qellc1tkv2hirhi6uhkvv4sqjskk9r.apps.googleusercontent.com',
    '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',
    'http://localhost:3000/monthly'
);

// set the access token to the auth object
auth.setCredentials({
    access_token: ACCESS_TOKEN,
    refresh_token: REFRESH_TOKEN
  });
  
  const calendar = google.calendar({version: 'v3', auth});
  
  // retrieve calendar events
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });