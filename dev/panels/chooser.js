
/**
    Panel > Chooser
    Shows a list of all the Glyphs to choose from
    for whatever the current page is.  Also has
    the logic for creating Glyph chooser dialogs.
**/


    function makePanel_GlyphChooser() {
        // debug('\n makePanel_GlyphChooser - START');

        let content = '<div class="navarea_header">';
        content += makePanelSuperTitle();
        content += '<h1 class="paneltitle">chooser</h1>';
        content += '</div>';
        content += '<div class="panel_section" id="glyphChooser">';

        let gcp = _UI.glyphChooser.panel;
        // _UI.glyphChooser.cache = false;

        if (_UI.currentPage === 'glyph edit') {
            asyncLoadChooserPanel();
            // _UI.glyphChooser.cache = make_GlyphChooser(_UI.glyphChooser.panel);
        } else if (_UI.currentPage === 'import svg') {
            asyncLoadChooserPanel();
            // _UI.glyphChooser.cache = make_GlyphChooser(_UI.glyphChooser.panel);
         } else if (_UI.currentPage === 'ligatures') {
            let emptyligs = countObjectKeys(getCurrentProject().ligatures) === 0;
            if (!emptyligs) {
                content += make_GlyphChooser(gcp);
            }
            content += '<div class="panel_section" ';
            content += emptyligs? 'style="padding-top:-10px;">' : '>';
            content += '<button onclick="showNewLigatureDialog();">create new ligature</button><br>';
            if (!emptyligs) content += '<button onclick="deleteLigatureConfirm();">delete selected ligature</button><br>';
            else content += '<button onclick="addCommonLigatures();">add some common ligatures</button>';
            content += '</div>';

            if (emptyligs) {
                content += '<div class="panel_section">';
                content += '<h2>Please note!</h2><br>';
                content += 'Ligatures will only be exported to SVG Fonts. This is a limitation of the library we use to write OTF files.<br><br>';
                content += 'If you really need Ligatures in an OTF file, first export your project to an SVG Font, then use an online service to ';
                content += 'convert your SVG Font to an OTF Font.';
                content += '</div>';
            }
        } else if (_UI.currentPage === 'components') {
            let emptycoms = countObjectKeys(getCurrentProject().components) === 0;
            if (!emptycoms) {
                content += make_GlyphChooser(gcp);
            }
            content += '<div class="panel_section" ';
            content += emptycoms? 'style="padding-top:-10px;">' : '>';
            content += '<button onclick="createNewComponent();history_put(\'Create New Component\');navigate({panel:\'npAttributes\'});">create new component</button><br>';
            if (!emptycoms) content += '<button onclick="deleteComponentConfirm();">delete selected component</button><br>';
            content += '</div>';
        }

        content += '</div>';

        // debug(' makePanel_GlyphChooser - END\n');
        return content;
    }

    function asyncLoadChooserPanel() {
        // debug(' asyncLoadChooserPanel - START');

        function tryLoadChooserPanel() {
            let np = _UI.popOut? document.getElementById('popOut_glyphchooser') : document.getElementById('navarea_panel');
            let gc = document.getElementById('glyphChooser');

            if (_UI.glyphChooser.cache && np && gc && gc.innerHTML === '') {
                gc.innerHTML = _UI.glyphChooser.cache;
                // debug(' tryLoadChooserPanel - SUCCESS\n');
            } else {
                // debug(' tryLoadChooserPanel - TRYING AGAIN\n');
                setTimeout(tryLoadChooserPanel, 10);
            }
        }

        tryLoadChooserPanel();
        _UI.glyphChooser.cache = make_GlyphChooser(_UI.glyphChooser.panel);
    }

    function make_GlyphChooser(gcdata) {
        // debug('\n make_GlyphChooser - START');
        // debug([gcdata]);

        let con = '';

        if ( (gcdata.choices === 'all') ||
            (_UI.currentPage === 'glyph edit' && pluralGlyphRange()) ||
            (_UI.currentPage === 'import svg' && (pluralGlyphRange() || countObjectKeys(getCurrentProject().components) || countObjectKeys(getCurrentProject().ligatures))) ) {
                con += make_GlyphChooser_Header(gcdata.selected);
        }

        if (_UI.glyphChooser.dropdown) con += make_GlyphChooser_DropDown(gcdata.choices);
        else con += make_GlyphChooser_Content(gcdata);

        // debug(' make_GlyphChooser - END\n');
        return con;
    }

    function toggle_GlyphChooser() {
        _UI.glyphChooser.dropdown = !_UI.glyphChooser.dropdown;

        if (isBigDialogOpen()) {
            document.getElementById('bigDialogScrollContent').innerHTML = make_GlyphChooser(_UI.glyphChooser.dialog);
        } else {
            redraw({calledBy: 'toggle_GlyphChooser', redrawCanvas: false});
        }
    }

    function update_GlyphChooser(selrange) {
        // debug('\n update_GlyphChooser - START');
        // debug('\t passed ' + selrange);

        if (isBigDialogOpen()) {
            _UI.glyphChooser.dialog.selected = selrange;
            toggle_GlyphChooser();
        } else {
            _UI.glyphChooser.panel.selected = selrange;
            _UI.glyphChooser.dropdown = !_UI.glyphChooser.dropdown;

            if (selrange === 'glyphs') selrange = 'basiclatin';

            if (!isNaN(parseInt(selrange))) {
                selectGlyph(getCurrentProject().projectSettings.glyphrange.custom[selrange].begin, true);
            } else {
                switch (selrange) {
                    case 'basiclatin': selectGlyph('0x0041', true); break;
                    case 'latinsupplement': selectGlyph('0x00A0', true); break;
                    case 'latinextendeda': selectGlyph('0x0100', true); break;
                    case 'latinextendedb': selectGlyph('0x0180', true); break;
                    case 'components': selectGlyph(getFirstID(getCurrentProject().components), true); break;
                    case 'ligatures': selectGlyph(getFirstID(getCurrentProject().ligatures), true); break;
                }
            }

            update_NavPanels();
            redraw({calledBy: update_GlyphChooser, redrawPanels: false});
        }

        // debug(' update_GlyphChooser - END\n');
    }

    function make_GlyphChooser_Header(selrange) {
        // debug('\n make_GlyphChooser_Header - START');
        // debug('\t passed selrange ' + selrange);

        let content = '<div class="glyphChooser-header" onclick="toggle_GlyphChooser();">';

        if (_UI.glyphChooser.dropdown) {
            content += 'choose a glyph range';
            content += '<span>&#x2571;&#x2572;</span>';
            content += '</div>';
            return content;
        }


        if (selrange === 'glyphs') selrange = 'basiclatin';

        if (!isNaN(parseInt(selrange))) {
            content += 'Custom Range ' + (selrange+1);
        } else if (selrange) {
            switch (selrange) {
                case 'basiclatin': content += 'Basic Latin'; break;
                case 'latinsupplement': content += 'Latin Supplement'; break;
                case 'latinextendeda': content += 'Latin Extended-A'; break;
                case 'latinextendedb': content += 'Latin Extended-B'; break;
                case 'components': content += 'Components'; break;
                case 'ligatures': content += 'Ligatures'; break;
            }
        } else {
            content += selrange;
        }
        // content += '&emsp;&#x25BC;';
        content += '<span>&#x2572;&#x2571;</span>';
        content += '</div>';

        return content;
    }

    function make_GlyphChooser_DropDown(ch) {
        let content = '<div class="glyphChooser-dropdown">';
        let gr = getCurrentProject().projectSettings.glyphrange;

        if (ch === 'glyphs' || ch === 'all') {
            if (gr.basiclatin) content += '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'basiclatin\');">Basic Latin</button>';
            if (gr.latinsupplement) content += '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'latinsupplement\');">Latin Supplement</button>';
            if (gr.latinextendeda) content += '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'latinextendeda\');">Latin Extended-A</button>';
            if (gr.latinextendedb) content += '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'latinextendedb\');">Latin Extended-B</button>';

            if (gr.custom.length) content += '<div style="height:12px;"></div>';
            for (let c=0; c<gr.custom.length; c++) {
                content += '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser('+c+');">';
                content += 'Custom Range '+(c+1) + '&emsp;';
                content += '<span class="units">' + gr.custom[c].begin + ' to ' + gr.custom[c].end + '</span>';
                content += '</button>';
            }
        }

        if (ch === 'components' || ch === 'all') {
            if (countObjectKeys(getCurrentProject().components)) {
                content += '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'components\');">';
                content += 'Components&emsp;';
                content += '<span class="units">(' + countObjectKeys(getCurrentProject().components) + ')</span>';
                content += '</button>';
            }
        }

        if (ch === 'ligatures' || ch === 'all') {
            if (countObjectKeys(getCurrentProject().ligatures)) {
                content += '<button class="navtargetbutton glyphChooser-dropdownbutton" onclick="update_GlyphChooser(\'ligatures\');">';
                content += 'Ligatures&emsp;';
                content += '<span class="units">(' + countObjectKeys(getCurrentProject().ligatures) + ')</span>';
                content += '</button>';
            }
        }

        return content + '</div>';
    }

    function pluralGlyphRange() {
        // debug('\n pluralGlyphRange - START');
        let gr = getCurrentProject().projectSettings.glyphrange;
        let count = gr.custom.length;

        if (gr.basiclatin) {
 count++; /* debug('\t triggered basiclatin');*/
}
        if (gr.latinextendeda) {
 count++; /* debug('\t triggered latinextendeda');*/
}
        if (gr.latinextendedb) {
 count++; /* debug('\t triggered latinextendedb');*/
}
        if (gr.latinsupplement) {
 count++; /* debug('\t triggered latinsupplement');*/
}

        // debug(' pluralGlyphRange - END - returning ' + count + '\n');
        return count > 1;
    }

    function make_GlyphChooser_Content(gcdata) {
        // debug('\n make_GlyphChooser_Content - START');
        // debug([gcdata]);

        let fname = gcdata.fname || 'selectGlyph';
        let sel = isVal(gcdata.selected)? gcdata.selected : 'glyphs';
        let selwi = getSelectedWorkItemID();
        let re = '<div class="glyphChooser-content">';

        if (sel === 'basiclatin' || sel === 'glyphs') {
            // debug('\t triggered glyphs');
            let bl = _UI.basiclatinorder;
            for (let i=0; i<bl.length; i++) {
                re += make_GlyphChooser_Button(bl[i], fname, selwi);
            }
            return re + '</div>';
        }

        if (sel === 'latinsupplement') {
            // debug('\t triggered latinsupplement');
            for (let s=_UI.glyphrange.latinsupplement.begin; s<=_UI.glyphrange.latinsupplement.end; s++) {
                re += make_GlyphChooser_Button(decToHex(s), fname, selwi);
            }
            return re + '</div>';
        }

        if (sel === 'latinextendeda') {
            // debug('\t triggered latinextendeda');
            for (let a=_UI.glyphrange.latinextendeda.begin; a<=_UI.glyphrange.latinextendeda.end; a++) {
                re += make_GlyphChooser_Button(decToHex(a), fname, selwi);
            }
            return re + '</div>';
        }

        if (sel === 'latinextendedb') {
            // debug('\t triggered latinextendedb');
            for (let b=_UI.glyphrange.latinextendedb.begin; b<=_UI.glyphrange.latinextendedb.end; b++) {
                re += make_GlyphChooser_Button(decToHex(b), fname, selwi);
            }
            return re + '</div>';
        }

        let cr = getCurrentProject().projectSettings.glyphrange;
        let c = parseInt(sel);
        if (!isNaN(c)) {
            // debug('\t triggered custom range');
            for (let range=cr.custom[c].begin; range<=cr.custom[c].end; range++) {
                cn = decToHex(range);
                if (getCurrentProject().projectSettings.glyphrange.filternoncharpoints) {
                    if (getUnicodeName(cn) !== '[name not found]') re += make_GlyphChooser_Button(cn, fname, selwi);
                } else {
                    re += make_GlyphChooser_Button(cn, fname, selwi);
                }
            }
            return re + '</div>';
        }

        if (sel === 'ligatures' && getFirstID(getCurrentProject().ligatures)) {
            sortLigatures();
            let lig = getCurrentProject().ligatures;
            for (let l in lig) {
 if (lig.hasOwnProperty(l)) {
                re += make_GlyphChooser_Button(l, fname, selwi);
            }
}
            return re + '</div>';
        }

        if (sel === 'components' && getFirstID(getCurrentProject().components)) {
            let com = getCurrentProject().components;
            for (let d in com) {
 if (com.hasOwnProperty(d)) {
                re += make_GlyphChooser_Button(d, fname, selwi);
            }
}
            return re + '</div>';
        }

        // debug(' make_GlyphChooser_HeaderContent - END ERROR\n');
        return '[error: make_GlyphChooser_HeaderContent]';
    }

    function make_GlyphChooser_Button(index, fname, selid) {
        // debug('\n make_GlyphChooser_Button - START ' + index);
        let onc = (fname + '(\'' + index + '\');');
        // debug('\t constructed function: ' + onc);

        let wi = getGlyph(index);
        // debug('\t getGlyph returned');
        // debug(wi);

        let gname = wi.name;
        if (gname === '[name not found]' || !gname) gname = getGlyphName(index);

        let rv = '<div class="glyphselect" onclick="'+onc+'" title="'+gname+'&#13;'+index+'">';

        let issel = (index === selid);

        if (wi && wi.hasShapes()) {
            let extra = '';
            if (issel) {
extra = ' glyphselectthumbsel';
}
            rv += '<div class="glyphselectthumb'+extra+'">'+wi.makeSVG()+'</div>';
        } else {
            if (issel) {
rv += '<div class="glyphselectbuttonsel"';
} else {
rv += '<div class="glyphselectbutton"';
}

            if (index === '0x0020') {
                rv += ' style="font-size:13px; line-height:3.8em;">space'; // SPACE needs to be smaller font size
            } else if (index.indexOf('0x') === -1) {
                rv += ' style="font-size:8px;"><div style="height:10px;"></div>'; // Component names needs to be smaller font size
                rv += gname;
            } else {
                rv += '>';
                rv += (wi.glyphhtml || hexToHTML(index) || gname);
            }

            rv += '</div>';
        }

        rv += '<div class="glyphselectname">'+ (hexToHTML(index) || gname || '[no name])') +'</div>';
        rv += '</div>';

        // debug(' make_GlyphChooser_Button - END\n');
        return rv;
    }
