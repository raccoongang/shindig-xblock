function ShindigXBlock(runtime, element, shindig_defaults) {

    var form = document.getElementById("shindig-signup");

    var shindig = (function () {
        //TODO:  DRY this code out vis-à-vis student.js
        var i,
            host,
            dates = form.querySelectorAll('[type=date]');

        if (!!form) {
            //Quick hack to get host
            var a = document.createElement('a');
            a.href = form.action;
            host = a.host;
        }

        //Extend date object to facilitate date range calculation
        Date.prototype.addMonths = function (n) {
            var day = this.getDate();
            this.setMonth(this.getMonth() + n);
            if (this.getDate() < day) {
                this.setDate(1);
                this.setDate(this.getDate() - 1);

            }
            return this;
        };

        function checkEnter(e) {
            var evt = (evt) ? evt : ((event) ? event : null);
            var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
            if ((evt.keyCode == 13) && (node.type != "submit")) {
                return false;
            }
        }

        function setLinkFormat(tr, item) {
            var td, link, eventLink;
            td = document.createElement('td');

            link = document.createElement('a');
            link.className = 'delete-event';
            link.href = '#';
            link.setAttribute('data-eid', item.eid);
            link.innerHTML = "Delete | ";
            td.appendChild(link);

            //if (item.join_now){
            //    link.innerHTML = "Join";
            //    link.target="_blank"
            //} else {
            //    link.innerHTML = "Delete | ";
            //}

            eventLink = document.createElement('a');
            eventLink.href = shindig_defaults.links_to_events_cms + item.eid;
            eventLink.target = "_blank";
            eventLink.innerHTML = "Events";
            td.appendChild(eventLink);
            tr.appendChild(td);
        }

        function dateRangeExceeded(e) {
            var today = new Date(),
                dateToTest = new Date(e.target.value);

            // Test for dates more than 6 months out
            if (dateToTest > today.addMonths(6)) {
                e.target.setCustomValidity('Please pick a date less than 6 months from now (' +
                new Date().toString() + ').');
            } else {
                e.target.setCustomValidity('');
            }
        }

        // Add additional validation rules
        i = dates.length; //or 10
        while (i--) {
            dates[i].addEventListener('input', dateRangeExceeded);
        }

        //Default start date to current date
        document.getElementById('startdate').value = new Date().toISOString().slice(0, 10);

        form.onkeypress = checkEnter;

        return {
            host: host,
            path: shindig_defaults.path_events,
            buildLink: setLinkFormat
        };
    }());


    (function () {
        "use strict";

        //Set up local vars
        var clearFilters, el, getEvents, populateEvents, buildTD, webcalURL;

        webcalURL = "webcal://" + shindig.host + '/createical?eid=';

        //Set up event handler for Clear Filters
        clearFilters = document.getElementById("shindig-clear-filters");
        if (!!clearFilters) {
            clearFilters.onclick = function () {
                TF_ClearFilters('event-table');
                TF_Filter('event-table');
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

        buildTD = function (tr, data) {
            var td;
            td = document.createElement('td');
            td.innerHTML = data;
            tr.appendChild(td);
            return td;
        };

        populateEvents = function (data) {
            $('.shindig-load').addClass('is-hidden');
            var eventList = document.getElementById('event-list'),
                len = data.length || 0,
                item = null,
                tr = null;

            //Reset event list
            eventList.innerHTML = "";

            //Populate event list rows
            if (!!eventList && !!data && len > 0) {

                for (var i = 0; i < len; i++) {

                    var eventDate, eventDateSortable, now, startTime, endTime, special;
                    item = data[i];

                    now = new Date();
                    startTime = new Date(item.start * 1000);
                    startTime = new Date(startTime.getUTCFullYear(),
                                         startTime.getUTCMonth(),
                                         startTime.getUTCDate(),
                                         startTime.getUTCHours(),
                                         startTime.getUTCMinutes());
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
                    endTime = new Date(endTime.getUTCFullYear(),
                                       endTime.getUTCMonth(),
                                       endTime.getUTCDate(),
                                       endTime.getUTCHours(),
                                       endTime.getUTCMinutes());
                    endTime   = endTime.toLocaleTimeString();

                    tr = document.createElement('tr');
                    tr.className += ("event-type " + item.event_type);

                    buildTD(tr, item.event_type +
                    ' - ' +
                    item.subheading +
                    '<a href="' +
                    webcalURL +
                    item.eid +
                    '" title="Click to add to Calendar">' +
                    '<i class="icon-calendar"></i>' +
                    '</a>');
                    buildTD(tr, item.description);
                    special = buildTD(tr, eventDate);
                    //Set custom sort key for date value
                    special.setAttribute('sorttable_customkey', eventDateSortable);
                    buildTD(tr, startTime);
                    buildTD(tr, endTime);
                    shindig.buildLink(tr, item);
                    eventList.appendChild(tr);
                }
            }

            if (len > 0) {
                setFilterGrid('event-table');
                TF_Filter("event-table");
            }

            actionDelete(getEvents);
            //if (len > 0) {
            //    if (!document.querySelector('.fltrow')) {
            //        //Set event filters
            //        window.setTimeout(function () {
            //            setFilterGrid('event-table');
            //            TF_Filter("event-table");
            //        }, 100);
            //    } else {
            //        TF_Filter("event-table");
            //    }
            //}

        };

        getEvents = function () {
            $('.shindig-load').removeClass('is-hidden');

            //Get existing events
            $.ajax({
                url: runtime.handlerUrl(element, 'get_events'),
                type: "GET",
                success: function(data){
                    if (data.status){
                        populateEvents(data.events);
                    }
                }
            });
        };

        //Initialize event table
        getEvents();

        $('#shindig-signup').on('submit', createEvent);

        function createEvent(event) {
             // fetch cross-browser event object and form node
            event = (event ? event : window.event);
            if (event.preventDefault) event.preventDefault();
            var formvalid = validateForm(event);
            if (formvalid) {
                $.ajax({
                    url: runtime.handlerUrl(element, 'create_event'),
                    type: "POST",
                    data: $('#shindig-signup').serialize(),
                    success: function(data) {
                        if (data.create){
                            if (document.querySelector('.fltrow')) {
                                //Set filters
                                var subheading = form.querySelector('#subheading').value,
                                    eventType = form.querySelector('[name="event_type"]:checked').value;
                                setFilterGrid('event-table');
                                TF_SetFilterValue('event-table', 0, eventType + ' - ' + subheading);
                                TF_SetFilterValue('event-table', 1, form.querySelector('#description').value);
                                TF_Filter("event-table");
                            }
                            getEvents();
                            //Set the Events tab as the active tab
                            var eventsRadioButton = document.getElementById('s3');
                            if (eventsRadioButton) {
                                eventsRadioButton.checked = true;
                            }
                        }
                    }
                });
            }
        }

        function validateForm(event) {
            var form = (event.target ? event.target : event.srcElement),
                formvalid = true; //false for testing

            //Test checkboxes for valid state
            var recurring = form.querySelector('#RecurringEvent');
            if (recurring.checked) {
                var checkboxes = form.querySelector('[name="days_of_the_week"]:checked');
                if (!checkboxes) {
                    formvalid = false;
                    var errormsg = form.querySelector('.days-of-week-error');
                    errormsg.classList.remove('hidden');
                }
            }
            return formvalid;
        }

    })();

    $('.action-cancel').click(function (event) {
        TblId.pop();
    });

    var actionDelete = function (callback) {
        $('.delete-event').click(function (event) {
            event.preventDefault();
            $.ajax({
                url: runtime.handlerUrl(element, 'remove_event'),
                type: "POST",
                data: {'eid': $(event.currentTarget).data('eid')},
                success: function(data){
                    if (data.remove){
                        callback();
                    }
                }
            });
        });
    };

}