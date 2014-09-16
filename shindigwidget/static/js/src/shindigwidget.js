/* Javascript for ShindigXBlock. */
function ShindigXBlock(runtime, element) {
    //TODO:  Get these values from the edX environment
    var shindig_defaults = {
        "institution": "Shindig University",
        "course": "Shindig 101",
        "customerServicePhone": "(800)888-8888",
        "customerServiceEmail": "help@shindigevents.com",
        "dummy": "dummy test value"
    };

    Modernizr.load({
        test : Modernizr.inputtypes && Modernizr.inputtypes.date,
        nope : [
            '//afarkas.github.io/webshim/js-webshim/minified/polyfiller.js',
            '//shindigevents.github.io/shindig-xblock/shindigwidget/static/css/webshim-overrides.css'
        ],
        callback: function(){
            if (!window.jQuery) {
                // Load jQuery from our local server
                // Inject it into the middle of our order of scripts to execute
                // even if other scripts are listed after this one, and are already
                // done loading.
                Modernizr.load('//code.jquery.com/jquery-1.11.1.min.js',
                               '//code.jquery.com/ui/1.10.4/jquery-ui.min.js');
            }
            window.setTimeout( function(){
                $.webshims.setOptions('waitReady', false);
                $.webshims.setOptions('forms-ext', {types: 'date'});
                $.webshims.polyfill('forms forms-ext');
            }, 4000);
        }
    });
    function dean_addEvent(a,b,c){if(a.addEventListener)a.addEventListener(b,c,!1);else{c.$$guid||(c.$$guid=dean_addEvent.guid++),a.events||(a.events={});var d=a.events[b];d||(d=a.events[b]={},a["on"+b]&&(d[0]=a["on"+b])),d[c.$$guid]=c,a["on"+b]=handleEvent}}function removeEvent(a,b,c){a.removeEventListener?a.removeEventListener(b,c,!1):a.events&&a.events[b]&&delete a.events[b][c.$$guid]}function handleEvent(a){var b=!0;a=a||fixEvent(((this.ownerDocument||this.document||this).parentWindow||window).event);var c=this.events[a.type];for(var d in c)this.$$handleEvent=c[d],this.$$handleEvent(a)===!1&&(b=!1);return b}function fixEvent(a){return a.preventDefault=fixEvent.preventDefault,a.stopPropagation=fixEvent.stopPropagation,a}function setFilterGrid(a){var b,c,d=grabEBI(a);if(null!=d&&"table"==d.nodeName.toLowerCase()){if(arguments.length>1)for(var e=0;e<arguments.length;e++){var f=typeof arguments[e];switch(f.toLowerCase()){case"number":b=arguments[e];break;case"object":c=arguments[e]}}void 0==b?b=1:b+=1;var g=getCellsNb(a,b);d.tf_ncells=g,void 0==d.tf_ref_row&&(d.tf_ref_row=b),d.tf_Obj=c,hasGrid(a)||AddGrid(a)}}function AddGrid(a){TblId.push(a);var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y=grabEBI(a),z=y.tf_Obj,A=y.tf_ncells;if(c=void 0!=z&&0==z.grid?!1:!0,d=void 0!=z&&1==z.btn?!0:!1,e=void 0!=z&&void 0!=z.btn_text?z.btn_text:"go",f=void 0!=z&&0==z.enter_key?!1:!0,g=void 0!=z&&z.mod_filter_fn?!0:!1,h=void 0!=z&&void 0!=z.display_all_text?z.display_all_text:"",i=void 0!=z&&0==z.on_change?!1:!0,j=void 0!=z&&1==z.rows_counter?!0:!1,k=void 0!=z&&void 0!=z.rows_counter_text?z.rows_counter_text:"Displayed rows: ",l=void 0!=z&&1==z.btn_reset?!0:!1,m=void 0!=z&&void 0!=z.btn_reset_text?z.btn_reset_text:"Reset",n=void 0!=z&&1==z.sort_select?!0:!1,o=void 0!=z&&1==z.paging?!0:!1,p=void 0!=z&&void 0!=z.paging_length?z.paging_length:10,q=void 0!=z&&1==z.loader?!0:!1,r=void 0!=z&&void 0!=z.loader_text?z.loader_text:"Loading...",s=void 0!=z&&1==z.exact_match?!0:!1,t=void 0!=z&&1==z.alternate_rows?!0:!1,u=void 0!=z&&z.col_operation?!0:!1,v=void 0!=z&&z.rows_always_visible?!0:!1,w=void 0!=z&&z.col_width?!0:!1,x=void 0!=z&&z.bind_script?!0:!1,y.tf_fltGrid=c,y.tf_displayBtn=d,y.tf_btnText=e,y.tf_enterKey=f,y.tf_isModfilter_fn=g,y.tf_display_allText=h,y.tf_on_slcChange=i,y.tf_rowsCounter=j,y.tf_rowsCounter_text=k,y.tf_btnReset=l,y.tf_btnReset_text=m,y.tf_sortSlc=n,y.tf_displayPaging=o,y.tf_pagingLength=p,y.tf_displayLoader=q,y.tf_loadText=r,y.tf_exactMatch=s,y.tf_alternateBgs=t,y.tf_startPagingRow=0,g&&(y.tf_modfilter_fn=z.mod_filter_fn),c){var B=y.insertRow(0);B.className="fltrow";for(var C=0;A>C;C++){var D=B.insertCell(C);if(b=C==A-1&&1==d?"flt_s":"flt",void 0==z||void 0==z["col_"+C]||"none"==z["col_"+C]){var E;E=void 0==z||void 0==z["col_"+C]?"text":"hidden";var F=createElm("input",["id","flt"+C+"_"+a],["type",E],["class",b]);F.className=b,D.appendChild(F),f&&(F.onkeypress=DetectKey)}else if("select"==z["col_"+C]){var G=createElm("select",["id","flt"+C+"_"+a],["class",b]);if(G.className=b,D.appendChild(G),PopulateOptions(a,C),o){var H=new Array;H.push(a),H.push(C),H.push(A),H.push(h),H.push(n),H.push(o),SlcArgs.push(H)}f&&(G.onkeypress=DetectKey),i&&(G.onchange=g?z.mod_filter_fn:function(){Filter(a)})}if(C==A-1&&1==d){var I=createElm("input",["id","btn"+C+"_"+a],["type","button"],["value",e],["class","btnflt"]);I.className="btnflt",D.appendChild(I),I.onclick=g?z.mod_filter_fn:function(){Filter(a)}}}}if(j||l||o||q){var J=createElm("div",["id","inf_"+a],["class","inf"]);if(J.className="inf",y.parentNode.insertBefore(J,y),j){var K,L=createElm("div",["id","ldiv_"+a]);j?L.className="ldiv":L.style.display="none",K=o?p:getRowsNb(a);var M=createElm("span",["id","totrows_span_"+a],["class","tot"]);M.className="tot",M.appendChild(createText(K));var N=createText(k);L.appendChild(N),L.appendChild(M),J.appendChild(L)}if(q){var O=createElm("div",["id","load_"+a],["class","loader"]);O.className="loader",O.style.display="none",O.appendChild(createText(r)),J.appendChild(O)}if(o){var P=createElm("div",["id","mdiv_"+a]);o?P.className="mdiv":P.style.display="none",J.appendChild(P);var Q=y.tf_ref_row,R=grabTag(y,"tr"),S=R.length,T=Math.ceil((S-Q)/p),U=createElm("select",["id","slcPages_"+a]);U.onchange=function(){q&&showLoader(a,""),y.tf_startPagingRow=this.value,GroupByPage(a),q&&showLoader(a,"none")};var V=createElm("span",["id","pgspan_"+a]);grabEBI("mdiv_"+a).appendChild(createText(" Page ")),grabEBI("mdiv_"+a).appendChild(U),grabEBI("mdiv_"+a).appendChild(createText(" of ")),V.appendChild(createText(T+" ")),grabEBI("mdiv_"+a).appendChild(V);for(var W=Q;S>W;W++)R[W].setAttribute("validRow","true");setPagingInfo(a),q&&showLoader(a,"none")}if(l&&c){var X=createElm("div",["id","reset_"+a]);l?X.className="rdiv":X.style.display="none";var Y=createElm("a",["href","javascript:clearFilters('"+a+"');Filter('"+a+"');"]);Y.appendChild(createText(m)),X.appendChild(Y),J.appendChild(X)}}w&&(y.tf_colWidth=z.col_width,setColWidths(a)),t&&!o&&setAlternateRows(a),u&&(y.tf_colOperation=z.col_operation,setColOperation(a)),v&&(y.tf_rowVisibility=z.rows_always_visible,o&&setVisibleRows(a)),x&&(y.tf_bindScript=z.bind_script,void 0!=y.tf_bindScript&&void 0!=y.tf_bindScript.target_fn&&y.tf_bindScript.target_fn.call(null,a))}function PopulateOptions(a,b){var c=grabEBI(a),d=c.tf_ncells,e=c.tf_display_allText,f=c.tf_sortSlc,g=(c.tf_displayPaging,c.tf_ref_row),h=grabTag(c,"tr"),i=new Array,j=0,k=new Option(e,"",!1,!1);grabEBI("flt"+b+"_"+a).options[j]=k;for(var l=g;l<h.length;l++){{var m=getChildElms(h[l]).childNodes,n=m.length;h[l].getAttribute("paging")}if(n==d)for(var o=0;n>o;o++)if(b==o){var p=getCellText(m[o]),q=!1;for(w in i)p==i[w]&&(q=!0);q||i.push(p)}}f&&i.sort();for(y in i){j++;var k=new Option(i[y],i[y],!1,!1);grabEBI("flt"+b+"_"+a).options[j]=k}}function Filter(a){showLoader(a,""),SearchFlt=getFilters(a);var b=grabEBI(a);fprops=void 0!=b.tf_Obj?b.tf_Obj:new Array;for(var c=new Array,d=getCellsNb(a),e=(getRowsNb(a),0),f=b.tf_exactMatch,g=b.tf_displayPaging,h=0;h<SearchFlt.length;h++)c.push(grabEBI(SearchFlt[h]).value.toLowerCase());for(var i=(b.tf_ref_row,grabTag(b,"tbody tr")),j=0;j<i.length;j++){"none"==i[j].style.display&&(i[j].style.display="");var k=getChildElms(i[j]).childNodes,l=k.length;if(l==d){for(var m=new Array,n=new Array,o=!0,p=0;l>p;p++){var q=getCellText(k[p]).toLowerCase();if(m.push(q),""!=c[p]){var r=parseFloat(q);if(/<=/.test(c[p])&&!isNaN(r))n[p]=r<=parseFloat(c[p].replace(/<=/,""))?!0:!1;else if(/>=/.test(c[p])&&!isNaN(r))n[p]=r>=parseFloat(c[p].replace(/>=/,""))?!0:!1;else if(/</.test(c[p])&&!isNaN(r))n[p]=r<parseFloat(c[p].replace(/</,""))?!0:!1;else if(/>/.test(c[p])&&!isNaN(r))n[p]=r>parseFloat(c[p].replace(/>/,""))?!0:!1;else{var s;s=f||"select"==fprops["col_"+p]?new RegExp("(^)"+regexpEscape(c[p])+"($)","gi"):new RegExp(regexpEscape(c[p]),"gi"),n[p]=s.test(q)}}}for(var t=0;d>t;t++)""==c[t]||n[t]||(o=!1)}o?(i[j].style.display="",g&&i[j].setAttribute("validRow","true")):(i[j].style.display="none",e++,g&&i[j].setAttribute("validRow","false"))}b.tf_nRows=parseInt(getRowsNb(a))-e,g||applyFilterProps(a),g&&(b.tf_startPagingRow=0,setPagingInfo(a))}function setPagingInfo(a){for(var b=grabEBI(a),c=parseInt(b.tf_ref_row),d=b.tf_pagingLength,e=grabTag(b,"tr"),f=grabEBI("mdiv_"+a),g=grabEBI("slcPages_"+a),h=grabEBI("pgspan_"+a),i=0,j=c;j<e.length;j++)"true"==e[j].getAttribute("validRow")&&i++;var k=Math.ceil(i/d);if(h.innerHTML=k,g.innerHTML="",k>0){f.style.visibility="visible";for(var l=0;k>l;l++){var m=new Option(l+1,l*d,!1,!1);g.options[l]=m}}else f.style.visibility="hidden";GroupByPage(a)}function GroupByPage(a){showLoader(a,"");for(var b=grabEBI(a),c=parseInt(b.tf_ref_row),d=parseInt(b.tf_pagingLength),e=parseInt(b.tf_startPagingRow),f=e+d,g=grabTag(b,"tr"),i=0,j=new Array,k=c;k<g.length;k++){var l=g[k].getAttribute("validRow");"true"==l&&j.push(k)}for(h=0;h<j.length;h++)h>=e&&f>h?(i++,g[j[h]].style.display=""):g[j[h]].style.display="none";b.tf_nRows=parseInt(i),applyFilterProps(a)}function applyFilterProps(a){t=grabEBI(a);var b=t.tf_rowsCounter,c=t.tf_nRows,d=t.tf_rowVisibility,e=t.tf_alternateBgs,f=t.tf_colOperation;b&&showRowsCounter(a,parseInt(c)),d&&setVisibleRows(a),e&&setAlternateRows(a),f&&setColOperation(a),showLoader(a,"none")}function hasGrid(a){var b=!1,c=grabEBI(a);if(null!=c&&"table"==c.nodeName.toLowerCase())for(i in TblId)a==TblId[i]&&(b=!0);return b}function getCellsNb(a,b){var c,d=grabEBI(a);c=void 0==b?grabTag(d,"tr")[0]:grabTag(d,"tbody tr")[b];var e=getChildElms(c);return e.childNodes.length}function getRowsNb(a){var b=grabEBI(a),c=b.tf_ref_row,d=grabTag(b,"tr").length;return parseInt(d-c)}function getFilters(a){var b=new Array,c=grabEBI(a),d=grabTag(c,"tr")[0],e=d.childNodes;if(c.tf_fltGrid)for(var f=0;f<e.length;f++)b.push(e[f].firstChild.getAttribute("id"));return b}function clearFilters(a){SearchFlt=getFilters(a);for(i in SearchFlt)grabEBI(SearchFlt[i]).value=""}function showLoader(a,b){var c=grabEBI("load_"+a);null!=c&&"none"==b?setTimeout("grabEBI('load_"+a+"').style.display = '"+b+"'",150):null!=c&&"none"!=b&&(c.style.display=b)}function showRowsCounter(a,b){var c=grabEBI("totrows_span_"+a);null!=c&&"span"==c.nodeName.toLowerCase()&&(c.innerHTML=b)}function getChildElms(a){if(1==a.nodeType){for(var b=a.childNodes,c=0;c<b.length;c++){var d=b[c];3==d.nodeType&&a.removeChild(d)}return a}}function getCellText(a){for(var b="",c=a.childNodes,d=0;d<c.length;d++){var e=c[d];b+=3==e.nodeType?e.data:getCellText(e)}return b}function getColValues(a,b,c){for(var d=grabEBI(a),e=grabTag(d,"tr"),f=e.length,g=parseInt(d.tf_ref_row),h=getCellsNb(a,g),i=new Array,j=g;f>j;j++){var k=getChildElms(e[j]).childNodes,l=k.length;if(l==h)for(var m=0;l>m;m++)if(m==b&&""==e[j].style.display){var n=getCellText(k[m]).toLowerCase();i.push(c?parseFloat(n):n)}}return i}function setColWidths(a){if(hasGrid(a)){var b=grabEBI(a);b.style.tableLayout="fixed";for(var c=b.tf_colWidth,d=parseInt(b.tf_ref_row),e=grabTag(b,"tr")[0],f=getCellsNb(a,d),g=0;g<c.length;g++)for(var h=0;f>h;h++)cell=e.childNodes[h],h==g&&(cell.style.width=c[g])}}function setVisibleRows(a){if(hasGrid(a))for(var b=grabEBI(a),c=grabTag(b,"tr"),d=c.length,e=b.tf_displayPaging,f=b.tf_rowVisibility,g=0;g<f.length;g++)f[g]<=d&&(e&&c[f[g]].setAttribute("validRow","true"),c[f[g]].style.display="")}function setAlternateRows(a){if(hasGrid(a)){for(var b=grabEBI(a),c=grabTag(b,"tr"),d=c.length,e=parseInt(b.tf_ref_row),f=new Array,g=e;d>g;g++)""==c[g].style.display&&f.push(g);for(var h=0;h<f.length;h++)c[f[h]].className=h%2==0?"even":"odd"}}function setColOperation(a){if(hasGrid(a)){var b=grabEBI(a),c=b.tf_colOperation.id,d=b.tf_colOperation.col,e=b.tf_colOperation.operation,f=b.tf_colOperation.write_method,g=2;if("object"==(typeof c).toLowerCase()&&"object"==(typeof d).toLowerCase()&&"object"==(typeof e).toLowerCase()){for(var h=grabTag(b,"tr"),i=(h.length,parseInt(b.tf_ref_row)),j=(getCellsNb(a,i),new Array),k=0;k<d.length;k++)j.push(getColValues(a,d[k],!0));for(var l=0;l<j.length;l++){for(var m=0,n=0,o=0;o<j[l].length;o++){var p=j[l][o];if(!isNaN(p))switch(e[l].toLowerCase()){case"sum":m+=parseFloat(p);break;case"mean":n++,m+=parseFloat(p)}}switch(e[l].toLowerCase()){case"mean":m/=n}if(void 0!=f&&"object"==(typeof f).toLowerCase()){if(m=m.toFixed(g),void 0!=grabEBI(c[l]))switch(f[l].toLowerCase()){case"innerhtml":grabEBI(c[l]).innerHTML=m;break;case"setvalue":grabEBI(c[l]).value=m;break;case"createtextnode":var q=grabEBI(c[l]).firstChild,r=createText(m);grabEBI(c[l]).replaceChild(r,q)}}else try{grabEBI(c[l]).innerHTML=m.toFixed(g)}catch(s){}}}}}function grabEBI(a){return document.getElementById(a)}function grabTag(a,b){return a.querySelectorAll(b)}function regexpEscape(b){function c(c){a=new RegExp("\\"+c,"g"),b=b.replace(a,"\\"+c)}chars=new Array("\\","[","^","$",".","|","?","*","+","(",")");for(e in chars)c(chars[e]);return b}function createElm(a){var b=document.createElement(a);if(arguments.length>1)for(var c=0;c<arguments.length;c++){var d=typeof arguments[c];switch(d.toLowerCase()){case"object":2==arguments[c].length&&b.setAttribute(arguments[c][0],arguments[c][1])}}return b}function createText(a){return document.createTextNode(a)}function DetectKey(a){var b=a?a:window.event?window.event:null;if(b){var c=b.charCode?b.charCode:b.keyCode?b.keyCode:b.which?b.which:0;if("13"==c){var d,e,f;d=this.getAttribute("id"),e=this.getAttribute("id").split("_")[0],f=d.substring(e.length+1,d.length),t=grabEBI(f),t.tf_isModfilter_fn?t.tf_modfilter_fn.call():Filter(f)}}}function importScript(a,b){for(var c=!1,d=grabTag(document,"script"),e=0;e<d.length;e++)if(d[e].src.match(b)){c=!0;break}if(!c){var f=grabTag(document,"head")[0],g=createElm("script",["id",a],["type","text/javascript"],["src",b]);f.appendChild(g)}}function TF_GetFilterIds(){try{return TblId}catch(a){alert("TF_GetFilterIds() fn: could not retrieve any ids")}}function TF_HasGrid(a){return hasGrid(a)}function TF_GetFilters(a){try{var b=getFilters(a);return b}catch(c){alert("TF_GetFilters() fn: table id not found")}}function TF_GetStartRow(a){try{var b=grabEBI(a);return b.tf_ref_row}catch(c){alert("TF_GetStartRow() fn: table id not found")}}function TF_GetColValues(a,b,c){return hasGrid(a)?getColValues(a,b,c):void alert("TF_GetColValues() fn: table id not found")}function TF_Filter(a){grabEBI(a);TF_HasGrid(a)?Filter(a):alert("TF_Filter() fn: table id not found")}function TF_RemoveFilterGrid(a){if(TF_HasGrid(a)){var b=grabEBI(a);clearFilters(a),null!=grabEBI("inf_"+a)&&b.parentNode.removeChild(b.previousSibling);for(var c=grabTag(b,"tr"),d=0;d<c.length;d++){c[d].style.display="";try{c[d].hasAttribute("validRow")&&c[d].removeAttribute("validRow")}catch(e){for(var f=0;f<c[d].attributes.length;f++)"validrow"==c[d].attributes[f].nodeName.toLowerCase()&&c[d].removeAttribute("validRow")}}if(b.tf_alternateBgs)for(var g=0;g<c.length;g++)c[g].className="";b.tf_fltGrid&&b.deleteRow(0);for(i in TblId)a==TblId[i]&&TblId.splice(i,1)}else alert("TF_RemoveFilterGrid() fn: table id not found")}function TF_ClearFilters(a){TF_HasGrid(a)?clearFilters(a):alert("TF_ClearFilters() fn: table id not found")}function TF_SetFilterValue(a,b,c){if(TF_HasGrid(a)){var d=getFilters(a);for(i in d)i==b&&(grabEBI(d[i]).value=c)}else alert("TF_SetFilterValue() fn: table id not found")}function setAutoComplete(a){function b(){for(var b=TF_GetFilters(a),c=0;c<b.length;c++)colValues.push("input"==grabEBI(b[c]).nodeName.toLowerCase()?getColValues(a,c):"");try{actb(grabEBI(b[0]),colValues[0])}catch(d){alert(e+" script may not be loaded")}}var c=grabEBI(a),d=c.tf_bindScript,e=(d.name,d.path);b()}var JSONP=function(){function a(a,b){var c=document.createElement("script"),d=!1;c.src=a,c.async=!0;var f=b||h.error;"function"==typeof f&&(c.onerror=function(b){f({url:a,event:b})}),c.onload=c.onreadystatechange=function(){d||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(d=!0,c.onload=c.onreadystatechange=null,c&&c.parentNode&&c.parentNode.removeChild(c))},e||(e=document.getElementsByTagName("head")[0]),e.appendChild(c)}function b(a){return encodeURIComponent(a)}function c(c,d,e,i){var j,k=-1===(c||"").indexOf("?")?"?":"&";i=i||h.callbackName||"callback";var l=i+"_json"+ ++f;d=d||{};for(j in d)d.hasOwnProperty(j)&&(k+=b(j)+"="+b(d[j])+"&");return g[l]=function(a){e(a);try{delete g[l]}catch(b){}g[l]=null},a(c+k+i+"="+l),l}function d(a){h=a}var e,f=0,g=this,h={};return{get:c,init:d}}(),stIsIE=!1;if(sorttable={init:function(){arguments.callee.done||(arguments.callee.done=!0,_timer&&clearInterval(_timer),document.createElement&&document.getElementsByTagName&&(sorttable.DATE_RE=/^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/,forEach(document.getElementsByTagName("table"),function(a){-1!=a.className.search(/\bsortable\b/)&&sorttable.makeSortable(a)})))},makeSortable:function(a){if(0==a.getElementsByTagName("thead").length&&(the=document.createElement("thead"),the.appendChild(a.rows[0]),a.insertBefore(the,a.firstChild)),null==a.tHead&&(a.tHead=a.getElementsByTagName("thead")[0]),1==a.tHead.rows.length){sortbottomrows=[];for(var b=0;b<a.rows.length;b++)-1!=a.rows[b].className.search(/\bsortbottom\b/)&&(sortbottomrows[sortbottomrows.length]=a.rows[b]);if(sortbottomrows){null==a.tFoot&&(tfo=document.createElement("tfoot"),a.appendChild(tfo));for(var b=0;b<sortbottomrows.length;b++)tfo.appendChild(sortbottomrows[b]);delete sortbottomrows}headrow=a.tHead.rows[0].cells;for(var b=0;b<headrow.length;b++)headrow[b].className.match(/\bsorttable_nosort\b/)||(mtch=headrow[b].className.match(/\bsorttable_([a-z0-9]+)\b/),mtch&&(override=mtch[1]),headrow[b].sorttable_sortfunction=mtch&&"function"==typeof sorttable["sort_"+override]?sorttable["sort_"+override]:sorttable.guessType(a,b),headrow[b].sorttable_columnindex=b,headrow[b].sorttable_tbody=a.tBodies[0],dean_addEvent(headrow[b],"click",sorttable.innerSortFunction=function(){if(-1!=this.className.search(/\bsorttable_sorted\b/))return sorttable.reverse(this.sorttable_tbody),this.className=this.className.replace("sorttable_sorted","sorttable_sorted_reverse"),this.removeChild(document.getElementById("sorttable_sortfwdind")),sortrevind=document.createElement("span"),sortrevind.id="sorttable_sortrevind",sortrevind.innerHTML=stIsIE?'&nbsp<font face="webdings">5</font>':"&nbsp;&#x25B4;",void this.appendChild(sortrevind);if(-1!=this.className.search(/\bsorttable_sorted_reverse\b/))return sorttable.reverse(this.sorttable_tbody),this.className=this.className.replace("sorttable_sorted_reverse","sorttable_sorted"),this.removeChild(document.getElementById("sorttable_sortrevind")),sortfwdind=document.createElement("span"),sortfwdind.id="sorttable_sortfwdind",sortfwdind.innerHTML=stIsIE?'&nbsp<font face="webdings">6</font>':"&nbsp;&#x25BE;",void this.appendChild(sortfwdind);theadrow=this.parentNode,forEach(theadrow.childNodes,function(a){1==a.nodeType&&(a.className=a.className.replace("sorttable_sorted_reverse",""),a.className=a.className.replace("sorttable_sorted",""))}),sortfwdind=document.getElementById("sorttable_sortfwdind"),sortfwdind&&sortfwdind.parentNode.removeChild(sortfwdind),sortrevind=document.getElementById("sorttable_sortrevind"),sortrevind&&sortrevind.parentNode.removeChild(sortrevind),this.className+=" sorttable_sorted",sortfwdind=document.createElement("span"),sortfwdind.id="sorttable_sortfwdind",sortfwdind.innerHTML=stIsIE?'&nbsp<font face="webdings">6</font>':"&nbsp;&#x25BE;",this.appendChild(sortfwdind),row_array=[],col=this.sorttable_columnindex,rows=this.sorttable_tbody.rows;for(var a=0;a<rows.length;a++)row_array[row_array.length]=[sorttable.getInnerText(rows[a].cells[col]),rows[a]];row_array.sort(this.sorttable_sortfunction),tb=this.sorttable_tbody;for(var a=0;a<row_array.length;a++)tb.appendChild(row_array[a][1]);delete row_array}))}},guessType:function(a,b){sortfn=sorttable.sort_alpha;for(var c=0;c<a.tBodies[0].rows.length;c++)if(text=sorttable.getInnerText(a.tBodies[0].rows[c].cells[b]),""!=text){if(text.match(/^-?[�$�]?[\d,.]+%?$/))return sorttable.sort_numeric;if(possdate=text.match(sorttable.DATE_RE)){if(first=parseInt(possdate[1]),second=parseInt(possdate[2]),first>12)return sorttable.sort_ddmm;if(second>12)return sorttable.sort_mmdd;sortfn=sorttable.sort_ddmm}}return sortfn},getInnerText:function(a){if(!a)return"";if(hasInputs="function"==typeof a.getElementsByTagName&&a.getElementsByTagName("input").length,null!=a.getAttribute("sorttable_customkey"))return a.getAttribute("sorttable_customkey");if("undefined"!=typeof a.textContent&&!hasInputs)return a.textContent.replace(/^\s+|\s+$/g,"");if("undefined"!=typeof a.innerText&&!hasInputs)return a.innerText.replace(/^\s+|\s+$/g,"");if("undefined"!=typeof a.text&&!hasInputs)return a.text.replace(/^\s+|\s+$/g,"");switch(a.nodeType){case 3:if("input"==a.nodeName.toLowerCase())return a.value.replace(/^\s+|\s+$/g,"");case 4:return a.nodeValue.replace(/^\s+|\s+$/g,"");case 1:case 11:for(var b="",c=0;c<a.childNodes.length;c++)b+=sorttable.getInnerText(a.childNodes[c]);return b.replace(/^\s+|\s+$/g,"");default:return""}},reverse:function(a){newrows=[];for(var b=0;b<a.rows.length;b++)newrows[newrows.length]=a.rows[b];for(var b=newrows.length-1;b>=0;b--)a.appendChild(newrows[b]);delete newrows},sort_numeric:function(a,b){return aa=parseFloat(a[0].replace(/[^0-9.-]/g,"")),isNaN(aa)&&(aa=0),bb=parseFloat(b[0].replace(/[^0-9.-]/g,"")),isNaN(bb)&&(bb=0),aa-bb},sort_alpha:function(a,b){return a[0]==b[0]?0:a[0]<b[0]?-1:1},sort_ddmm:function(a,b){return mtch=a[0].match(sorttable.DATE_RE),y=mtch[3],m=mtch[2],d=mtch[1],1==m.length&&(m="0"+m),1==d.length&&(d="0"+d),dt1=y+m+d,mtch=b[0].match(sorttable.DATE_RE),y=mtch[3],m=mtch[2],d=mtch[1],1==m.length&&(m="0"+m),1==d.length&&(d="0"+d),dt2=y+m+d,dt1==dt2?0:dt2>dt1?-1:1},sort_mmdd:function(a,b){return mtch=a[0].match(sorttable.DATE_RE),y=mtch[3],d=mtch[2],m=mtch[1],1==m.length&&(m="0"+m),1==d.length&&(d="0"+d),dt1=y+m+d,mtch=b[0].match(sorttable.DATE_RE),y=mtch[3],d=mtch[2],m=mtch[1],1==m.length&&(m="0"+m),1==d.length&&(d="0"+d),dt2=y+m+d,dt1==dt2?0:dt2>dt1?-1:1},shaker_sort:function(a,b){for(var c=0,d=a.length-1,e=!0;e;){e=!1;for(var f=c;d>f;++f)if(b(a[f],a[f+1])>0){var g=a[f];a[f]=a[f+1],a[f+1]=g,e=!0}if(d--,!e)break;for(var f=d;f>c;--f)if(b(a[f],a[f-1])<0){var g=a[f];a[f]=a[f-1],a[f-1]=g,e=!0}c++}}},document.addEventListener&&document.addEventListener("DOMContentLoaded",sorttable.init,!1),/WebKit/i.test(navigator.userAgent))var _timer=setInterval(function(){/loaded|complete/.test(document.readyState)&&sorttable.init()},10);window.onload=sorttable.init,dean_addEvent.guid=1,fixEvent.preventDefault=function(){this.returnValue=!1},fixEvent.stopPropagation=function(){this.cancelBubble=!0},Array.forEach||(Array.forEach=function(a,b,c){for(var d=0;d<a.length;d++)b.call(c,a[d],d,a)}),Function.prototype.forEach=function(a,b,c){for(var d in a)"undefined"==typeof this.prototype[d]&&b.call(c,a[d],d,a)},String.forEach=function(a,b,c){Array.forEach(a.split(""),function(d,e){b.call(c,d,e,a)})};var forEach=function(a,b,c){if(a){var d=Object;if(a instanceof Function)d=Function;else{if(a.forEach instanceof Function)return void a.forEach(b,c);"string"==typeof a?d=String:"number"==typeof a.length&&(d=Array)}d.forEach(a,b,c)}},TblId,SearchFlt,SlcArgs;TblId=new Array,SlcArgs=new Array;var colValues=new Array,shindig=function(){function a(){var a=a?a:event?event:null,b=a.target?a.target:a.srcElement?a.srcElement:null;return 13==a.keyCode&&"submit"!=b.type?!1:void 0}function b(a,b){var c,d;c=document.createElement("td"),d=document.createElement("a"),d.href=b.link_url,d.target="postTarget",d.innerHTML="Delete",c.appendChild(d),a.appendChild(c)}function c(a){var b=new Date,c=new Date(a.target.value);a.target.setCustomValidity(c>b.addMonths(6)?"Please pick a date less than 6 months from now ("+(new Date).toString()+").":"")}function d(a){a=a?a:window.event;var b=a.target?a.target:a.srcElement,c=!0;if(h.checked){var d=b.querySelector('[name="days_of_the_week"]:checked');if(!d){c=!1;var e=b.querySelector(".days-of-week-error");e.classList.remove("hidden")}}if(c){var f=b.querySelector("#subheading").value,g=b.querySelector('[name="event_type"]:checked').value;TF_SetFilterValue("event-table",0,g+" - "+f),TF_SetFilterValue("event-table",1,b.querySelector("#description").value)}else a.preventDefault&&a.preventDefault();return c}var e,f,g=document.getElementById("shindig-signup"),h=g.querySelector("#RecurringEvent"),i=g.querySelectorAll("[type=date]");if(g){var j=document.createElement("a");j.href=g.action,f=j.host}for(Date.prototype.addMonths=function(a){var b=this.getDate();return this.setMonth(this.getMonth()+a),this.getDate()<b&&(this.setDate(1),this.setDate(this.getDate()-1)),this},e=i.length;e--;)i[e].addEventListener("input",c);return document.getElementById("startdate").value=(new Date).toISOString().slice(0,10),g.onsubmit=d,g.onkeypress=a,{host:f,path:"readevents",buildLink:b}}();!function(){"use strict";console.log("Welcome to Shindig!");var a,b,c,d,e,f,g;g=!0,f="webcal://"+shindig.host+"/createical?eid=",a=document.getElementById("postTarget"),a&&(a.onload=function(){if(g)g=!1;else{console.log("getting events"),c();var a=document.getElementById("s3");a&&(a.checked=!0)}});for(var h in shindig_defaults)shindig_defaults.hasOwnProperty(h)&&(b=document.getElementById(h),b&&(b.value=shindig_defaults[h]));JSONP.init({error:function(a){alert("Failed to load : "+a.url)}}),e=function(a,b){var c;return c=document.createElement("td"),c.innerHTML=b,a.appendChild(c),c},d=function(a){var b,c=document.getElementById("event-list"),d=a.length||0,h=null,i=null;if(g=!1,c.innerHTML="",c&&a&&d>0){console.log("populating event list.");for(var j=0;d>j;j++){var k,b,l,m,n,o;h=a[j],l=new Date,m=new Date(h.start),k=m.toDateString();try{b=m.toISOString().slice(0,10)}catch(p){b=p.message}try{m=m.toLocaleTimeString()}catch(p){m=p.message}n=new Date(h.end),n=n.toLocaleTimeString(),i=document.createElement("tr"),i.className+="event-type "+h.event_type,e(i,h.event_type+" - "+h.subheading+'<a href="'+f+h.eid+'" title="Click to add to Calendar"><i class="icon-calendar"></i></a>'),e(i,h.description),o=e(i,k),o.setAttribute("sorttable_customkey",b),e(i,m),e(i,n),shindig.buildLink(i,h),c.appendChild(i)}}document.querySelector(".fltrow")?TF_Filter("event-table"):window.setTimeout(function(){setFilterGrid("event-table"),TF_Filter("event-table")},100)},(c=function(){var a,b;a=document.getElementById("institution").value,b=document.getElementById("course").value,JSONP.get("//"+shindig.host+"/"+shindig.path+"/",{institution:a,course:b},d)})()}();
}