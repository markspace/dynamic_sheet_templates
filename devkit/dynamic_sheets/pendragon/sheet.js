/*
* This is the javascript specific to the pendragon DST 
* by Mark Davidson
*
* Lots of ideas from Langy and ChainsawXIV
*/

// Global Storage
pendragon_context = {};
var $ = jQuery

var pendragon_default_values = {


  "passion_loyalty_lord" : "15",
  "passion_love_family" : "15",
  "passion_hospitality" : "15",
  "passion_honor" : "15",

  "equipment_carried" : "Armour XX points",

  "skill_awareness" : "5",
  "skill_boating" : "1",
  "skill_compose" : "1",
  "skill_courtesy" : "3",
  "skill_dancing" : "2",
  "skill_faerie_lore" : "1",
  "skill_falconry" : "3",
  "skill_first_aid" : "10",
  "skill_flirting" : "3",
  "skill_folklore" : "2",
  "skill_gaming" : "3",
  "skill_heraldry" : "3",
  "skill_hunting" : "2",
  "skill_intrigue" : "3",
  "skill_orate" : "3",
  "skill_play1_name" : "Play __",
  "skill_play1" : "3",
  "skill_read1_name" : "Read __",
  "skill_read1" : "0",
  "skill_recognize" : "3",
  "skill_religion1_name" : "Religion (__)",
  "skill_religion1" : "2",
  "skill_romance" : "2",
  "skill_singing" : "2",
  "skill_stewardship" : "2",
  "skill_swimming" : "2",
  "skill_tourney" : "2",

  "glory_this_game" : "",
  "glory" : "0",

  "combat_battle" : "10",
  "combat_horsemanship" : "10",
  "combat_sword" : "10",
  "combat_lance" : "10",
  "combat_spear" : "6",
  "combat_dagger" : "5",

  "squire_first_aid" : "6",
  "squire_battle" : "1",
  "squire_horsemanship" : "6",
};

function pendragon_dataPreLoad(opts) {
    $.fn.editable.defaults['onblur'] = 'submit';

    aisleten.characters.jeditablePlaceholder = "__";
    aisleten.characters.jeditableSubmit = '';

    // Called just before the data is loaded.
    var tempData = {};
    for (var val in pendragon_default_values)
    {
        tempData[val] = pendragon_default_values[val];
    }
    for (var val in dynamic_sheet_attrs)
    {
        tempData[val] = dynamic_sheet_attrs[val];
    }

    dynamic_sheet_attrs = tempData;
}

function pendragon_dataPostLoad(opts) {

    var containerId = "#" + opts['containerId'];
    pendragon_context = document.getElementById(opts['containerId']);
    opts['context'] = document.getElementById(opts['containerId']);

    //Convert interface elements
    pendragon_convertAreas(opts);


    // Modify the image attributes so that it is scaled to fit inside
    // the pre-allocated space on the character sheet
    var avatarImgActual = '.avatar_image';
    var avatarImg = jQuery(avatarImgActual);
    var width = avatarImg.width();
    var height = avatarImg.height();
    if (width > height) {
        jQuery(avatarImgActual).css("width", "100%");
    } else {
        jQuery(avatarImgActual).css("height", "100%");
    }
    pendragon_derivedStats();
}

function pendragon_dataChange(opts) {

    pendragon_derivedStats();

}

function pendragon_dataPreSave(opts) {
    opts['context'] = document.getElementById(opts['containerId']);
    pendragon_unconvertAreas(opts);
    var containerId = "#" + opts['containerId'];
}

function pendragon_derivedStats() {
    var size = pendragon_getInt(jQuery('.dsf_siz').html());
    var dexterity = pendragon_getInt(jQuery('.dsf_dex').html());
    var strength = pendragon_getInt(jQuery('.dsf_str').html());
    var constitution = pendragon_getInt(jQuery('.dsf_con').html());
    var appearance = pendragon_getInt(jQuery('.dsf_app').html());

    var damage = Math.round((strength+size)/6);
    jQuery('.dsf_damage').html(damage+'D6');
    var healing_rate = Math.round((strength+constitution)/10);
    jQuery('.dsf_healing_rate').html(healing_rate);
    var movement_rate = Math.round((strength+dexterity)/10);
    jQuery('.dsf_movement_rate').html(movement_rate);
    var total_hp = size+constitution;
    jQuery('.dsf_total_hp').html(total_hp);
    var unconscious = Math.round(total_hp/4);
    jQuery('.dsf_unconscious').html(unconscious);

}

function pendragon_getInt(val) {
    var score = parseInt(val);
    if (isNaN(score)) score = 0;
    return score;
}

