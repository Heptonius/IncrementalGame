//http-server W:\Users\Zdenek\Dokumenty\CodingProjects\IncrGameFolder -c-1 //http test server in NCP

//imports
import {Building, Task, Currency, TextLog} from './classes.js'
import {Upgrade, upgrades} from './upgrades.js' //
import {gameStart, TryToProgressFunct} from './story.js'
import {tasks} from './tasks.js'

//game variables
var mainCurrency = new Currency(0,"Credits",'',"Credits","credits_div");
var secCurrency1 = new Currency(1,"Scrap","warrior","sec1currency_txt","sec1currency_div");
var secCurrency2 = new Currency(1,"Better Scrap","mechanic","sec2currency_txt","sec2currency_div");
var secCurrency3 = new Currency(1,"Electronics","mechanic","sec3currency_txt","sec3currency_div");
var secCurrency4 = new Currency(1,"",'false',"sec4currency_txt","sec4currency_div");
var secCurrency5 = new Currency(1,"",'false',"sec5currency_txt","sec5currency_div");



////buildings declarations
var building1 = new Building(1, "small field", 1, 10,0);
var building2 = new Building(2, "big field", 5, 100,0);
var building3 = new Building(3, "humongeous field", 20, 5000,0);
export var buildings = [building1, building2, building3];

//game object definitions -> player, resources, ...
export let player = {onClickGain: 1, intervalBase : 1000, intervalCurrent : 1000, gamePhase: 0, timeSpeedIncrease:0, 
    currency: mainCurrency, currentSpec:"mechanic", currentTextLog: null, taskBaseExpProgress: new Decimal(10), focusState:true, taskProgTickRate:100};

export var resourcesP1 = {secCurrency1, secCurrency2, secCurrency3, secCurrency4, secCurrency5};


//var buildings = [building1, building2, building3];

////upgrades and their effects and corresponding functions

//var upgrade1 = new Upgrade(1, "small field upgrade", 5, 15); upgrade1.setEffFunct = () => building1.BaseGain += upgrade1.BaseGain;

function BuyAndActivateUpgrade(upg) {
    upg.BuyUpgrade = player.currency.Currency.cmp(upg.CostToBuy);
    if (upg.isBought && !upg.hasFunctRan) {
        upg.upgradeEffectFunction();
        upg.hasFunctRan = true;
        console.log("upg effect has been run");
    }
};

//document variables
let CreditsValueTxt,Prestige1ValueTxt,Prestige2ValueTxt,Prestige3ValueTxt,Prestige4ValueTxt;
let SecCurrency1ValueTxt,SecCurrency2ValueTxt,SecCurrency3ValueTxt,SecCurrency4ValueTxt,SecCurrency5ValueTxt;
let currencyBtn;
let timeSpeedTxt;
let timeSpeedBtn;
let activityTxt;
let testBtn;
let loadBtn,saveBtn,selectMechBtn,selectWarrBtn,selectPriestBtn;

let building1btn;
let building1txt;
let building2btn;
let building2txt;
let building3btn;
let building3txt;

let adventureMenu = [];
let adventureTab,adventureTab1,adventureTab2,adventureTab3,adventureTab4;
let adventureTabBtn1, adventureTabBtn2, adventureTabBtn3, adventureTabBtn4;

document.addEventListener("DOMContentLoaded", setDOMS());

//util functions

