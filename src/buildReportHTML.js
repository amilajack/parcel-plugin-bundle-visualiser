//merges tree data into page template + inlines scripts
const fs = require('fs');


module.exports = function(treeData){
  const foamTreeScript = loadTextFile('./carrotsearch.foamtree.js');
  const treeDataString = JSON.stringify(treeData);

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>FoamTree Quick Start</title>
      <meta charset="utf-8" />
    </head>
  
    <body>
      <div class="container">
        <div id="visualization"></div>
      </div>
      <style>
        body{ margin:0; }
        .container{ display:flex; height:100vh; }
        #visualization{ width:100%; }
      </style>
      <script>${foamTreeScript}</script>
      <script>

        var foamtree;

        window.addEventListener('load', function() {
          foamtree = new CarrotSearchFoamTree({
            id: 'visualization',
            dataObject: ${treeDataString},
            layoutByWeightOrder:true,
            layout: 'squarified',
            stacking: 'flattened',
            pixelRatio: window.devicePixelRatio || 1,
            maxGroupLevelsDrawn: Number.MAX_VALUE,
            maxGroupLevelsAttached:Number.MAX_VALUE,
            maxGroupLabelLevelsDrawn: Number.MAX_VALUE,
            rolloutDuration: 0,
            pullbackDuration: 0,
            fadeDuration: 0,
            zoomMouseWheelDuration: 300,
            openCloseDuration: 200,
            groupLabelVerticalPadding: 0.2,
            groupBorderRadius: 0,
            
            //TODO: follow up later
            // onGroupHover:function(e){
            //   console.log(evt.group && evt.group.label);
            //   if (e.group) {
            //     if (e.group.company) {
            //       detailsPanel.show(e.group.company);
            //     }
            //   } else {
            //     detailsPanel.hide();
            //   }
            // },

            //zoom to group rather than that weird pop out thing
            onGroupDoubleClick: function(e) {
              e.preventDefault();
              var group = e.group;
              var toZoom;
              if (group) {
                toZoom = e.secondary ? group.parent : group;
              } else {
                toZoom = this.get("dataObject");
              }
              this.zoom(toZoom);
            }

          });
        });
  
        window.addEventListener("resize", (function() {
          var timeout;
          return function() {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(foamtree.resize, 300);
          };
        })());

      </script>
    </body>
  </html>
  `;
};

function loadTextFile(filePath){
  const filename = require.resolve(filePath);
  return fs.readFileSync(filename, 'utf8');
}