<div align="center" id="top"> 
  <img src="./.github/app.gif" alt="Markup Starter" />

  &#xa0;
</div>

<h1 align="center">Markup Starter</h1>

## 🎯 About 
**Markup Starter** is a project template that uses Gulp for automating development tasks such as compiling Pug and Sass, linting JavaScript, and optimizing images.



## ✨ Gulp tasks
- **pugTask:** Compiles Pug files into HTML.
- **sassTask:** Compiles SCSS files into CSS and adds prefixes for cross-browser compatibility.
- **jsTask:** Lints and compiles JavaScript files using Babel.
- **fontsTask:** Copies fonts to the distribution folder.
- **imagesTask:** Optimizes images and copies them to the distribution folder.
- **picTask:** Copies pictures from the src/pic folder to the distribution folder.
- **watchTask:** Starts the server and watches for file changes.

## 🚀 Dependencies
The project uses the following dependencies:
- **@babel/core:** Babel compiler
- **@babel/preset-env:** Babel preset for modern JavaScript features
- **browser-sync:** Local server with automatic reloading
- **gulp:** Task automation tool
- **gulp-babel:** Used for compiling JavaScript with Babel
- **gulp-clean-css:** CSS optimization and minification
- **gulp-concat:** File concatenation
- **gulp-eslint**: JavaScript file linting
- **gulp-imagemin:** Image optimization
- **gulp-pug:** Compiles Pug files into HTML
- **gulp-sass:** Compiles Sass into CSS
- **gulp-terser:** JavaScript minification
- **sass:** Compiled Sass

## 🏁 Starting
```
# Clone this project
$ git clone https://github.com/mmazitov/markup-starter

# Access
$ cd markup-starter

# Install the dependencies using Yarn or npm:
$ $ yarn install or $ npm install

# Run the project
$ $ yarn start or $ npm start

# The server will initialize in the <http://localhost:3000>
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue if you encounter any bugs or have feature requests.