//DOM initialization
function setDOMS() {    
    
    CreditsValueTxt = document.getElementById("credits_value_txt");Prestige1ValueTxt=document.getElementById("pr1currency_value_txt");
    Prestige2ValueTxt=document.getElementById("pr2currency_value_txt");Prestige3ValueTxt=document.getElementById("pr3currency_value_txt");
    Prestige4ValueTxt=document.getElementById("pr4currency_value_txt");

    mainCurrency.DOMElem = document.getElementById("credits_value_txt");
    secCurrency1.DOMElem = document.getElementById("sec1currency_value_txt");
    secCurrency2.DOMElem = document.getElementById("sec2currency_value_txt");
    secCurrency3.DOMElem = document.getElementById("sec3currency_value_txt");
    secCurrency4.DOMElem = document.getElementById("sec4currency_value_txt");
    secCurrency5.DOMElem = document.getElementById("sec5currency_value_txt");

    currencyBtn = document.getElementById("currency_btn");
    timeSpeedTxt = document.getElementById("time_speed_txt");
    activityTxt = document.getElementById("#ctivity_txt");
    timeSpeedBtn = document.getElementById("time_speed_btn");
    testBtn = document.getElementById("test_btn");
    loadBtn = document.getElementById("load-btn");
    saveBtn = document.getElementById("save-btn");
    selectMechBtn=document.getElementById("selectMechanicBtn");selectWarrBtn=document.getElementById("selectWarriorBtn");selectPriestBtn=document.getElementById("selectPriestBtn");
    
    
    //buildings
    building1btn = document.getElementById("building1_btn");
    building1txt = document.getElementById("building1_cnt_txt");
    building2btn = document.getElementById("building2_btn");
    building2txt = document.getElementById("building2_cnt_txt");
    building3btn = document.getElementById("building3_btn");
    building3txt = document.getElementById("building3_cnt_txt");  
    
    //adventures
    adventureTab = document.getElementById("adventure-menu");
    adventureTab1 = document.getElementById('adventure-tab1')
    adventureTab2 = document.getElementById('adventure-tab2')
    adventureTab3 = document.getElementById('adventure-tab3')
    adventureTab4 = document.getElementById('adventure-tab4')
    adventureMenu.push(adventureTab1);
    adventureMenu.push(adventureTab2);
    adventureMenu.push(adventureTab3);
    adventureMenu.push(adventureTab4);

    adventureTabBtn1 = document.getElementById('adventure-tab-nav-btn1')
    adventureTabBtn2 = document.getElementById('adventure-tab-nav-btn2')
    adventureTabBtn3 = document.getElementById('adventure-tab-nav-btn3')
    adventureTabBtn4 = document.getElementById('adventure-tab-nav-btn4')

    tasks.t1.DOMElem = document.getElementById("task-btn1");
    tasks.t2.DOMElem = document.getElementById("task-btn2");
    tasks.t3.DOMElem = document.getElementById("task-btn3");
    tasks.t4.DOMElem = document.getElementById("task-btn4");
    tasks.t5.DOMElem = document.getElementById("task-btn5");
};


function saveGame() {
    localStorage.setItem("player-save", JSON.stringify(player));
    localStorage.setItem("buildings-save", JSON.stringify(buildings));
};

function loadGame() {
    var loadedPlayer = localStorage.getItem("player-save");
    var loadedBuildings = localStorage.getItem("buildings-save");
    if (loadedPlayer) {
        player = JSON.parse(loadedPlayer);
        player.currency.Currency = new Decimal(player.currency.Currency);        
    }
    if (loadedBuildings) {        
        var tempbuildings = JSON.parse(loadedBuildings);        
        for (let index = 0; index < tempbuildings.length; index++) {            
            buildings[index] = new Building(tempbuildings[index].Tier,tempbuildings[index].Name,
            tempbuildings[index].BaseGain,tempbuildings[index].BaseCost,tempbuildings[index].Count);            
        }
    }
    fullUpdate();
};

var buildingTxts = [building1txt, building2txt, building3txt];

//adventure 
function switchAdventureTab(param) {
    var advTabRef = param.currentTarget;
    adventureMenu[advTabRef.advTabArrayPlace].style.visibility="visible";
    const tempAdvTabRef = adventureMenu.map((x) => x);
    tempAdvTabRef.splice(advTabRef.advTabArrayPlace,1);    
    tempAdvTabRef.forEach(element => element.style.visibility="hidden");
};

//task functions

