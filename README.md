# NiyoGuard

## Run the website
1. Install Node.js 18+.
2. `node server.js`, then open http://localhost:3000

The chatbot uses pre-written Bisaya questions and answers (see the `QA` list at the top of `chat.js`).
It needs **no API key and no server**, so the site can also be hosted as plain static files.

### Edit the chatbot
Open `chat.js`. Each entry has the tappable question (`q`), the answer lines (`a`), the sources (`src`) and two follow-up questions (`next`). Add a new entry, then add its id to a group in `GROUPS` so it appears in the list.
