
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
