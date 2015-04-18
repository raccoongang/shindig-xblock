"""TO-DO: Write a description of what this XBlock is."""
from django.http import HttpResponseBadRequest
import pkg_resources
import requests

from django.core.exceptions import PermissionDenied
from webob.response import Response

from xblock.core import XBlock
from xblock.fields import Scope, Integer
from xblock.fragment import Fragment


class ShindigXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """
    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )

    def __init__(self, *args, **kwargs):
        super(ShindigXBlock, self).__init__(*args, **kwargs)
        institution, course, run = str(self.course_id).split('/')
        self.shindig_defaults = {
            "customerServicePhone": "(800)888-8888",
            "customerServiceEmail": "help@shindigevents.com",
            "institution": institution,
            "course": course,
            "host_events": "http://192.168.33.10:3000/",
            "path_events": "api/events/",
            "links_to_events_cms": "http://www.shindig.com/event/admin/",
            "links_to_events_lms": "http://www.shindig.com/event/",
            }

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def studio_view(self, context):
        """
        Create a fragment used to display the edit view in the Studio.
        """
        html = self.resource_string("static/html/shindig_instructor.html")
        frag = Fragment(html.format(self=self))
        frag.add_javascript(self.resource_string("static/js/src/shindigwidget_instructor.js"))
        frag.initialize_js('ShindigXBlock', json_args=self.shindig_defaults)
        return frag

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the ShindigXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/shindig_student.html")
        frag = Fragment(html.format(self=self))
        frag.add_javascript(self.resource_string("static/js/src/modernizr.js"))
        frag.add_javascript(self.resource_string("static/js/src/jsonp.js"))
        frag.add_javascript(self.resource_string("static/js/src/sorttable.js"))
        frag.add_javascript(self.resource_string("static/js/src/tablefilter.js"))
        frag.add_css(self.resource_string("static/css/shindigwidget.css"))
        frag.add_javascript(self.resource_string("static/js/src/shindigwidget_student.js"))
        frag.initialize_js('ShindigXBlock', json_args=self.shindig_defaults)
        return frag

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def increment_count(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        # Just to show data coming in...
        assert data['hello'] == 'world'

        self.count += 1
        return {"count": self.count}

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("ShindigXBlock",
             """
                <shindigwidget/>
             """),           
        ]

    @XBlock.handler
    def remove_events(self, request, suffix=''):
        eid = request.params['eid']
        url = self.shindig_defaults['host_events'] + self.shindig_defaults['path_events'] + eid
        req = requests.request('DELETE', url)
        if req.status_code == 200:
            return Response(json_body={'remove': True})
        else:
            return Response(json_body={'remove': False})
