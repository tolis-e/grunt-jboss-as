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
var grunt = require('grunt'),
    StringModule = require('../common/string-module').StringModule;

var KeyValuePair = function () {
    this.keyValueHolder = {};
    return this;
};

KeyValuePair.prototype = {
    setKeyValue: function (id, val) {
        if (id && StringModule.trim(id) !== "")
        {
            this.keyValueHolder[id] = val;
        }
        return this;
    },
    getValue: function (id) {
        return this.keyValueHolder[id];
    },
    deleteKey: function (id) {
        if (id)
        {
            delete this.keyValueHolder[id];
        }
    },
    toArray: function () {
        var arr = [],
            counter = 0;
        for (var id in this.keyValueHolder)
        {
            arr[counter++] = ([id, this.keyValueHolder[id]].join(''));
        }
        return arr;
    }
};

if (typeof module !== 'undefined') {
    module.exports.KeyValuePair = KeyValuePair;
}
