function ShindigStudioXBlock(runtime, element, shindig_defaults) {

    if (!shindig_defaults.is_valid_settings){
        alert('xBlock settings are not properly configured!');
        return
    }

    window.RequireJS.require({
        paths: {
            'moment': '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.min',
            'moment-timezone': '//cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.0/moment-timezone.min'
        },
        shim: {
            'moment': {
                exports: 'moment'
            },
            'moment-timezone': {
                exports: 'moment-timezone'
            }
        }
    });

    window.RequireJS.require(['moment', 'moment-timezone'], function (moment) {


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

        moment.tz.add([
            "America/New_York|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261t0 1nX0 11B0 1nX0 11B0 1qL0 1a10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x40 iv0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Chicago|CST CDT EST CWT CPT|60 50 50 50 50|01010101010101010101010101010101010102010101010103401010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 1wp0 TX0 WN0 1qL0 1cN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 11B0 1Hz0 14p0 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Denver|MST MDT MWT MPT|70 60 60 60|01010101023010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261r0 1nX0 11B0 1nX0 11B0 1qL0 WN0 mn0 Ord0 8x20 ix0 LCN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Phoenix|MST MDT MWT|70 60 60|01010202010|-261r0 1nX0 11B0 1nX0 SgN0 4Al1 Ap0 1db0 SWqX 1cL0",
            "America/Los_Angeles|PST PDT PWT PPT|80 70 70 70|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261q0 1nX0 11B0 1nX0 SgN0 8x10 iy0 5Wp0 1Vb0 3dB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "America/Anchorage|CAT CAWT CAPT AHST AHDT YST AKST AKDT|a0 90 90 a0 90 90 90 80|012034343434343434343434343434343456767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17T00 8wX0 iA0 Qlb0 52O0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cm0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0",
            "Pacific/Honolulu|HST HDT HST|au 9u a0|010102|-1thLu 8x0 lef0 8Pz0 46p0",
            "Europe/London|GMT BST BDST|0 -10 -20|0101010101010101010101010101010101010101010101010121212121210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2axa0 Rc0 1fA0 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 2Rz0 Dc0 1zc0 Oo0 1zc0 Rc0 1wo0 17c0 1iM0 FA0 xB0 1fA0 1a00 14o0 bb0 LA0 xB0 Rc0 1wo0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1a00 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1tA0 IM0 90o0 U00 1tA0 U00 1tA0 U00 1tA0 U00 1tA0 WM0 1qM0 WM0 1qM0 WM0 1tA0 U00 1tA0 U00 1tA0 11z0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00"
        ]);

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

        // initialize default fields
        $(element).find('[data-institution]').val(shindig_defaults.institution);
        $(element).find('[data-course]').val(shindig_defaults.course);

        function initNewEventName() {
            var maxEid = _.max(dataEvents, function(event){ return event.eid; }).eid;
            if (maxEid) {
                maxEid += 1;
            } else {
                maxEid = 1
            }
            var newEventName = shindig_defaults.course + ' ' + shindig_defaults.course_run + ' #' + maxEid;
            $(element).find('[data-name]').val(newEventName);
        }

        var userEmail;
        $.ajax({
            url: runtime.handlerUrl(element, 'get_user_email_and_username'),
            type: "GET",
            success: function (data) {
                userEmail = data.email;
                $(element).find("[data-user-email]").val(userEmail);
                //$(element).find("[data-username]").val(data.username);
            }
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
        var isChangedEvents = false;
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
                                initNewEventName();
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
            var template = _.template($('#event-item', element).text());
            _.each(events, function(event){
                var values = getValuesForTemplate(event);
                eventList += template(values);
            });
            $('.shindig-load', element).addClass('is-hidden');
            $("[data-event-list]", element).html(eventList);
            $('[data-event]:first', element).addClass('active');
            addthisevent.generate();
            actionDelete();
            actionEdit();
            actionToggleActive();
            if (dataEvents.length > events.length) {
                $('[data-btn-more]', element).removeClass('hidden');
            } else {
                $('[data-btn-more]', element).addClass('hidden');
            }

        };

        var getValuesForTemplate = function (data) {
            var eventType = {OH: 'Office Hours', DS: 'Discussion Section', SH: 'Study Hall'};
            var tz = jstz.determine();
            var hasShowLink = false;
            if (moment.unix(data.start) < moment().add(1, 'hour')) {
                hasShowLink = true;
            }
            var linksToEvent;
            if (data.temp_link) {
                linksToEvent = shindig_defaults.links_to_events_cms + data.temp_link + '/?hash_key=' + hashKeyUser
            } else {
                linksToEvent = shindig_defaults.links_to_events_cms + data.eid + '/?hash_key=' + hashKeyUser
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
                stringDate: startDate.calendar() + moment.unix(data.end).format("[ -] h:mma"),
                classStringDate: classStringDate,
                startDate: startDate.format("MM/DD/YY HH:mm"),
                endDate: moment.unix(data.end).format("MM/DD/YY HH:mm"),
                timezone: tz.name(),
                institution: shindig_defaults.institution,
                email: shindig_defaults.service_phone,
                eid: data.eid,
                linksToEvent: linksToEvent,
                hasShowLink: hasShowLink
            }
        };

        $('[data-btn-more], [data-search-clear]', element).on('click submit', function () {
            $('[data-search-text]', element).val('');
            $('[data-search-date]', element).val('');
            renderEvents(dataEvents);
            return false;
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
                search(event);
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

        // create new event or edit event
        var form = $('#shindig-signup', element);
        form.on('submit', createOrEditEvent);

        function createOrEditEvent(event) {
            event.preventDefault();
            var formValid = validateForm();
            if (formValid) {
                $('#s3', element).prop("checked", true);
                $('.shindig-load', element).removeClass('is-hidden');
                $('[data-btn-more]', element).addClass('hidden');
                $("[data-event-list]", element).html('');
                var dataForm = form.serialize();
                if (eidEditEvent) {
                    dataForm = dataForm + '&eid=' + eidEditEvent
                }
                $.ajax({
                    url: runtime.handlerUrl(element, 'create_or_edit_event'),
                    type: "POST",
                    data: dataForm,
                    success: function (data) {
                        if (data.save) {
                            $('[data-search-text]', element).val(data.event[0].event_name);
                            if (eidEditEvent) {
                                var dataEid = _.map(dataEvents, function(data){ return data.eid });
                                dataEvents.splice(_.indexOf(dataEid, eidEditEvent), 1, data.event[0])
                            } else {
                                dataEvents = dataEvents.concat(data.event);
                            }
                            renderEvents(data.event);
                            isChangedEvents = true;
                            dataEvents.sort(function(ev1, ev2) {
                                return ev1.start - ev2.start
                            });
                            clearForm();
                        } else {
                            var error = 'Error save. ' + data.error;
                            alert(error);
                            renderEvents(dataEvents.slice(0, 3));
                        }
                    }
                });
            }
        }

        function validateForm() {
            var formValid = true;

            // validation schedule
            var recurring = $('[data-recurring]', element)[0];
            if (recurring.checked) {
                var dayOfTheWeek = $('[data-schedule]:checked', element);
                if (!dayOfTheWeek.length) {
                    formValid = false;
                    $('[data-schedul-error]', element).removeClass('hidden');
                }
            }
            return formValid;
        }

        // remove event
        var actionDelete = function () {
            $('[data-delete-event]', element).on('click', function (event) {
                event.preventDefault();
                var eid = $(event.currentTarget).data('eid');
                $.ajax({
                    url: runtime.handlerUrl(element, 'remove_event'),
                    type: "POST",
                    data: {'eid': eid},
                    success: function (data) {
                        if (data.remove) {
                            $(event.currentTarget).parents('.list-item').remove();
                            var dataEid = _.map(dataEvents, function(data){ return data.eid });
                            isChangedEvents = true;
                            dataEvents.splice(_.indexOf(dataEid, eid), 1);
                        }
                    }
                });
            });
        };

        var eidEditEvent = false;
        function actionEdit() {
            $('[data-edit-event]', element).on('click', renderEditTab)
        }

        function renderEditTab(ev) {
            ev.preventDefault();
            var eid = $(ev.currentTarget).data('eid');
            eidEditEvent = eid;
            $('#s2', element).prop("checked", true);
            var event = _.findWhere(dataEvents, {eid: eid});
            $('[data-text-tab2]', element).text('Edit');
            $('[data-submit-form]', element).text('Edit event');
            $(element).find('[data-country]').val(event.country).trigger('change');
            $(element).find('[data-timezone]').val(event.time_zone);
            $(element).find('[data-name]').val(event.event_name);
            $(element).find('[data-title]').val(event.subheading);
            $(element).find('[data-description]').val(event.description);
            $(element).find('[data-user-email]').val(event.service_email);
            $(element).find('[name="event_type"][value=' + event.event_type + ']').prop("checked", true);
            $(element).find('[name="series"][value="false"]').click();
            $(element).find('[name="series"]').prop('disabled', true);
            $(element).find('[data-startdate]').datepicker('setDate', moment.unix(event.start).tz(event.time_zone).format('MM/DD/YYYY'));
            $(element).find('[data-start-time]').timepicker('setTime', moment.unix(event.start).tz(event.time_zone).format('HH:mm'));
            $(element).find('[data-end-time]').timepicker('setTime', moment.unix(event.end).tz(event.time_zone).format('HH:mm'));
        }

        var actionToggleActive = function () {
            $('[data-toggle-active]', element).on('click', function (event) {
                $(event.currentTarget).parents('.event').toggleClass('active');
            })
        };

        var clearForm = function(){
            eidEditEvent  = false;
            initNewEventName();
            $('[data-text-tab2]', element).text('Create');
            $('[data-submit-form]', element).text('Create My Event');
            $(element).find('[data-title]').val('');
            $(element).find('[data-description]').val('');
            $(element).find('[data-user-email]').val(userEmail);
            $(element).find('[name="event_type"][value="OH"]').prop("checked", true);
            $(element).find('[name="series"]').prop('disabled', false);
            $(element).find('[name="series"][value="false"]').click();
            $(element).find('[data-startdate]').datepicker('setDate', moment().format('MM/DD/YYYY'));
            $(element).find('[data-enddate]').val('');
            $(element).find('[data-start-time]').val('');
            $(element).find('[data-end-time]').val('');
        };

        $('.action-cancel').on('click', function () {
            if (isChangedEvents) {
                runtime.notify('save', {state: 'start'});
                runtime.notify('save', {state: 'end'});
            }
        });

        $('[name = "series"]', element).on('change', function (event) {
            $('[data-toggle-series]', element).toggleClass('hidden');
            if (event.currentTarget.value == 'true') {
                $('[data-enddate]', element).prop('required', true);
                $('[data-label-text-startdate]', element).text('Beginning');
            } else {
                $('[data-enddate]', element).prop('required', false);
                $('[data-label-text-startdate]', element).text('On');
            }
        });

        $('[data-schedule]', element).on('change', function () {
            $('[data-schedul-error]', element).addClass('hidden');
        });

        function filterTimeZones() {
            var timeZones = {
                "United States": {
                    "Eastern": "America\/New_York",
                    "Central": "America\/Chicago",
                    "Mountain": "America\/Denver",
                    "Arizona": "America\/Phoenix",
                    "Pacific": "America\/Los_Angeles",
                    "Alaska": "America\/Anchorage",
                    "Hawaii": "Pacific\/Honolulu"
                },
                "United Kingdom": {"London": "Europe\/London"}
            };
            var country = $('select[name=country]', element);
            var tz = $('select[name=timeZone]', element);
            tz.children().remove();

            var selectedCountryLabel = country.find(':selected').attr('label');
            $.each(timeZones[selectedCountryLabel], function (k, v) {
                var newOption = $('<option value="' + v + '" label="' + k + '">'
                    + k + '</option>');
                if (typeof(savedTimeZone) == 'string' && v == savedTimeZone) {
                    $(newOption).attr('selected', 'selected');
                }
                tz.append(newOption);
            });
            return true;
        }
        filterTimeZones();
        $('select[name=country]', element).change(filterTimeZones);

        $("[data-startdate]", element).datepicker({
            constrainInput: true,
            maxDate: '+20w',
            dateFormat: "mm/dd/yy",
            onClose: function( selectedDate ) {
                $("[data-enddate]", element).datepicker("option", "minDate", selectedDate);
          }
        });

        $("[data-startdate]", element).datepicker('setDate', moment().format('MM/DD/YYYY'));

        $("[data-enddate]", element).datepicker({
            constrainInput: true,
            dateFormat: "mm/dd/yy",
            maxDate: '+20w',
            minDate: moment().format('MM/DD/YYYY'),
            onClose: function(selectedDate) {
                $("[data-startdate]").datepicker( "option", "maxDate", selectedDate );
            }
        });

        $("[data-start-time]", element).timepicker({
            showLeadingZero: true,
            defaultTime: '',
            onSelect: function(time, endTimePickerInst) {
                $("[data-end-time]", element).timepicker('option', {
                    minTime: {
                        hour: endTimePickerInst.hours,
                        minute: endTimePickerInst.minutes
                    }
                });
            },
            onClose: function(time, inst) {
                var endSelect = $("[data-end-time]", element).timepicker('getTime');
                if (endSelect && endSelect == time) {
                    $("[data-start-time]", element).val('');
                }
            }
        });

        $("[data-end-time]", element).timepicker({
            showLeadingZero: true,
            defaultTime: '',
            onSelect: function(time, startTimePickerInst) {
                $("[data-start-time]", element).timepicker('option', {
                    maxTime: {
                        hour: startTimePickerInst.hours,
                        minute: startTimePickerInst.minutes
                    }
                });
            },
            onClose: function(time, inst) {
                var startSelect = $("[data-start-time]", element).timepicker('getTime');
                if (startSelect && startSelect == time) {
                    $("[data-end-time]", element).val('');
                }
            }
        });

    });
}