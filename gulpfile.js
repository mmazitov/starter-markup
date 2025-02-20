const gulp = require("gulp"); //
const pug = require("gulp-pug"); // Import Pug
// const htmlBeautify = require("gulp-html-beautify"); // HTML beautifier
const sass = require("gulp-sass")(require("sass")); // Import Sass compiler
const sourcemaps = require("gulp-sourcemaps");
const eslint = require("gulp-eslint"); // ESLint for JavaScript linting
const concat = require("gulp-concat"); // Concatenate files
const cleanCSS = require("gulp-clean-css"); // Minify CSS
const svgSprite = require("gulp-svg-sprite");
const prettyData = require("gulp-pretty-data");
const terser = require("gulp-terser"); // Minify JavaScript
const browserSync = require("browser-sync").create(); // Live reloading server
const path = require("path");
const gulpPostcss = require("gulp-postcss"); // Import PostCSS plugin

// Dynamic import for image optimization plugins
async function loadImageMinPlugins() {
	const imagemin = (await import("gulp-imagemin")).default;
	const imageminGifsicle = (await import("imagemin-gifsicle")).default;
	const imageminMozjpeg = (await import("imagemin-mozjpeg")).default;
	const imageminOptipng = (await import("imagemin-optipng")).default;

	return {
		imagemin,
		plugins: [
			imageminGifsicle({ interlaced: true }),
			imageminMozjpeg({ quality: 75, progressive: true }),
			imageminOptipng({ optimizationLevel: 5 }),
		],
	};
}

// Paths to files
const paths = {
	pug: {
		src: "./src/pug/**/*.pug",
		dist: "dist",
		pages: "./src/pug/pages/**/*.pug",
	},
	// html: {
	// 	src: "./src/html/**/*.html",
	// 	dist: "./dist",
	// 	pages: "./src/html/pages/**/*.html",
	// },
	styles: {
		src: "./src/scss/**/*.scss",
		dist: "./dist/css",
	},
	scripts: {
		src: "./src/js/**/*.js",
		dist: "./dist/js",
	},
	fonts: {
		src: "./src/fonts/**/*",
		dist: "./dist/fonts",
	},
	images: {
		src: "./src/images/**/*",
		dist: "./dist/images",
	},
	pic: {
		src: "./src/pic/**/*",
		dist: "./dist/pic",
	},
	svg: {
		src: "./src/pic/svg/**/*.svg",
		dist: "./dist/pic",
	},
};

// Task to compile Pug into HTML
function pugTask() {
	return gulp
		.src(paths.pug.pages)
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(paths.pug.dist))
		.pipe(browserSync.stream());
}

// Task to compile HTML with file includes
// function htmlTask() {
// 	return gulp
// 		.src(paths.html.pages)
// 		.pipe(
// 			fileInclude({
// 				prefix: "@@",
// 				basepath: "@file",
// 			})
// 		)
// 		.pipe(
// 			htmlBeautify({
// 				indent_size: 2,
// 				indent_with_tabs: true,
// 				end_with_newline: true,
// 			})
// 		)
// 		.pipe(gulp.dest(paths.html.dist))
// 		.pipe(browserSync.stream());
// }

// Task to compile SCSS into CSS with Bootstrap (separate Bootstrap and custom styles)
function sassTask() {
	return gulp
		.src(paths.styles.src) // SCSS files
		.pipe(sourcemaps.init()) // Initialize sourcemaps
		.pipe(sass().on("error", sass.logError)) // Compile SCSS
		.pipe(cleanCSS()) // Minify CSS
		.pipe(sourcemaps.write()) // Write sourcemaps
		.pipe(gulp.dest(paths.styles.dist)) // Save to dist folder
		.pipe(browserSync.stream());
}

// Task for linting and compiling JavaScript with Bootstrap (separate Bootstrap and custom JS)
function jsTask() {
	return gulp
		.src([paths.scripts.src]) // Include Bootstrap and custom JS
		.pipe(sourcemaps.init()) // Initialize sourcemaps
		.pipe(eslint()) // Lint JavaScript
		.pipe(eslint.format()) // Format ESLint output
		.pipe(terser()) // Minify JavaScript
		.pipe(sourcemaps.write()) // Write sourcemaps
		.pipe(gulp.dest(paths.scripts.dist)) // Save in the dist folder
		.pipe(browserSync.stream());
}

function fontsTask() {
	return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dist));
}

// Unified image optimization task for both images and pic directories
async function optimizeImagesTask() {
	const { imagemin, plugins } = await loadImageMinPlugins();

	const imageStreams = [
		gulp.src(paths.images.src).pipe(imagemin(plugins)).pipe(gulp.dest(paths.images.dist)),
		gulp.src(paths.pic.src).pipe(imagemin(plugins)).pipe(gulp.dest(paths.pic.dist)),
	];

	return Promise.all(
		imageStreams.map((stream) => new Promise((resolve) => stream.on("end", resolve)))
	);
}

// Config for SVG sprite
const svgConfig = {
	mode: {
		symbol: {
			sprite: "../sprite.svg",
			example: false,
		},
	},
	shape: {
		transform: [
			{
				svgo: {
					plugins: [
						{ name: "removeTitle", active: true },
						{ name: "removeDesc", active: true },
						{ name: "removeUselessStrokeAndFill", active: true },
						{ name: "removeAttrs", params: { attrs: "(fill|stroke|style|class)" } },
					],
				},
			},
		],
	},
	svg: {
		xmlDeclaration: false,
		doctypeDeclaration: false,
		pretty: true,
		indent: "\t\t",
	},
};

function svgSpriteTask() {
	return gulp
		.src(paths.svg.src)
		.pipe(svgSprite(svgConfig))
		.pipe(prettyData({ type: "prettify", extensions: { svg: "xml" } }))
		.pipe(gulp.dest(paths.svg.dist))
		.pipe(browserSync.stream());
}

// Task to start the server and watch for changes
function watchTask() {
	browserSync.init({
		server: {
			baseDir: "./dist",
		},
	});

	gulp.watch(paths.styles.src, sassTask);
	gulp.watch(paths.pug.src, pugTask);
	// gulp.watch(paths.html.src, htmlTask);
	gulp.watch(paths.scripts.src, jsTask);
	gulp.watch([paths.images.src, paths.pic.src], optimizeImagesTask);
	gulp.watch(paths.svg.src, svgSpriteTask);
	gulp.watch(paths.fonts.src, fontsTask);
}

// Define the build task
function buildTask(cb) {
	// Run all the other tasks for the build process
	gulp.series(
		gulp.parallel(pugTask, sassTask, jsTask, fontsTask, optimizeImagesTask, svgSpriteTask)
	)(cb); // Signal async completion using the callback
	// gulp.series(gulp.parallel(htmlTask, sassTask, jsTask, fontsTask, optimizeImagesTask, svgSpriteTask))(cb); // Signal async completion using the callback
}

exports.build = buildTask;

// Define the default tasks
exports.default = gulp.series(
	gulp.parallel(pugTask, sassTask, jsTask, fontsTask, optimizeImagesTask, svgSpriteTask),
	// gulp.parallel(htmlTask, sassTask, jsTask, fontsTask, optimizeImagesTask, svgSpriteTask),
	watchTask
);
