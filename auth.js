//MSAL configuration
const msalConfig = {
    auth: {
        clientId: "178a1dc2-f0a6-4bb6-9caa-237a615be857",  // put the 'Client ID' of your MS dev registered app here
        // comment out if you use a multi-tenant AAD app
        authority: "https://login.microsoftonline.com/63864b83-1011-47c0-8c87-c56553563895", // Directory(Tenant) ID after "...microsoftonline.com/"
        redirectUri: "http://localhost:8080"   // This redirect uri must be the same as the registered app's in your Azure AD portal
    }
};
const msalRequest = { scopes: [] };
function ensureScope (scope)
 {
    if (!msalRequest.scopes.some((s) => s.toLowerCase() === scope.toLowerCase())) {
        msalRequest.scopes.push(scope);
    }
}
//Initialize MSAL client
const msalClient = new msal.PublicClientApplication(msalConfig);

// Log the user in
async function signIn()
 {
    const authResult = await msalClient.loginPopup(msalRequest);
    sessionStorage.setItem('msalAccount', authResult.account.username);
}
//Get token from Graph
async function getToken()
 {
    let account = sessionStorage.getItem('msalAccount');
    if (!account) {
        throw new Error(
            'User info cleared from session. Please sign out and sign in again.');
    }
    try {
        // First, attempt to get the token silently
        const silentRequest = {
            scopes: msalRequest.scopes,
            account: msalClient.getAccountByUsername(account)
        };

        const silentResult = await msalClient.acquireTokenSilent(silentRequest);
        return silentResult.accessToken;
    } catch (silentError)
     {
        // If silent requests fails with InteractionRequiredAuthError,
        // attempt to get the token interactively
        if (silentError instanceof msal.InteractionRequiredAuthError) {
            const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
            return interactiveResult.accessToken;
        } else {
            throw silentError;
        }
    }
}
