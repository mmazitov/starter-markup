const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass")); // Import Sass compiler
const sourcemaps = require("gulp-sourcemaps");
const eslint = require("gulp-eslint"); // ESLint for JavaScript linting
const concat = require("gulp-concat"); // Concatenate files
const cleanCSS = require("gulp-clean-css"); // Minify CSS
const terser = require("gulp-terser"); // Minify JavaScript
const browserSync = require("browser-sync").create(); // Live reloading server
const path = require("path");
const gulpPostcss = require("gulp-postcss"); // Import PostCSS plugin

// Paths to files
const paths = {
	pug: {
		src: "./src/pug/**/*.pug",
		dist: "dist",
		pages: "./src/pug/pages/**/*.pug",
	},
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
};

// Task to compile Pug into HTML
function pugTask() {
	return gulp
		.src(paths.pug.pages)
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(paths.pug.dist))
		.pipe(browserSync.stream());
}

// Task to compile SCSS into CSS with Bootstrap (separate Bootstrap and custom styles)
function sassTask() {
	return gulp
		.src(paths.styles.src) // SCSS files
		.pipe(sourcemaps.init()) // Initialize sourcemaps
		.pipe(sass().on("error", sass.logError)) // Compile SCSS
		.pipe(gulpPostcss([require("tailwindcss"), require("autoprefixer")])) // Process with TailwindCSS and Autoprefixer
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

// Remaining tasks as previously defined...
function fontsTask() {
	return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dist));
}

async function imagesTask() {
	const imagemin = (await import("gulp-imagemin")).default;
	const imageminGifsicle = (await import("imagemin-gifsicle")).default;
	const imageminMozjpeg = (await import("imagemin-mozjpeg")).default;
	const imageminOptipng = (await import("imagemin-optipng")).default;
	const imageminSvgo = (await import("imagemin-svgo")).default;

	return gulp
		.src(paths.images.src)
		.pipe(
			imagemin([
				imageminGifsicle({ interlaced: true }),
				imageminMozjpeg({ quality: 75, progressive: true }),
				imageminOptipng({ optimizationLevel: 5 }),
				imageminSvgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(gulp.dest(paths.images.dist));
}

async function picTask() {
	const imagemin = (await import("gulp-imagemin")).default;
	const imageminGifsicle = (await import("imagemin-gifsicle")).default;
	const imageminMozjpeg = (await import("imagemin-mozjpeg")).default;
	const imageminOptipng = (await import("imagemin-optipng")).default;
	const imageminSvgo = (await import("imagemin-svgo")).default;

	return gulp
		.src(paths.pic.src)
		.pipe(
			imagemin([
				imageminGifsicle({ interlaced: true }),
				imageminMozjpeg({ quality: 75, progressive: true }),
				imageminOptipng({ optimizationLevel: 5 }),
				imageminSvgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(gulp.dest(paths.pic.dist));
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
	gulp.watch(paths.scripts.src, jsTask);
	gulp.watch(paths.images.src, imagesTask);
	gulp.watch(paths.pic.src, picTask);
	gulp.watch(paths.fonts.src, fontsTask);
}

// Define the build task
function buildTask(cb) {
	// Run all the other tasks for the build process
	gulp.series(gulp.parallel(pugTask, sassTask, jsTask, fontsTask, imagesTask, picTask))(cb); // Signal async completion using the callback
}

exports.build = buildTask;

// Define the default tasks
exports.default = gulp.series(
	gulp.parallel(pugTask, sassTask, jsTask, fontsTask, imagesTask, picTask),
	watchTask
);
