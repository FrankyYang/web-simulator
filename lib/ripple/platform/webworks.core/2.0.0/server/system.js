/*
 *  Copyright 2011 Research In Motion Limited.
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
var deviceSettings = require('ripple/deviceSettings'),
    devices = require('ripple/devices'),
    app = require('ripple/app'),
    client = require('ripple/platform/webworks.core/2.0.0/client/system'),
    utils = require('ripple/utils'),
    notifications = require('ripple/notifications'),
    constants = require('ripple/constants'),
    platform = require('ripple/platform'),
    _self;

function _is(feature) {
    return {
        allowedFor: function (location) {
            return feature && feature.URIs.some(function (uri) {
                return uri.value === location ||
                      (location.indexOf(uri.value) >= 0 && uri.subdomains);
            });
        }
    };
}

_self = {
    hasCapability: function (args) {
        var capabilities = devices.getCurrentDevice().capabilities;
        return {
            code: 1,
            data: capabilities ? capabilities.some(function (type) {
                return type === args.capability;
            }) : false
        };
    },
    isMassStorageActive: function () {
        return {code: 1, data: deviceSettings.retrieveAsBoolean("system.isMassStorageActive")};
    },
    hasDataCoverage: function () {
        return {code: 1, data: deviceSettings.retrieveAsBoolean("system.hasDataCoverage")};
    },
    softwareVersion: function () {
        return {code: 1, data: devices.getCurrentDevice().osVersion};
    },
    model: function () {
        return {code: 1, data: devices.getCurrentDevice().model};
    },
    scriptApiVersion: function () {
        return {code: 1, data: platform.current().version};
    },
    setHomeScreenBackground: function (args) {
        var path = args.filePath,
            msg = "Set home screen background to " + path + ".";
        notifications.openNotification(constants.NOTIFICATIONS.TYPES.NORMAL, msg);
        return {code: 1};
    },
    hasPermission: function (args) {
        var info = app.getInfo(),
            feature = info.features[args.desiredModule];

        return {code: 1, data: _is(feature).allowedFor(utils.location().href) ? client.ALLOW : client.DENY};
    },
    network: function () {
        return {code: 1, data: deviceSettings.retrieve("system.network")};
    }
};

module.exports = _self;
