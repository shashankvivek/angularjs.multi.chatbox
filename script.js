// WS - web socket

var myApp = angular.module("myApp", []);

myApp.controller('MainController', function ($scope, $interval, GetUserFactory, $timeout) {

    $scope.count = {p: 0}; // CAN BE REMOVED - to count on index.html that no more than 3 chat windows are open
    $scope.openChatUserList = []; // to maintain the list of all chat windows that have been created
    
    // TO BE REMOVED - bot to send regular message from server to chat windows. 
    // Replicating Web scoket like feature for demo purpose. 
    var inter = $interval(function () {
        $scope.incomingMsg = [
            {
                sender: "USER1",
                receiver: GetUserFactory.getName(),
                msg: "New Msg from USER1: " + new Date().getTime()
            },
            {
                sender: "USER2",
                receiver: GetUserFactory.getName(),
                msg: "New Msg from USER2: " + new Date().getTime()
            }

        ]
    }, 2000);
    // to stop $interval and send a new message for user3
    $timeout(function () {
        $interval.cancel(inter);
        $scope.incomingMsg =
                [{
                        sender: "USER3",
                        receiver: GetUserFactory.getName(),
                        msg: "New Msg from USER3: " + new Date().getTime()
                    }];
    }, 8000)
});

// dummy for fetching logged in user name
myApp.factory('GetUserFactory', function () {
    return{
        getName: function () {
            return "SHASHANK";
        }
    }
})

/**
 * 
 * directive to monitor incoming message from Web socket. 
 * We are using $interval to replicate the scenario.
 */
myApp.directive('watchDirective', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            console.log(scope.incomingMsg)
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

/*
 *  directive to insert chat windows in html body
 */
myApp.directive('addChat', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            user: '@',
            count: '=',
            openChatUserList: '=',
            incomingMsg: '='
        },
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var userList = scope.openChatUserList;
                var userWindowDetails = {index: 0, name: "", position: ""};
                var result = _.findWhere(userList, {name: scope.user});
                if (!result) {

                    userWindowDetails.index = scope.count.p;
                    userWindowDetails.name = scope.user;
                    userWindowDetails.position = setPixel(scope.count.p);

                    scope.openChatUserList.push(userWindowDetails);

                    angular.element(document.getElementById('main-html-body')).append(
                            //dynamically add the chat windows over here.   
                            $compile("<div chat-box \n\
                                        id=" + scope.user + "\n\
                                        class='row chat-window col-xs-5 col-md-3' \n\
                                        incoming-msg='incomingMsg' \n\
                                        open-chat-user-list='openChatUserList' \n\
                                        user='" + scope.user + "' \n\
                                        count='count' style='position: fixed;bottom:0; right: " + setPixel(scope.count.p) + "'></div>"
                                    )(scope)
                            )
                    scope.count.p++;
                } else {
                    alert('chat window for' + scope.user + 'is already opened')
                    scope.count.p--;
                }
            });
        }
    }
})

/*
 *  directive of newly created chat window
 *  TODO- no responsivness in chat windows
 */
myApp.directive('chatBox', function ($compile, GetUserFactory) {
    return {
        restrict: 'AE',
        scope: {
            user: '@',
            count: '=',
            openChatUserList: '=openChatUserList',
            incomingMsg: '='
        },
        templateUrl: 'chat.html',
        controller: function ($scope) {
            $scope.showChatMsgs = true;
            // to be sent to user via WS
            $scope.chatData = {
                sender: GetUserFactory.getName(),
                receiver: $scope.user, 
                msg: ""
            }
        },
        link: function (scope, element, attr) {
            scope.close = function () {
                element.remove();// close the selected chat window
                var result = _.findWhere(scope.openChatUserList, {name: scope.user});
                scope.openChatUserList.splice(result.index, 1);
                scope.openChatUserList = updateIndexes(scope.openChatUserList, result.index);
                scope.count.p--;
                scope.$destroy();
            };
            scope.minimize = function () {
                scope.showChatMsgs = !scope.showChatMsgs;
            }
            scope.$watch('incomingMsg', function (newVal, oldVal) {
                var result = _.findWhere(scope.incomingMsg, {sender: scope.user});
                // TODO - check this condition as per the format of incomingMsg of WS
                if (result) {
                    var userChatId = 'body1_' + scope.user;
                    angular.element(document.getElementById(userChatId)).append(
                            $compile("<div class='row msg_container base_receive'><div class='col-md-2 col-xs-2 avatar'> \n\
                            <img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg' class='img-responsive'>\n\
                            </div>\n\
                            <div class='col-md-10 col-xs-10'>\n\
                            <div class='messages msg_receive'>\n\
                            <p>" + result.msg + "</p>\n\
                            <time datetime='2009-11-13T20:00'>Timothy • 51 min</time></div></div>\n\
                            </div>")(scope)
                            )
                    // TODO - scroll to the bottom of chat window to read the latest ping by user
                }

            });
            scope.sendMsg = function (msg) {
                var msg = msg;
                var userChatId = 'body1_' + scope.user;
                angular.element(document.getElementById(userChatId)).append(
                        $compile("<div class='row msg_container base_sent'>\n\
                                <div class='col-md-10 col-xs-10'>\n\
                                    <div class='messages msg_sent'>\n\
                                        <p>" + msg + "</p>\n\
                                        <time datetime='2009-11-13T20:00'>Timothy • 51 min</time>\n\
                                    </div>\n\
                                </div>\n\
                                <div class='col-md-2 col-xs-2 avatar'>\n\
                                    <img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg' class='img-responsive'>\n\
                                </div>\n\
                            </div>")(scope)
                        )
                // send "msg" to the websocket in a paticular format
                // TODO - WSService.send($scope.chatData)
                console.log(scope.chatData)
                // reset the msg area
                scope.chatData.outMsg = "";

            }
            // assignes new pixels to the chat divs once some open div is closed
            var updateIndexes = function (userChatBoxArray, index) {
                var removedIndex = index;
                userChatBoxArray.forEach(function (arrayItem) {
                    if (arrayItem.index > removedIndex) {
                        arrayItem.index--;
                        arrayItem.position = arrayItem.index * 410;
                        var id = arrayItem.name;
                        document.getElementById(id).style.right = arrayItem.position + 'px';
                    }
                })
            }
        }
    };
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