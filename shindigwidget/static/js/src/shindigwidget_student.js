function ShindigStudentXBlock(runtime, element, shindig_defaults) {

    if (!shindig_defaults.is_valid_settings){
        alert('xBlock settings are not properly configured!');
        return
    }


    window.RequireJS.require.config({
        paths: {
            moment: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.min'

        },
        shim: {
            'moment': {
                exports: 'moment'
            }
        }
    });

    window.RequireJS.require(['moment'], function(moment) {

        moment.locale('en', {
            calendar : {
                sameDay: '[Today from] h:mma',
                nextDay: '[Tomorrow from] h:mma',
                sameElse: 'dddd MMM Do [from] h:mma',
                lastWeek: 'dddd MMM Do [from] h:mma',
                nextWeek: 'dddd MMM Do [from] h:mma',
                lastDay: 'dddd MMM Do [from] h:mma'
            }
        });

        addthisevent.settings({
            license: "replace-with-your-licensekey",
            css: false,
            outlook: {show: true, text: "Outlook Calendar"},
            google: {show: true, text: "Google Calendar"},
            yahoo: {show: true, text: "Yahoo Calendar"},
            outlookcom: {show: true, text: "Outlook.com"},
            appleical: {show: true, text: "Apple iCalendar"},
            dropdown: {order: "appleical,google,outlook,outlookcom,yahoo"}
        });

        var hashKeyUser = false;
        var getHashKeyUser = $.ajax({
            url: runtime.handlerUrl(element, 'get_hash_key_user'),
            type: "GET",
            success: function (data) {
                hashKeyUser = data.hash_key;
            }
        });

        // initialize event list
        var dataEvents = [];
        var getEvents = function () {
            $('.shindig-load', element).removeClass('is-hidden');
            $.ajax({
                url: runtime.handlerUrl(element, 'get_events'),
                type: "GET",
                success: function (data) {
                    if (data.status) {
                        var intervalID = setInterval(function () {
                            if (getHashKeyUser.isResolved()) {
                                dataEvents = data.events;
                                renderEvents(dataEvents.slice(0, 3));
                                clearInterval(intervalID)
                            }
                        }, 300)

                    }
                }
            });
        };

        getEvents();

        var renderEvents = function(events) {
            var eventList = '';
            var template = _.template($('#event-item-student', element).text());
            _.each(events, function(event){
                var values = getValuesForTemplate(event);
                eventList += template(values);
            });
            $('.shindig-load', element).addClass('is-hidden');
            $("[data-event-list]", element).html(eventList);
            $('[data-event]:first', element).addClass('active');
            addthisevent.generate();
            actionToggleActive();
            if (dataEvents.length > events.length) {
                $('[data-block-more]', element).removeClass('is-hidden');
            } else {
                $('[data-block-more]', element).addClass('is-hidden');
            }

        };

        var getValuesForTemplate = function (data) {
            var eventType = {OH: 'Office Hours', DS: 'Discussion Section', SH: 'Study Hall'};
            var tz = jstz.determine();
            var linksText = 'rsvp';
            if (moment.unix(data.start) < moment()) {
                linksText = 'join';
            }
            var linksToEvent;
            if (data.temp_link) {
                linksToEvent = shindig_defaults.links_to_events_lms + data.temp_link + '/?hash_key=' + hashKeyUser
            } else {
                linksToEvent = shindig_defaults.links_to_events_lms + data.eid + '/?hash_key=' + hashKeyUser
            }

            var classStringDate = '';
            var startDate = moment.unix(data.start);
            if (startDate.isSame(moment(), 'day')) {
                classStringDate = 'today';
            } else if (startDate.isSame(moment().add(1, 'day'), 'day')) {
                classStringDate = 'tomorrow';
            }

            return {
                eventType: eventType[data.event_type],
                name: data.event_name,
                title: data.subheading,
                description: data.description,
                stringDate: startDate.calendar() + moment.unix(data.end).format("[ to] h:mma"),
                classStringDate: classStringDate,
                startDate: startDate.format("MM/DD/YY HH:mm"),
                endDate: moment.unix(data.end).format("MM/DD/YY HH:mm"),
                timezone: tz.name(),
                institution: shindig_defaults.institution,
                email: shindig_defaults.service_phone,
                eid: data.eid,
                linksToEvent: linksToEvent,
                linksText: linksText
            }
        };

        $('[data-btn-more], [data-search-clear]', element).on('click', function (event) {
            event.preventDefault();
            $('[data-search-text]', element).val('');
            $('[data-search-date]', element).val('');
            renderEvents(dataEvents);
        });

        var search = function(event) {
            if (event) {
                event.preventDefault();
            }
            var searchText = $('[data-search-text]', element).val().toLowerCase();
            var searchDate = $('[data-search-date]', element).val();
            if (searchText || searchDate) {
                var searchEvent = _.filter(dataEvents, function (data) {
                    var isTextName = data.event_name.toLowerCase().indexOf(searchText) != -1;
                    var isTextTitle = data.subheading.toLowerCase().indexOf(searchText) != -1;
                    var isTextDescription = data.description.toLowerCase().indexOf(searchText) != -1;
                    var isDate = moment.unix(data.start).isSame(moment(searchDate), 'day');
                    if (searchText && searchDate) {
                        return (isTextTitle || isTextDescription || isTextName) && isDate
                    }
                    if (searchText) {
                        return isTextTitle || isTextDescription || isTextName
                    }
                    if (searchDate) {
                        return isDate
                    }
                });
                renderEvents(searchEvent);
            }
        };

        $('[data-search-btn]', element).on('click', search);
        $('[data-search-text]', element).on('keypress', function (event) {
            if (event.which == 13) {
                search(event)
            }
        });
        $('[data-search-date]', element).on('change', function (event) {
            var searchDate = $(event.currentTarget).val();
            var searchText = $('[data-search-text]', element).val();
            if (searchText || searchDate) {
                search();
            } else {
                renderEvents(dataEvents);
            }
        });

        var actionToggleActive = function () {
            $('[data-toggle-active]', element).on('click', function (event) {
                $(event.currentTarget).parents('.event').toggleClass('active');
            })
        };
    });
}