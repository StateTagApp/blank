stateTagApp.log(stateTagApp.namespace.concat("-html: #BUILD#"));

import _ from "lodash";
import Vue from "vue";
import vueCustomElement from "vue-custom-element";

stateTagApp.Vue = Vue;
stateTagApp.env = process.env.NODE_ENV;

Vue.use(vueCustomElement);
Vue.use(require("vue-moment"));

Vue.config.productionTip = {
    production: true,
    development: false
}[process.env.NODE_ENV];

Vue.prototype._ = _;
import {v4 as uuidv4} from 'uuid';

stateTagApp['uuid'] = uuidv4;


import Api from "./api";

Vue.use(Api);


import Nebula from "./nebula";

Vue.use(Nebula);

import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

if (!_.isUndefined(stateTagApp.socket)) {
    stateTagApp.socket = stateTagApp.socket[process.env.NODE_ENV];
    stateTagApp['socketIo'] = io(stateTagApp.socket);

    stateTagApp['$onSocket'] = function (event, handler) {
        stateTagApp['socketIo'].on(event, handler);
    }

    Vue.use(VueSocketIOExt, stateTagApp['socketIo']);
}

Vue.filter("date", function (value, format) {
    format = format || stateTagApp.format.date;
    let date = new Date(value);
    return stateTagApp.Vue.moment(date).format(format)
});

Vue.filter('dynamicFilters', function(value, filters) {

    for(let i in filters){
        let name = filters[i].name;
        let args = filters[i].args || [];
        value = Vue.filter(name)(value, ...args);
    }

    return value;
});

import state from "./state";
import router from "./routes"

initGlobalStateWatchers(stateTagApp["storage"]);
initGlobalSocketWatchers();
initGlobalNebulaWatchers(uuidv4, _);

import XHtml from "./x-html";

Vue.use(XHtml);
import Manifest from "@/x-html/manifest";

for (let tag in Manifest) {
    Manifest[tag].store = state;
    Manifest[tag].router = router;
    Vue.customElement(tag, Manifest[tag]);
}
