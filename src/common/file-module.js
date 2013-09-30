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
    AdmZip = require('adm-zip'),
    StringModule = require('./string-module').StringModule;

module.exports.FileModule =
{
    replaceStrings: function (sourceFile, destinationFile, regExpValuePairs, callback)
    {
        fileSystem.readFile(sourceFile, 'utf8', function (err, data) {
            if (err) {
                throw ['[Error]: FileModule: replace: readFile: err: \'', err, '\' sourceFile: \'', sourceFile, '\' destinationFile: \'', destinationFile, '\'.'].join('');
            }
            var result = data;
            for (var toBeReplaced in regExpValuePairs)
            {
                result = result.replace((new RegExp(toBeReplaced,"g")), regExpValuePairs[toBeReplaced]);
            }

            fileSystem.writeFile(destinationFile, result, 'utf8', function (err) {
                if (err)
                {
                    throw ['[Error]: FileModule: replace: writeFile: err: \'', err, '\' sourceFile: \'', sourceFile, '\' destinationFile: \'', destinationFile, '\'.'].join('');
                }
            });
            
            if (callback && typeof callback === 'function')
            {
                callback();
            }
        });
    },
    extract: function (fileNamePath, targetDir, callbacks)
    {
        //grunt.log.writeln(['FileModule: extract: filePath \'', fileNamePath, '\' targetDir: \'', targetDir, '\'.'].join(''));

        if (fileNamePath && StringModule.trim(fileNamePath) !== '')
        {
            if (!grunt.file.isFile(fileNamePath))
            {
                grunt.log.error(['[Error]: FileModule: extract: File: ', fileNamePath, ' does not exist.'].join(''));
                callbacks.error();
            }
            else if (!StringModule.endsWith(fileNamePath, '.zip'))
            {
                grunt.log.error(['[Error]: FileModule: extract: File: ', fileNamePath, ' is not .zip.'].join(''));
                callbacks.error();
            }
            else
            {
                var fileName = fileNamePath.split('/').pop(),
                    toDir = targetDir ? targetDir : fileNamePath.substring(0, fileNamePath.indexOf(fileName)),
                    filePath = [toDir, '/', fileName.substring(0, fileName.indexOf('.zip'))].join('');

                if (grunt.file.isDir(filePath))
                {
                    grunt.log.writeln(['FileModule: extract: Directory: \'', filePath, '\' already exists. Operation was cancelled.'].join(''));
                    callbacks.success();
                }
                else
                {
                    grunt.log.writeln(['FileModule: extract: targetDir: \'', targetDir, '\'.'].join(''));
                    var zip = new AdmZip(fileNamePath);
                    zip.extractAllTo(toDir, true);
                    if (!grunt.file.isDir(filePath))
                    {
                        grunt.log.error(['Error: FileModule: extract: filePath: ', filePath, ' was not created.'].join(''));
                        callbacks.error();
                    }
                    else
                    {
                        callbacks.success();
                    }
                }
            }
        }
        return;
    }
};
