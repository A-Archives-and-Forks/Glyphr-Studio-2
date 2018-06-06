
/**
    Panel > Actions
    Usually this is attached to the bottom of the
    Glyph Attributes panel screen mode,
    the Attributes panel gets its own column.
**/


    function makePanel_Actions(){
        var pop = _UI.popOut;
        var ss = _UI.multiSelect.shapes.getMembers();

        var content = '<div class="panel_section">';
        if(pop) content = '<div class="navarea_header">';
        content += '<h1 class="paneltitle">actions</h1>';

        if(!existingWorkItem()){ return content + '</div></div>'; }


        // UNIVERSAL ACTIONS
        var allactions = '';
        allactions += '<button title="Paste\nAdds the previously-copied shape or shapes into this glyph" '+(_UI.clipboardShape? '': 'disabled')+' onclick="pasteShape(); history_put(\'Paste Shape\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_Paste(!_UI.clipboardShape) + '</button>';
        allactions += '<button title="Undo\nStep backwards in time one action" '+(history_length()? '': 'disabled')+' onclick="history_pull();">' + makeActionButton_Undo(!history_length()) + '</button>';

        if(!_UI.popOut) allactions += '<button title="Add Shape\nCreates a new default shape and adds it to this glyph" onclick="addShape(); history_put(\'Add Shape\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_AddShape(false) + '</button>';
        if(!_UI.popOut) allactions += '<button title="Add Component Instance\nChoose another Component or Glyph, and use it as a Component Instance in this glyph" onclick="showDialog_AddComponent();">'+ makeActionButton_AddShape(true) + '</button>';
        if(!_UI.popOut) allactions += '<button title="Get Shapes\nChoose another Glyph, and copy all the shapes from that glyph to this one" onclick="showDialog_GetShapes();">' + makeActionButton_PasteShapesFromAnotherGlyph() + '</button>';

        if(_UI.currentPage === 'components') allactions += '<button title="Link to Glyph\nChoose a glyph, and add this Component to that glyph as a Component Instance" onclick="showDialog_LinkComponentToGlyph();">' + makeActionButton_LinkToGlyph() + '</button>';


        // SHAPE
        var shapeactions = ss.length > 1? '<h3>shapes</h3>' : '<h3>shape</h3>';
        shapeactions += '<button title="Copy\nAdds a copy of the currently selected shape or shapes to the clipboard" onclick="copyShape();">' + makeActionButton_Copy() + '</button>';
        if(!_UI.popOut) shapeactions += '<button title="Delete\nRemoves the currently selected shape or shapes from this glyph" onclick="_UI.multiSelect.shapes.deleteShapes(); history_put(\'Delete Shape\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_DeleteShape() + '</button>';
        shapeactions += '<button title="Reverse Overlap Mode\nToggles the clockwise or counterclockwise winding of the shape\'s path" onclick="_UI.multiSelect.shapes.reverseWinding(); history_put(\'Reverse Path Direction\'); redraw({calledBy:\'shapeDetails - Winding\'});">' + makeActionButton_ReverseWinding() + '</button>';
        if(ss.length === 1 && ss[0].objtype === 'componentinstance'){
            shapeactions += '<button title="Turn Component Instance into a Shape\nTakes the selected Component Instance, and un-links it from its Root Component,\nthen adds copies of all the Root Component\'s shapes as regular Shapes to this glyph" onclick="turnComponentIntoShapes(); history_put(\'Unlinked Component\'); redraw({calledBy:\'turnComponentIntoShapes\'});">' + makeActionButton_SwitchShapeComponent(true) + '</button>';
        } else {
            shapeactions += '<button title="Turn Shape into a Component Instance\nTakes the selected shape and creates a Component out of it,\nthen links that Component to this glyph as a Component Instance" onclick="turnSelectedShapeIntoAComponent(); history_put(\'Turned Shape into a Component\'); redraw({calledBy:\'turnSelectedShapeIntoAComponent\'});">' + makeActionButton_SwitchShapeComponent(false) + '</button>';
        }
        shapeactions += '<button title="Flip Horizontal\nReflects the currently selected shape or shapes horizontally" onclick="_UI.multiSelect.shapes.flipEW(); history_put(\'Flip Shape Horizontal\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_FlipHorizontal() + '</button>';
        shapeactions += '<button title="Flip Vertical\nReflects the currently selected shape or shapes vertically" onclick="_UI.multiSelect.shapes.flipNS(); history_put(\'Flip Shape Vertical\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_FlipVertical() + '</button>';


        // ALIGN
        var alignactions = '<br>';
        alignactions += '<button title="Align Left\nMoves all the selected shapes so they are left aligned with the leftmost shape" onclick="_UI.multiSelect.shapes.align(\'left\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_Align('left') + '</button>';
        alignactions += '<button title="Align Center\nMoves all the selected shapes so they are center aligned between the leftmost and rightmost shape" onclick="_UI.multiSelect.shapes.align(\'center\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_Align('center') + '</button>';
        alignactions += '<button title="Align Right\nMoves all the selected shapes so they are right aligned with the rightmost shape" onclick="_UI.multiSelect.shapes.align(\'right\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_Align('right') + '</button>';
        alignactions += '<button title="Align Top\nMoves all the selected shapes so they are top aligned with the topmost shape" onclick="_UI.multiSelect.shapes.align(\'top\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_Align('top') + '</button>';
        alignactions += '<button title="Align Middle\nMoves all the selected shapes so they are middle aligned between the topmost and bottommost shape" onclick="_UI.multiSelect.shapes.align(\'middle\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_Align('middle') + '</button>';
        alignactions += '<button title="Align Bottom\nMoves all the selected shapes so they are bottom aligned with the bottommost shape" onclick="_UI.multiSelect.shapes.align(\'bottom\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_Align('bottom') + '</button>';


        // LAYERS
        var layeractions = '';
        layeractions += '<button title="Move Shape Up\nMoves the shape up in the shape layer order" onclick="moveShapeUp(); history_put(\'Move Shape Layer Up\');">' + makeActionButton_MoveLayerUp() + '</button>';
        layeractions += '<button title="Move Shape Down\nMoves the shape down in the shape layer order" onclick="moveShapeDown(); history_put(\'Move Shape Layer Down\');">' + makeActionButton_MoveLayerDown() + '</button>';


        // COMBINE
        var boolactions = '';
        boolactions += '<button title="Combine\nSelect two shapes, and combine their paths into a single shape" onclick="combineSelectedShapes();">' + makeActionButton_Combine() + '</button>';
        // boolactions += '<button title="Subtract Using Upper\nSelect two shapes, and the upper shape will be used to cut out an area from the lower shape" onclick="">' + makeActionButton_SubtractUsingTop() + '</button>';
        // boolactions += '<button title="Subtract Using Lower\nSelect two shapes, and the lower shape will be used to cut out an area from the upper shape" onclick="">' + makeActionButton_SubtractUsingBottom() + '</button>';


        // PATH POINT
        var pointactions = '<h3>path point</h3>';
        pointactions += '<button title="Insert Path Point\nAdds a new Path Point half way between the currently-selected point, and the next one" onclick="_UI.multiSelect.points.insertPathPoint(); history_put(\'Insert Path Point\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_InsertPathPoint() + '</button>';
        pointactions += '<button title="Delete Path Point\nRemoves the currently selected point or points from the path" class="'+(ss.length? '': 'buttondis')+'" onclick="_UI.multiSelect.points.deletePathPoints(); history_put(\'Delete Path Point\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_DeletePathPoint() + '</button>';
        pointactions += '<button title="Reset Handles\nMoves the handles of the currently selected point or points to default locations" onclick="_UI.multiSelect.points.resetHandles(); history_put(\'Reset Path Point\'); redraw({calledBy:\'actions panel\'});">' + makeActionButton_ResetPathPoint() + '</button>';
        pointactions += '<h3>point align</h3>';
        pointactions += '<button title="Align Vertically\nAlign points vertically" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { console.log(o[0]),o[0].alignX(o[1]) }); history_put(\'Align Points Vertically\');">' + makeActionButton_AlignPointsX() + '</button>';
        pointactions += '<button title="Align Horizontally\nAlign points horizontally" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignY(o[1]) }); history_put(\'Align Points Horizontally\');">' + makeActionButton_AlignPointsY() + '</button>';
        pointactions += '<h3>point handle align</h3>';
        pointactions += '<button title="Align Handles Vertically\nAlign handles vertically" onclick="k_combinations(_UI.multiSelect.points.members, 1).forEach(function(o, i) { o[0].alignHV(); }); history_put(\'Align Handles Vertically\');">' + makeActionButton_AlignHandlesV() + '</button>';
        pointactions += '<button title="Align Handles Horizontally\nAlign handles horizontally" onclick="k_combinations(_UI.multiSelect.points.members, 1).forEach(function(o, i) { o[0].alignHH(); }); history_put(\'Align Handles Horizontally\');">' + makeActionButton_AlignHandlesH() + '</button>';
        pointactions += '<br>';
        pointactions += '<button title="Align Handles Double-Cross Horizontally\nAlign both opposite handles horizontally" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignHYCross(o[1]) }); history_put(\'Align Handles Double-Cross Horizontally\');">' + makeActionButton_AlignHandlesYCross() + '</button>';
        pointactions += '<button title="Align 1-Handles Cross-Horizontally\nAlign first opposite handles horizontally" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH1YCross(o[1]) }); history_put(\'Align 1-Handles Cross-Horizontally\');">' + makeActionButton_AlignHandlesH1YCross() + '</button>';
        pointactions += '<button title="Align 2-Handles Cross-Horizontally\nAlign second opposite handles horizontally" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH2YCross(o[1]) }); history_put(\'Align 1-Handles Cross-Horizontally\');">' + makeActionButton_AlignHandlesH2YCross() + '</button>';
        pointactions += '<button title="Align Handles Horizontally\nAlign handles horizontally" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignHY(o[1]) }); history_put(\'Align Handles Horizontally\');">' + makeActionButton_AlignHandlesHY() + '</button>';
        pointactions += '<button title="Align 1-Handles Horizontally\nAlign first handles horizontally" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH1Y(o[1]) }); history_put(\'Align 1-Handles Horizontally\');">' + makeActionButton_AlignHandlesH1Y() + '</button>';
        pointactions += '<button title="Align 2-Handles Horizontally\nAlign second handles horizontally" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH2Y(o[1]) }); history_put(\'Align 2-Handles Horizontally\');">' + makeActionButton_AlignHandlesH2Y() + '</button>';
        pointactions += '<br>';
        pointactions += '<button title="Align Handles Double-Cross Vertically\nAlign both opposite handles vertically" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignHXCross(o[1]) }); history_put(\'Align Handles Double Cross Vertically\');">' + makeActionButton_AlignHandlesXCross() + '</button>';
        pointactions += '<button title="Align 1-Handles Cross-Vertically\nAlign first opposite handles vertically" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH1XCross(o[1]) }); history_put(\'Align 1-Handles Cross-Vertically\');">' + makeActionButton_AlignHandlesH1XCross() + '</button>';
        pointactions += '<button title="Align 2-Handles Cross-Vertically\nAlign second opposite handles vertically" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH2XCross(o[1]) }); history_put(\'Align 1-Handles Cross-Vertically\');">' + makeActionButton_AlignHandlesH2XCross() + '</button>';
        pointactions += '<button title="Align Handles Vertically\nAlign handles vertically" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignHX(o[1]) }); history_put(\'Align Handles Vertically\');">' + makeActionButton_AlignHandlesHX() + '</button>';
        pointactions += '<button title="Align 1-Handles Vertically\nAlign first handles vertically" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH1X(o[1]) }); history_put(\'Align 1-Handles Vertically\');">' + makeActionButton_AlignHandlesH1X() + '</button>';
        pointactions += '<button title="Align 2-Handles Vertically\nAlign second handles vertically" onclick="k_combinations(_UI.multiSelect.points.members, 2).forEach(function(o, i) { o[0].alignH2X(o[1]) }); history_put(\'Align 2-Handles Vertically\');">' + makeActionButton_AlignHandlesH2X() + '</button>';
        pointactions += '<h3>point autofit</h3>';
        pointactions += '<button title="Autofit XY\nAutofit a point based on the selected points" onclick="k_combinations(_UI.multiSelect.points.members, _UI.multiSelect.points.members.length > 3 ? 4 : 3).forEach(function(o, i) { o[o[3] ? 3 : 2].alignMutualOffsetXY(o[0], o[1], o[3] ? o[2] : {P:{x:undefined}}) }); history_put(\'Autofit XY\');">' + makeActionButton_AutofitXY() + '</button>';
        pointactions += '<button title="Autofit X\nAutofit a point based on the selected points" onclick="k_combinations(_UI.multiSelect.points.members, _UI.multiSelect.points.members.length > 3 ? 4 : 3).forEach(function(o, i) { o[o[3] ? 3 : 2].alignMutualOffsetX(o[0], o[1], o[3] ? o[2] : {P:{x:undefined}}) }); history_put(\'Autofit X\');">' + makeActionButton_AutofitX() + '</button>';
        pointactions += '<button title="Autofit Y\nAutofit a point based on the selected points" onclick="k_combinations(_UI.multiSelect.points.members, _UI.multiSelect.points.members.length > 3 ? 4 : 3).forEach(function(o, i) { o[o[3] ? 3 : 2].alignMutualOffsetY(o[0], o[1], o[3] ? o[2] : {P:{x:undefined}}) }); history_put(\'Autofit Y\');">' + makeActionButton_AutofitY() + '</button>';


    // GLYPH
        var glyphactions = '<h3>glyph</h3>';
        glyphactions += '<button title="Combine all shapes\nCombines the paths of all shapes with the same winding into as few shapes as possible" onclick="combineAllGlyphShapes();">' + makeActionButton_Combine() + '</button>';
        glyphactions += '<button title="Flip Vertical\nReflects the glyph vertically" onclick="getSelectedWorkItem().flipEW(); history_put(\'Flip Glyph : Vertical\'); redraw({calledBy:\'Glyph Details - FlipEW\'});">' + makeActionButton_FlipHorizontal() + '</button>';
        glyphactions += '<button title="Flip Horizontal\nReflects the glyph horizontally" onclick="getSelectedWorkItem().flipNS(); history_put(\'Flip Glyph : Horizontal\'); redraw({calledBy:\'Glyph Details - FlipNS\'});">' + makeActionButton_FlipVertical() + '</button>';


        // DEV
        var devactions = '';
        if(_UI.devMode){
            if(_UI.testActions.length) devactions += '<h3>test</h3>';
            for(var a=0; a<_UI.testActions.length; a++){
                devactions += '<button onclick="'+_UI.testActions[a].onclick+'">'+_UI.testActions[a].name+'</button>';
            }
        }


        // Put it all together
        if(pop) content += '</div><div class="panel_section"><div class="actionsarea" style="margin-top:0px;">';
        else content += '<div class="actionsarea">';

        content += allactions;
        if(!pop) content += '<br>';

        if(ss.length === 0) content += glyphactions;
        if(ss.length > 0) content += shapeactions;
        if(ss.length > 1) content += boolactions;
        if(ss.length === 1 && !pop) content += layeractions;
        if(ss.length > 1) content += alignactions;

        if(!pop) content += '<br>';

        var ispointsel = false;
        if(_UI.multiSelect.points.count() > 0) ispointsel = true;
        if(_UI.selectedTool !== 'pathedit') ispointsel = false;

        if(ispointsel){ content += pointactions; }
        if(!pop) content += '<br>';

        content += devactions;

        content += '</div>';
        content += '</div>';

        return content;
    }


