twentytab-gmaps
===============

A django widget with select2 integration that uses google geocode api to search place and create map with markers

## Installation

Use the following command: <b><i>pip install twentytab-gmaps</i></b>

## Configuration

```py
INSTALLED_APPS = {
    ...,
    'gmaps',
    ...
}

GMAPS_API_KEY = "xxxxxxxxxxxxxxxxxxxx"

```

- Static files

Run collectstatic command or map static directory. If you use uWSGI you can map static files:

```ini
static-map = /static/gmaps/=%(path_to_site_packages)/gmaps/static/gmaps
```

## Usage

```py
from django.db import models
from gmaps.fields import GmapsField, GeotypeField


class MyClass(models.Model):
    address = GmapsField(plugin_options={'geocode_field': 'geocode', 'type_field': 'geo_type'},
                         select2_options={'width': '300px'})
    geocode = models.CharField(max_length=250)
    geo_type = GeotypeField()

    def __unicode__(self):
        return self.address
```

![ScreenShot](https://raw.github.com/20tab/twentytab-gmaps/blob/master/img/screenshot.png)
