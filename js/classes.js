import {numberToExpFormat, numberWithCommas , player, resourcesP1} from './scripts.js'

export class Building {
    constructor(inputTier, inputName, inputBaseGain, inputBaseCost, inputCount){
        this.Tier = inputTier;
        this.Name = inputName;
        this.BaseGain = inputBaseGain;
        this.BaseCost = inputBaseCost;
        this.Count = inputCount;
        this.GrowthExponent = 1.2;        
    };

    get gainFactor() {        
        return this.calculateGainFactor();
    };

    calculateGainFactor() {        
        return this.BaseGain*this.Count;
    };

    get priceToBuy() {
        return this.calcuatePriceToBuy();
    };

    calcuatePriceToBuy() {                
        var tempPrice = new Decimal(this.BaseCost);
        tempPrice = tempPrice.mul(new Decimal(1.2).pow(this.Count)); //this.BaseCost*Math.pow(this.GrowthExponent,this.Count);     
        return tempPrice.round();
    };
};

export class Currency {
    constructor(inputPhase, inputName, inputSpec, inputTextReference, inputDivReference){
        this.phase = inputPhase; this.name = inputName; this.spec = inputSpec; this.isActive=false;
        this.Currency=new Decimal(0); this.gainPerSecond=new Decimal(0); this.textReference = inputTextReference;this.DivReference=inputDivReference; this.DOMElem;
        };        
    setDOMElementName=function(currentSpec){
        if (this.spec==='false') {  //non visible display option
            document.getElementById(this.DivReference).style.display="none";            
        }
        if (currentSpec==this.spec) {   //set name and display to visible
            document.getElementById(this.textReference).innerHTML=this.name;
            document.getElementById(this.DivReference).style.display="block";  
        }        
    };
    FormatedCurrencyValue(value){
        return (value.mag%1==0&&value.e<9) ? numberWithCommas(value) : numberToExpFormat(value)
    }
    refreshValueOnPage=function(){
        this.DOMElem.innerHTML= `${this.FormatedCurrencyValue(this.Currency)} + ${this.FormatedCurrencyValue(this.gainPerSecond)}/s`;//`${numberToExpFormat(this.Currency)}`;
    };
};

//`${(player.currency.Currency.mag%1==0&&player.currency.Currency.e<9) ? numberWithCommas(player.currency.Currency) : numberToExpFormat(player.currency.Currency)} + ${CurrPerSecond}/s`


let dateToCheckAgainst = Date.now();
function BASIC_TASK_PROG(){
    if(player.focusState){return new Decimal(1);}
    else{
        console.log((Date.now()-dateToCheckAgainst)/player.taskProgTickRate)
        return new Decimal((Date.now()-dateToCheckAgainst)/player.taskProgTickRate);
    }
}