function pendragon_area(oElement,opts){

    // Store opts
    oElement.setAttribute('optsIsEditable',opts['isEditable']);
    oElement.setAttribute('optsDebugThreshold',opts['debugThreshold']);

    // Attaches edit events to area text
    oElement.activate = function(){

        // Don't activate the element if we're not in edit mode
        if (this.getAttribute('optsIsEditable') != 'true') return;

        // Activate the element
        oElement.onclick = this.edit;

        // Add default value
        if (this.innerHTML == '') this.innerHTML = aisleten.characters.jeditablePlaceholder;

        // Set the element's alt text
        this.title = 'Edit';

        // Set the cursor for the item
        this.style.cursor = 'pointer';

    };

    // Converts the element to an editable area
    oElement.edit = function(){

        // Abort click function if we just clicked submit
        if(this.getAttribute('eventLock') == 'locked'){
            this.setAttribute('eventLock',null);
            return;
        }

        // Force submit any other area in the context
        var aAreas = pendragon_getElementsByClassName('area','span');
        for (var i = 0; i < aAreas.length; i++){
            if (aAreas[i].getAttribute('status') == 'editing') aAreas[i].submit();
        }

        // Set the editing flag
        this.setAttribute('status','editing');

        // Disable click functionality
        this.onclick = null;

        // Set cursor
        this.style.cursor = 'text';

        // Remove default
        if (this.innerHTML == aisleten.characters.jeditablePlaceholder) this.innerHTML = '';

        // Convert <br /> tags to line breaks
        var sText = this.innerHTML.replace(/<br>/g,'\n');

        // Select dimensions and classes
        var iWidth = this.offsetWidth + parseInt(this.getAttribute('widthMod'));
        var iHeight = this.offsetHeight + parseInt(this.getAttribute('heightMod')) + 60;
        var sClasses = this.getAttribute('areaClasses');

        // Convert content into form with button
        this.innerHTML = '<textarea class=pendragon_textarea "' + sClasses + '" style="width:' + iWidth + 'px;height:' + iHeight + 'px;">' + sText + '</textarea>';

        var focusRef = function(){$('.pendragon_textarea').focus();};
        var submitRef = function(){$('.pendragon_textarea').parent().submit();};
        var unfocusRef = function(){$('.pendragon_textarea').blur(submitRef)};

        this.focusTimeout = setTimeout(focusRef,50);
        this.unfocusTimeout = setTimeout(unfocusRef,60);
    };

    // Converts the edit box back into regular text form
    oElement.submit = function(){

        // Get the data from the edit box
        var sContent = this.getElementsByTagName('textarea')[0].value.replace(/\n/g,'<br>');

        // Remove the form elements
        this.innerHTML = sContent;

        // Reapply the default value if needed
        if (this.innerHTML == '') this.innerHTML = aisleten.characters.jeditablePlaceholder;

        // Lock out the click event until we're done
        this.setAttribute('eventLock','locked');

        // Automatically unlock after a twentieth of a second
        var submitRef = function(){oElement.setAttribute('eventLock',null);};
        this.timeout = setTimeout(submitRef,50);

        // Set pointer
        this.style.cursor = 'pointer';

        // Reattach the click functionality
        this.onclick = this.edit;

        // Reset the editing flag
        this.setAttribute('status',null);

        // Call the onUpdate event
        this.onUpdate();

    };

    // On Update event function, typicaly overriden
    oElement.onUpdate = function(){

    }

    // Error handling function - alerts on errors if bug reporting is on
    oElement.error = function(iImportance,sText){
        if (this.getAttribute('optsDebugThreshold')) var iThreshold = this.getAttribute('debugThreshold');
        else iThreshold = 0;
        if (iImportance < iThreshold){
            alert(sText);
        }
    }

    // Return the element for ease of refference
    return oElement;

}

// Converts all properly classed divs in the context to areas
function pendragon_convertAreas(opts){

    // Find all the spans on the page with "area" in their class name
    if (opts['context']) var aSpans = opts['context'].getElementsByTagName('span');
    else var aSpans = document.getElementsByTagName('span');

    var taTemp = {};
    for (var i = 0; i < aSpans.length; i++){
        if (aSpans[i].className.match(/area/)){

            // Convert each element to a full featured area object
            taTemp = pendragon_area(aSpans[i],opts);
            taTemp.activate();

            // Load up custom parameters and such depending on class
            if (aSpans[i].className.match('is_tooltip')){
                taTemp.setAttribute('widthMod',-9);
                taTemp.setAttribute('heightMod',-9);
                taTemp.setAttribute('areaClasses','area tip_area');
                taTemp.onUpdate = function(){
                    oParent = this.parentNode;
                    oParent.setAttribute("editLock","unlocked");
                    oParent.mouseOut();
                };
            }
            else{
                taTemp.setAttribute('widthMod',-23);
                taTemp.setAttribute('heightMod',-6);
                taTemp.setAttribute('areaClasses','area');
            }

        }
    }

}

// Sets the necesary class name on areas for them to be saved
function pendragon_unconvertAreas(opts){

    // Find all the spans on the page with "area" in their class name
    if (opts['context']) var aSpans = opts['context'].getElementsByTagName('span');
    else var aSpans = document.getElementsByTagName('span');

    // Add the necesary save key to the class name
    // Also close out any active edit boxes
    for (var i = 0; i < aSpans.length; i++){
        if (aSpans[i].className.match(/area/)){
            //if (aSpans[i].innerHTML.match(/textarea/)) aSpans[i].submit();
            if (aSpans[i].innerHTML == aisleten.characters.jeditablePlaceholder) aSpans[i].innerHTML = '';
        }
    }
}


////////////////////////////////////////////////////////
// General Utility Functions :: Credit to ChainsawXIV //
////////////////////////////////////////////////////////

// Gets an array of elements with a particular class from the context
function pendragon_getElementsByClassName(sClassName,sElementType){

    // Provide default element type
    if (!sElementType) sElementType = 'div';

    var aList = new Array();
    var aDivs = pendragon_context.getElementsByTagName(sElementType);
    for (var i = 0; i < aDivs.length; i++){
        if (aDivs[i].className.match(sClassName)) aList[aList.length] = aDivs[i];
    }
    return aList;

}