function progressTasks() {
    Object.values(tasks).forEach(element => {if(element.active){element.progressTask(element)}});
    tasks.t1.setTaskTickTime();
    const kkeke = setTimeout(progressTasks,100/(1+(player.taskProgTickRate-100)/100));
}

//game functions
function selectSpec(param) {
    player.currentSpec=param.currentTarget.spec;
    gameStart(player, buildings, resourcesP1, tasks);
    document.getElementById("phase0div").style.display="none";
}

function fullUpdate() {
    player.currency.refreshValueOnPage();
    updateAllBuildingsState();
}
function updateBuildingsState(tier) {
    buildingTxts[tier].innerHTML = buildings[tier].Count;
};

function updateAllBuildingsState() {
    for (let i = 0; i < buildingTxts.length; i++) {
        updateBuildingsState(i);        
    }
};
buildings.UPDATE=updateAllBuildingsState; //set buildings propperty for ability to refresh state from other files

export function numberToExpFormat(x) {
    if(x.e>15&&x.layer!=0) {
        return `${x.toFixed(2)}`;
    }
    if(x.e>=9&&x.layer==0){
        return `${x.mantissa.toFixed(2)}e${x.e}`;
    }else
    {
        return numberWithCommas(x);
    }
}
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function updateMainCurrency(currencyDOM) {
    currencyDOM.innerHTML = `${(player.currency.Currency.mag%1==0&&player.currency.Currency.e<9) ? numberWithCommas(player.currency.Currency) : numberToExpFormat(player.currency.Currency)} + ${CurrPerSecond}/s`;
};

var CurrPerSecond = new Decimal(0);

function increment() {        
    var currencyGain = new Decimal(calculateBuildingsGain());    
    CurrPerSecond = currencyGain.mul(player.intervalBase/player.intervalCurrent).add(player.onClickGain);
    if (CurrPerSecond % 1 != 0) {   //is currency per second a whole number? if not, format to 2 decimals -> later add exponential formating?
        CurrPerSecond = CurrPerSecond.toFixed(2);
    }
    player.currency.Currency = player.currency.Currency.add(player.onClickGain).add(currencyGain);
    player.currency.refreshValueOnPage();
    updateAllBuildingsState();
};

function calculateBuildingsGain() {     //calculates total gain factor from all buildings
    var tempBuildingGainFactor = new Decimal(0);
    buildings.forEach(element => tempBuildingGainFactor = tempBuildingGainFactor.add(element.gainFactor));    
    return(tempBuildingGainFactor);
};

function accelerateTimeBtn() {
    player.timeSpeedIncrease++;
    player.intervalCurrent = Math.ceil(player.intervalBase / (1+player.timeSpeedIncrease/100)); 
    timeSpeedTxt.innerHTML = `Time is being accelerated by: ${player.timeSpeedIncrease}%, current interval is: ${player.intervalCurrent}`;    
};

/* "Anim start stop"
var animPlaying = true;
function testFunction() {    
    if (!animPlaying) {
        document.getElementById("adventure-menu").style.animationIterationCount = "infinite";
        animPlaying = true;
        console.log("started");
    } else{
        document.getElementById("adventure-menu").style.animationIterationCount = 0;
        animPlaying = false;
    }    
};
 */

var visibilitySwitch = false;
function switchDOMVisibility() {    //"Element visibility on/off"  -> needs to be redone to be modular for any element
    if (!visibilitySwitch) {
        document.getElementById('tasks-adventures-div').style.display="none";
        visibilitySwitch = true;
        console.log("off");
    }else{
        document.getElementById('tasks-adventures-div').style.display="inline-flex";
        visibilitySwitch = false;
        console.log("on");
    }   
};

/*  TESTING TERRITORY   */
var flipflop = true;
function testFunction() {
    
};
/*  TESTING TERRITORY   */

