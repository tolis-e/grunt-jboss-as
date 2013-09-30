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
    Constants = require("../common/constants"),
    FileModule = require('../common/file-module').FileModule,
    execute = require('child_process').exec,
    fileSystem = require('fs'),
    StringModule = require('../common/string-module').StringModule;

module.exports.JBossModule =
{
    getDefaultVmArgs: function (jbossHome)
    {
        if (!jbossHome || StringModule.trim(jbossHome) === '')
        {
            grunt.log.error(['[Error]: JBossModule: getDefaultArgs: jbossHome: \'', jbossHome, '\' is invalid.'].join(''));
            return;
        }

        return new KeyValuePair()
                .setKeyValue('-D', Constants.JBOSS_INSTANCE_TYPE)
                .setKeyValue('-server', '')
                .setKeyValue('-Xms', Constants.JBOSS_XMS)
                .setKeyValue('-Xmx', Constants.JBOSS_XMX)
                .setKeyValue('-XX:MaxPermSize=', Constants.JBOSS_XX_MAX_PERM_SIZE)
                .setKeyValue('-Djava.net.preferIPv4Stack=', Constants.JBOSS_PREFER_IPV4)
                .setKeyValue('-Dorg.jboss.resolver.warning=', Constants.JBOSS_RESOLVER_WARNING)
                .setKeyValue('-Dsun.rmi.dgc.client.gcInterval=', Constants.JBOSS_CLIENT_GC_INSTERVAL)
                .setKeyValue('-Dsun.rmi.dgc.server.gcInterval=', Constants.JBOSS_SERVER_GC_INTERVAL)
                .setKeyValue('-Djboss.modules.system.pkgs=', Constants.JBOSS_SYSTEM_PKGS)
                .setKeyValue('-Djava.awt.headless=', Constants.JBOSS_AWT_HEADLESS)
                .setKeyValue('-Djboss.server.default.config=', Constants.JBOSS_DEFAULT_CONFIG)
                .setKeyValue('-Dorg.jboss.boot.log.file=', Constants.JBOSS_BOOT_LOG_FILE.replace(Constants.JBOSS_HOME_VAR, jbossHome))
                .setKeyValue('-Dlogging.configuration=', Constants.JBOSS_LOGGING_CONFIG.replace(Constants.JBOSS_HOME_VAR, jbossHome))
                .setKeyValue('-jar', '')
                .setKeyValue(Constants.JBOSS_MODULES.replace(Constants.JBOSS_HOME_VAR, jbossHome), '')
                .setKeyValue('-mp', '')
                .setKeyValue(Constants.JBOSS_MODULES_PATH.replace(Constants.JBOSS_HOME_VAR, jbossHome), '')
                .setKeyValue('-jaxpmodule', '')
                .setKeyValue(Constants.JBOSS_JAXP_MODULE_1, '')
                .setKeyValue(Constants.JBOSS_JAXP_MODULE_2, '')
                .setKeyValue('-Djboss.home.dir=', Constants.JBOSS_HOME.replace(Constants.JBOSS_HOME_VAR, jbossHome))
                .setKeyValue('-b', '')
                .setKeyValue(Constants.JBOSS_BIND_ADDRESS, '');
    },
    start: function (javaHome, jbossHome, custom_args, ports, keystore, callbacks)
    {
        if (!jbossHome || StringModule.trim(jbossHome) === '')
        {
            var err = ['[Error]: JBossModule: start: jbossHome: \'', jbossHome, '\' is invalid.'].join('');
            grunt.log.error(err);
            callbacks.error();
            return;
        }

        // get default args
        var keyValuePair = this.getDefaultVmArgs(jbossHome);

        // set custom args
        if (custom_args)
        {
            for (var id in custom_args)
            {
                var value = custom_args[id];
                if (id && (id === '-Xms' || id === '-Xmx' || id === '-XX:MaxPermSize=' || id === '-b') && value && StringModule.trim(value) !== '')
                {
                    if (id === '-b')
                    {
                        keyValuePair.deleteKey(Constants.JBOSS_BIND_ADDRESS);
                        keyValuePair.deleteKey('-b');
                        keyValuePair.setKeyValue('-b', '');
                        keyValuePair.setKeyValue(value, '');
                    }
                    else
                    {
                        keyValuePair.setKeyValue(id, value);
                    }
                }
            }
        }

        var argsArray = keyValuePair.toArray();
        console.log(argsArray);

        if (ports || keystore)
        {
            var regExpValuePairs = {};
            
            if (ports)
            {
                for (var key in ports)
                {
                    if (key && (key === 'http' || key === 'https'))
                    {
                        var port = ports[key];
                        if (port && StringModule.trim(port) !== '')
                        {
                            regExpValuePairs[["name=\"", key, "\" port=\"(.*)\""].join('')] = ["name=\"", key, "\" port=\"", port, "\""].join('');
                        }
                    }
                }
            }

            if (keystore)
            {
                var kFile = keystore['file'],
                    kAlias = keystore['alias'],
                    kPassword = keystore['password'],
                    kProtocol = keystore['protocol'];
                
                if (kFile && StringModule.trim(kFile) !== '' && kAlias && StringModule.trim(kAlias) !== '' && kPassword && StringModule.trim(kPassword) !== '' && kProtocol && StringModule.trim(kProtocol) !== '')
                {
                    // remove all https connectors
                    regExpValuePairs["<connector[^>]*socket-binding=\"https\"[^<]*<ssl[^<]*(</ssl\\s*>)?[^<]*</connector\\s*>"] = "";
                    // add new https connector
                    regExpValuePairs["<subsystem xmlns=\"urn:jboss:domain:web:1.1\"[^>]*>"] = ["<subsystem xmlns=\"urn:jboss:domain:web:1.1\" default-virtual-server=\"default-host\" native=\"false\">\n<connector name=\"https\" protocol=\"HTTP/1.1\" scheme=\"https\" socket-binding=\"https\" secure=\"true\">", "<ssl name=\"ssl-setup\" key-alias=\"", kAlias,"\" password=\"", kPassword,"\" certificate-key-file=\"", kFile,"\" protocol=\"", kProtocol,"\"/>", "</connector>"].join('');
                }
            }

            var sourceDestinationFilePath = Constants.JBOSS_STANDALONE_XML_PATH.replace(Constants.JBOSS_HOME_VAR, jbossHome),
                _callback = function () {
                    grunt.log.writeln('JBossModule: start: port/certificate setup is done.');
                };

            FileModule.replaceStrings(sourceDestinationFilePath, sourceDestinationFilePath, regExpValuePairs, _callback);
        }

        // spawning
        var jbossProcess = grunt.util.spawn({
                    cmd: javaHome,
                    args: argsArray
               }),
            listener = function(data) {
                grunt.log.writeln(data);
                if (/JBoss (AS|EAP) (.*) started in/.test(data))
                {
                    callbacks.success();
                }
                else if (/JBoss (AS|EAP) (.*) started \(with errors\)/.test(data))
                {
                    jbossProcess.stdout.removeListener('data', listener);
                    jbossProcess.kill();
                    grunt.log.error('[Error]: JBossModule: start: AS started with errors.');
                    callbacks.error();
                }
            };

            jbossProcess.stdout.on('data', listener);
        
        return jbossProcess;
    },
    deploy: function (jbossHome, fileNamePath, callbacks)
    {
        if (jbossHome && fileNamePath && StringModule.trim(jbossHome) !== '' && StringModule.trim(fileNamePath) !== '')
        {
            if (!grunt.file.isFile(fileNamePath))
            {
                grunt.log.error(['[Error]: JbossModule: deploy: file: \'', fileNamePath, '\' does not exist.'].join(''));
                callbacks.error();
                return;
            }

            var serverLog = [jbossHome, '/standalone/log/server.log'].join(''),
                deploymentsPath = [jbossHome, '/standalone/deployments'].join(''),
                fileName = fileNamePath.split('/').pop(),
                deployedFile = [deploymentsPath, '/', fileName, '.deployed'].join(''),
                isRedeploy = grunt.file.isFile(deployedFile),
                deployPattern = new RegExp(["(Red|D)eployed \"", fileName, "\""].join('')),
                watchListener = function(curr, prev) {
                    if(prev && curr && prev.size > curr.size)
                    {
                        return {
                            clear: true
                        };
                    }
                    
                    var fstream = fileSystem.createReadStream(serverLog, {
                        start: prev.size,
                        end: curr.size
                    });

                    fstream.addListener("data", function(data) {
                        grunt.log.writeln(data);
                        if (deployPattern.test(data))
                        {
                            fileSystem.unwatchFile(serverLog, watchListener);
                            callbacks.success();
                        }
                    });
                };

                fileSystem.watchFile(serverLog, watchListener);

                var moveProcess = execute(['cp -r ', fileNamePath, ' ', deploymentsPath].join(''), function(error, stdout, stderr) {
                    if (error)
                    {
                        grunt.log.error(['[Error]: JBossModule: deploy: move: error: \'', error, '\'.'].join(''));
                        callbacks.error();
                    }
                    else
                    {
                        if (isRedeploy)
                        {
                            var touch = execute(['touch ', deployedFile].join(''), function(_error, _stdout, _stderr) {
                                if (_error)
                                {
                                    grunt.log.error(['[Error]: JBossModule: deploy: touch: error: \'', _error, '\'.'].join(''));
                                    callbacks.error();
                                }
                            });
                        }
                    }
                });
        }
        return;
    }
};
