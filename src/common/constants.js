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
module.exports = {
    /* -- defaultValues for starting JBoss AS -- */
    JBOSS_INSTANCE_TYPE       : "\"[STANDALONE]\"",
    JBOSS_XMS                 : "64m",
    JBOSS_XMX                 : "512m",
    JBOSS_XX_MAX_PERM_SIZE    : "256m",
    JBOSS_PREFER_IPV4         : "true",
    JBOSS_RESOLVER_WARNING    : "true",
    JBOSS_CLIENT_GC_INSTERVAL : "3600000",
    JBOSS_SERVER_GC_INTERVAL  : "3600000",
    JBOSS_DEFAULT_CONFIG      : "standalone.xml",
    JBOSS_AWT_HEADLESS        : "true",
    JBOSS_SYSTEM_PKGS         : "org.jboss.byteman",
    JBOSS_BOOT_LOG_FILE       : "${JBOSS_HOME}/boot.log",
    JBOSS_LOGGING_CONFIG      : "file:${JBOSS_HOME}/standalone/configuration/logging.properties",
    JBOSS_MODULES             : "${JBOSS_HOME}/jboss-modules.jar",
    JBOSS_MODULES_PATH        : "${JBOSS_HOME}/modules",
    JBOSS_JAXP_MODULE_1       : "javax.xml.jaxp-provider",
    JBOSS_JAXP_MODULE_2       : "org.jboss.as.standalone",
    JBOSS_HOME                : "${JBOSS_HOME}",
    JBOSS_BIND_ADDRESS        : "127.0.0.1",
    JBOSS_HOME_VAR            : "${JBOSS_HOME}",
    JBOSS_STANDALONE_XML_PATH : "${JBOSS_HOME}/standalone/configuration/standalone.xml"
};
