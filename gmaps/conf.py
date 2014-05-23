from appconf import AppConf
from django.conf import settings


class GmapsConf(AppConf):
    STATIC_URL = u'/static/'
    JQUERY_LIB = u"{}{}".format(
        getattr(settings, u'STATIC_URL', u'/static/'),
        u"gmaps/js/jquery-2.1.0.min.js"
    )
    SELECT2_VERSION = u'select2-3.4.8'

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

    def configure_select2_version(self, value):
        if not getattr(settings, 'SELECT2_VERSION', None):
            self._meta.holder.SELECT2_VERSION = value
            return value
        return getattr(settings, 'SELECT2_VERSION')