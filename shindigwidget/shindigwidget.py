import re
import pkg_resources
import time
import requests

from requests.auth import HTTPBasicAuth
from webob.response import Response
from xblock.core import XBlock
from xblock.fragment import Fragment


def _quote_slashes(match):
    """
    Helper function for `quote_slashes`
    """
    matched = match.group(0)
    # We have to escape ';', because that is our
    # escape sequence identifier (otherwise, the escaping)
    # couldn't distinguish between us adding ';_' to the string
    # and ';_' appearing naturally in the string
    if matched == ';':
        return ';;'
    elif matched == '/':
        return ';_'
    else:
        return matched


def quote_slashes(text):
    """
    Quote '/' characters so that they aren't visible to
    django's url quoting, unquoting, or url regex matching.

    Escapes '/'' to the sequence ';_', and ';' to the sequence
    ';;'. By making the escape sequence fixed length, and escaping
    identifier character ';', we are able to reverse the escaping.
    """
    return re.sub(ur'[;/]', _quote_slashes, text)


class ShindigXBlock(XBlock):

    SHINDIG_HOST_SERVER = "http://54.83.13.6/"
    PATH_EVENTS = "api/events/"
    PATH_TOKEN = "o/token/"
    PATH_HASH_KEY_USER = "api/lti_users/"
    PATH_WIDGET = 'embed_events_widget/'

    CUSTOMER_SERVICE_PHONE = "(800)888-8888"
    HOST_SHINDIG = "http://www.shindig.com/"
    LINKS_TO_EVENTS_CMS = "event/admin/"
    LINKS_TO_EVENTS_LMS = "event/"

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
        frag = Fragment(html.format(self=self,
                                    embed_code=self.embed_code(shindig_defaults)))
        if self.runtime.__class__.__name__ == 'WorkbenchRuntime':
            self.add_javascript_and_css(frag)
        frag.add_css(self.resource_string("static/css/jquery.ui.timepicker.css"))
        frag.add_javascript(self.resource_string("static/js/src/jquery.ui.timepicker.js"))
        frag.add_javascript(self.resource_string("static/js/src/shindigwidget_instructor.js"))
        frag.initialize_js('ShindigStudioXBlock', json_args=shindig_defaults)
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
        frag.initialize_js('ShindigStudentXBlock', json_args=shindig_defaults)
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
        course = self.get_course_obj()
        req = requests.get(url,
                           params={'institution': course.org if course else None,
                                   'course': course.number if course else None})

        if req.status_code == 200:
            return Response(json_body={'events': req.json(), 'status': True})
        return Response(json_body={'status': False})

    @XBlock.handler
    def create_or_edit_event(self, request, suffix=''):
        access_token = self.get_token(request)
        shindig_settings = self.get_shindig_settings()
        if access_token:
            headers = {"Authorization": "Bearer " + access_token}
            data = request.params.mixed()
            course = self.get_course_obj()
            data.update({
                'course_run': course.url_name if course else 'course_run',
                'email': shindig_settings['EMAIL'],
                'password': shindig_settings['PASSWORD']
            })
            eid = data.get('eid', False)
            url = self.SHINDIG_HOST_SERVER + self.PATH_EVENTS
            if eid:
                url += eid + '/'
                req = requests.put(url, headers=headers, data=data)
            else:
                req = requests.post(url, headers=headers, data=data)

            if req.status_code == 201 or req.status_code == 206:
                return Response(json_body={'save': True,
                                           'event': req.json()})
            else:
                return Response(json_body={'save': False, 'error': req.json().get('error', '')})
        return Response(json_body={'create': False, 'error': ''})

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

    @XBlock.handler
    def get_user_email_and_username(self, request, suffix=''):
        user = request.body_file.user
        return Response(json_body={'email': user.email, 'username': user.username})

    @XBlock.handler
    def get_hash_key_user(self, request, suffix=''):
        access_token = self.get_token(request)
        if access_token:
            url = self.SHINDIG_HOST_SERVER + self.PATH_HASH_KEY_USER
            headers = {"Authorization": "Bearer " + access_token}
            if request.body_file.user.courseaccessrole_set.filter(course_id=self.course_id,
                                                                  role__in=['staff', 'instructor']).exists():
                edx_role = 'staff'
            else:
                edx_role = 'student'
            data = {'email': request.body_file.user.email,
                    'username': request.body_file.user.username,
                    'edx_role': edx_role}
            req = requests.post(url, headers=headers, data=data)
            if req.status_code == 201:
                req_data = req.json()
                if edx_role == 'staff':
                    shindig_settings = self.get_shindig_settings()
                    req_data.update({'user_email_shindig': shindig_settings['EMAIL'],
                                     'user_password_shindig': shindig_settings['PASSWORD']})
                return Response(json_body=req_data)
            else:
                del request.body_file.session["token"]
                del request.body_file.session["expires_at"]
        return Response(json_body={'hash_key': False})

    def get_course_obj(self):
        try:
            course = self.runtime.modulestore.get_course(self.course_id)
        except AttributeError:
            course = None
        return course

    def add_javascript_and_css(self, frag):
        frag.add_javascript(self.resource_string("static/js/src/modernizr.js"))
        frag.add_javascript(self.resource_string("static/js/src/jsonp.js"))
        frag.add_javascript(self.resource_string("static/js/src/addthisevent.min.js"))
        frag.add_javascript(self.resource_string("static/js/src/jstz.min.js"))
        frag.add_css(self.resource_string("static/css/shindigwidget.css"))
        frag.add_css(self.resource_string("static/css/addthisevent.theme7.css"))

    def shindig_defaults(self):
        shindig_settings = self.get_shindig_settings()
        course = self.get_course_obj()
        return {"service_phone": self.CUSTOMER_SERVICE_PHONE,
                "institution": course.org if course else 'institution',
                "course": course.number if course else 'course',
                "course_run": course.url_name if course else 'course_run',
                "course_display_name": course.display_name if course else 'course_display_name',
                "links_to_events_cms": self.HOST_SHINDIG + self.LINKS_TO_EVENTS_CMS,
                "links_to_events_lms": self.HOST_SHINDIG + self.LINKS_TO_EVENTS_LMS,
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
                         'username': shindig_settings.get('SERVER_USERNAME'),
                         'password': shindig_settings.get('SERVER_PASSWORD')}
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
        course = self.get_course_obj()
        if course:
            lti_passports = course.lti_passports
            for lti_passport in lti_passports:
                try:
                    name, key, secret = [i.strip() for i in lti_passport.split(':')]
                except ValueError:
                    return shindig_settings
                if name == 'shindig_server_user':
                    shindig_settings.update({'SERVER_USERNAME': key,
                                             'SERVER_PASSWORD': secret})
                elif name == 'shindig_auth':
                    shindig_settings.update({'CLIENT_ID': key,
                                             'CLIENT_SECRET': secret})
                elif name == 'shindig_user':
                    shindig_settings.update({'EMAIL': key,
                                             'PASSWORD': secret})
        return shindig_settings

    def is_valid_settings(self, settings):
        return 'EMAIL' in settings and \
               'PASSWORD' in settings and \
               'CLIENT_ID' in settings and \
               'CLIENT_SECRET' in settings and \
               'SERVER_USERNAME' in settings and \
               'SERVER_PASSWORD' in settings

    def get_handler_url(self, handler_name):
        return '/courses/{course_id}/xblock/{usage_id}/handler/{handler_name}'\
            .format(course_id=unicode(self.course_id),
                    usage_id=quote_slashes(unicode(self.scope_ids.usage_id).encode('utf-8')),
                    handler_name=handler_name)

    def embed_code(self, shindig_defaults):
        code = '''
<iframe id='iframe-shindig' src='' width='100%' height='720' marginwidth='0' marginheight='0' frameborder='0' scrolling='yes'>You need an iFrame capable browser to view this.</iframe>
<script>
    var urlUserDetail = '{}';
    $.ajax({{
        url: urlUserDetail,
        type: 'GET',
        success: function (data) {{
            var url = '{}{}' + data.hash_key + '/?course={}&institution={}&course_run={}&course_display_name={}';
            if (data.user_email_shindig) {{
                url += '&email=' + data.user_email_shindig + '&password=' + data.user_password_shindig;
            }}
            var cacheParamValue = (new Date()).getTime();
            url += "&cache=" + cacheParamValue;
            $('#iframe-shindig').attr('src', url);
        }}
    }});
</script>
        '''.format(self.get_handler_url('get_hash_key_user'),
                   self.SHINDIG_HOST_SERVER,
                   self.PATH_WIDGET,
                   shindig_defaults['course'],
                   shindig_defaults['institution'],
                   shindig_defaults['course_run'],
                   shindig_defaults['course_display_name'])

        return code
