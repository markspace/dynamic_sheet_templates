/*
* This is the javascript specific to the laundry DST
*/

// Global Storage
laundry_context = {};
var $ = jQuery

var laundry_default_values = {

    "cthulhu_sanity": "99",

    "skill_appraise": "15",
    "skill_art1": "5",
    "skill_art2": "5",
    "skill_athletics": "10",
    "skill_bargain": "5",
    "skill_bureaucracy": "5",
    "skill_climb": "40",
    "skill_command": "5",
    "skill_computer_use1": "5",
    "skill_computer_use2": "5",
    "skill_computer_use3": "5",
    "skill_computer_use4": "5",
    "skill_craft1": "5",
    "skill_craft2": "5",
    "skill_cthulhu_mythos": "0",
    "skill_demolition": "1",
    "skill_disguise": "5",
    "skill_drive1": "20",
    "skill_drive2": "20",
    "skill_etiquette": "5",
    "skill_fast_talk": "5",
    "skill_fine_manipulation": "5",
    "skill_first_aid": "30",
    "skill_gaming": "10",
    "skill_grapple": "25",
    "skill_heavy_machine": "5",
    "skill_hide": "10",
    "skill_insight": "5",
    "skill_jump": "25",
    "skill_knowledge_accounting": "10",
    "skill_knowledge_espionage": "0",
    "skill_knowledge_law": "5",
    "skill_knowledge_occult": "5",
    "skill_knowledge_politics": "5",
    "skill_knowledge1": "0",
    "skill_listen": "25",
    "skill_medicine": "5",
    "skill_navigate": "10",
    "skill_perform": "5",
    "skill_persuade": "15",
    "skill_pilot1": "0",
    "skill_pilot2": "0",
    "skill_psychotherapy": "0",
    "skill_repair1" : "15",
    "skill_repair2" : "15",
    "skill_repair3" : "15",
    "skill_research": "25",
    "skill_ride": "5",
    "skill_science1": "0",
    "skill_science2": "0",
    "skill_science3": "0",
    "skill_sense": "10",
    "skill_skill_sleight_of_hand": "5",
    "skill_skill_sorcery": "0",
    "skill_spot": "25",
    "skill_status": "15",
    "skill_stealth": "10",
    "skill_strategy": "0",
    "skill_swim": "25",
    "skill_teach": "10",
    "skill_technology_use1": "5",
    "skill_technology_use2": "5",
    "skill_track": "10",

    "weapon1_name": "Fist",
    "weapon1_percent": "50",
    "weapon1_damage": "1D3+db",
    "weapon1_malfunction": "n/a",
    "weapon1_hands": "1",
    "weapon1_range": "touch",
    "weapon1_num_attack": "1",
    "weapon1_shots": "n/a",
    "weapon1_hitpoints": "n/a",

    "weapon2_name": "Grapple",
    "weapon2_percent": "25",
    "weapon2_damage": "special",
    "weapon2_malfunction": "n/a",
    "weapon2_hands": "2",
    "weapon2_range": "touch",
    "weapon2_num_attack": "1",
    "weapon2_shots": "n/a",
    "weapon2_hitpoints": "n/a",

    "weapon3_name": "Head",
    "weapon3_percent": "10",
    "weapon3_damage": "1D4+db",
    "weapon3_malfunction": "n/a",
    "weapon3_hands": "0",
    "weapon3_range": "touch",
    "weapon3_num_attack": "1",
    "weapon3_shots": "n/a",
    "weapon3_hitpoints": "n/a",

    "weapon4_name": "Kick",
    "weapon4_percent": "25",
    "weapon4_damage": "1D6+db",
    "weapon4_malfunction": "n/a",
    "weapon4_hands": "0",
    "weapon4_range": "touch",
    "weapon4_num_attack": "1",
    "weapon4_shots": "n/a",
    "weapon4_hitpoints": "n/a",

};

function laundry_dataPreLoad(opts) {
    $.fn.editable.defaults['onblur'] = 'submit';

    aisleten.characters.jeditablePlaceholder = "__";

    // Called just before the data is loaded.
    var tempData = {};
    for (var val in laundry_default_values)
    {
        tempData[val] = laundry_default_values[val];
    }
    for (var val in dynamic_sheet_attrs)
    {
        tempData[val] = dynamic_sheet_attrs[val];
    }

    dynamic_sheet_attrs = tempData;
}

function laundry_dataPostLoad(opts) {

    var containerId = "#" + opts['containerId'];
    laundry_context = document.getElementById(opts['containerId']);
    opts['context'] = document.getElementById(opts['containerId']);

    //Convert interface elements
    laundry_convertAreas(opts);


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
    laundry_derivedStats();
    laundry_calculateSanity();
}

function laundry_dataChange(opts) {

    var field = opts['fieldName'];
    var val = opts['fieldValue'];

    if (field.indexOf("skill") != -1) {
        if (field == 'skill_cthulhu_mythos') {
            laundry_calculateSanity(val);
        }
    } else {
        laundry_derivedStats();
    }

}

function laundry_dataPreSave(opts) {
    opts['context'] = document.getElementById(opts['containerId']);
    laundry_unconvertAreas(opts);
    var containerId = "#" + opts['containerId'];
}

