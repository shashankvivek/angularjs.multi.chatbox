/**
 * 
 * directive to monitor incoming message from Web socket. 
 * We are using $interval to replicate the scenario.
 */
myApp.directive('watchDirective', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // =========== using watcher
            scope.$watch('incomingMsg', function (newVal, oldVal) {
                for (var index in newVal) {
                    var user = newVal[index].sender;
                    var userList = scope.openChatUserList;
                    var userWindowDetails = {index: 0, name: "", position: ""};
                    var result = _.findWhere(userList, {name: user});
                    if (!result) {

                        userWindowDetails.index = scope.count.p;
                        userWindowDetails.name = user;
                        userWindowDetails.position = setPixel(scope.count.p);

                        scope.openChatUserList.push(userWindowDetails);
// =================================== Append new chat boxes into the html page  =======================================================
                        angular.element(document.getElementById('main-html-body')).append(
                                //dynamically add the chat windows over here.   
                                $compile("<div chat-box \n\
                                        id=" + user + "\n\
                                        class='row chat-window col-xs-5 col-md-3' \n\
                                        incoming-msg='incomingMsg' \n\
                                        open-chat-user-list='openChatUserList' \n\
                                        user='" + user + "' \n\
                                        count='count' style='position: fixed;bottom:0; right: " + setPixel(scope.count.p) + "'></div>"
                                        )(scope)
                                )
// ========================================================================================================================================                        
                        scope.count.p++;

                    }
                }
                ;
            });
        }
    }
})