export class Task{
    constructor(inputProgressToComplete, inputCurrentProgress, inputIsActive, inputTxtElemID, inputTaskLvlID, inputTaskExpID){
        this.progressToComplete = inputProgressToComplete; this.currentProgress = inputCurrentProgress; this.completedTimes;       
        this.active=inputIsActive; this.canActivate=()=>{return true}; this.resourcesSpentAlready=false;
        this.DOMElem;
        this.taskName; this.txtElemId=inputTxtElemID;
        this.completionRewardFunct=(compTimes)=>{};
        this.currencyToRefresh;
        this.rewTargetsAmtsChances=[{}]; this.reqTargetsAmtsChances=[];
        this.currentTaskEXP=new Decimal(0); this.expToLvlUp = new Decimal(50); this.taskLVL=1; this.taskLvlID=inputTaskLvlID; this.taskExpID=inputTaskExpID;
    };
    get possibleTimesToDo(){
        if (this.reqTargetsAmtsChances.length==0) {return -1;} //if there are no requirements, infinitely-times possible
        var possTimes = this.reqTargetsAmtsChances[0].target.Currency.div(this.reqTargetsAmtsChances[0].amountReq).floor(); //[{target:resourcesP1.secCurrency1,amountReq: 5,chance:0.85}];
        this.reqTargetsAmtsChances.forEach(element=>{
            var tempPoss = element.target.Currency.div(element.amountReq).floor(); tempPoss<possTimes? possTimes = tempPoss : possTimes;});
        return possTimes;
    }
    chanceInclBonuses(targetChance){
        //basic lvl scaling - possible to improve and include upgrades later
        var tempChance = targetChance+Math.pow(0.5*targetChance*Math.floor(this.taskLVL-1),1.35);

        return tempChance;
    }
    set activate(state){
        if (state==false) {
            this.active=state;
            return;
        }
        if (state==true&&this.canActivate()) {
            this.active=state;
            return;
        }        
    }
    setTaskName(name){
        this.taskName=name;
        document.getElementById(this.txtElemId).innerHTML=this.taskName;
    }
    gainTaskEXP(compTimes){
        this.currentTaskEXP=this.currentTaskEXP.add(player.taskBaseExpProgress.mul(compTimes)).round();
        this.checkLvlUP();
        this.updateTaskElemValues();
    }
    checkLvlUP(){ //trochu líný kus kódu, kandidát na předělání na analytickou funkci a ne iterativní :) 
        while (this.currentTaskEXP.cmp(this.expToLvlUp)>=0) {
            this.currentTaskEXP=this.currentTaskEXP.sub(this.expToLvlUp);
            this.taskLVL++;
            this.expToLvlUp=this.expToLvlUp.mul(1.6).round();
        }
    }
    updateTaskElemValues(){
        document.getElementById(this.taskLvlID).innerHTML=`LVL ${this.taskLVL}`;
        document.getElementById(this.taskExpID).innerHTML=`${numberToExpFormat(this.currentTaskEXP)} / ${numberToExpFormat(this.expToLvlUp)} EXP`;
    }
    completeTask(){
        this.resourcesSpentAlready=false;
        this.currentProgress = this.currentProgress.sub(this.progressToComplete.mul(this.completedTimes.trunc(this.completedTimes.log(10).floor())));
        let howManyCallsToDo;
        this.completedTimes.min(this.possibleTimesToDo).cmp(-1)==0? howManyCallsToDo=this.completedTimes: howManyCallsToDo=this.completedTimes.min(this.possibleTimesToDo).max(1);
        this.completionRewardFunct(howManyCallsToDo);
        this.rewTargetsAmtsChances.forEach(element=>element.target.refreshValueOnPage());
        this.gainTaskEXP(howManyCallsToDo);
        this.active=false;
        this.activate=true;
        if (this.active==false) {this.DOMElem.style.setProperty('--h',`0%`);}
    }    
    progressTask(){            
        this.currentProgress=this.currentProgress.add(BASIC_TASK_PROG()); //task debug speed here!!!!
        if (this.currentProgress.cmp(this.progressToComplete)>=0) {
            this.completedTimes=this.currentProgress.div(this.progressToComplete).floor();
            this.completeTask();
        }   
        this.DOMElem.style.setProperty('--h',`${this.currentProgress.div(this.progressToComplete).mul(100)}%`)        
    }
    setTaskTickTime(){dateToCheckAgainst = Date.now();}    
};

export class TextLog{
    constructor(inputTextToLog){
        this.textToLog = inputTextToLog;
        this.parrentDOMElem=document.getElementById('text-log-holder');
        this.DOMElemToPlace;
    }

    createAndPlaceTextLog(){
        this.DOMElemToPlace = document.createElement("div"); this.DOMElemToPlace.innerHTML=this.textToLog; this.DOMElemToPlace.setAttribute("class","text-log");
        this.parrentDOMElem.appendChild(this.DOMElemToPlace);
        player.currentTextLog = this.DOMElemToPlace;
        this.parrentDOMElem.scrollTop = this.DOMElemToPlace.offsetTop;
    }
}