from appconf import AppConf
from django.conf import settings
from django.utils.translation import get_language


class GmapsConf(AppConf):
    STATIC_URL = u'/static/'
    JQUERY_LIB = u"{}{}".format(
        getattr(settings, u'STATIC_URL', u'/static/'),
        u"gmaps/js/jquery-2.1.0.min.js"
    )
    SELECT2_LIB = u"{}{}".format(
        getattr(settings, u'STATIC_URL', u'/static/'),
        u"gmaps/select2-3.4.8/select2.min.js"
    )
    SELECT2_CSS_LIB = u"{}{}".format(
        getattr(settings, u'STATIC_URL', u'/static/'),
        u"gmaps/select2-3.4.8/select2.css"
    )
    LANGUAGE_CODE = get_language()

    def configure_static_url(self, value):
        if not getattr(settings, 'STATIC_URL', None):
            self._meta.holder.STATIC_URL = value
            return value
        return getattr(settings, 'STATIC_URL')

    def configure_jquery_lib(self, value):
        if not getattr(settings, 'JQUERY_LIB', None):
            self._meta.holder.JQUERY_LIB = value
            return value
        return getattr(settings, 'JQUERY_LIB')

    def configure_select2_lib(self, value):
        if not getattr(settings, 'SELECT2_LIB', None):
            self._meta.holder.SELECT2_LIB = value
            return value
        return getattr(settings, 'SELECT2_LIB')

    def configure_select2_css_lib(self, value):
        if not getattr(settings, 'SELECT2_CSS_LIB', None):
            self._meta.holder.SELECT2_CSS_LIB = value
            return value
        return getattr(settings, 'SELECT2_CSS_LIB')

    def configure_language_code(self, value):
        if not getattr(settings, 'LANGUAGE_CODE', None):
            self._meta.holder.LANGUAGE_CODE = value
            return value
        return getattr(settings, 'LANGUAGE_CODE')