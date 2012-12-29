/*
* This is the javascript specific to the laundry DST
*/

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

// Make sure that the sidebar is the same height as the main
// page split. This has to be done once all of the values are filled
// in to the page. So, doing this on the Post Load event is just a
// little bit too soon.
jQuery(document).ready(laundry_resizeSidebar);

function laundry_dataPreLoad(options) {

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

function laundry_dataPostLoad(options) {

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
}

function laundry_dataChange(options) {

    var field = options['fieldName'];
    var val = options['fieldValue'];

    if (field.indexOf("skill") != -1) {
        if (field == 'skill_cthulhu_mythos') {
            laundry_updateCthulhuMythos(val);
        }
    } else {
        if (field == 'str') {
            laundry_updateStrength(val);
        } else if (field == 'con') {
            laundry_updateConstitution(val);
        } else if (field == 'siz') {
            laundry_updateSize();
        } else if (field == 'int') {
            laundry_updateIntelligence(val);
        } else if (field == 'dex') {
            laundry_updateDexterity(val);
        } else if (field == 'pow') {
            laundry_updatePower(val);
        } else if (field == 'cha') {
            laundry_updateCharisma(val);
        } else if (field == 'edu') {
            laundry_updateEducation(val);
        }
    }

    laundry_resizeSidebar();
}

function laundry_dataPreSave(options) {
    // Called just before the data is saved to the server.
}

function laundry_updateStrength(strength) {
    laundry_calculateDamageBonus();
    var score = parseInt(strength);
    if (isNaN(score)) score == 0;
    var effort = Math.min(score * 5, 99);
    jQuery('.dsf_effort').html(effort);
}

function laundry_updateConstitution(constitution) {
    laundry_calculateHP();
    var score = parseInt(constitution);
    if (isNaN(score)) score == 0;
    var endurance = Math.min(score * 5, 99);
    jQuery('.dsf_endurance').html(endurance);
}

function laundry_updateSize(size) {
    laundry_calculateDamageBonus();
    laundry_calculateHP();
}

function laundry_updateIntelligence(intelligence) {
    var score = parseInt(intelligence);
    if (isNaN(score)) score = 0;

    var idea = Math.min(score * 5, 99);
    jQuery('.dsf_idea').html(idea);
}

function laundry_updateDexterity(dexterity) {
    var score = parseInt(dexterity);
    if (isNaN(score)) score == 0;

    var dodge = parseInt(jQuery('.dsf_skill_dodge').html());
    if (isNaN(dodge) || dodge < (score * 2)) {
        dodge = score * 2;
        jQuery('.dsf_skill_dodge').html(dodge);
    }
    var agility = Math.min(score * 5, 99);
    jQuery('.dsf_agility').html(agility);
}

function laundry_updatePower(power) {
    var score = parseInt(power);
    if (isNaN(score)) score = 0;

    var luck = Math.min(score * 5, 99);
    jQuery('.dsf_luck').html(luck);

    var san = luck;
    jQuery('.dsf_san').html(san);

    laundry_calculateMaximumSanity();
    laundry_calculateMaximumMagic();
}

function laundry_updateCharisma(charisma) {
    var score = parseInt(charisma);
    if (isNaN(score)) score = 0;

    var influence = Math.min(score * 5, 99);
    jQuery('.dsf_influence').html(influence);
}

function laundry_updateEducation(education) {
    var score = parseInt(education);
    if (isNaN(score)) score = 0;

    var know = Math.min(score * 5, 99);
    jQuery('.dsf_know').html(know);

    var ownLanguage = parseInt(jQuery('.dsf_skill_own_language').html());
    if (isNaN(ownLanguage) || ownLanguage < know) {
        ownLanguage = know;
        jQuery('.dsf_skill_own_language').html(ownLanguage);
    }
}

function laundry_updateCthulhuMythos(cthulhuMythosValue) {
    var score = parseInt(cthulhuMythosValue);
    if (isNaN(score)) score = 0;

    var cthulhuSanity = 99 - score;
    jQuery('.dsf_cthulhu_sanity').html(cthulhuSanity);

    laundry_calculateMaximumSanity();
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

function laundry_calculateMaximumSanity() {
    var cthulhuSanity = parseInt(jQuery('.dsf_cthulhu_sanity').html());
    var luck = Math.min(parseInt(jQuery('.dsf_pow').html()) * 5, 99);

    var maxSanity = Math.min(cthulhuSanity, luck);
    if (!isNaN(maxSanity)) {
        jQuery('.dsf_maximum_sanity').html(maxSanity);

        var currentSanity = parseInt(jQuery('.dsf_current_sanity').html());
        if (isNaN(currentSanity)) {
            jQuery('.dsf_current_sanity').html(maxSanity);
        }
    }
}

function laundry_calculateMaximumMagic() {
    var score = parseInt(jQuery('.dsf_pow').html());
    
    if (!isNaN(score)) {
        jQuery('.dsf_maximum_magic').html(score);

        var currentMagic = parseInt(jQuery('.dsf_current_magic').html());
        if (isNaN(currentMagic)) {
            jQuery('.dsf_current_magic').html(score);
        }
    }
}

function laundry_calculateHP() {
    var con = parseInt(jQuery('.dsf_con').html());
    var siz = parseInt(jQuery('.dsf_siz').html());

    var hp = Math.ceil((con + siz) / 2);
    if (!isNaN(hp)) {
        jQuery('.dsf_maximum_hitpoints').html(hp);

        var currentHP = parseInt(jQuery('.dsf_current_hitpoints').html());
        if (isNaN(currentHP)) {
            jQuery('.dsf_current_hitpoints').html(hp);
        }
    }
}

function laundry_resizeSidebar() {
    var page1split = jQuery('.coc_page1_split');
    var page1splitHeight = page1split.height() + 'px';

    jQuery('.coc_sidebar').css("height", page1splitHeight);
}

function laundry_yearChanged(yearSelect) {
    var year = yearSelect.options[yearSelect.selectedIndex].value;
    jQuery('.dsf_year').html(year);

    laundry_showCorrectSkillPage(year);
}

function laundry_showCorrectSkillPage(year) {
    var skill1890 = '.coc_year_1890';
    var skill1920 = '.coc_year_1920';
    var skillPresent = '.coc_year_present';
    var skillYear = '.coc_year_' + year;

    jQuery(skill1890).addClass('coc_hidden');
    jQuery(skill1920).addClass('coc_hidden');
    jQuery(skillPresent).addClass('coc_hidden');
    jQuery(skillYear).removeClass('coc_hidden');

    var range1_1890 = 30;
    var range1_1920 = 30;
    var range1_present = 28;
    var range2_1890 = 61;
    var range2_1920 = 59;
    var range2_present = 57;

    var range1lt = (year == '1920') ? range1_1920 : (year == 'present') ? range1_present : range1_1890;
    var range2lt = (year == '1920') ? range2_1920 : (year == 'present') ? range2_present : range2_1890;

    var wrapDiv = '<div class="column"></div>';
    var avatarImageDiv = '<div class="coc_character_image">';
    avatarImageDiv += jQuery('.coc_character_image').html();
    avatarImageDiv += '</div>';

    jQuery('.coc_character_image').remove();
    jQuery('.coc_skill_item').unwrap();
    jQuery('.coc_skill_item').slice(0, range1lt).wrapAll(wrapDiv);
    jQuery('.coc_skill_item').slice(range1lt, range2lt).wrapAll(wrapDiv);
    jQuery('.coc_skill_item').slice(range2lt).wrapAll(wrapDiv);
    jQuery('.coc_skill_item').slice(range2lt, range2lt + 1).before(avatarImageDiv);
}

