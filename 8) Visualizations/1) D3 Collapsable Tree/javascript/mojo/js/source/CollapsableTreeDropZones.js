(function () { 
    if (!mstrmojo.plugins.CollapsableTree) {
        mstrmojo.plugins.CollapsableTree = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.CustomVisDropZones",
        "mstrmojo.array"
    );

    mstrmojo.plugins.CollapsableTree.CollapsableTreeDropZones = mstrmojo.declare(
        mstrmojo.vi.models.CustomVisDropZones,
        null,
        {
            scriptClass: "mstrmojo.plugins.CollapsableTree.CollapsableTreeDropZones",
            cssClass: "collapsabletreedropzones",
            getCustomDropZones: function getCustomDropZones(){
 },
            shouldAllowObjectsInDropZone: function shouldAllowObjectsInDropZone(zone, dragObjects, idx, edge, context) {
 
 








},
            getActionsForObjectsDropped: function getActionsForObjectsDropped(zone, droppedObjects, idx, replaceObject, extras) {
 
 








},
            getActionsForObjectsRemoved: function getActionsForObjectsRemoved(zone, objects) { 
  
 








},
            getDropZoneContextMenuItems: function getDropZoneContextMenuItems(cfg, zone, object, el) {
 
 








}
})}());
//@ sourceURL=CollapsableTreeDropZones.js