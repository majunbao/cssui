"use strict"

const fs = require('fs');
const rollup = require('rollup');

class Build{
	constructor(o){
		let src = "module";

		fs.readdir("./module", function(err, files){
			let filelist = files;
			files.forEach(function(name){
				fs.readdir('./module/'+name,function(err, files){
					console.log(files)
				})
			})
		})
	};

	

	js(src, format, dest){
		rollup.rollup({
			entry: src
		}).then(function( bundle ){
			let result = bundle.generate({
				format: 'iife'
			})

			fs.writeFileSync(dest, result.code);
		})
	}

	css(){

	}

	watch(src){
		console.log(2)
		fs.watchFile(src,{persistent:true, interval:500},function(){
			a.js('module/tip/tip.js','iife', 'a.js')
		})
	}
}



var a = new Build
// a.js('module/tip/tip.js','iife', 'a.js')
a.watch('module/tip/tip.js')
