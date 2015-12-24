function sendErrorsToAPI( message, scriptUrl, lineNumber, columnNumber, error ) {
	var xhr = new XMLHttpRequest();

	error = error || new Error( message );

	// POST to the API
	xhr.open( 'POST', 'https://public-api.wordpress.com/js-error', true );
	xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
	xhr.send( 'message=' + error.message + '&type=' + error.constructor && error.constructor.name + '&userAgent=' + navigator.userAgent + '&stack=' + error.stack );
}

if ( ( localStorage.getItem( 'log-errors' ) !== undefined && localStorage.getItem( 'log-errors' ) === true ) || Math.random() <= 0.01 ) {
	localStorage.setItem( 'log-errors', true );

	// set up handler to POST errors
	window.onerror = sendErrorsToAPI;
}
