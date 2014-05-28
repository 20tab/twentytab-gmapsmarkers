jQuery(function($){

    $.fn.ttGmap = function(options){

        var self = $(this);

        var config = $.extend({
            googleApiKey: "",
            mapCanvas: 'map-canvas',
            googleApiUrl: "https://maps.googleapis.com/maps/api/geocode/json",
            typeid: null,
            geocodeid: null,
            select2_options: {},
            allowed_types: []
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
                            key: config.googleApiKey
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
                }

            }
            $(this).select2($.extend(opts,config.select2_options));
            $('#'+config.typeid).select2($.extend({triggerChange: true}, config.select2_options));
        }

        $.fn.destroy = function(){
            $(this).select2('destroy');
        }

        function contains(arr,obj) {
            return (arr.indexOf(obj) != -1);
        }
        var type_choices = function(results){
            var types_list = [];
            for(el in results){
                var components = results[el]['address_components'];
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
            }
            types_list = types_list.filter( function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            }).sort();

            $('#'+config.typeid).html("")
            $(types_list).each(function() {
                $('#'+config.typeid).append($("<option>").attr('value',this).text(this));
            });
        }

        var select_change_handler = function (e) {
            var address = $(this).val();
            $.ajax({
                url: config.googleApiUrl,
                dataType: 'json',
                data: {
                    address: address,
                    key: config.googleApiKey
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
            var map,
                mapOptions,
                lat,
                lng,
                name;

            // Set map options (defaults)
            mapOptions = {
                zoom: 4,
                center: new google.maps.LatLng(results[0].geometry.location.lat, results[0].geometry.location.lng)
            };

            // Create map
            var id_canvas = config.mapCanvas.replace('#','');
            map = new google.maps.Map(document.getElementById(id_canvas), mapOptions);

            // Set marker for each result
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

        $(this).bind('gmaps-click-on-marker', function(e, data){
            return data;
        });

        // Set markers
        function set_markers(map, result) {
            var selectedMarker;

            var icon = {
                path: google.maps.SymbolPath.CIRCLE,
                fillOpacity: 0.8,
                fillColor: 'ff0000',
                strokeOpacity: 1.0,
                strokeColor: 'ff0000',
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


            var iconSelected = $.extend({}, icon, {fillColor: 'ED7A07'});
            // Set CLICK event for marker

            google.maps.event.addListener(marker, 'click', function(e) {
                var marker_coords = this.position;
                var marker_lat = marker_coords[Object.keys(marker_coords)[0]];
                var marker_lng = marker_coords[Object.keys(marker_coords)[1]];
                var marker_name = this.title;
                $('#'+config.geocodeid).val(marker_lat+","+marker_lng);

                self.trigger('gmaps-click-on-marker', [result]);

                if (selectedMarker) {
                    selectedMarker.setIcon(icon);
                }

                for(m in all_markers){
                    all_markers[m].setIcon(icon);
                }

                this.setIcon(iconSelected);
                selectedMarker = this;
                map.panTo(this.getPosition());

            });
            return marker;
        }


        // Set automatix zoom and center according to markers
        function autofit_map(map, locations) {

            //Make an array of the LatLng's of the markers you want to show
            var markersList = [];
            for ( var i = 0; i < locations.length; i++ ) {
                var location = locations[i];
                markersList.push(new google.maps.LatLng(location.geometry.location.lat, location.geometry.location.lng));
            }

            //Create a new viewpoint bound
            var bounds = new google.maps.LatLngBounds();

            //Go through each...
            for ( var i = 0; i < markersList.length; i++ ) {
                //And increase the bounds to take this point
                bounds.extend(markersList[i]);
            }

            //Fit these bounds to the map
            map.fitBounds(bounds);
            // if ( locations.length <= 1 ) {
            //     var listener = google.maps.event.addListener(map, 'idle', function() {
            //         map.setZoom(14);
            //         google.maps.event.removeListener(listener);
            //     });
            // }
        }

        return this.each(function(){
            if(!config.googleApiKey){
                console.log('You must set google api key!');
            }

            $(this).gmap_init();
            $(this).on('change', select_change_handler);

        });

    }

});