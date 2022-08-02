// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
        // Call getToken in auth.js
        return await getToken();
    }
};


// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });


//Get user info from Graph
async function getUser()
{
    ensureScope('user.read');
    return await graphClient
        .api('/me')
        .select('id,displayName') //this is to select the username to display after MS login
        .get();
}

// function to get calendar events of the signed-in user
async function getEvents()  
 {
    ensureScope('Calendars.read');
    const dateNow = new Date();      //creating date objects to use date functions ahead
    const dateNextWeek = new Date();
    dateNextWeek.setDate(dateNextWeek.getDate() + 7); //setting up date of next week (+7 days from now)  
    const query = `startDateTime=${dateNow.toISOString()}&endDateTime=${dateNextWeek.toISOString()}`; // querying using the time range of 1 week
  
    return await graphClient
    .api('/me/calendarView').query(query)
    .select('subject,start,end') //select method is used to select specific properties in results
    .orderby(`start/DateTime`) // sorting the result in ascending order by start field (default)
    .get();
  }