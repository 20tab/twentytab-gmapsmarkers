twentytab-gmaps
===============

A django widget with [Select2](http://ivaynberg.github.com/select2/) integration that uses [google geocode](https://developers.google.com/maps/documentation/geocoding/) api to search places and create maps with markers

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

SELECT2_VERSION = u'select2-3.4.8'

```
SELECT2_VERSION parameter needs to be defined if the application uses [twentytab-select2](https://github.com/20tab/twentytab-select2)
or other apps that define it.


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
    address = GmapsField(
        plugin_options={
            'geocode_field': 'geocode',
            'type_field': 'geo_type',
            'allowed_types': ['country', 'administrative_area_level_1']
        },
        select2_options={'width': '300px'}
    )
    geocode = models.CharField(max_length=250)
    geo_type = GeotypeField()

    def __unicode__(self):
        return self.address
```

![ScreenShot](https://raw.github.com/20tab/twentytab-gmaps/master/img/screenshot.png)


## Google geocode results

The widget binds a javascript event (gmaps-click-on-marker) on GmapsField that can capture it,
sending back the json result given by google geocode api.

For example:
```js
jQuery(function($){

    $("#id_address").on('gmaps-click-on-marker', function(e, data){
        console.log('gmaps-click-on-marker');
        console.log(data);
        console.log($(this))
    });

});
```