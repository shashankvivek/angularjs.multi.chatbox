
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
        templateUrl: 'template/chat.html',
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

