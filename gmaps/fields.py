from django.db import models
from django import forms
from gmaps.widgets import GmapsSelectAutocomplete, GeotypeSelect
from django.conf import settings


class GmapsField(models.CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = kwargs.pop("max_length", 250)
        self.plugin_options = kwargs.pop("plugin_options", {})
        self.select2_options = kwargs.pop("select2_options", {})
        self.language_code = kwargs.pop("language_code", settings.LANGUAGE_CODE)
        super(GmapsField, self).__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        self.plugin_options['gmaps_field_name'] = self.name
        defaults = {
            'form_class': GmapsFormField,
            'plugin_options': self.plugin_options,
            'select2_options': self.select2_options,
            'language_code': self.language_code
        }
        defaults.update(kwargs)
        return super(GmapsField, self).formfield(**defaults)


class GmapsFormField(forms.CharField):
    def __init__(self, plugin_options={}, select2_options={}, language_code=settings.LANGUAGE_CODE, *args, **kwargs):
        kwargs.update({'widget': GmapsSelectAutocomplete(
            plugin_options=plugin_options, select2_options=select2_options, language_code=language_code
        )})
        super(GmapsFormField, self).__init__(*args, **kwargs)


class GeotypeField(models.CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = kwargs.pop("max_length", 250)
        super(GeotypeField, self).__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        defaults = {
            'form_class': GeotypeFormField
        }
        defaults.update(kwargs)
        return super(GeotypeField, self).formfield(**defaults)


class GeotypeFormField(forms.CharField):
    def __init__(self, *args, **kwargs):
        kwargs.update({'widget': GeotypeSelect})
        super(GeotypeFormField, self).__init__(*args, **kwargs)

# Fix field for South
try:
    from south.modelsinspector import add_introspection_rules
    add_introspection_rules([], ["^gmaps\.fields\.GmapsField"])
    add_introspection_rules([], ["^gmaps\.fields\.GeotypeField"])
except:
    pass
