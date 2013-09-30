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
module.exports = function (grunt) {
    'use strict';

    var ProcessModule = require('../src/common/process-module').ProcessModule,
        GruntModule = require('../src/common/grunt-module').GruntModule,
        StringModule = require('../src/common/string-module').StringModule,
        JBossModule = require('../src/servers/jboss-as-module').JBossModule,
        path = require('path'),
        defaultServerURL = 'http://download.jboss.org/jbossas/7.1/jboss-as-7.1.1.Final/jboss-as-7.1.1.Final.zip',
        defaultTargetDir = 'target';

    grunt.registerTask('download-jboss-as', 'Download JBoss AS', function () {
        var HttpModule = require('../src/common/http-module').HttpModule,
            urlOption = GruntModule.getOption('servers.jboss.download.url'),
            targetDirOption = GruntModule.getOption('servers.jboss.download.targetDir'),
            downloadURL = urlOption && StringModule.trim(urlOption) !== '' ? urlOption : defaultServerURL,
            destinationDir = targetDirOption && StringModule.trim(targetDirOption) !== '' ? targetDirOption : defaultTargetDir,
            done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            };

        HttpModule.download(downloadURL, destinationDir, callbacks);
    });

    grunt.registerTask('extract-zip', 'Extract .ZIP', function (zipFilePath, destDir) {
        var FileModule = require('../src/common/file-module').FileModule,
            filePath = zipFilePath || GruntModule.getOption('servers.jboss.extract.zipFile'),
            targetDirOption = destDir || GruntModule.getOption('servers.jboss.extract.targetDir'),
            targetDir = targetDirOption && StringModule.trim(targetDirOption) !== '' ? targetDirOption : defaultTargetDir,
            done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            };
        FileModule.extract(filePath, targetDir, callbacks);
    });

    grunt.registerTask('extract-jboss-as', 'Extract JBoss AS .ZIP', function () {
        var downloadURLOption = GruntModule.getOption('servers.jboss.download.url'),
            targetDirOption = GruntModule.getOption('servers.jboss.download.targetDir'),
            downloadURL = downloadURLOption && StringModule.trim(downloadURLOption) !== '' ? downloadURLOption : defaultServerURL,
            targetDir = targetDirOption && StringModule.trim(targetDirOption) !== '' ? targetDirOption : defaultTargetDir,
            fileName = downloadURL.split('/').pop(),
            filePath = [targetDir, '/', fileName].join(''),
            compressedFilePathOptionId = 'servers.jboss.extract.zipFile';
        GruntModule.setOption(compressedFilePathOptionId, filePath);
        grunt.task.run(['extract-zip', ':', ':'].join(''));
    });

    grunt.registerTask('start-jboss-as', 'Start a JBoss AS instance', function (jbossHome, xms, xmx, permSize, bindingAddress, httpPort, httpsPort, sslKeystoreAlias, sslKeystorePassword, sslKeystoreFile, sslProtocol) {
        var whichJava = [process.env.JAVA_HOME, '/bin/java'].join(''),
            _jbossHome = jbossHome || GruntModule.getOption('servers.jboss.startup.options.jbossHome'),
            done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            },
            custom_args = {},
            ports = {},
            keystore = {};

        // setup custom arguments 
        custom_args['-Xms'] = xms || GruntModule.getOption('servers.jboss.startup.options.xms');
        custom_args['-Xmx'] = xmx || GruntModule.getOption('servers.jboss.startup.options.xmx');
        custom_args['-XX:MaxPermSize='] = permSize || GruntModule.getOption('servers.jboss.startup.options.maxPermSize');
        custom_args['-b'] = bindingAddress || GruntModule.getOption('servers.jboss.startup.options.bindingAddress');

        // setup ports
        ports['http'] = httpPort || GruntModule.getOption('servers.jboss.startup.options.httpPort');
        ports['https'] = httpsPort || GruntModule.getOption('servers.jboss.startup.options.httpsPort');

        //setup keystore
        keystore['alias'] = sslKeystoreAlias || GruntModule.getOption('servers.jboss.startup.options.keystoreAlias');
        keystore['password'] = sslKeystoreAlias || GruntModule.getOption('servers.jboss.startup.options.keystorePassword');
        keystore['file'] = sslKeystoreAlias || GruntModule.getOption('servers.jboss.startup.options.keystoreFile');
        keystore['protocol'] = sslKeystoreAlias || GruntModule.getOption('servers.jboss.startup.options.securityProtocol');

        var jbossProcess = JBossModule.start(whichJava, _jbossHome, custom_args, ports, keystore, callbacks),
            processId = [GruntModule.getOption('servers.jboss.startup.options.baseProcessId'), '__', jbossProcess.pid].join('');

        grunt.log.writeln(['[INFO]: start-jboss-as: =====> process id: \'', processId, '\'.'].join(''));

        ProcessModule.put(processId, jbossProcess);
    });

    grunt.registerTask('start-jboss-as-default', 'Start JBoss AS using the default configuration', function () {
        var jbossZipName = GruntModule.getOption('servers.jboss.download.url').split('/').pop(),
            jbossHome = path.resolve([GruntModule.getOption('servers.jboss.extract.targetDir'), '/', jbossZipName.substring(0, jbossZipName.indexOf('.zip'))].join(''));

        GruntModule.setOption('servers.jboss.startup.options.jbossHome', jbossHome);
        grunt.task.run(['start-jboss-as', '::::::::::'].join(''));
    });

    grunt.registerTask('maven-build', 'Clean & Build a maven project', function (pomFilePath) {
        var MavenModule = require('../src/build/maven-module').MavenModule,
            done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            };

        MavenModule.build(pomFilePath, callbacks);
    });

    grunt.registerTask('maven-build-default', 'Build the default configured maven project', ['maven-build', ':', GruntModule.getOption('maven.build.pom')].join(''));

    grunt.registerTask('deploy-archive-jboss-as', 'Deploy archive to JBoss AS', function (jbossHome, fileNamePath) {
        var done = this.async(),
            callbacks = {
                success: function () {
                    done(true);
                },
                error: function () {
                    done(false);
                }
            };

        JBossModule.deploy(jbossHome, fileNamePath, callbacks);
    });

    grunt.registerTask('deploy-archive-jboss-as-default', 'Deploy the default configured archive to JBoss AS', function () {
        var jbossZipName = GruntModule.getOption('servers.jboss.download.url').split('/').pop(),
            jbossHome = path.resolve([GruntModule.getOption('servers.jboss.extract.targetDir'), '/', jbossZipName.substring(0, jbossZipName.indexOf('.zip'))].join('')),
            archive = GruntModule.getOption('servers.jboss.deploy.archive');

        grunt.task.run(['deploy-archive-jboss-as', ':', jbossHome, ':', archive].join(''));
    });

    grunt.registerTask('stop-process', 'Kill a process', function (id) {
        ProcessModule.kill(id);
    });

    grunt.registerTask('stop-all-processes', 'Kill all processes created by the current plugin', function () {
        ProcessModule.killAll();
    });

};
