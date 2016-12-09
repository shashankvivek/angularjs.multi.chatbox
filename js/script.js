// WS - web socket

var myApp = angular.module("multiChat", []);

// dummy for fetching logged in user name
myApp.factory('GetUserFactory', function () {
    return{
        getName: function () {
            return "SHASHANK";
        }
    }
});

/*
 * this function is used to set pixel for the newly created chat boxes 
 * OR rearranging exiting chat boxes when anyone of them is closed
 */ 
function setPixel(chatWindowNumber) {
    if (chatWindowNumber > 0) {
        return (chatWindowNumber * 410) + 'px';
    } else {
        return 0;
    }
}
