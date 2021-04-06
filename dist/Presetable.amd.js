define(['exports'], function (exports) { 'use strict';

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
                    else {
                        this.presets[ presetName ] = presetValues;
                    } 
        
                    if ( this.settings.debug ) { console.log( "Preset " + presetName +  " created: ", this.presets[ presetName ] ); }
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
                    
                    if ( !this[ key ] || typeof this[ key ] === "undefined" ) { return; }

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

                if ( this.settings.debug ) { console.log("Filtered Preset: ", preset ); }
                return preset;
            },
        
            /**
             * Load preset 
             * @param {String} name Preset name
             */
            loadPreset: function( name ){
        
                let preset = this.getPresetByName( name );
        
                if ( !preset ) { return; }
        
                Object.keys( preset ).forEach( ( propertyName ) => {
                    
                    this.setPropertiesValues( this, preset, propertyName );
                    
                });
        
                if ( this.settings.debug ) { console.log( "Preset " + name + " loaded: ", preset ); }
            },
            
            /**
            * ClearPresets
             */
            clearPresets: function(){

                this.presets = {};
            },

            /**
             * set Presetvalue to the Object property value
             * @param {Object} property 
             * @param {} presetValues
             */
            setPropertiesValues: function( instance, preset, propertyName ){

                let property     = instance[ propertyName ];
                let presetValues = preset[ propertyName ];
                
                // Object has not defined attribute as preset name
                if ( typeof property === "undefined" || typeof presetValues === "undefined" ) { return; }      

                // if preset function
                if ( typeof presetValues === "function" ){
                    
                    let value = presetValues( property );
                   
                    if ( value.isVector3 || value.isEuler ){
                        instance[ propertyName ].copy( value );
                    } 
                    else {
                        instance[ propertyName ] = presetValues( property );
                    }
                    // old instance[ propertyName ] = presetValues( property );
                }

                // if Vector3 
                else if ( property.isVector3 || property.isEuler ){
                    property.set.apply( property, presetValues );
                }

                // if property function
                else if ( typeof property === "function" ){
                    if ( Array.isArray( presetValues ) ){
                        property.apply( void 0, presetValues ); 
                    } else {
                        property( presetValues );
                    }
                }

                // if preset object is nested 1 level
                else if ( this.settings.recursion && typeof property === "object" && Object.keys( property ).length > 0 ){

                    // recursion
                    Object.keys( presetValues ).forEach( ( nestedPropertyName ) => {

                        this.setPropertiesValues( instance[ propertyName ], presetValues, nestedPropertyName );

                    });

                } 

                // set simple value
                else {
                    instance[ propertyName ] = presetValues;
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

    exports.Presetable = Presetable;
    exports.default = Presetable;

    Object.defineProperty(exports, '__esModule', { value: true });

});
//# sourceMappingURL=Presetable.amd.js.map
