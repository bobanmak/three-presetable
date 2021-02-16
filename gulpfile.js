/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const gulp = require('gulp');
const build_inteface = require("./build/build_interface_amd");

gulp.task('init', ( done ) => {
    
    done();
    
});

gulp.task("build", ( done ) => {
    "use strict";
    build_inteface( ()=>{
        
            done();
       
    });
});

gulp.task("buildAMD", build_inteface );

gulp.task('default', gulp.series('init', 'buildAMD') );