"use strict";(globalThis.webpackChunk=globalThis.webpackChunk||[]).push([["app_components_primer_experimental_toggle-switch-element_ts"],{11772(a,b,c){c.r(b);var d=c(76006),e=function(a,b,c,d){var e,f=arguments.length,g=f<3?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)g=Reflect.decorate(a,b,c,d);else for(var h=a.length-1;h>=0;h--)(e=a[h])&&(g=(f<3?e(g):f>3?e(b,c,g):e(b,c))||g);return f>3&&g&&Object.defineProperty(b,c,g),g};let f=class ToggleSwitchElement extends HTMLElement{toggle(){this.isOn()?this.turnOff():this.turnOn()}turnOn(){!this.isDisabled()&&(this.switch.setAttribute("aria-checked","true"),this.classList.add("ToggleSwitch--checked"))}turnOff(){!this.isDisabled()&&(this.switch.setAttribute("aria-checked","false"),this.classList.remove("ToggleSwitch--checked"))}isOn(){return"true"===this.switch.getAttribute("aria-checked")}isDisabled(){return"true"===this.switch.getAttribute("aria-disabled")}};e([d.fA],f.prototype,"switch",void 0),f=e([d.Ih],f)}}])
//# sourceMappingURL=app_components_primer_experimental_toggle-switch-element_ts-e1ca7a298f15.js.map