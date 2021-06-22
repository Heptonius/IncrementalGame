import {buildings, resourcesP1, player} from './scripts.js'
import {upgrades} from './upgrades.js'
import {TextLog} from './classes.js'
import {tasks, TaskFunctions} from './tasks.js'



export function gameStart() {
    if (player.currentSpec=="mechanic") {
        setGameForMechanic(player.gamePhase);
        return;
    }
    if (player.currentSpec=="warrior") {
        console.log("warrior has been chosen");
    }
    if (player.currentSpec=="priest") {
        console.log("priest has been chosen");
    }
}
export function TryToProgressFunct() {  //everchanging progress function
}
//Individual game starts, spec settings
function setGameForMechanic(gPhase) {
    if (gPhase==0) {
        resourcesP1.secCurrency1.name="Scrap";resourcesP1.secCurrency1.spec="mechanic";resourcesP1.secCurrency1.isActive=true;
        resourcesP1.secCurrency2.name="Good Quality Scrap";resourcesP1.secCurrency2.spec="mechanic";
        resourcesP1.secCurrency3.name="Electronics";resourcesP1.secCurrency3.spec="mechanic";
        
        TaskFunctions.setTasksForStory();        
        player.currency.Currency=player.currency.Currency.add(121); //give money to buy first building
        player.currency.refreshValueOnPage();
        let mechText1_0 = new TextLog(`Hmmm... You managed to muster some money after all. Great! \nYou could try to get some sort of a workplace to start your career. Just take a look around if you can find something within your possibilities.`).createAndPlaceTextLog();
        
        TryToProgressFunct=p0q0;    
        return p0UISetting();
    }
    if (gPhase==1) {
        console.log("mechanic has been chosen at phase 1");
    }    
}

//UI Setting functs
function setCurrencyTags(resources) {
    Object.values(resources).forEach(element=>element.isActive? element.setDOMElementName(player.currentSpec) : element);
}

//phase0 gameStart UI setting
function p0UISetting() {
    setCurrencyTags(resourcesP1);
    document.getElementById("main-content-window").style.display="block";document.getElementById("main-content-window").scrollTop=0;
}

//tasks definitions



//phase1 progress path
function p0q0() {
    if (buildings[0].Count>=1) {
        let mechText1_1= new TextLog("Marvelous! You got a decent deal on this old warehouse next door. It's not a workshop per se, but it should be good enough for a starter. Now get to work!").createAndPlaceTextLog();
        tasks.t1.DOMElem.style.display="block"; tasks.t2.DOMElem.style.display="block";
        TryToProgressFunct = p1q1;
        return true;
    }
}
function p1q1() {
    if (player.currency.currency>=1000) {
        
        //return true;        
    }
}
function p1q2() {
    if (player.currency.currency>=5000&&buildings[0].Count>=10) {
        console.log("quest 2 done");
        TryToProgressFunct = p1q1;
        player.currency.currency=player.currency.currency.add(50000)
        return true;
    }
}

//phase1 progress path
