const gulp = require('gulp');
const shell = require('gulp-shell');
const fs = require('fs');
const path = require('path');
const del = require('del');
const merge = require('merge-stream');
const webp = require('webpack');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const nodemon = require('gulp-nodemon');

var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

const clientSrc = './src_client';
const serverSrc = './src_server';
const publicSrc = 'public';
const dest = './build';
const serverResources = 'server_resources';

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development';
}

function getFolders(dir) {
	return fs.readdirSync(dir)
		.filter(file => {
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}

function handleError(err) {
	console.log(err.toString());
	this.emit('end');
}

gulp.task('clean-build', () => {
	del(dest);
});

gulp.task('build-client', () => {
	const folders = getFolders(clientSrc);
	return merge(
		gulp.src(path.resolve(publicSrc, '*/**/*.*'))
			.pipe(gulp.dest(path.resolve(dest, publicSrc))),
		folders.map(element => {
			return gulp.src(path.join(clientSrc, element, `${element}.html`))
				.pipe(gulp.dest(path.resolve(dest, serverResources, 'html')));
		}),
		folders.map(element => {
			return gulp.src(path.join(clientSrc, element, '*/**/*.css'))
				.pipe(gulp.dest(path.resolve(dest, publicSrc, 'css')));
		}),
		folders.map(element => {
			return gulp.src(path.join(clientSrc, element, `${element}.jsx`))
				.on('error', handleError)
				.pipe(webpack({
					plugins: [
						new webp.DefinePlugin({
							'process.env': {
								'NODE_ENV': `"${process.env.NODE_ENV}"`
							}
						})
					],
					module: {
						loaders: [
							{
								test: /\.css$/,
								loaders: [ 'style-loader', 'css-loader' ]
							},
							{
								test: /.json$/,
								loader: 'json-loader'
							},
							{
								test: /.jsx?$/,
								loader: 'babel-loader',
								exclude: /node_modules/,
								query: {
									presets: ['es2015', 'react', 'stage-2']
								}
							}
						]
					},
					output: {
						filename: `${element}.js`
					}
				}))
				.on('error', handleError)
				.pipe(gulp.dest(path.resolve(dest, publicSrc, 'js')))
				.on('error', handleError);
		})
	);
});

gulp.task('build-server', () => {
	//gulp.src(path.resolve(serverSrc, '**/**/**.js'))
		/*.on('error', handleError)
		.pipe(babel({
			presets: ['es2017', 'stage-0'],
			plugins: ['transform-es2015-modules-commonjs']
		}))
		.on('error', handleError)
		.pipe(gulp.dest(dest))
		.on('error', handleError);*/

	 return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(dest));
});

gulp.task('build', ['build-server', 'build-client'], () => {
	return gulp.src([path.resolve(dest, 'public', '*/**/*.js'), `!${path.resolve(dest, 'public', '*/**/*.min.js')}`])
		.on('error', handleError)
		.pipe(uglify())
		.on('error', handleError)
		.pipe(gulp.dest(path.resolve(dest, 'public')))
		.on('error', handleError);
});

gulp.task('server', () => {
	nodemon({ script: path.resolve(dest, 'server.js'), watch: path.resolve(dest, 'server.js'), delay: 2500})
		.on('restart', function () {
			console.log('restarted!');
		})
		.on('crash', function() {
			console.error('Application has crashed!\n');
			this.emit('restart', 10);  // restart the server in 10 seconds
		});
});

gulp.task('eslint', () => {
	return gulp.src('*.js', {read: false})
		.pipe(shell([
			'eslint --ext .js,.jsx src_client/** src_server/** --fix'
		]));
});

gulp.task('tslint', () => {
	return gulp.src('*.js', {read: false})
		.pipe(shell([
			'tslint src_client/** src_server/** --fix'
		]));
});


gulp.task('lint', ['eslint', 'tslint'], () => null);

gulp.task('default', () => {
	gulp.watch(`./${publicSrc}/**/*.*`, ['build-client'])
		.on('error', handleError)
		.on('change', event => {
			console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		});

	gulp.watch([path.join(clientSrc, '/**/*.jsx'), path.join(clientSrc, '/**/*.js')], ['build-client'])
		.on('error', handleError)
		.on('change', event => {
			console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		});

	gulp.watch([path.join(serverSrc, '/**/*.*')], ['build-server'])
		.on('error', handleError)
		.on('change', event => {
			console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		});
});