function laundry_derivedStats() {
    laundry_calculateDamageBonus();
    laundry_calculateHP();
    var strength = laundry_getInt(jQuery('.dsf_str').html());
    var constitution = laundry_getInt(jQuery('.dsf_con').html());
    var size = laundry_getInt(jQuery('.dsf_siz').html());
    var intelligence = laundry_getInt(jQuery('.dsf_int').html());
    var dexterity = laundry_getInt(jQuery('.dsf_dex').html());
    var power = laundry_getInt(jQuery('.dsf_pow').html());
    var charisma = laundry_getInt(jQuery('.dsf_cha').html());
    var education = laundry_getInt(jQuery('.dsf_edu').html());

    var effort = Math.min(strength * 5, 99);
    jQuery('.dsf_effort').html(effort);
    var endurance = Math.min(constitution * 5, 99);
    jQuery('.dsf_endurance').html(endurance);
    var idea = Math.min(intelligence * 5, 99);
    jQuery('.dsf_idea').html(idea);
    var exp_bonus = Math.ceil(intelligence/2);
    jQuery('.dsf_exp_bonus').html(exp_bonus);
    var agility = Math.min(dexterity * 5, 99);
    jQuery('.dsf_agility').html(agility);
    var dodge = parseInt(jQuery('.dsf_skill_dodge').html());
    if (isNaN(dodge) || dodge < (dexterity * 2)) {
        dodge = dexterity * 2;
        jQuery('.dsf_skill_dodge').html(dodge);
    }
    var luck = Math.min(power * 5, 99);
    jQuery('.dsf_luck').html(luck);
    var influence = Math.min(charisma * 5, 99);
    jQuery('.dsf_influence').html(influence);
    var know = Math.min(education * 5, 99);
    jQuery('.dsf_know').html(know);

    var ownLanguage = parseInt(jQuery('.dsf_skill_own_language').html());
    if (isNaN(ownLanguage) || ownLanguage < know) {
        ownLanguage = know;
        jQuery('.dsf_skill_own_language').html(ownLanguage);
    }
    laundry_calculateSanity();
}

function laundry_getInt(val) {
    var score = parseInt(val);
    if (isNaN(score)) score = 0;
    return score;
}


function laundry_calculateDamageBonus()
{
    var str = parseInt(jQuery('.dsf_str').html());
    var siz = parseInt(jQuery('.dsf_siz').html());

    var dmgBonus = str + siz;
    var bonusText;

    if (isNaN(dmgBonus)) {
        bonusText = '0';
    } else if (dmgBonus <= 12) {
        bonusText = '-1D6';
    } else if (dmgBonus <= 16) {
        bonusText = '-1D4';
    } else if (dmgBonus <= 24) {
        bonusText = '0';
    } else if (dmgBonus <= 32) {
        bonusText = '+1D4';
    } else {
        var total = dmgBonus - 24;
        total /= 16;
        total = Math.ceil(total);

        bonusText = '+' + total + 'D6';
    }
    jQuery('.dsf_damage_bonus').html(bonusText);
}

function laundry_calculateSanity() {
    var score = laundry_getInt(jQuery('.dsf_skill_cthulhu_mythos').html());

    var cthulhuSanity = 99 - score;
    var luck = Math.min(parseInt(jQuery('.dsf_pow').html()) * 5, 99);

    var maxSanity = Math.min(cthulhuSanity, luck);
    if (!isNaN(maxSanity)) {
        jQuery('.dsf_maximum_sanity').html(maxSanity);

        var initialSanity = parseInt(jQuery('.dsf_initial_sanity').html());
        if (isNaN(initialSanity)) {
            jQuery('.dsf_initial_sanity').html(luck);
        }
        var currentSanity = parseInt(jQuery('.dsf_current_sanity').html());
        if (isNaN(currentSanity)) {
            jQuery('.dsf_current_sanity').html(maxSanity);
        }
    }
}

function laundry_calculateHP() {
    var con = parseInt(jQuery('.dsf_con').html());
    var siz = parseInt(jQuery('.dsf_siz').html());

    var hp = Math.ceil((con + siz) / 2);
    var majorwound = Math.ceil(hp / 2);
    if (!isNaN(hp)) {
        jQuery('.dsf_maximum_hitpoints').html(hp);
        jQuery('.dsf_major_wound').html(majorwound);
        var currentHP = parseInt(jQuery('.dsf_current_hitpoints').html());
        if (isNaN(currentHP)) {
            jQuery('.dsf_current_hitpoints').html(hp);
        }
    }
}


function laundry_area(oElement,opts){

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
        var aAreas = laundry_getElementsByClassName('area','span');
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
        this.innerHTML = '<textarea class=laundry_textarea "' + sClasses + '" style="width:' + iWidth + 'px;height:' + iHeight + 'px;">' + sText + '</textarea>';

        var focusRef = function(){$('.laundry_textarea').focus();};
        var submitRef = function(){$('.laundry_textarea').parent().submit();};
        var unfocusRef = function(){$('.laundry_textarea').blur(submitRef)};

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
function laundry_convertAreas(opts){

    // Find all the spans on the page with "area" in their class name
    if (opts['context']) var aSpans = opts['context'].getElementsByTagName('span');
    else var aSpans = document.getElementsByTagName('span');

    var taTemp = {};
    for (var i = 0; i < aSpans.length; i++){
        if (aSpans[i].className.match(/area/)){

            // Convert each element to a full featured area object
            taTemp = laundry_area(aSpans[i],opts);
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
function laundry_unconvertAreas(opts){

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
function laundry_getElementsByClassName(sClassName,sElementType){

    // Provide default element type
    if (!sElementType) sElementType = 'div';

    var aList = new Array();
    var aDivs = laundry_context.getElementsByTagName(sElementType);
    for (var i = 0; i < aDivs.length; i++){
        if (aDivs[i].className.match(sClassName)) aList[aList.length] = aDivs[i];
    }
    return aList;

}

