// Set speed options
var speedInput1 = document.getElementById('speedInput1');
var speedInput2 = document.getElementById('speedInput2');
var speedInput3 = document.getElementById('speedInput3');
var speedInput4 = document.getElementById('speedInput4');
var speedInput5 = document.getElementById('speedInput5');
var speedInput6 = document.getElementById('speedInput6');
var speedInput7 = document.getElementById('speedInput7');
var speedInput8 = document.getElementById('speedInput8');

// Set shortcuts
var shortCut1 = document.getElementById('shortCut1');
var shortCut2 = document.getElementById('shortCut2');
var shortCut3 = document.getElementById('shortCut3');
var shortCut4 = document.getElementById('shortCut4');
var shortCut5 = document.getElementById('shortCut5');
var shortCut6 = document.getElementById('shortCut6');
var shortCut7 = document.getElementById('shortCut7');
var shortCut8 = document.getElementById('shortCut8');
var displaySpeed = document.getElementById('displaySpeed');

// create arrays for speeds and shortcuts
var speedsArr = [speedInput1, speedInput2, speedInput3, speedInput4, speedInput5, speedInput6, speedInput7, speedInput8];
var shortcutsArr = [shortCut1, shortCut2, shortCut3, shortCut4, shortCut5, shortCut6, shortCut7, shortCut8, displaySpeed];

// Create objects for speeds and shortcuts
var optionSettings = {
    speeds: {
        speedInput1: 1,
        speedInput2: 2.5,
        speedInput3: 4,
        speedInput4: 9,
        speedInput5: 16,
        speedInput6: 1,
        speedInput7: 1,
        speedInput8: 1,
    },
    shortcuts: {
        shortCut1: 'a',
        shortCut2: 's',
        shortCut3: 'd',
        shortCut4: 'e',
        shortCut5: 'g',
        shortCut6: '6',
        shortCut7: '7',
        shortCut8: '8',
        displaySpeed: '.'
    },
    currentPlaybackSpeed: 1
};

// Set chrome storage
var storage = chrome.storage.sync;

// Event listener
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentSetting();

    document.getElementById('defaultSetting').addEventListener('click', loadDefaultSetting);
    document.getElementById('currentSetting').addEventListener('click', loadCurrentSetting);
    document.getElementById('clearSetting').addEventListener('click', clearAllSetting);
    document.getElementById('save').addEventListener('click', saveOptions);
});

// Load current optionSettings from Chrome storage
function loadCurrentSetting() {
    chrome.storage.sync.get(optionSettings, function(result) {
        // Retrieve speed optionSettings
        for (var i = 0; i < Object.keys(optionSettings.speeds).length; i++) {
            if (speedsArr[i].id === Object.keys(optionSettings.speeds)[i]) {
                speedsArr[i].value = result.speeds[speedsArr[i].id];
            }
        };

        // Retrieve shortcut optionSettings
        for (var i = 0; i < Object.keys(optionSettings.shortcuts).length; i++) {
            if (shortcutsArr[i].id === Object.keys(optionSettings.shortcuts)[i]) {
                shortcutsArr[i].value = result.shortcuts[shortcutsArr[i].id];
            }
        };
    });
}

// Clear all input fields
function clearAllSetting() {
    var elements = document.getElementsByTagName('input');
    for (var i = 0; i < elements.length; i++) {
        elements[i].value = "";
    };

    document.getElementById('saved').innerHTML = "";
}

// Load default optionSettings
function loadDefaultSetting() {
    // Speed settings
    for (var i = 0; i < speedsArr.length; i++) {
        speedsArr[i].value = optionSettings.speeds[speedsArr[i].id];
    }

    // Shortcuts settings
    for (var i = 0; i < shortcutsArr.length; i++) {
        shortcutsArr[i].value = optionSettings.shortcuts[shortcutsArr[i].id];
    }
}

// Save current optionSettings
function saveOptions() {

    // Check speeds
    for (var i = 0; i < speedsArr.length; i++) {
        if (speedsArr[i].value < 0.01 || speedsArr[i].value > 16.00) {
            speedsArr[i].value = 1.00;
        }
        var key = speedsArr[i].id;
        var value = Number(speedsArr[i].value);
        optionSettings.speeds[key] = value;
    };

    // Characters that are allowed as shortcuts
    var pattern = new RegExp("[a-zA-Z0-9\.]");

    // Check shortcuts
    for (var i = 0; i < shortcutsArr.length; i++) {
        if (!pattern.test(shortcutsArr[i].value)) {
            shortcutsArr[i].value = '1';
        }

        if (shortcutsArr[i].value != '') {
            var key = shortcutsArr[i].id;
            var value = shortcutsArr[i].value;
            optionSettings.shortcuts[key] = value;
        }
    };

    // Save to Chrome Storage
    storage.set(optionSettings);

    var saved = document.getElementById('saved');
    saved.textContent = "Options saved";
    setTimeout(function() {
        saved.textContent = "";
    }, 1000);
}