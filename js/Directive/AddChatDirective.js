
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
