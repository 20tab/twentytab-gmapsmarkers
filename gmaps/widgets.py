from django import forms
from django.conf import settings
from django.utils.safestring import mark_safe


class GmapsSelectAutocomplete(forms.TextInput):
    def __init__(self, attrs=None, plugin_options={}, select2_options={}):
        super(GmapsSelectAutocomplete, self).__init__(attrs)
        self.plugin_options = plugin_options
        self.select2_options = select2_options

    def render(self, name, value, attrs=None):
        res = super(GmapsSelectAutocomplete, self).render(name, value, attrs)
        tmp_id = attrs['id'].replace(self.plugin_options['gmaps_field_name'], '')

        if 'geocode_field' in self.plugin_options:
            self.plugin_options['geocodeid'] = '{}{}'.format(tmp_id, self.plugin_options['geocode_field'])
            #del self.plugin_options['geocode_field']

        if 'type_field' in self.plugin_options:
            self.plugin_options['typeid'] = '{}{}'.format(tmp_id, self.plugin_options['type_field'])
            #del self.plugin_options['type_field']

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
            <div class="gmaps-map-init" id="gmaps-map-init-{}" data-googleapikey="{}"{}></div>
            """.
            format(
                res,
                attrs['id'],
                settings.GMAPS_API_KEY,
                opts
            )
        )
        # <script type="text/javascript">
        #     jQuery(function($){{
        #         $("#{}").ttGmap($.extend({{
        #             mapCanvas:'#gmaps-map-init-{}',
        #             googleApiKey:'{}',
        #             select2_options: {}
        #         }}, {}));
        #     }});
        # </script>
        return res

    class Media:
        js = (
            settings.JQUERY_LIB,
            u'{}gmaps/{}/select2.min.js'.format(settings.STATIC_URL, settings.SELECT2_VERSION),
            u'{}gmaps/js/gmap.js'.format(settings.STATIC_URL),
            u'{}gmaps/js/gmaps__init.js'.format(settings.STATIC_URL),
        )
        css = {u"all": (
            u"{}gmaps/{}/select2.css".format(settings.STATIC_URL, settings.SELECT2_VERSION),
            u"{}gmaps/css/gmaps.css".format(settings.STATIC_URL),
        )}

