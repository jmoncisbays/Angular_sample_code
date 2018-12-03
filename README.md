# Angular_sample_code
## calendar
The folder contains two components: calendar, and calendar-day. "calendar" component draws a calendar --see calendar.png-- displaying a calendar-day component for each day containing the holidays and the PTO days of each employee.

## auth
This folder contains the following services:
auth.service.ts - This service do the user authentication passing the user credentials to token.repository.ts repository  which calls a Web API endpoint using HttpClient to receive a JWT, which is stored in the browser session using the sessionStorage method.

The call to Web API is as follows:

    getToken(model: Login) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set("crossDomain", "true");

        return this.httpClient.post(`${url}/token/CreateToken`, model, {
            headers: headers,
            responseType: 'text'
        });
    }

'url' value is taken from an environment variable.

## auth-guard.service.ts
This service implements CanActivate. It restricts the access to authenticated users.

## role-guard.service.ts
This service implements CanActivate. It restricts the access to users with specif role.

token.interceptor.ts - This service adds headers to each http request.



## res-skills2text.pipe.ts
This is a custom pipe that receives an array of Skill objects (id, name) and returns a string containing all the skill names separated by a comma.

The pipe is used then like this:

{{ resource.skills | skillsToString:(resource.skills) }}

