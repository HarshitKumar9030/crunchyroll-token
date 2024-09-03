document.getElementById('apiForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const selectedApi = document.getElementById('apiSelector').value;
    const userToken = document.getElementById('userToken').value;
    const responseField = document.getElementById('apiResponse');
    responseField.value = "Loading...";
  
    try {
      const decodedToken = JSON.parse(atob(userToken.split('.')[1]));
      const accountId = decodedToken.profile_id;
  
      const url = selectedApi.replace('${account_id}', accountId);
  
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${userToken}`
        }
      });
  
      if (response.ok) {
        const responseData = await response.json();
        responseField.value = JSON.stringify(responseData, null, 2);
      } else {
        responseField.value = `Error: ${response.status} ${response.statusText}`;
      }
    } catch (error) {
      responseField.value = 'Error: Invalid token format or API request failed. ' + error.message;
    }
  });
  