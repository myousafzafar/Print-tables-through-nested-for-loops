async function displayUI()
 {    
    await signIn();

    // Display info from user profile
    const user = await getUser();
    var userName = document.getElementById('userName');
    userName.innerText = user.displayName;  

    // Hide login button and initial UI
    var signInButton = document.getElementById('signin');
    signInButton.style = "display: none";
    var content = document.getElementById('content');
    content.style = "display: block";

    var btnShowEvents = document.getElementById('btnShowEvents'); //
btnShowEvents.style = "display: block";//display the 'Show Events' button only on successful authorization
}

// Displaying the events received from MS graph
async function displayEvents()
 {
    var events = await getEvents();
    if (!events || events.value.length < 1) { //In case no event is found
      var content = document.getElementById('content');  //assigning content to content variable 
      var noItemsMessage = document.createElement('p');
      noItemsMessage.innerHTML = `No events for the coming week!`; // In case no event is found in calendar in the next week, this message will be displayed.
      content.appendChild(noItemsMessage)
  
    } else {
      var wrapperShowEvents = document.getElementById('eventWrapper');  
      wrapperShowEvents.style = "display: block";
      const eventsElement = document.getElementById('events'); // In case an event is found, this block of code runs - events are fetched by ID, traversed and listed.
      eventsElement.innerHTML = '';
      events.value.forEach(event => {
        var eventList = document.createElement('li');
        eventList.innerText = `${event.subject} - From  ${new Date(event.start.dateTime).toLocaleString()} to ${new Date(event.end.dateTime).toLocaleString()} `;
        eventsElement.appendChild(eventList);
      });
    }
    var btnShowEvents = document.getElementById('btnShowEvents');
    btnShowEvents.style = "display: none";
  }