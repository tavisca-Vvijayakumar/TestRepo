import {CONTROL_NAME_CARD_ORIENTATION, ORIENTATION_HORIZONTAL, ORIENTATION_VERTICAL} from '../const';
import baseControl from "./baseControl";

const ORIENTATION_STATES = [
    {
        id: 1,
        tooltipKey: 'settings.controls.orientation.horizontal',
        value: ORIENTATION_HORIZONTAL,
        class: 'es-icon-product-horizontal'
    },
    {
        id: 2,
        tooltipKey: 'settings.controls.orientation.vertical',
        value: ORIENTATION_VERTICAL,
        class: 'es-icon-product-vertical',
    }
];


export default {
    ...baseControl,
    name: CONTROL_NAME_CARD_ORIENTATION,

    render() {
        this.jContainer.html(this.getControlMarkup());
        this.buttons = [...ORIENTATION_STATES].map(b => Object.assign({}, b, {
            tooltip: this.translate(b.tooltipKey),
            active: this.panelState.blockConfig.orientation === b.value
        }));
        this.buttonsSelector = this.jContainer.find('buttons-selector')[0];
        this.buttonsSelector.props.buttons = this.buttons;
        this.buttonsSelector.props.onButtonSelected = this.onButtonSelected.bind(this);
    },

    onButtonSelected(button) {
        this.panelState.blockConfig.orientation = button.value;
        this.toggleButtonAdjustToWidth();
        this.updateLayout();
        this.applyChangesImmediately();
    },

    toggleButtonAdjustToWidth() {
        let isVerticalOrientation = this.panelState.blockConfig.orientation == ORIENTATION_VERTICAL;
        const theme = this.panelState.blockConfig.composition.variables.find(item => item.variable == 'p_button').theme;
        theme.buttonStretch = isVerticalOrientation;
        if (isVerticalOrientation) {
            theme.buttonInternalPadding.desktop.left = 0;
            theme.buttonInternalPadding.desktop.right = 0;
            delete this.panelState.internalIndentLeft;
            delete this.panelState.internalIndentRight;
        } else {
            theme.buttonInternalPadding.desktop.left = 40;
            theme.buttonInternalPadding.desktop.right = 40;
        }
    },

    layoutChanged() {
        if (this.isControlVisible()) {
            this.buttonsSelector.props.buttons = this.buttonsSelector.props.buttons.map(b => {
                b.active = this.panelState.blockConfig.orientation === b.value;
                return b;
            })
        }
        this.updateControlVisibility();
    },

    getControlMarkup() {
        return `<div class="form-group">
                <label class="col-xs-7 control-label">${this.translate('settings.controls.orientation.label')}</label>
                <div class="col-xs-5 pull-right">
                    <buttons-selector classes="btn-group-justified orientation-control"></buttons-selector>
                </div>
            </div>`;
    },

    isControlVisible() {
        return this.isValuableBlock();
    }
}
