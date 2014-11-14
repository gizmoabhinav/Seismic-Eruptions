exports.config =
  # See http://brunch.io/#documentation for docs.
  files:
    javascripts:
      joinTo:
        '2D/app-2d.js': /^app\\scripts\\2D/
        '3D/app-3d.js': /^app\\scripts\\3D/
        '3D/vendor-3d.js': /^vendor\\scripts\\3D/
    stylesheets:
      joinTo:
        '2D/app-2d.css': /^app\\styles\\2D/
        '3D/app-3d.css': /^app\\styles\\3D/
        '2D/vendor-2d.css': /^vendor/

  sourceMaps: false

  modules:
    wrapper: false
    definition: false