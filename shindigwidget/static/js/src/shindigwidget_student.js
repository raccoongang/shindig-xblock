function ShindigXBlock(runtime, element, shindig_defaults) {

    if (!shindig_defaults.is_valid_settings){
        alert('xBlock settings are not properly configured!');
        return
    }

    var shindig = (function () {
        var host = document.getElementById("shindig-signup-student");

        host.action = shindig_defaults.host_events + shindig_defaults.path_events;

        if (!!host) {
            //Quick hack to get host
            var a = document.createElement('a');
            a.href = host.action;
            host = a.host;
        }

        function setLinkFormat(tr, item, hashKeyUser) {
            var td, link;
            td = document.createElement('td');
            link = document.createElement('a');
            //link.href = item.link_url || item.event_url;
            if (item.temp_link) {
                link.href = shindig_defaults.links_to_events_lms + item.temp_link + '/?hash_key=' + hashKeyUser;
            } else {
                link.href = shindig_defaults.links_to_events_lms + item.eid + '/?hash_key=' + hashKeyUser;
            }
            //link.target="postTarget";
            link.target = "_blank";
            //if (item.join_now){
            //    link.innerHTML = "Join";
            //    link.target ="_blank";
            //} else {
            //    link.innerHTML = "RSVP";
            //    link.target ="_blank";
            //}
            link.innerHTML = "Events";
            td.appendChild(link);
            tr.appendChild(td);
        }

        return {
            host: host,
            path: shindig_defaults.path_events,
            buildLink: setLinkFormat
        };
    }());

    /*
     * Lightweight Event Management for Shindig
     * Copyright 2014 Charles Fulnecky for Shindig. All rights reserved.
     * TODO: Insert licencing here
     */

    (function () {
        "use strict";

        //Set up local vars
        var postTarget, clearFilters, el, getEvents, populateEvents, buildTD, webcalURL, isFirstTime, convertUtcToDate, initSettingsAddthisevent;


        isFirstTime = true;
        webcalURL = "webcal://" + shindig.host + '/createical?eid=';


        //Set up event handler for iframe target onload
        postTarget = document.getElementById("postTarget");
        if (!!postTarget) {
            postTarget.onload = function () {
                if (isFirstTime) {
                    isFirstTime = false;
                } else {
                    getEvents();
                    //Set the Events tab as the active tab
                    var eventsRadioButton = document.getElementById('s3');
                    if (eventsRadioButton) {
                        eventsRadioButton.checked = true;
                    }
                }
            };
        }

        //Set up event handler for Clear Filters
        clearFilters = document.getElementById("s-shindig-clear-filters");
        if (!!clearFilters) {
            clearFilters.onclick = function () {
                TF_ClearFilters('s-event-table');
                TF_Filter('s-event-table');
            };
        }

        //Populate Event creation fields with provided default values
        for (var item in shindig_defaults) {
            if (shindig_defaults.hasOwnProperty(item)) {
                // Set default values for specific elements if they exist
                el = document.getElementById(item);
                if (el) {
                    el.value = shindig_defaults[item];
                }
            }
        }

        //Initialize events list
        JSONP.init({
            error: function (ex) {
                alert("Failed to load : " + ex.url);
            }
        });

        buildTD = function (tr, data) {
            var td;
            td = document.createElement('td');
            td.innerHTML = data;
            tr.appendChild(td);
            return td;
        };

        populateEvents = function (data, hashKeyUser) {
            //Setup settings
            initSettingsAddthisevent();

            $('.s-shindig-load').addClass('is-hidden');
            var eventDateSortable,
                eventList = document.getElementById('s-event-list'),
                len = data.length || 0,
                item = null,
                tr = null;


            //Reset event list
            isFirstTime = false;
            eventList.innerHTML = "";

            //Populate event list rows
            if (!!eventList && !!data && len > 0) {

                for (var i = 0; i < len; i++) {

                    var eventDate, eventDateSortable, now, startTime, endTime, special;
                    item = data[i];

                    now = new Date();
                    startTime = new Date(item.start * 1000);
                    eventDate = startTime.toDateString();
                    try {
                        eventDateSortable = startTime.toISOString().slice(0, 10);
                    } catch (ex) {
                        eventDateSortable = ex.message;
                    }
                    try {
                        startTime = startTime.toLocaleTimeString();
                    } catch (ex) {
                        startTime = ex.message;
                    }

                    endTime = new Date(item.end * 1000);
                    endTime = endTime.toLocaleTimeString();

                    tr = document.createElement('tr');
                    tr.className += ("event-type " + item.event_type);


                    var tz = jstz.determine();



                    buildTD(tr, item.event_type +
                        ' - ' +
                        item.subheading +

                        '<div title="Add to Calendar" class="addthisevent">' +
                        '<i class="icon-calendar"></i>' +
                        '<span class="start">' +
                        convertUtcToDate(item.start, "mm/dd/yyyy HH:MM") +
                        '</span>' +
                        '<span class="end">' +
                        convertUtcToDate(item.end, "mm/dd/yyyy HH:MM") +
                        '</span>' +
                        '<span class="timezone">' +
                        tz.name() +
                        '</span>' +
                        '<span class="title">' +
                        item.event_type + ' - ' + item.subheading +
                        '</span>' +
                        '<span class="description">' +
                        item.description +
                        '</span>' +
                        '<span class="location">Location of the event</span>' +
                        '<span class="organizer">' +
                        item.institution +
                        '</span>' +
                        '<span class="organizer_email">' +
                        item.service_email +
                        '</span>' +
                        '<span class="all_day_event">false</span>' +
                        '<span class="date_format">MM/DD/YYYY</span>' +
                        '</div>'

                    );

                    buildTD(tr, item.description);
                    special = buildTD(tr, eventDate);
                    //Set custom sort key for date value
                    special.setAttribute('sorttable_customkey', eventDateSortable);
                    buildTD(tr, startTime);
                    buildTD(tr, endTime);
                    shindig.buildLink(tr, item, hashKeyUser);
                    eventList.appendChild(tr);
                }
            }
            if (len > 0) {
                if (!document.querySelector('.fltrow')) {
                    //Set event filters
                    window.setTimeout(function () {
                        setFilterGrid('s-event-table');
                        TF_Filter("s-event-table");
                    }, 100);
                } else {
                    TF_Filter("s-event-table");
                }
            }

        };

        initSettingsAddthisevent = function () {
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
        };
        convertUtcToDate = function (utcSeconds, format) {
            var date = new Date(0);
            date.setUTCSeconds(utcSeconds);
            return date.format(format)
        };


        var hashKeyUser = false;

        getEvents = function () {
            $('.shindig-load').removeClass('is-hidden');

            //Get existing events
            $.ajax({
                url: runtime.handlerUrl(element, 'get_events'),
                type: "GET",
                success: function (data) {
                    if (data.status) {
                        var intervalID = setInterval(function () {
                            if (getHashKeyUser.isResolved()) {
                                populateEvents(data.events, hashKeyUser);
                                addthisevent.generate();
                                // Hide advertising
                                $('.frs').hide();
                                clearInterval(intervalID)
                            }
                        }, 300)
                    }
                }
            });
        };

        //Initialize event table
        getEvents();

        var getHashKeyUser = $.ajax({
            url: runtime.handlerUrl(element, 'get_hash_key_user'),
            type: "GET",
            success: function (data) {
                hashKeyUser = data.hash_key;
            }
        })

    })();


}