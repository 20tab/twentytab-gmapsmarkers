jQuery(function(){


    function gmaps_select2_init(){

        $('.gmaps-map-init').not('.processed').each(function(){
            var id = $(this).attr('id').replace('gmaps-map-init-', '');
            if(id.indexOf("__prefix__") == -1){
                var opts = $(this).data();
                var plugin_options = {};
                var select2_options = {}
                for(el in opts){
                    if(el.indexOf('plugin_') != -1){
                        plugin_options[el.replace('plugin_', '')] = opts[el];
                        if(opts[el].indexOf('__prefix__-') != -1){
                            var id_splitted = opts[el].split('__prefix__');
                            var index = id.replace(id_splitted[0], '').replace('-'+opts['plugin_gmaps_field_name'], '');
                            var replacer = id_splitted[0]+index+id_splitted[1];
                            plugin_options[el.replace('plugin_', '')] = replacer;
                        }
                    }
                    if(el.indexOf('select2_') != -1){
                        select2_options[el.replace('select2_', '')] = opts[el];
                    }
                }
                $('#'+id).ttGmap($.extend({
                     mapCanvas:'#gmaps-map-init-'+id,
                     googleApiKey: opts['googleapikey'],
                     select2_options: select2_options
                 }, plugin_options));
                $(this).addClass('processed');
            }
        });
    }

    gmaps_select2_init();

    $('.add-row a').on('click', function(){
        gmaps_select2_init();
    });

});