twentytab-gmapsmarkers
===============

A django widget with [Select2](http://ivaynberg.github.com/select2/) integration that uses [google geocode](https://developers.google.com/maps/documentation/geocoding/) api to search places and create maps with markers

## Installation

Use the following command: <b><i>pip install twentytab-gmapsmarkers</i></b>

## Configuration

```py
INSTALLED_APPS = {
    ...,
    'gmapsmarkers',
    ...
}

GMAPS_API_KEY = "xxxxxxxxxxxxxxxxxxxx"
GMAPS_LANGUAGE_CODE = "en"  # default value

```

twentytab-gmaps will set his own jquery plugin. If you already use yours you have to define the following parameters in your settings:

```py

STATIC_URL = u'/static/'
JQUERY_LIB = 'path_to_jquery'
SELECT2_LIB = 'path_to_select2_js'
SELECT2_CSS_LIB = 'path_to_select2_css'

```


- Static files

Run collectstatic command or map static directory.

## Usage

```py
from django.db import models
from gmapsmarkers.fields import GmapsField, GeotypeField


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

![ScreenShot](https://raw.github.com/20tab/twentytab-gmapsmarkers/master/img/screenshot.png)


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