//-------------------
// Combine
//-------------------

    function combineSelectedShapes() {
        showToast('Combining selected shapes... ', 100); 

        setTimeout(function() {
            _UI.multiSelect.shapes.combine();
            history_put('combine selected shapes'); 
            redraw({calledBy:'actions panel'});
        }, 200);
    }

    function combineAllGlyphShapes() {
        showToast('Combining all glyph shapes... ', 100); 
        
        setTimeout(function() {
            getSelectedWorkItem().combineAllShapes(true); 
            history_put('combine all glyph shapes'); 
            redraw({calledBy:'actions panel'});
        }, 200);
    }

//-------------------
// Copy Paste
//-------------------
    function copyShape(){
        var ssm = _UI.multiSelect.shapes.getMembers();
        if(ssm.length){
            _UI.clipboardShape = {
                's':clone(ssm),
                'c':_UI.selectedGlyph,
                'dx': 0,
                'dy': 0
            };
            //debug("COPYShape() - new clipboard shape: " + _UI.clipboardShape._UI.multiSelect.shapes.name);
        }
        redraw({calledBy:'copyShape', redrawCanvas:false});
    }

    function pasteShape(){
        // debug('pasteShape - START');
        var cbs = _UI.clipboardShape;
        // debug(cbs);
        var selwi = getSelectedWorkItemID();

        if(cbs){
            var newshapes = [];
            var sourceshapes = cbs.s;
            var ts, newname, newsuffix, n;
            var offsetShapes = cbs.c === selwi;
            
            for(var s=0; s<sourceshapes.length; s++){
                var ts;
                
                if(sourceshapes[s].objtype === 'componentinstance'){
                    ts = new ComponentInstance(sourceshapes[s]);
                } else {
                    ts = new Shape(sourceshapes[s]);
                }

                // debug('\t shape ' + s);
                // debug('\t objtype: ' + ts.objtype);
                // debug('\t checking for moved glyphs: ' + cbs.c + ' to ' + selwi);
                // debug('\t offsetShapes: ' + offsetShapes);

                if(offsetShapes) {
                    if(s === 0){
                        cbs.dx += 20;
                        cbs.dy -= 20;
                    }
                    ts.updateShapePosition(cbs.dx,cbs.dy,true);

                } else {
                    cbs.dx = 0;
                    cbs.dy = 0;
                }
                

                newname = ts.name;
                newsuffix = ' (copy)';
                n = ts.name.lastIndexOf('(copy');

                if(n > 0){
                    var suffix = newname.substring(n+5);
                    newname = newname.substring(0,n);
                    if(suffix === ')'){
                        newsuffix = '(copy 2)';
                    } else {
                        // debug("\t - suffix " + suffix);
                        suffix = suffix.substring(1);
                        // debug("\t - suffix " + suffix);
                        suffix = suffix.substring(0, suffix.length-1);
                        // debug("\t - suffix " + suffix);
                        newsuffix = '(copy ' + (parseInt(suffix)+1) + ")";
                        // debug("\t - newsuffix " + newsuffix);
                    }
                }
                ts.name = newname + newsuffix;

                if(ts.objtype === 'componentinstance'){
                    addToUsedIn(ts.link, _UI.selectedGlyph);
                    //debug("PASTESHAPE - pasted a component, added " + _UI.selectedGlyph + " to usedin array.");
                }

                newshapes.push(addShape(ts));
            }

            _UI.multiSelect.shapes.clear();
            _UI.multiSelect.points.clear();

            for(var t=0; t<newshapes.length; t++) _UI.multiSelect.shapes.add(newshapes[t]);

            cbs.c = selwi;
                    
            // debug('pasteShapes - END \n');
        }
    }

    function showDialog_GetShapes(msg){
        var content = '<h1>Get Shapes</h1>';
        content += 'Clicking a glyph will copy all the shapes in that glyph, and paste them into this glyph.<br><br>';
        content += msg? msg : '';
        content += initGetShapesDialogOptions();

        _UI.glyphChooser.dialog = {
            fname:'pasteShapesFrom',
            choices:'all',
            selected:'glyphs'
        };

        openBigDialog(content);
    }

    function initGetShapesDialogOptions(type) {
        /*        
        _UI.glyphChooser.getShapeOptions = {
            srcAutoWidth: false,
            srcWidth: false,
            srcLSB: false,
            srcRSB: false
        };
        */
        type = type || 'shapes';
        var gso = _UI.glyphChooser.getShapeOptions;


        var content = '<br><br><br><br><h3>Copy options</h3>';

        if(type === 'shapes') content += 'When copying the shapes from the other glyph, also copy these attributes to this glyph:';
        else content += 'When inserting the Component Instance, also copy these attributes from the Root Component to this glyph:';
        
        content += '<table class="settingstable projectsettings">';

        content +=     '<tr><td style="text-align:right; vertical-align:top;">'+checkUI('_UI.glyphChooser.getShapeOptions.srcAutoWidth', gso.srcAutoWidth)+'</td>'+
                    '<td style="vertical-align:top;"><label for="srcAutoWidth">Auto-calculate Width</label><br><br></td></tr>';

        content +=     '<tr><td style="text-align:right; vertical-align:top;">'+checkUI('_UI.glyphChooser.getShapeOptions.srcWidth', gso.srcWidth)+'</td>'+
                    '<td style="vertical-align:top;"><label for="srcWidth">Glyph Width</label><br><br></td></tr>';

        content +=     '<tr><td style="text-align:right; vertical-align:top;">'+checkUI('_UI.glyphChooser.getShapeOptions.srcLSB', gso.srcLSB)+'</td>'+
                    '<td style="vertical-align:top;"><label for="srcLSB">Left Side Bearing</label><br><br></td></tr>';

        content +=     '<tr><td style="text-align:right; vertical-align:top;">'+checkUI('_UI.glyphChooser.getShapeOptions.srcRSB', gso.srcRSB)+'</td>'+
                    '<td style="vertical-align:top;"><label for="srcRSB">Right Side Bearing</label><br><br></td></tr>';

        content += '</table>';

        return content;
    }

    function pasteShapesFrom(sourceGlyphID) {
        var destinationGlyphID = getSelectedWorkItemID();
        var sourceGlyph = getGlyph(sourceGlyphID);

        if(sourceGlyphID !== destinationGlyphID && sourceGlyph){
            sourceGlyph.copyShapesTo(destinationGlyphID, _UI.glyphChooser.getShapeOptions);
            redraw({calledBy:'pasteShapesFrom'});
            history_put('Copied shapes from "' + getGlyphName(sourceGlyphID) + '" to  "' + getSelectedWorkItemName());
            if(_UI.selectedTool === 'pathaddpoint') _UI.selectedTool = 'shaperesize';
            closeDialog();
            
        } else {
            showDialog_GetShapes('Sorry, you can\'t paste shapes from the glyph you selected.<br>');
        }
    }



//-------------------
// COMPONENT Actions
//-------------------

    function showDialog_LinkComponentToGlyph(msg){
        var sls = getSelectedWorkItem();
        var content = '<h1>Link to Glyph</h1>';
        content += 'Select a Glyph you would like to link to this Component.<br><br>';
        content += msg? msg : 'There are currently ' + sls.usedin.length + ' instances of "' + sls.name + '" being used in various Glyphs.<br><br>';

        _UI.glyphChooser.dialog = {
            'fname':'linkComponentToGlyph',
            'choices':'all',
            'selected':'glyphs'
        };

        openBigDialog(content);
    }

    function linkComponentToGlyph(id){
        if(insertComponentInstance(_UI.selectedComponent, id)){
            showDialog_LinkComponentToGlyph('The Component "' + getSelectedWorkItem().name + '" was successfully linked to Glyph "' + getGlyphName(id) + '".<br><br>');
        }
    }
