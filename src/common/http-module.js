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
    fileSystem = require('fs'),
    url = require('url'),
    http = require('http'),
    ProgressBar = require('./progress-bar').ProgressBar,
    StringModule = require('./string-module').StringModule;

module.exports.HttpModule =
{
    download: function (from, toDir, callbacks)
    {
        grunt.log.writeln(['HttpModule: download: from: \'', from, '\''].join(''));
        if (from && toDir)
        {
            var filename = url.parse(from).pathname.split('/').pop(),
                destinationFilePath = [toDir, '/', filename].join(''),
                httpDownload = function (_source, _callbacks) {
                    var progressBar = new ProgressBar(),
                        file = fileSystem.createWriteStream(destinationFilePath).on('finish', function() {
                                    //grunt.log.writeln(['HttpModule: download: Finish event fired for downloading of ',  _source].join(''));
                                    progressBar.clear();
                                    _callbacks.success();
                                });
                    grunt.log.writeln(['HttpModule: download: Downloading: \'', from, '\':'].join(''));
                    http.get(_source, function(response) {
                        var size = response.headers["content-length"];
                            progressBar.setMaxValue(size)
                                       .setInterval(200)
                                       .build();
                        response.on('data', function(data) {
                            progressBar.setValue(progressBar.getValue() + data.length);
                            file.write(data);
                        }).on('end', function() {
                            progressBar.setValue(size);
                            file.end();
                        });
                    });
                };

            if (grunt.file.isFile(destinationFilePath))
            {
                grunt.log.writeln(['HttpModule: download: File: ', destinationFilePath, ' already exists.'].join(''));
                callbacks.success();
            }
            else
            {
                if (!grunt.file.isDir(toDir))
                {
                    grunt.log.writeln(['HttpModule: download: Directory: \'', toDir, '\' does not exist and will be created.'].join(''));
                    grunt.file.mkdir(toDir);
                    if (!grunt.file.isDir(toDir))
                    {
                        grunt.log.error(['[Error]: HttpModule: download: Directory: \'', toDir, '\' was not created.'].join(''));
                        callbacks.error();
                    }
                }
                httpDownload(from, callbacks);
            }
        }
    }
};
