# Purpose
This is a sample MicroStrategy Web plugin that converts the D3 Collapasble Tree visual into a widget that can be consumed in MicroStrategy web

# Deployment
The below instructions explain how to deploy a visualization that has already been built using the MicroStrategy Visualization Builder. If you are interested in how to create the visualization yourself, code changes made to the original D3 visualization are noted in the `Developer Notes` section

1. Download the `CollapsableTree` folder
2. Place this folder in the `plugins` directory of the MicroStrategy Web/Library application `(../[MicroStrategyWeb/MicroStrategyLibrary]/plugins)`
3. Restart the webserver for the changes to take place

# Developer Notes

The original visualization was obtained off the D3js.org website.
https://bl.ocks.org/mbostock/1093025

Very few modifications were needed to convert this to a visualization that can be used within MicroStrategy. The alterations are highlighted below.

```javascript
//BEGIN MODIFICATION*********//
//Make change to render the content within the assigned div on screen
//var svg = d3.select("body").append("svg")
var svg = d3.select(this.domNode).append("svg")
//END MODIFICATION*********//
//
    .attr("width", width + margin.left + margin.right)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//BEGIN Modification*********//
//Make change to read data from Microstrategy rather than a static JSON data file as the original sample used
/*
d3.json("flare.json", function(error, flare) {
 if (error) throw error;
  flare.x0 = 0;
  flare.y0 = 0;
  update(root = flare);
});
*/
var json = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);
update(root = json);
//END Modification*********//
```

# Documentation 

## Vis Builder
https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/VisSDK/Content/topics/HTML5/Using_Vis_Builder.htm

## Visualization SDK
https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/VisSDK/Content/topics/Introduction_to_the_Visualization_SDK.htm

## Adding functionailty
https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/VisSDK/Content/topics/HTML5/Integrating_with_MSTR_data.htm

https://lw.microstrategy.com/msdz/MSDL/GARelease_Current/docs/projects/VisSDK/Content/topics/HTML5/Adding_Mstr_features.htm
