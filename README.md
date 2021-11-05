# Google Calendar to Notion Sync

### Install Node packages
```shell
npm install
```

### Tokens

1. Create OAuth tokens in the Google Cloud API console. [Instructions here](https://developers.google.com/calendar/api/guides/auth).

2. Get refresh token by testing OAuth on the [Google OAuth Playground](https://developers.google.com/oauthplayground/).

    * Make sure to add the OAuth Playground url as a valid redirect URL under your web application key

3. Get [Notion integration key](https://www.notion.so/my-integrations)

4. Find your database id: Notion URLs are formatted as following
    ```
    https://www.notion.so/{workspace_name}/{database_id}?v={view_id}
    ```

Use the sample [token-template.json](token-template.json) file and rename it to "token.json" or create your own token JSON file with the following format:
```json
{
    "client_id": "",
    "client_secret": "",
    "refresh_token": "",
    "notion_key": "",
    "database_id": ""
}
```

### Implementation

Run sync with
```shell
node index.js
```

### APIs used
#### Google Calendar API 
- Utilized 'readonly' scopes to pull events from user
#### Notion API
- Required to add events to a calendar database

### Work in progress
- Repeating events
- Automatic sync

