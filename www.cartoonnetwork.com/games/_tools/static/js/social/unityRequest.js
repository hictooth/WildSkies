function UnityRequest(go_name, responce_func, request_name, request_param ) {
	console.log(go_name)
	console.log(responce_func)
	console.log(request_name)
	console.log(request_param)
	if( request_name == "isLoggedIn" ) {
		//if( CartoonMSIB.isLoggedIn() )
			GetUnity().SendMessage( go_name, responce_func, "LOGGED" );
		//else
		//	GetUnity().SendMessage( go_name, responce_func, "LOG_FAILED" );
	} else if( request_name == "checkAuthorization" ) {
		//if( CartoonMSIB.checkAuthorization() )
			GetUnity().SendMessage( go_name, responce_func, "AUTHORIZED" );
		//else
		//	GetUnity().SendMessage( go_name, responce_func, "AUTHORIZED_FAILED" );
	} else if( request_name == "readCookie" ) {
		//if( CartoonMSIB.doCookieCheck(request_param) )
			var response = request_param[0] + "=7624";
			GetUnity().SendMessage( go_name, responce_func, /*CartoonMSIB.readCookie(request_param)*/response );
		//else
		//	GetUnity().SendMessage( go_name, responce_func, "" );
	}
}

/*function UnityRequest(go_name, responce_func, request_name, request_param ) {
	if( request_name == "isLoggedIn" ) {
		if( CartoonMSIB.isLoggedIn() )
			GetUnity().SendMessage( go_name, responce_func, "LOGGED" );
		else
			GetUnity().SendMessage( go_name, responce_func, "LOG_FAILED" );
	} else if( request_name == "checkAuthorization" ) {
		if( CartoonMSIB.checkAuthorization() )
			GetUnity().SendMessage( go_name, responce_func, "AUTHORIZED" );
		else
			GetUnity().SendMessage( go_name, responce_func, "AUTHORIZED_FAILED" );
	} else if( request_name == "readCookie" ) {
		if( CartoonMSIB.doCookieCheck(request_param) )
			GetUnity().SendMessage( go_name, responce_func, CartoonMSIB.readCookie(request_param) );
		else
			GetUnity().SendMessage( go_name, responce_func, "" );
	}
}*/

/* global function for getting a reference to the Unity object */
function GetUnity() {
	if (typeof _cnglobal.unityObj != null) {
		return _cnglobal.unityObj.getUnity();
	}
	return null;
}

/* global function for embedding the Unity file
 * takes the following params:
 *	- the Unity config object
 *	- the path for the Unity file
 *	- the div you're loading into (as a jQuery object)
 */
function embedUnity(config, filePath, gameDiv) {

	/* initialize the unity object */
    _cnglobal.unityObj = new UnityObject2(config);

    /* grab the "install now" buttons and hide them */
    var brokenScreen = gameDiv.find("#broken");
    var missingScreen = gameDiv.find("#missing");

    /* check to see if the browser has Unity installed already */
    _cnglobal.unityObj.observeProgress(function (progress) {
        switch(progress.pluginStatus) {
            case "broken":
                brokenScreen.find("a").click(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    _cnglobal.unityObj.installPlugin();
                    return false;
                });
                brokenScreen.css("display", "inline-block").width(config.width).height(config.height);
                break;
            case "missing":
                missingScreen.find("a").click(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    _cnglobal.unityObj.installPlugin();
                    return false;
                });
                missingScreen.css("display", "inline-block").width(config.width).height(config.height);
                break;
            case "installed":
                missingScreen.remove();
                break;
        }
    });

    /* start the unity plugin */
	_cnglobal.unityObj.initPlugin(gameDiv[0], filePath);

}
