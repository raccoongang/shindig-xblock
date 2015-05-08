"""TO-DO: Write a description of what this XBlock is."""
import pkg_resources
import time
import requests

from requests.auth import HTTPBasicAuth
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

    SHINDIG_HOST_SERVER = "http://shindig-server.raccoongang.com/"
    #SHINDIG_HOST_SERVER = "http://23.21.220.214:3000/"
    PATH_EVENTS = "api/events/"
    PATH_TOKEN = "o/token/"
    AUTH_USERNAME = "root"
    AUTH_PASSWORD = "keifOkbiv9"
    CLIENT_ID = "LV0tm4l5S47uRQn3yYlVDcWGkahO5dOgA99Y2Ifn"
    CLIENT_SECRET = "engLelV6EjtJf8Pai1CEvvxSgDlfSkaaLp2aQ1UbazRQ59HP40dVksyXMOr8ycHRSDZHFVcbtbFwf3tTtyYdHv54BLnQGEejEqJ5WNNgVZgXrovSvTdQjlJDvrAIZMW7"

    CUSTOMER_SERVICE_PHONE = "(800)888-8888"
    CUSTOMER_SERVICE_EMAIL = "help@shindigevents.com"
    LINKS_TO_EVENTS_CMS = "http://www.shindig.com/event/admin/"
    LINKS_TO_EVENTS_LMS = "http://www.shindig.com/event/"

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def studio_view(self, context):
        """
        Create a fragment used to display the edit view in the Studio.
        """
        shindig_defaults = self.shindig_defaults()
        html = self.resource_string("static/html/shindig_instructor.html")
        frag = Fragment(html.format(self=self))
        if self.runtime.__class__.__name__ == 'WorkbenchRuntime':
            self.add_javascript_and_css(frag)
        frag.add_javascript(self.resource_string("static/js/src/shindigwidget_instructor.js"))
        frag.initialize_js('ShindigXBlock', json_args=shindig_defaults)
        return frag

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the ShindigXBlock, shown to students
        when viewing courses.
        """
        shindig_defaults = self.shindig_defaults()
        html = self.resource_string("static/html/shindig_student.html")
        frag = Fragment(html.format(self=self))
        self.add_javascript_and_css(frag)
        frag.add_javascript(self.resource_string("static/js/src/shindigwidget_student.js"))
        frag.initialize_js('ShindigXBlock', json_args=shindig_defaults)
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
    def get_events(self, request, suffix=''):
        url = self.SHINDIG_HOST_SERVER + self.PATH_EVENTS
        req = requests.get(url, params={'institution': self.institution, 'course': self.course})

        if req.status_code == 200:
            return Response(json_body={'events': req.json(), 'status': True})
        return Response(json_body={'status': False})

    @XBlock.handler
    def create_event(self, request, suffix=''):
        access_token = self.get_token(request)
        if access_token:
            url = self.SHINDIG_HOST_SERVER + self.PATH_EVENTS
            headers = {"Authorization": "Bearer " + access_token}
            req = requests.post(url, headers=headers, data=dict(request.params))
            if req.status_code == 201:
                return Response(json_body={'create': True})
        return Response(json_body={'create': False})

    @XBlock.handler
    def remove_event(self, request, suffix=''):
        access_token = self.get_token(request)
        if access_token:
            url = self.SHINDIG_HOST_SERVER + self.PATH_EVENTS + request.params['eid']
            headers = {"Authorization": "Bearer " + access_token}
            req = requests.delete(url, headers=headers)
            if req.status_code == 204:
                return Response(json_body={'remove': True})
        return Response(json_body={'remove': False})

    def _course_id(self):
        try:
            course_id = self.course_id
        except AttributeError:
            course_id = None
        return course_id

    @property
    def institution(self):
        return self._course_id() and str(self._course_id()).split('/')[0] or 'institution'

    @property
    def course(self):
        return self._course_id() and str(self._course_id()).split('/')[1] or 'course'

    def add_javascript_and_css(self, frag):
        frag.add_javascript(self.resource_string("static/js/src/modernizr.js"))
        frag.add_javascript(self.resource_string("static/js/src/jsonp.js"))
        frag.add_javascript(self.resource_string("static/js/src/sorttable.js"))
        frag.add_javascript(self.resource_string("static/js/src/tablefilter.js"))
        frag.add_css(self.resource_string("static/css/shindigwidget.css"))

    def shindig_defaults(self):
        return {"customerServicePhone": self.CUSTOMER_SERVICE_PHONE,
                "customerServiceEmail": self.CUSTOMER_SERVICE_EMAIL,
                "institution": self.institution,
                "course": self.course,
                "host_events": self.SHINDIG_HOST_SERVER,
                "path_events": self.PATH_EVENTS,
                "links_to_events_cms": self.LINKS_TO_EVENTS_CMS,
                "links_to_events_lms": self.LINKS_TO_EVENTS_LMS}

    def get_token(self, request):
        token = request.body_file.session.get("token")
        expires_at = request.body_file.session.get("expires_at", 0)
        if token and expires_at > time.time():
            return token

        client_auth = HTTPBasicAuth(self.CLIENT_ID, self.CLIENT_SECRET)
        post_data = {"grant_type": "password",
                     'username': self.AUTH_USERNAME,
                     'password': self.AUTH_PASSWORD}
        response = requests.post(self.SHINDIG_HOST_SERVER + self.PATH_TOKEN,
                                 auth=client_auth,
                                 data=post_data)

        if response.status_code == 200:
            token_json = response.json()
            request.body_file.session["token"] = token_json["access_token"]
            request.body_file.session["expires_at"] = time.time() + int(token_json["expires_in"])
            return token_json["access_token"]
        return None
