from django import forms
from django.conf import settings
from django.utils.safestring import mark_safe


class GmapsSelectAutocomplete(forms.TextInput):
    def __init__(self, attrs=None, plugin_options={}, select2_options={}, language_code=settings.LANGUAGE_CODE):
        super(GmapsSelectAutocomplete, self).__init__(attrs)
        self.plugin_options = plugin_options
        self.select2_options = select2_options
        self.language_code = language_code
        self.Media.js = ('https://maps.googleapis.com/maps/api/js?v=3.14&key={}&sensor=false&language={}'.format(
            settings.GMAPS_API_KEY, self.language_code
        ),) + self.Media.js

    def render(self, name, value, attrs=None):
        res = super(GmapsSelectAutocomplete, self).render(name, value, attrs)
        tmp_id = attrs['id'].replace(self.plugin_options['gmaps_field_name'], '')

        if 'geocode_field' in self.plugin_options:
            self.plugin_options['geocodeid'] = '{}{}'.format(tmp_id, self.plugin_options['geocode_field'])

        if 'type_field' in self.plugin_options:
            self.plugin_options['typeid'] = '{}{}'.format(tmp_id, self.plugin_options['type_field'])

        opts = ""
        if self.plugin_options:
            for k, v in self.plugin_options.items():
                if k not in ['geocode_field', 'type_field']:
                    opts += u' data-plugin_{}="{}"'.format(k, v)
        if self.select2_options:
            for k, v in self.select2_options.items():
                opts += u' data-select2_{}="{}"'.format(k, v)

        res = mark_safe(
            u"""
            {}
            <div class="gmaps-map-init" id="gmaps-map-init-{}" data-languagecode="{}" data-googleapikey="{}"{}></div>
            """.
            format(
                res,
                attrs['id'],
                self.language_code,
                settings.GMAPS_API_KEY,
                opts
            )
        )
        return res

    class Media:
        js = (
            settings.JQUERY_LIB,
            settings.SELECT2_LIB,
            u'{}gmaps/js/gmap.js'.format(settings.STATIC_URL),
            u'{}gmaps/js/gmaps__init.js'.format(settings.STATIC_URL),
        )
        css = {u"all": (
            settings.SELECT2_CSS_LIB,
            u"{}gmaps/css/gmaps.css".format(settings.STATIC_URL),
        )}


class GeotypeSelect(forms.Select):

    def render(self, name, value, attrs=None, choices=()):
        if value:
            choices = list(choices)
            choices.append((value, value))
        return super(GeotypeSelect, self).render(name, value, attrs, choices)
