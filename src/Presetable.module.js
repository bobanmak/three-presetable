/** Interface to implement presets for any Object 3D in THree.js
 *  Created by Boban Jordanoski 16.02.2021
 * 
 *  TO.DO:
 *  - add TWEENS
 * const tweaks = {
 *       daylight: {
 *           ignore: [ "intensity" ],
 *           tween: {
 *               position: {
 *                  time: 0.5
 *              }
 *          }
 *      }
 *  };
 */

const Presetable = {

    interface: {

        /**
         * Initialise Interfaces
         * @param {Object} opts Object with default presets
         * @param {Object} settings Configuration
         */
        initPresetable: function( opts, settings ){
            this.presets  = opts || {};
            this.settings = {
                debug: true,
                recursion: true
            };

            Object.assign( this.settings, settings );
        },

        /**
         * Add Presets
         * @param {Object} presets Object with list of presets
         */
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
    
        /**
         * Get Preset Definition by name
         * @param {String} name Preset name
         */
        getPresetByName: function( name ){
    
            if ( typeof this.presets[ name ] === "undefined" || !this.presets[ name ] ){
                console.warn( name + " Preset is not defined!" );
                return null;
            } 
            else {
                return this.presets[ name ];
            }
        },

        /**
         * Create Object with presets from actuall Object
         * @param {Array} properties List with property Names, which we write out
         */
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
    
        /**
         * Load preset 
         * @param {String} name Preset name
         */
        loadPreset: function( name ){
    
            let preset = this.getPresetByName( name );
    
            if ( !preset ) return;
    
            Object.keys( preset ).forEach( ( propertyName ) => {
                
                this.setPropertiesValues( this[ propertyName ], preset[ propertyName ] );
                
            });
    
            if ( this.settings.debug ) console.log( "Preset " + name + " loaded: ", preset );
        },

        /**
         * set Presetvalue to the Object property value
         * @param {Object} property 
         * @param {} presetValues
         */
        setPropertiesValues: function( property, presetValues ){

            // Object has not defined attribute as preset name
            if ( typeof property === "undefined" || typeof presetValues === "undefined" ) return;
                
            // if Vector3 
            if ( property.isVector3 || property.isEuler ){
                property.set( ...presetValues );
            }

            // if function
            else if ( property === "function" ){
                property( presetValues ); 
            }

            // if preset object is nested 1 level
            else if ( this.settings.recursion && typeof property === "object" && Object.keys( property ).length > 0 ){

                // recursion
                Object.keys( presetValues ).forEach( ( nestedPropertyName ) => {

                    this.setPropertiesValues( this[ nestedPropertyName ], presetValues[ nestedPropertyName ] );

                });

            } 

            // set simple value
            else {
                property = presetValues;
            }
        }

    },

    /**
     * Implement and initialise interface
     * @param {Object} instance Object3D insance
     * @param {Object} presets Default presets
     */
    implement: function( instance, presets ){
       
        Object.assign( instance, Presetable.interface );
        instance.initPresetable( presets );

    }

};

export { Presetable };
export default Presetable;