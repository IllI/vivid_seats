
var app = angular.module('vivid_seats_homework', ['ui.bootstrap']);



app.controller("controller", function($scope){
    $scope.now = new Date();
    /*** All accesses event services all function to retrieve up to date event list ***/
    function All(){
        VividSeats.eventService.all(
            function(stuff){
                //set time and event_date attributes to each event for displaying properly on the tabular list
                _.each(stuff, function(event){
                    event.event_date = $.datepicker.formatDate("M dd",new Date(event.date));//$.datepicker.parseDate("M dd", event.date);//$filter('date')(new Date(this.date), 'M dd ha');
                    event.time = new Date(event.date).toString("hh:mm tt");
                });

                //Render table
                $scope.$apply(function () {
                    $scope.events = stuff;
                        //Timeout allows enough time for the view to render, sans PubSub
                        setTimeout(function(){
                            initDateTimeFields();
                        },800);
                });

                console.log($scope.events);

            },
            function(){
                onError("Oops, a server error occurred")
            }
        );
    }
    /*** Upcoming accesses event services all function to retrieve up to date event list and then filters for future events ***/
    function Upcoming(){
        VividSeats.eventService.all(
            function(stuff){
                $scope.events = stuff;
                $scope.$apply(function () {
                    var now = new Date();
                    var events = _.filter($scope.events, function(event){


                        var date = new Date(event.date);
                        var now = new Date();
                        if(date.getTime() > now.getTime())
                        {
                            return true;
                        }

                    });
                    console.log(events)

                    $scope.events = events;
                    initDateTimeFields();
                });
                console.log($scope.events);

            },
            function(){
                onError("Oops, a server error occurred")
            }
        );



    }
    /*** Local accesses event services all function to retrieve events in Chicago
     *  TODO: Geocode event locations and get browser time zone
     *  NOTE: Without geocoding or getting browser time zone settings, I'm currently just showing events in Chicago
     * ***/
    function Local(){
        VividSeats.eventService.all(
            function(stuff) {
                $scope.events = stuff;


                        var events = _.filter($scope.events, function (event) {
                            if (event.venue.city.indexOf("Chicago") > -1) {
                                return true;
                            }
                        });
                    $scope.$apply(function () {
                        $scope.events = events;
                        initDateTimeFields();
                    });


                    },
            function(){
                onError("Oops, a server error occurred")
            }


    );
    }

/** Initialize app **/
//Get all events on page load

    All();

    //Set up the top nav tabs
    $scope.tabs = [{
        title: 'All Events',
        url: 'all'
    }, {
        title: 'Upcoming Events',
        url: 'upcoming'
    }, {
        title: 'Local Events',
        url: 'local'
    }];

    $scope.currentTab = 'all';


    //click tab functionality
    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
        if (tab.title.indexOf("All") > -1)
        {
           All();

        }
        if (tab.title.indexOf("Upcoming") > -1)
        {
            Upcoming();
        }
        if (tab.title.indexOf("Local") > -1)
        {
            Local();
        }

    }

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

    //Add event is called from new event create event button
    //calls eventServices add function
    $scope.addEvent = function(event){

            event.date = newDate;
            VividSeats.eventService.add(event,

                function(stuff) {
                    All();
                },
                function(){
                    onError("Oops, a server error occurred")
                }


            );


    }

    //Save event is called when the save button is pressed on editing an event
    //calls eventServices update function
    $scope.saveEvent = function(event){
        console.log(event);
        VividSeats.eventService.update(event,

            function(stuff) {
               //TODO: get current tab and render that view after edit
                All();


            },
            function(){
                onError("Oops, a server error occurred")
            }


        );
    }

    //Remove event is called when remove button is clicked next to an event
    //calls eventServices remove function
    $scope.removeEvent = function(event){
        //Make sure the user wants to remove this event
        var conf = confirm('Are you sure you want to remove this event?');
        if (conf){
            VividSeats.eventService.remove(event,

                function(stuff) {
                    //TODO: get current tab and render that view after edit
                    All();
                },
                function(){
                    onError("Oops, a server error occurred")
                }


            );

        }
    }

    var newDate = "";
    function initDateTimeFields(){
        //TODO: Make directives for date/time pickers

        /*** Calendar datepicker overrides onSelect method to do Angular model binding***/
        $(".calendar").datepicker({
            // dateFormat: 'M dd',
            onSelect: function (val, el) {
                var modelPath = 'event.date';
                //use model id and input id to match event
                var myEvent = _.filter($scope['events'],function(event){
                    return event['id'] == el.id;
                })[0];
                //if event already exists, set modle date to ISO format
                try{
                    myEvent.date = el.currentYear+"-"+ (el.currentMonth > 9 ? "" + el.currentMonth: "0" + el.currentMonth) + "-" +  (el.currentDay > 9 ? el.currentDay: "0" + el.currentDay) +myEvent.date.substring(myEvent.date.indexOf("T"))
                }
                //otherwise update newDate;
                catch(e){
                    newDate =  el.currentYear+"-"+ (el.currentMonth > 9 ? "" + el.currentMonth: "0" + el.currentMonth) + "-" +  (el.currentDay > 9 ? el.currentDay: "0" + el.currentDay) +newDate.substring(newDate.indexOf("T"));
                }

            }
        });
        /*** Timepicker from trentrichardson.com invokes onSelect method to do Angular model binding with date***/
        $(".timepicker").timepicker({

            timeFormat: "hh:mm tt",
            onSelect: function (val, el) {
                var modelPath = 'event.date';//$(this).attr('ng-model');

                var myEvent = _.filter($scope['events'],function(event){
                    //$input.context is the actual input field in the el DOM object
                    return event['id'] == el.$input.context.id;
                })[0];
                //try to edit existing event
                try{
                    var date = myEvent.date.substring(0,myEvent.date.indexOf("T")) + "T" + el.hour + ":" + el.minute;
                    myEvent.date = date;
                }
                //set newDate to date value
                catch(e){
                    var d = $("#new_form .calendar").val();
                    d = d.split('/');
                    console.log(d)
                    if (d.length > 0){
                        d = d[2]+'-'+d[0] +'-'+d[1];
                        newDate = d;

                    }
                    if ((""+el.minute).length < 2) el.minute = "0"+el.minute;
                    newDate+="T"+ el.hour + ":" + el.minute;


                }

            }
        });
    }


});


