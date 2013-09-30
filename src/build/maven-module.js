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
    KeyValuePair = require('../data/key-value-pair').KeyValuePair,
    StringModule = require('../common/string-module').StringModule;

module.exports.MavenModule =
{
    build: function (pomFilePath, callbacks)
    {
        if (pomFilePath && StringModule.trim(pomFilePath) !== '')
        {
            if (!grunt.file.isFile(pomFilePath))
            {
                grunt.log.error(['[Error]: MavenModule: build: file: \'', pomFilePath, '\' does not exist.'].join(''));
                callbacks.error();
                return;
            }
            
            var keyValuePairs = new KeyValuePair()
                    .setKeyValue('-f', '')
                    .setKeyValue(pomFilePath, '')
                    .setKeyValue('clean', '')
                    .setKeyValue('package', ''),
                mvnBuild = grunt.util.spawn({
                    cmd: 'mvn',
                    args: keyValuePairs.toArray()
                }, function (error, result, code) {
                        if (code === 0)
                        {
                            if (/BUILD SUCCESS/.test(result))
                            {
                                callbacks.success();
                            }
                            else if (/BUILD FAILURE/.test(result))
                            {
                                grunt.log.error('[Error]: MavenModule: build: BUILD FAILURE.');
                                callbacks.error();
                            }
                        }
                        else
                        {
                            grunt.log.error('[Error]: MavenModule: build: BUILD FAILURE.');
                            callbacks.error();
                        }
                });
        }
    }
};
