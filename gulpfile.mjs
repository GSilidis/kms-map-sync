import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import gulp from 'gulp';
import change from 'gulp-change';
import run from 'gulp-run'
import copy from 'gulp-copy';
import { deleteAsync } from 'del';
import fs from 'fs';
import fsPromises from 'fs/promises';

const rawPackageJson = fs.readFileSync('./package.json');
const packageJson = JSON.parse(rawPackageJson);

const TEMP_DOCS_CATALOG = 'temp-docs/'

// Cleans all directories, used for building
function clean() {
    return deleteAsync(['src/', TEMP_DOCS_CATALOG, 'docs/'])
}

// Removes temporary directories created during other tasks
function cleanTemporaries() {
    return deleteAsync(['src/', TEMP_DOCS_CATALOG]);
}

// JSDoc needs at least one file with source code to run. So - creating temporary empty file before launching jsdoc
function createTempSource (done) {
    fsPromises.mkdir('src', {}).then(() => {
        fsPromises.writeFile('src/index.js', 'class Blank { }')
            .then(done)
            .catch(error => {
                console.error('Cannot create temporary files in src catalog, will exit', error);
                process.exit(1);
            });
    }).catch(error => {
        if (error) {
            console.error('Cannot create src catalog, will exit', error);
            process.exit(1);
        }
    })
}

// Compiles source bundles
function compileBundles() {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                return reject(err)
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')))
            }
            resolve()
        })
    });
}

// Injects contents of corresponding .ts file into tutorial html template
function injectSourceToTemplates(content, done) {
    let newContent = content;
    const scriptName = this.fname.replaceAll('.html', '.ts')
    const f = fs.readFileSync('tutorials/cases' + scriptName);
    newContent += `<pre class="language-ts"><code>${f}</code></pre>

    <script src="./js${scriptName}.example.bundle.js"></script>`;

    done(null, newContent);
}

// Copy static files to other generated files
function copyPublicFiles() {
    return gulp.src('public/*').pipe(copy(`docs/${packageJson.name}/${packageJson.version}/`, {}));
}

// JSDoc
function buildDocs () {
    return gulp.src('tutorials/cases/*.html')
        .pipe(change(injectSourceToTemplates))
        .pipe(gulp.dest(TEMP_DOCS_CATALOG))
        .pipe(run('yarn doc', { }))
}

gulp.task('build', gulp.series(clean, createTempSource, gulp.parallel(compileBundles, buildDocs), cleanTemporaries, copyPublicFiles));
