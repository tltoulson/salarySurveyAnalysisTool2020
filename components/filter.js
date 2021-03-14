class Filter extends HTMLElement {
    connectedCallback() {

    }

    render(state) {
        if (state.filter == this._filter) {
            return;
        }
        
        this._filter = state.filter;

        this.innerHTML = `
            <style>
                salary-filter {
                    padding-left: 1em;
                }

                .filterItem {
                    cursor: pointer;
                }

                .filterItem:hover {
                    background-color: #eee;
                }
            </style>
            <span><b>Filter:</b></span>
        `;

        Object.keys(state.filter).forEach(function(propertyName) {
            this.insertAdjacentHTML('beforeend', `<span class="filterItem" propertyName="${propertyName}">${propertyName} = ${state.filter[propertyName]} &gt; </span>`)
        }, this);
    }
}
      
customElements.define('salary-filter', Filter);