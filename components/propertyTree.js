import {varianceDecimalPlaces} from '../config/config.js';

class PropertyTree extends HTMLElement {
    connectedCallback() {
        this._styles = `
            <style>
                salary-property-tree {
                    display: block;
                    padding-top: 1em;
                }

                salary-property-tree div {
                    cursor: pointer;
                    padding: .5em 0;
                    padding-left: 1em;
                }

                salary-property-tree div:hover {
                    background-color: #eee;
                }
            </style>
        `;

        this.innerHTML = this._styles;
    }

    get variances() {
        return this._variances;
    }

    set variances(newValue) {
        this._variances = newValue;
    }

    render(state) {
        this.innerHTML = this._styles;
        this._responses = state.responses;
        this._variances.forEach(function(prop) {
            this.insertAdjacentHTML('beforeend', `<div propertyName="${prop.propertyName}">${prop.propertyName} - ${(prop.variance || 0).toFixed(varianceDecimalPlaces)}</div>`)
        }, this);
    }
}
      
customElements.define('salary-property-tree', PropertyTree);