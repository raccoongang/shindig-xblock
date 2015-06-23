function ShindigStudioXBlock(runtime, element, shindig_defaults) {

    if (!shindig_defaults.is_valid_settings){
        alert('xBlock settings are not properly configured!');
        return
    }

    window.RequireJS.require({
        paths: {
            'moment': '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.min.js'
        }
    });

    window.RequireJS.require(['moment'], function (moment) {

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

        $.ajax({
            url: runtime.handlerUrl(element, 'get_user_email_and_username'),
            type: "GET",
            success: function (data) {
                $(element).find("[data-user-email]").val(data.email);
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
            var linksText = 'rsvp';
            if (moment.unix(data.start).utc() < moment.utc()) {
                linksText = 'join';
            }
            var linksToEvent;
            if (data.temp_link) {
                linksToEvent = shindig_defaults.links_to_events_cms + data.temp_link + '/?hash_key=' + hashKeyUser
            } else {
                linksToEvent = shindig_defaults.links_to_events_cms + data.eid + '/?hash_key=' + hashKeyUser
            }

            var classStringDate = '';
            var startDate = moment.unix(data.start).utc();
            if (startDate.isSame(moment.utc(), 'day')) {
                classStringDate = 'today';
            } else if (startDate.isSame(moment.utc().add(1, 'day'), 'day')) {
                classStringDate = 'tomorrow';
            }

            return {
                eventType: eventType[data.event_type],
                name: data.event_name,
                title: data.subheading,
                description: data.description,
                stringDate: startDate.calendar() + moment.unix(data.end).utc().format("[ -] h:mma"),
                classStringDate: classStringDate,
                startDate: startDate.format("MM/DD/YY HH:mm"),
                endDate: moment.unix(data.end).utc().format("MM/DD/YY HH:mm"),
                timezone: tz.name(),
                institution: shindig_defaults.institution,
                email: shindig_defaults.service_phone,
                eid: data.eid,
                linksToEvent: linksToEvent,
                linksText: linksText
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
                    var isDate = moment.unix(data.start).utc().isSame(moment.utc(searchDate), 'day');
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

        // create new event
        var form = $('#shindig-signup', element);
        form.on('submit', createEvent);

        function createEvent(event) {
            event.preventDefault();
            var formValid = validateForm();
            if (formValid) {
                $('#s3', element).prop("checked", true);
                $('.shindig-load', element).removeClass('is-hidden');
                $('[data-btn-more]', element).addClass('hidden');
                $("[data-event-list]", element).html('');
                $.ajax({
                    url: runtime.handlerUrl(element, 'create_event'),
                    type: "POST",
                    data: form.serialize(),
                    success: function (data) {
                        if (data.create) {
                            $('[data-search-text]', element).val(data.event[0].event_name);
                            if (data.event.length == 1) {
                                $('[data-search-date]', element).val(moment.unix(data.event[0].start).utc().format('YYYY-MM-DD'));
                            } else {
                                $('[data-search-date]', element).val('');
                            }
                            renderEvents(data.event);
                            isChangedEvents = true;
                            dataEvents = dataEvents.concat(data.event);
                            dataEvents.sort(function(ev1, ev2) {
                                return ev1.start - ev2.start
                            });
                            clearForm();
                        } else {
                            var error = 'Error create. ' + data.error;
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
                var eid = $(event.currentTarget).data('eid')
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

        var actionToggleActive = function () {
            $('[data-toggle-active]', element).on('click', function (event) {
                $(event.currentTarget).parents('.event').toggleClass('active');
            })
        };

        var clearForm = function(){
            $(element).find('[data-name]').val('');
            $(element).find('[data-title]').val('');
            $(element).find('[data-description]').val('');
            $("[data-startdate]", element).datepicker('setDate', moment.utc().format('MM/DD/YYYY'));
            $(element).find('[data-enddate]').val('');
            $(element).find('[data-start-time]').val('');
            $(element).find('[data-end-time]').val('');
            initNewEventName();
        };

        $('.action-cancel').on('click', function () {
            if (isChangedEvents) {
                runtime.notify('save', {state: 'start'});
                runtime.notify('save', {state: 'end'});
            }
        });

        $('[name = "series"]', element).on('change', function (event) {
            $('[data-toggle-series]').toggleClass('hidden');
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
                "United Kingdom": {"London": "Europe\/London"},
                "UTC": {"UTC": "UTC"}
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

        $("[data-startdate]", element).datepicker('setDate', moment.utc().format('MM/DD/YYYY'));

        $("[data-enddate]", element).datepicker({
            constrainInput: true,
            dateFormat: "mm/dd/yy",
            maxDate: '+20w',
            minDate: moment.utc().format('MM/DD/YYYY'),
            onClose: function(selectedDate) {
                $("[data-startdate]").datepicker( "option", "maxDate", selectedDate );
            }
        });

        $("[data-start-time]", element).timepicker({
            timeFormat: 'H:i'
        });

        $("[data-end-time]", element).timepicker({
            timeFormat: 'H:i'
        });

        $("[data-start-time]", element).on('changeTime', function(){
            $("[data-end-time]", element).timepicker('option', 'minTime', $(this).val());
        });

        $("[data-end-time]", element).on('changeTime', function(){
            $("[data-start-time]", element).timepicker('option', 'maxTime', $(this).val());
        });

    });
}