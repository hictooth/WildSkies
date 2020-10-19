/*
 * This is a patched version of unityRequest.js originally found on CN's website
 * at www.cartoonnetwork.com/games/_tools/static/js/social/unityRequest.js
 *
 * The function UnityRequest(...) is called from within the Unity game, and is
 * expected to respond with various pieces of information.
 *
 * isLoggedIn
 *  should return whether the user is logged in or not. As the saving server is
 *  offline and all saving is now done within this app, this is hard coded to be
 *  yes (or "LOGGED")
 *
 * checkAuthorization
 *  should return whether the user is authorized or not. Like for isLoggedIn,
 *  this has been hard coded to be yes, or "AUTHORIZED"
 *
 * readCookie
 *  the only one to make use of the optional request_param paramater, which will
 *  hold an array of the names of the cookies that are desired. The format
 *  expected here is a key value string (not sure what it should be separated by
 *  though, as it's only ever given a single value) in the form NAME=VALUE. As
 *  all saving is done locally it is not necessary to have actual cookies
 *  defined, and therefore it is hard coded to just return a number (picked at
 *  random).
 */

function UnityRequest(go_name, responce_func, request_name, request_param ) {
    var response = null

	if (request_name == "isLoggedIn") {
        // checking whether the user is logged in - hard code this to yes
		response = "LOGGED"
	} else if (request_name == "checkAuthorization") {
        // checking whether the user is authorized - hard code this to yes
        response = "AUTHORIZED"
	} else if ( request_name == "readCookie" ) {
        // get value of cookie (for sending to the saves server) - hard code values
		response = request_param[0] + "=7624"
	}

    if (response != null) {
        _cnglobal.unityObj.getUnity().SendMessage(go_name, responce_func, response)
    }
}
