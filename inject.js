chrome.extension.sendMessage({}, function(response) {
    var settings = {
        speeds: {
            speedInput1: 1,
            speedInput2: 2.5,
            speedInput3: 4,
            speedInput4: 9,
            speedInput5: 16
        },
        shortcuts: {
            shortCut1: 'a',
            shortCut2: 's',
            shortCut3: 'd',
            shortCut4: 'e',
            shortCut5: 'g',
            displaySpeed: '.'
        },
        currentPlaybackSpeed: 1
    };

    var videoTags = document.getElementsByTagName('video');

    var fragment = document.createDocumentFragment();
    var container = document.createElement('div');
    var speedIndicator = document.createElement('span');

    var controls = document.createElement('span');
    var speed1Button = document.createElement('button');
    var speed2Button = document.createElement('button');
    var speed3Button = document.createElement('button');
    var speed4Button = document.createElement('button');
    var speed5Button = document.createElement('button');

    // Create an array of speed buttons
    var speedButtons = [speed1Button, speed2Button, speed3Button, speed4Button, speed5Button];

    // Retrieve data from Chrome storage
    function getChromeStorage() {
        chrome.storage.sync.get(settings, function(storage) {
            // Retrieve shortcut settings
            Object.keys(settings.shortcuts).forEach(function (key) {
                settings.shortcuts[key] = storage.shortcuts[key];
            });

            // Retrieve speed settings
            for (var i = 0; i < Object.keys(settings.speeds).length; i++) {
                settings.speeds[Object.keys(settings.speeds)[i]] = storage.speeds[Object.keys(settings.speeds)[i]];
                speedButtons[i].textContent = storage.speeds[Object.keys(settings.speeds)[i]];
                // Add shortcut display next to speeds
                // speedButtons[i].textContent = storage.speeds[Object.keys(settings.speeds)[i]] + "-" + "r";
            }
            settings.currentPlaybackSpeed = storage.currentPlaybackSpeed;
        });

        chrome.storage.sync.get('currentPlaybackSpeed', function(storage) {
            speedIndicator.textContent = storage.currentPlaybackSpeed;
        });
    }

    var readyStateCheckInterval = setInterval(initializeVideoSpeed, 10);

    function initializeVideoSpeed() {
        if (document.readyState === 'complete') {
            clearInterval(readyStateCheckInterval);

            settings.videoController = function(target) {
                getChromeStorage();

                this.video = target;
                this.initializeControls();

                target.addEventListener('play', function(event) {
                    target.playbackRate = Number(speedIndicator.textContent);
                });

                target.playbackRate = Number(speedIndicator.textContent);
            }

            settings.videoController.prototype.initializeControls = function() {
                // Append to control
                speedButtons.forEach(function(button) {
                    controls.appendChild(button);
                });

                container.appendChild(speedIndicator);
                container.appendChild(controls);

                container.classList.add('settings-videoController');
                speedIndicator.classList.add('settings-speedIndicator');
                controls.classList.add('settings-controls');

                fragment.appendChild(container);

                this.video.parentElement.insertBefore(fragment, this.video);

                container.addEventListener('click', function(e) {
                    for (var i = 0; i < speedButtons.length; i++) {
                        if (e.target === speedButtons[i]) {
                            // var targetSpeed = parseFloat(speedButtons[i].textContent).toFixed(2);
                            var targetSpeed = Number(speedButtons[i].textContent);
                            runAction(targetSpeed);
                            break;
                        };
                    };

                    e.stopPropagation();
                    e.preventDefault();
                }, true);
            }

            function setSpeed(v, speed) {
                chrome.storage.sync.set({'currentPlaybackSpeed': speed});
                v.playbackRate = speed;
                speedIndicator.textContent = speed;
            }

            function runAction(action) {
                videoTags.forEach(function(v) {
                    setSpeed(v, action);
                })
            }

            document.addEventListener('keypress', function(event) {
                // Ignore keypress event if typing in an input box
                if (document.activeElement.nodeName === 'INPUT' && document.activeElement.getAttribute('type') === 'text') {
                    return false;
                }

                // if uppercase letter pressed, check for lowercase key code
                var keyCode = String.fromCharCode(event.keyCode).toLowerCase();
                var isVisible = !container.classList.contains('settings-videoController');

                if (keyCode == settings.shortcuts.displaySpeed) {
                    container.classList.toggle('settings-videoController');
                } else if (!isVisible) {
                    if (keyCode == settings.shortcuts.shortCut1) runAction(settings.speeds.speedInput1);
                    if (keyCode == settings.shortcuts.shortCut2) runAction(settings.speeds.speedInput2);
                    if (keyCode == settings.shortcuts.shortCut3) runAction(settings.speeds.speedInput3);
                    if (keyCode == settings.shortcuts.shortCut4) runAction(settings.speeds.speedInput4);
                    if (keyCode == settings.shortcuts.shortCut5) runAction(settings.speeds.speedInput5);
                }

                return false;
            }, true);

            document.addEventListener('DOMNodeInserted', function(event) {
                var node = event.target || null;
                if (node && node.nodeName === 'VIDEO') {
                  new settings.videoController(node);
                }
            });

            videoTags.forEach = Array.prototype.forEach;
            videoTags.forEach(function(video) {
                var control = new settings.videoController(video);
            });
        };
    }
});