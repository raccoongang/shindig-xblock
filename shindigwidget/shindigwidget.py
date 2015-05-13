"""TO-DO: Write a description of what this XBlock is."""
import pkg_resources
import time
import requests

from requests.auth import HTTPBasicAuth
from webob.response import Response
from xblock.core import XBlock
from xblock.fragment import Fragment


class ShindigXBlock(XBlock):

    SHINDIG_HOST_SERVER = "http://shindig-server.raccoongang.com/"
    PATH_EVENTS = "api/events/"
    PATH_TOKEN = "o/token/"

    CUSTOMER_SERVICE_PHONE = "(800)888-8888"
    CUSTOMER_SERVICE_EMAIL = "help@shindigevents.com"
    LINKS_TO_EVENTS_CMS = "http://www.shindig.com/event/admin/"
    LINKS_TO_EVENTS_LMS = "http://www.shindig.com/event/"

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

    def get_course_id(self):
        try:
            course_id = self.course_id
        except AttributeError:
            course_id = None
        return course_id

    @property
    def institution(self):
        return self.get_course_id() and str(self.get_course_id()).split('/')[0] or 'institution'

    @property
    def course(self):
        return self.get_course_id() and str(self.get_course_id()).split('/')[1] or 'course'

    def add_javascript_and_css(self, frag):
        frag.add_javascript(self.resource_string("static/js/src/modernizr.js"))
        frag.add_javascript(self.resource_string("static/js/src/jsonp.js"))
        frag.add_javascript(self.resource_string("static/js/src/sorttable.js"))
        frag.add_javascript(self.resource_string("static/js/src/tablefilter.js"))
        frag.add_css(self.resource_string("static/css/shindigwidget.css"))

    def shindig_defaults(self):
        shindig_settings = self.get_shindig_settings()
        return {"customerServicePhone": self.CUSTOMER_SERVICE_PHONE,
                "customerServiceEmail": self.CUSTOMER_SERVICE_EMAIL,
                "institution": self.institution,
                "course": self.course,
                "host_events": self.SHINDIG_HOST_SERVER,
                "path_events": self.PATH_EVENTS,
                "links_to_events_cms": self.LINKS_TO_EVENTS_CMS,
                "links_to_events_lms": self.LINKS_TO_EVENTS_LMS,
                'is_valid_settings': self.is_valid_settings(shindig_settings)}

    def get_token(self, request):
        shindig_settings = self.get_shindig_settings()
        if self.is_valid_settings(shindig_settings):
            token = request.body_file.session.get("token")
            expires_at = request.body_file.session.get("expires_at", 0)
            if token and expires_at > time.time():
                return token

            client_auth = HTTPBasicAuth(shindig_settings.get('CLIENT_ID'), shindig_settings.get('CLIENT_SECRET'))
            post_data = {"grant_type": "password",
                         'username': shindig_settings.get('USERNAME'),
                         'password': shindig_settings.get('PASSWORD')}
            response = requests.post(self.SHINDIG_HOST_SERVER + self.PATH_TOKEN,
                                     auth=client_auth,
                                     data=post_data)

            if response.status_code == 200:
                token_json = response.json()
                request.body_file.session["token"] = token_json["access_token"]
                request.body_file.session["expires_at"] = time.time() + int(token_json["expires_in"])
                return token_json["access_token"]
        return None

    def get_shindig_settings(self):
        shindig_settings = {}
        course_id = self.get_course_id()
        if course_id:
            lti_passports = self.runtime.modulestore.get_course(self.course_id).lti_passports
            for lti_passport in lti_passports:
                try:
                    name, key, secret = [i.strip() for i in lti_passport.split(':')]
                except ValueError:
                    return shindig_settings
                if name == 'shindig_user':
                    shindig_settings.update({'USERNAME': key,
                                            'PASSWORD': secret})
                elif name == 'shindig_auth':
                    shindig_settings.update({'CLIENT_ID': key,
                                             'CLIENT_SECRET': secret})
        return shindig_settings

    def is_valid_settings(self, settings):
        return 'USERNAME' in settings and \
               'PASSWORD' in settings and \
               'CLIENT_ID' in settings and \
               'CLIENT_SECRET' in settings
