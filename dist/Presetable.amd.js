define(['exports'], function (exports) { 'use strict';

    // 6.2.21 Boban J.

    const Presetable = {

        interface: {

            initPresetable: function( opts ){
                // console.log("Opts: ", opts );
                this.presets = opts || {};
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
                    else {
                        this.presets[ presetName ] = presetValues;
                    } 
        
                    console.log( "Preset " + presetName +  " created: ", this.presets[ presetName ] );
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
        
            loadPreset: function( name ){
        
                let preset = this.getPreset( name );
        
                if ( !preset ) { return; }
        
                Object.keys( preset ).forEach( ( attrName ) => {
                    var ref;

        
                    // Object has defined attribute
                    if ( typeof this[ attrName ] === "undefined" ) { return; }
        
                    // if Vector3 
                    if ( this[ attrName ].isVector3 || this[ attrName ].isEuler ){
                        (ref = this[ attrName ]).set.apply( ref, preset[ attrName ] );
                    }
        
                    // if preset object is nested 1 level
                    else if ( typeof preset[ attrName ] === "object" && Object.keys( preset[ attrName ] ).length > 0 ){
            
                        Object.keys( preset[ attrName ] ).forEach( ( nestedAttrName ) => {
                            var ref;

        
                            if ( typeof this[ attrName ][ nestedAttrName ] === "undefined" ) { return; }
        
                            if ( this[ attrName ][ nestedAttrName ].isVector3 || this[ attrName ].isEuler ){
                                (ref = this[ attrName ][ nestedAttrName ]).set.apply( ref, preset[ attrName ][ nestedAttrName ] );
                            }
                            else {
                                this[ attrName ][ nestedAttrName ] = preset[ attrName ][ nestedAttrName ] ;
                            }
                            
                        });
        
                    } 
        
                    else {
                        this[ attrName ] = preset[ attrName ];
                    }
                    
                });
        
                console.log( "Preset " + name + " loaded: ", preset );
            }

        },

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
