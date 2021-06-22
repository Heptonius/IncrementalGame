import {buildings, resourcesP1, player} from './scripts.js'

export class Upgrade {
    constructor(inputTier, inputName, inputBaseGain, inputCostToBuy, inputUpgInfo){
        this.Tier = inputTier;
        this.Name = inputName; this.upgInfo = inputUpgInfo; this.upgTooltip;
        this.BaseGain = inputBaseGain;
        this.CostToBuy = inputCostToBuy;
        this.isBought = false;
        this.effFunct;  
        this.hasFunctRan = false;
        this.parrentDOM = document.getElementById("upgrades-div"); this.mainDOM; this.childrenDOM = [];
    };
    set BuyUpgrade(cmpValue){
        if (cmpValue >= 0) {
            this.isBought = true;
            player.mainCurrency.currency=player.mainCurrency.currency.sub(this.CostToBuy);
        }
    };
    get upgradeEffectFunction() {
        return this.effFunct;
    };
    createAndPlaceUpgDiv(){
        this.mainDOM = Object.assign(document.createElement("div"), {className:"upgrade-div"});
        this.childrenDOM.push(Object.assign(document.createElement("h3"),{className: "upgrade-name", innerText: this.Name}));
        this.childrenDOM.push(Object.assign(document.createElement("hr"),{className: "upg-txt-divier"}));
        this.childrenDOM.push(Object.assign(document.createElement("h4"),{className: "upgrade-text", innerText: this.upgInfo}));
        this.childrenDOM.forEach(elem=>{this.mainDOM.appendChild(elem)});
        this.parrentDOM.appendChild(this.mainDOM);
        this.parrentDOM.scrollTop = this.mainDOM.offsetTop;
    }
    removeUpgDOMs(){
        this.childrenDOM.forEach(DOM=>{DOM.remove()});        
        this.childrenDOM = [];
        this.mainDOM.remove();
    }
};

var u1_1_1 = new Upgrade(1, "small field upgrade", 5, 15, "Boosts building 1 production bonus a little bit");

export var upgrades = {tier1: {u1:u1_1_1}};