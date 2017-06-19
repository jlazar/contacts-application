## Setup

1) `yarn install` (`npm install yarn -g` if you don't have it yet)
2) `yarn start`
3) In your browser, you'll be prompted to sign in to a Contactually account on our staging environment.
   - Create a new account and sign in
   - Once you hit the /onboarding page, you can head back to http://localhost:3030
   - On http://localhost:3030 you should see our welcome page
4) Start building!
   - The OAuth setup for our API is already taken care of for you in src/index.js
   - An example of using our API can be found in the JS API section below
   - The api documentation can be found [here](https://developers.contactually.com/docs/v2/)

## Directions

- Create an app that has at least two routes: `/contacts` (index) and `/buckets/:id` (show). Create each page:
   - `/contacts` should:
      - Display a list of your contacts (table columns: at least `avatar`, `firstName`, `lastName`, `email`, `buckets`)
      - Allow the user to edit or create a contact (form fields: at least `email`, `firstName`, `lastName`)
      - Allow the user to edit a contact (form fields: at least `email`, `firstName`, `lastName`)
      - Allow the user to delete a contact
   - `/buckets/:id` should:
      - Display a bucket which belongs to the user
      - Display a list of contacts within that bucket
      - Allow a user to add a contact to that bucket
      - Allow a user to remove a contact from that bucket
   - Using `react-router-dom` is recommended
   - We've left the requirements for this project pretty basic, because we'd like to see you showcase 
     your talents as much as possible. Use this project as an opportunity to show what you can bring to our team. 
     Some characteristics of a submission that would stand out as a "winner" include:
      - Passion & attention to detail
      - Modularization / componentization
      - Thorough unit testing
      - Performance optimizations
      - Creative/Intuituve UI/UX
      - Appropriate use of comments/JSDoc
- Submit your application
   - Create a git bundle that includes all your commits.
      - `git bundle create <output_file> <git-rev-list-args>`
      - EX: `git bundle create ../my-submission.bundle --all`
   - Add your bundle file to a zip (many email systems will strip .bundle attachments).
   - Email your submission to hw@contactually.com.
      - Be sure to send us any brief notes on:
         - What you would have done if you had more time.
         - Which parts (if any) you struggled on or were unsure about.
         - Which parts you are particularly proud of.
   - We'll review your submission and get back to you within a few days.

## JS API

This project includes an older version of our JS API. 
To use, `import { ApiClient } from './lib/contactually-api'` and create a new instance of `ApiClient`

`ApiClient` has 5 instance methods:
- `get`
- `post`
- `put`
- `patch`
- `delete`

All of these methods take 2 arguments:
- `{string} url` the path, relative to `/v2/`
- `{object} options`
   - `{object} data` the data to send in the request body.
   - `{function} onSuccess` success callback.
   - `{function} onError` error callback.
   
Our API is paginated, each `GET` response will return a maximum of 50 rows per page. See the [API Documentation](https://developers.contactually.com/docs/v2/) for more information. Front-end pagination is not required, but is another opportunity to showcase your skills and stand out.
   
** IMPORTANT NOTE ** All object keys within `data` are camelCased automagically by `ApiClient`. The frontend always
uses camelCased response object keys.

It's also worth noting that a `data.id` param is required for `delete`, `put`, and `patch` 

Examples of all basic REST actions can be found below:

```js
import { ApiClient } from './lib/contactually-api'
const apiClient = new ApiClient()

// Example: get the current user
apiClient.get('me', {
  onSuccess: ({ data }) => { /* would be cool to do something here */ },
  onError: () => { /* would be cool to do something here */ }
})

// Example: get a list of buckets
apiClient.get('buckets', {
  onSuccess: ({ data }) => { /* would be cool to do something here */ },
  onError: () => { /* would be cool to do something here */ }
})

// Example: create a contact
apiClient.post('contacts', {
  data: {
    firstName: 'Test',
    lastName: 'Contact',
    email: 'test@email.com',
  },
  onSuccess: ({ data }) => { /* would be cool to do something here */ },
  onError: () => { /* would be cool to do something here */ }
})

// Example: update a contact
apiClient.patch('contacts/contact_123', {
  data: {
    id: '123',
    firstName: 'foo'
  },
  onSuccess: ({ data }) => { /* would be cool to do something here */ },
  onError: () => { /* would be cool to do something here */ }
})

// Example: delete a contact
apiClient.delete('contacts/contact_123', {
  data: {
    id: '123'
  },
  onSuccess: ({ data }) => { /* would be cool to do something here */ },
  onError: () => { /* would be cool to do something here */ }
})
```
