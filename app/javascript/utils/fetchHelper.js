

export function jsonHeader(options = {}) {
    return Object.assign(options, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }
  
 
  export function getMetaContent(name) {
    const header = document.querySelector(`meta[name="${name}"]`);
    return header && header.content;
  }
  
 
  export function getAuthenticityToken() {
    const token = getMetaContent('csrf-token');
    console.log('CSRF Token:', token); 
    return token;
  }
  
  
  export function authenticityHeader(options = {}) {
    return Object.assign(options, {
      'X-CSRF-Token': getAuthenticityToken(),
      'X-Requested-With': 'XMLHttpRequest',
    });
  }
  
  
  export function safeCredentials(options = {}) {
    const finalOptions = Object.assign(options, {
      credentials: 'include',  
      mode: 'same-origin',     
      headers: Object.assign(
        (options.headers || {}),
        authenticityHeader(),  
        jsonHeader()           
      ),
    });
  
    
    console.log('Final fetch options:', finalOptions);  
  
    return finalOptions;
  }
  
  
  
  export function safeCredentialsFormData(options = {}) {
    return Object.assign(options, {
      credentials: 'include',
      mode: 'same-origin',
      headers: Object.assign((options.headers || {}), authenticityHeader()),
    });
  }
  
  
  export function handleErrors(response) {
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);  
      throw Error(`Error ${response.status}: ${response.statusText}`);
    }
  
   
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json(); 
    } else {
      return response.text(); 
    }
  }
  