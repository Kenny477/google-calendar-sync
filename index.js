const { Client } = require("@notionhq/client");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const tokens = require("./tokens.json");
const oAuth2Client = new OAuth2(
    tokens['client_id'],
    tokens['client_secret'],
    );

oAuth2Client.setCredentials({refresh_token: tokens['refresh_token']});

const calendar = google.calendar('v3');

const NOTION_KEY = tokens['notion_key'];
const databaseId = tokens['database_id'];

const notion = new Client({ auth: NOTION_KEY })

function removeExtra(event){
    return {
        summary: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
        location: event.location,
        description: event.description,
    }
}

function clean(items) {
    return items.map(item => removeExtra(item))
}

async function getEvents(){
    try {
        const res = await calendar.events.list({
            auth: oAuth2Client,
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        const items = res.data.items;
        const cl = clean(items);
        return cl;
    }
    catch(error){
        console.log(error);
        return null;
    }
}

async function addCalendarEntry(title, start, end, location, description) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: title
                            }
                        }
                    ]
                },
                Date: {
                    type: 'date',
                    date: {
                        start: start,
                        end: end
                    }
                },
                Location: {
                    rich_text: [
                        {
                            text: {
                                content: location
                            }
                        }
                    ]
                }
            },
            children: [
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        text: [
                            {
                                type: 'text',
                                text: {
                                    content: description
                                }
                            }
                        ]
                    }
                }
            ]
        });
        console.log(response);
        console.log("Success! Entry added.");
    } catch (error) {
        console.error(error.body);
    }
}

async function searchDatabase(){
    const res = await notion.databases.query({
        database_id: databaseId
    });
    console.log(res['results'][0]['properties']);
}

function addCalendar(){
    getEvents().then(events => { 
        events.forEach(event => {
            addCalendarEntry(event.summary, event.start, event.end, event.location, event.description);
        });
    });
}
addCalendar();