function accelerateTime() {
    player.intervalCurrent = Math.ceil(player.intervalBase / (1+player.timeSpeedIncrease/100));
    timeSpeedTxt.innerHTML = `Time is being accelerated by: ${player.timeSpeedIncrease}%, current interval is: ${player.intervalCurrent}`;    
};

function buyBuilding(param) {    
    var tempBuildRef = param.currentTarget;
    var currentPriceToBuy = new Decimal(buildings[tempBuildRef.tier-1].priceToBuy);
    if (player.currency.Currency.cmp(currentPriceToBuy) >= 0) {
        //console.log(buildings[tempBuildRef.tier-1].priceToBuy);
        console.log(`You bought a building, money spent: ${currentPriceToBuy}.`);
        player.currency.Currency = player.currency.Currency.sub(currentPriceToBuy);
        buildings[tempBuildRef.tier-1].Count++;        
        updateBuildingsState(tempBuildRef.tier-1);
        player.currency.refreshValueOnPage();
    } else {
        console.log(`Not enough money to buy this building, money needed: ${currentPriceToBuy}, money you have: ${player.currency.Currency}.`);
    }
};

//event listeners       TODO!!! rework event listeners for only one event listener branching based on target !!!
function buttonClick () {    
    increment();
};

currencyBtn.addEventListener("click", buttonClick);
timeSpeedBtn.addEventListener("click", accelerateTimeBtn);
testBtn.addEventListener("click", testFunction);
saveBtn.addEventListener("click", saveGame);
loadBtn.addEventListener("click", loadGame);

//class selection buttons
selectMechBtn.spec="mechanic";selectMechBtn.addEventListener("click",selectSpec);
/*selectWarrBtn.spec="warrior";selectWarrBtn.addEventListener("click",selectSpec);
selectPriestBtn.spec="priest";selectPriestBtn.addEventListener("click",selectSpec);*/

building1btn.tier = 1;
building1btn.addEventListener("click", buyBuilding);
building2btn.tier = 2;
building2btn.addEventListener("click", buyBuilding);
building3btn.tier = 3;
building3btn.addEventListener("click", buyBuilding);

tasks.t1.DOMElem.addEventListener("click", ()=>{tasks.t1.active? tasks.t1.activate=false : tasks.t1.activate=true});
tasks.t2.DOMElem.addEventListener("click", ()=>{tasks.t2.active? tasks.t2.activate=false : tasks.t2.activate=true});
tasks.t3.DOMElem.addEventListener("click", ()=>{tasks.t3.active? tasks.t3.activate=false : tasks.t3.activate=true});
tasks.t4.DOMElem.addEventListener("click", ()=>{tasks.t4.active? tasks.t4.activate=false : tasks.t4.activate=true});
tasks.t5.DOMElem.addEventListener("click", ()=>{tasks.t5.active? tasks.t5.activate=false : tasks.t5.activate=true});

/*
adventureTabBtn1.advTabArrayPlace = 0;
adventureTabBtn1.addEventListener("click", switchAdventureTab);
adventureTabBtn2.advTabArrayPlace = 1;
adventureTabBtn2.addEventListener("click", switchAdventureTab);
adventureTabBtn3.advTabArrayPlace = 2;
adventureTabBtn3.addEventListener("click", switchAdventureTab);
adventureTabBtn4.advTabArrayPlace = 3;
adventureTabBtn4.addEventListener("click", switchAdventureTab); */

function checkForFocusState(){
    player.focusState=!document.hidden;
    const kkeke = setTimeout(checkForFocusState,50);
}

//game loop

var IncrementalLoop = setTimeout(gameLoop, player.intervalBase);
progressTasks();
checkForFocusState();
var blurredTimeSet = false;
var TimeBlurred = Date.now();
var TotalBlurredTime = 0;

function gameLoop() {    
    TryToProgressFunct();    
    var IncrementalLoop = setTimeout(gameLoop, player.intervalCurrent); // update loop timer
};

//gameStart(player, buildings, resourcesP0, tasks);