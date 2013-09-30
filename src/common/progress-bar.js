/**
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var grunt = require('grunt');

var ProgressBar = function () {
    this._defaultMaxValue = 100;
    this._defaultValue = 0;
    this._defaultInterval = 800;
    this._isBuilt = false;
    return this;
};

ProgressBar.prototype = {
    setValue: function (newValue) {
        if (!newValue || isNaN(newValue)) {
            throw '[Error]: ProgressBar value is not numeric';
        }
        this._value = newValue;
        return this;
    },
    getValue: function () {
        return this._value || this._defaultValue;
    },
    setMaxValue: function (newMaxValue) {
        if (this._isBuilt) {
            throw '[Error]: ProgressBar is already built.';
        } else {
            this._maxValue = newMaxValue;
            return this;
        }
    },
    getMaxValue: function () {
        return this._maxValue || this._defaultMaxValue;
    },
    setInterval: function (newInterval) {
        if (this._isBuilt) {
            throw '[Error]: ProgressBar is already built.';
        } else {
            this._interval = newInterval;
            return this;
        }
    },
    getInterval: function () {
        return this._interval || this._defaultInterval;
    },
    build: function () {
        if (this._isBuilt) {
            throw '[Error]: The ProgressBar is already built';
        }
        this._isBuilt = true;
        var self = this;
        this.fillProgressBar = setInterval( function() {
            var _percentage = 100 * self.getValue() / self.getMaxValue();
            if (_percentage >= 100)
            {
                clearInterval(this.fillProgressBar);
            }
            else
            {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                grunt.log.write(['Download Progress: ', _percentage.toFixed(0), ' %'].join(''));
            }
        }, this.getInterval());
        return this;
    },
    clear: function () {
        if (!this._isBuilt) {
            throw '[Error]: ProgressBar is not built yet.';
        } else {
            if (this.fillProgressBar) {
                clearInterval(this.fillProgressBar);
            }
            return null;
        }
    }
};

if (typeof module !== 'undefined') {
    module.exports.ProgressBar = ProgressBar;
}
