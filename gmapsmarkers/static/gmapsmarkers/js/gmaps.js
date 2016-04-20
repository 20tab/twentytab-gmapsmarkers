jQuery(function($){

    $.fn.ttGmap = function(options){

        //console.log("Inizio lo script");

        var self = $(this);

        var language_code = self.data('language-code');

        var config = $.extend({
            googleApiKey: "",
            mapCanvas: 'map-canvas',
            googleApiUrl: "https://maps.googleapis.com/maps/api/geocode/json",
            typeid: null,
            geocodeid: null,
            select2_options: {},
            allowed_types: [],
            language_code: 'en'
        }, options);

        $.fn.gmap_init = function(){
            var opts = {
                triggerChange: true,
                ajax: {
                    url: config.googleApiUrl,
                    dataType: 'json',
                    data: function (term, page) {
                        return {
                            address: term,
                            key: config.googleApiKey,
                            language: config.language_code
                        };
                    },
                    results: function (data, page) {
                        var results = []
                        for (el in data['results']){
                            var item = {
                                'id': data['results'][el]['formatted_address'],
                                'text': data['results'][el]['formatted_address']
                            }
                            results.push(item);
                        }
                        return {
                            results: results
                        };
                    }
                },
                //initSelection : function (element, callback) {
                //    var data = {id: element.val(), text: element.val()};
                //    callback(data);
                //}
            }
            //console.log("Inizializzo mappa");
            $(this).select2($.extend(opts,config.select2_options));
            $('#'+config.typeid).select2($.extend({
                triggerChange: true
            }, config.select2_options));
            if($('#'+config.geocodeid).val()){
                init_on_load($('#'+config.geocodeid).val(), $('#'+config.typeid).val());
            }
        }

        $.fn.destroy = function(){
            //console.log("Destroy");
            $(this).select2('destroy');
        }

        function contains(arr,obj) {
            return (arr.indexOf(obj) != -1);
        }

        var type_choices = function(result){
            //console.log("var function type_choices");
            var types_list = ['',];
            var components = result['address_components'];
            for(c in components){
                var types = components[c]['types'];
                if(config.allowed_types.length > 0){
                    for(t in types){
                        if(contains(config.allowed_types, types[t])){
                            types_list.push(types[t]);
                        }
                    }
                }
                else{
                    types_list.push.apply(types_list, types);
                }
            }
            types_list = types_list.filter( function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            }).sort();
            $('#'+config.typeid).html("");
            $(types_list).each(function() {
                $('#'+config.typeid).append($("<option>").attr('value',this).text(this));
            });
        }

        var select_change_handler = function (e) {
            //console.log("select change");
            var address = $(this).val();
            $.ajax({
                url: config.googleApiUrl,
                dataType: 'json',
                data: {
                    address: address,
                    key: config.googleApiKey,
                    language: config.language_code

                },
                success: function (data) {
                    if (data.status === 'OK') {
                        type_choices(data.results);
                        init_map(data.results);
                    }
                }
            })
        }


        //
        // Maps functions
        // ________________________________

        var all_markers = [];

        // initialize the map
        function init_map(results) {
            //console.log('init map');
            var map,
                mapOptions,
                lat,
                lng,
                name;

            // Set map options (defaults)
            mapOptions = {
                //maxZoom:12,
                //minZoom:2,
                center: new google.maps.LatLng(results[0].geometry.location.lat, results[0].geometry.location.lng)
            };

            // Create map
            var id_canvas = config.mapCanvas.replace('#','');
            map = new google.maps.Map(document.getElementById(id_canvas), mapOptions);

            // Set marker and bounds for each result
            for ( var i = 0; i < results.length; i++ ) {
                lat = results[i].geometry.location.lat;
                lng = results[i].geometry.location.lng;
                name = results[i].formatted_address;
                var marker = set_markers(map, results[i]);
                all_markers.push(marker);
            }

            // Automatically set center and zoom
            autofit_map(map, results);
        }

        function init_on_load(latlng, level) {
            var latlng = latlng.split(',');
            var myLatlng = new google.maps.LatLng(latlng[0], latlng[1]);

            var id_canvas = config.mapCanvas.replace('#','');
            var mapOptions = {
                center: myLatlng
            }
            var map = new google.maps.Map(document.getElementById(id_canvas), mapOptions);

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': myLatlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var location_to_use = results[0].geometry.location;
                    var viewport_to_use = results[0].geometry.viewport;
                    for(var r in results){
                        for(var t in results[r].types){
                            if(level == results[r].types[t]){
                                location_to_use = results[r].geometry.location;
					            viewport_to_use = results[r].geometry.viewport;
                                break;
                            }
                        }
                    }
                    map.setCenter(location_to_use);
                    map.fitBounds(viewport_to_use);
                    new google.maps.Marker({
                        position: location_to_use,
                        map: map
                    });


				}else{
					alert("Geocode was not successful for the following reason: " + status);
				}

			});

        }


        $(this).bind('gmaps-click-on-marker', function(e, data){
            return data;
        });

        // Set markers
        function set_markers(map, result) {
            var selectedMarker;

            var icon = {
                path: google.maps.SymbolPath.CIRCLE,
                fillOpacity: 0.8,
                fillColor: '#ff0000',
                strokeOpacity: 1.0,
                strokeColor: '#000000',
                strokeWeight: 1.0,
                scale: 10
            };

            var lat = result.geometry.location.lat;
            var lng = result.geometry.location.lng;
            var name = result.formatted_address;

            // define markers options
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                title: name,
                icon: icon
            });


            var iconSelected = $.extend({}, icon, {fillColor: '#00ff00'});
            // Set CLICK event for marker

            google.maps.event.addListener(marker, 'click', function(e) {
                var marker_coords = this.position;
                var marker_lat = marker_coords.lat();
                var marker_lng = marker_coords.lng();
                var marker_name = this.title;
                $('#'+config.geocodeid).val(marker_lat+","+marker_lng);

                self.trigger('gmaps-click-on-marker', [result]);

                if (selectedMarker) {
                    selectedMarker.setIcon(icon);
                }
                type_choices(result);

                for(m in all_markers){
                    all_markers[m].setIcon(icon);
                }

                this.setIcon(iconSelected);
                selectedMarker = this;
                map.panTo(this.getPosition());

            });
            return marker;
        }


        // Set automatic zoom and center according to viewport
        function autofit_map(map, results) {

            //Make an array of the LatLng's of the markers you want to show
            var boundsList = [];
            for ( var i = 0; i < results.length; i++ ) {
                var res = results[i];
                boundsList.push(new google.maps.LatLng(res.geometry.viewport.northeast.lat, res.geometry.viewport.northeast.lng));
                boundsList.push(new google.maps.LatLng(res.geometry.viewport.southwest.lat, res.geometry.viewport.southwest.lng));
            }

            //Create a new viewpoint bound
            var bounds = new google.maps.LatLngBounds();

            //Go through each...
            for ( var i = 0; i < boundsList.length; i++ ) {
                //And increase the bounds to take this point
                bounds.extend(boundsList[i]);
            }

            //Fit these bounds to the map
            map.fitBounds(bounds);
            if ( results.length <= 1 ) {
                 var listener = google.maps.event.addListener(map, 'idle', function() {
                     google.maps.event.removeListener(listener);
                 });
            }
        }

        return this.each(function(){
            if(!config.googleApiKey){
                console.log('You should set google api key!');
            }
            $(this).gmap_init();
            $(this).on('change', select_change_handler);

        });

    }

});
