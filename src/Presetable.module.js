// 6.2.21 Boban J.

const Presetable = {

    interface: {

        initPresetable: function( opts, settings ){
            this.presets  = opts || {};
            this.settings = {
                debug: true,
                recursion: true
            };

            Object.assign( this.settings, settings );
        },
    
        getInfo: function(){
            console.log( "interface - presets: ", this.presets );
        },
    
        addPresets: function( presets ){
    
            let keys = Object.keys( presets );
            let presetValues;
            
            keys.forEach( ( presetName ) => {
    
                presetValues = presets[ presetName ];
    
                // update existing
                if ( this.presets[ presetName ] ){
                    Object.assign( this.presets[ presetName ], presetValues );
                }
                // create new
                else{
                    this.presets[ presetName ] = presetValues;
                } 
    
                if ( this.settings.debug ) console.log( "Preset " + presetName +  " created: ", this.presets[ presetName ] );
            });

        },
    
        getPreset: function( name ){
    
            if ( typeof this.presets[ name ] === "undefined" || !this.presets[ name ] ){
                console.warn( name + " Preset is not defined!" );
                return null;
            } 
            else {
                return this.presets[ name ];
            }
        },

        filterPreset: function( properties ){
            
            let preset = {};
            let property = {};
            
            properties.forEach( ( key )=>{
                
                if ( !this[ key ] || typeof this[ key ] === "undefined" ) return;

                if ( this[ key ].isEuler || this[ key ].isVector3 ){
                    property[ key ] = this[ key ].toArray();
                }
                else if ( typeof this[ key ] === "function" ){
                    property[ key ] = {};
                }
                else {
                    property[ key ] = this[ key ];
                }

                Object.assign( preset, property );
            });

            if ( this.settings.debug ) console.log("Filtered Preset: ", preset );
            return preset;
        },
    
        loadPreset: function( name ){
    
            let preset = this.getPreset( name );
    
            if ( !preset ) return;
    
            Object.keys( preset ).forEach( ( attrName ) => {
                
                this.setAttributesValues( this[ attrName ], preset[ attrName ] );
                
            });
    
            if ( this.settings.debug ) console.log( "Preset " + name + " loaded: ", preset );
        },

        setAttributesValues: function( attribute, presetValues ){

            // Object has not defined attribute as preset name
            if ( typeof attribute === "undefined" || typeof presetValues === "undefined" ) return;
                
            // if Vector3 
            if ( attribute.isVector3 || attribute.isEuler ){
                attribute.set( ...presetValues );
            }

            // if function
            else if ( attribute === "function" ){
                attribute( presetValues ); 
            }

            // if preset object is nested 1 level
            else if ( this.settings.recursion && typeof attribute === "object" && Object.keys( attribute ).length > 0 ){

                // recursion
                Object.keys( presetValues ).forEach( ( nestedAttrName ) => {

                    this.setAttributesValues( this[ nestedAttrName ], presetValues[ nestedAttrName ] );

                });

            } 

            // set simple value
            else {
                attribute = presetValues;
            }
        }

    },

    implement: function( instance, presets ){
        Object.assign( instance, Presetable.interface );
        instance.initPresetable( presets );
    }

};

export { Presetable };
export default Presetable;