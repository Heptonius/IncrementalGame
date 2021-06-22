import {Task} from './classes.js'
import {player, resourcesP1} from './scripts.js'

//tasks
var task1 = new Task(new Decimal(30),new Decimal(0),false,"task1-name","task1-lvl","task1-exp");
var task2 = new Task(new Decimal(60),new Decimal(0),false,"task2-name","task2-lvl","task2-exp");
var task3 = new Task(new Decimal(300),new Decimal(0),false,"task3-name","task3-lvl","task3-exp");
var task4 = new Task(new Decimal(400),new Decimal(0),false,"task4-name","task4-lvl","task4-exp");
var task5 = new Task(new Decimal(500),new Decimal(0),false,"task5-name","task5-lvl","task5-exp");



export var TaskFunctions = {
    setTasksForStory : function setTasksForStory() {
        if (player.currentSpec=='mechanic') {//mechanic tasks
            if (player.gamePhase==0) {
                task1.setTaskName("Collect Scrap");
                task1.rewTargetsAmtsChances=[{target:resourcesP1.secCurrency1,amountMin:new Decimal(1),amountMax:new Decimal(3),chance:0.75}];
                task1.completionRewardFunct = (compTimes) => task1.rewTargetsAmtsChances.forEach(element => {
                    var roll = Math.random().toFixed(5); var elemChance = task1.chanceInclBonuses(element.chance);
                        if (roll <= elemChance) {
                            let probabilityAmt = new Decimal(1).mul(element.amountMax.sub(element.amountMin)).mul(Math.floor(elemChance)+roll*elemChance%1).round();
                            element.target.Currency=element.target.Currency.add(element.amountMin.add(probabilityAmt).mul(compTimes));
                        }
                        else{ //didnt proc
                        }
                    }
                );
                task2.setTaskName("Repair Stuff");
                task2.rewTargetsAmtsChances=[{target:player.currency,amountMin:new Decimal(5),amountMax:new Decimal(10),chance:1.25}];
                task2.reqTargetsAmtsChances=[{target:resourcesP1.secCurrency1,amountReq: new Decimal(5),chance:0.85}];
                task2.canActivate=()=>{
                    if(task2.resourcesSpentAlready){return true;}
                    let requirementsMet = true;
                    task2.reqTargetsAmtsChances.forEach(element=>{element.target.Currency.cmp(element.amountReq)<0? requirementsMet=false : element}); 
                    if (requirementsMet){
                        task2.reqTargetsAmtsChances.forEach(element=>{element.target.Currency=element.target.Currency.sub(element.amountReq);element.target.refreshValueOnPage();});
                        task2.resourcesSpentAlready=true;
                        return true;
                    }
                    else return false;
                }
                task2.completionRewardFunct = (compTimes) => task2.rewTargetsAmtsChances.forEach(element => {
                    var roll = Math.random().toFixed(5); var elemChance = task2.chanceInclBonuses(element.chance);
                        if (roll <= elemChance) {
                            var probabilityAmt = new Decimal(1).mul(element.amountMax.sub(element.amountMin)).mul(Math.floor(elemChance)+roll*elemChance%1).round();
                            element.target.Currency=element.target.Currency.add(element.amountMin.add(probabilityAmt).mul(compTimes));
                            if(compTimes.cmp(1)>0){task2.reqTargetsAmtsChances.forEach(
                                element=>{element.target.Currency=element.target.Currency.sub(element.amountReq.mul(compTimes));element.target.refreshValueOnPage();})
                            } 
                        }
                        else{ //didnt proc
                        }
                    }
                );
                return
            }
        }
        if (player.currentSpec=='warrior') {
            
        }
        if (player.currentSpec=='priest') {
            
        }
    }    
}

export const tasks = {t1 : task1,t2 : task2,t3 : task3,t4 : task4,t5 : task5};