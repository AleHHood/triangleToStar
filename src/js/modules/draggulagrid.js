import dragula from 'dragula';
import getscheme from './getScheme';

const dragggrid = () => {

    const blockBar = document.querySelector('.calculation__blockBar'),
    blockHome = document.querySelectorAll('.calculation__block'),
    container = document.querySelector('.calculation__container'),
    workTable = document.querySelector('.calculation__workTable'),
    blockSettings = document.querySelector('.blocksettings__container'),
    cell = document.querySelectorAll('.grid__cell'),
    wrapperFormN = document.querySelector('.blocksettings__wrapper-N'),
    wrapperFormKnots = document.querySelector('.blocksettings__wrapper-Knots'),
    wrapperFormR = document.querySelector('.blocksettings__wrapper-R'),
    wrapperFormE = document.querySelector('.blocksettings__wrapper-E'),
    inputFormR = document.querySelector('#rblock'),
    inputFormE = document.querySelector('#eblock'),
    inputFormN = document.querySelector('#nblock'),
    inputFormKnots = document.querySelector('#knotsblock'),
    notifyR = document.querySelector('#notifyR'),
    notifyE = document.querySelector('#notifyE'),
    notifyN = document.querySelector('#notifyN'),
    blocks = [], // массив блоков
    branchs = [],
    branch = [],
    branch3 = [],
    branch4 = [];
    let copyDrakeContainers = [],
    tx = 10,
    numId = 10,
    ActiveBlock = 0; // активный блок
    const formSettings = document.querySelector('.calculation__settings'),
    ActiveBlocks = []; //массив блоков в рабочей зоне
    let formData;

    class Block {
        constructor(rotate, type, voltage, resistance, cell, id, element, number, error, x, y) {
            this.rotate = rotate; // 0 - горизонтальное пол. 1 - вертикальное
            this.type = type; // 0=R, 1=E, 2=B, 3=K, 4=Corner;
            this.voltage = voltage;
            this.resistance = resistance;
            this.cell = cell;
            this.id = id;
            this.element = element;
            this.number = number;
            this.error = error;
            this.x = x;
            this.y = y;
        }
        getParametrForm(){
            switch(this.type){
                case 0:
                    wrapperFormN.style.display = 'block';
                    wrapperFormKnots.style.display = 'none';
                    wrapperFormR.style.display = 'block';
                    wrapperFormE.style.display = 'none';
                    inputFormR.value = this.resistance;
                    break;
                case 1:
                    wrapperFormN.style.display = 'block';
                    wrapperFormKnots.style.display = 'none';
                    wrapperFormE.style.display = 'block';
                    wrapperFormR.style.display = 'none';
                    inputFormE.value = this.voltage;
                    break;
                case 3:
                    wrapperFormKnots.style.display = 'block';
                    wrapperFormN.style.display = 'none';
                    wrapperFormE.style.display = 'none';
                    wrapperFormR.style.display = 'none';
                    inputFormE.value = this.voltage;
                    break;
                default:
                    wrapperFormN.style.display = 'none';
                    wrapperFormKnots.style.display = 'none';
                    wrapperFormE.style.display = 'none';
                    wrapperFormR.style.display = 'none';
                break;
            }
            inputFormN.removeAttribute('data-form');
            inputFormN.setAttribute('data-form', this.id);
            inputFormN.value = this.number;    
        }
        getErrorMessage(){
            let tNotify = 0;
            notifyN.style.display = 'none';
            switch (this.type) {
                case 0:
                    tNotify = notifyR;
                    tNotify.style.display = 'none';
                    break;
                case 1:
                    tNotify = notifyE;
                    tNotify.style.display = 'none';
                    break;            

            }
                    switch (this.error) {
                        case 'error':
                            tNotify.style.display = 'block';
                            tNotify.textContent   = 'Введите значение от 0 до 1000';                            
                            break;
                        case 'errorNumber':
                            notifyN.style.display = 'block';
                            notifyN.textContent   = 'Введите значение от 0 до 1000';                          
                            break;
                        case 'number':
                            notifyN.style.display = 'block';
                            notifyN.textContent   = 'Максимальное з';                          
                            break;
                    
                        default:
                            break;
                    }
                     
        }
        Validation(InputForm, el){
            let tb = 0;
            if(((InputForm.value >= 1000) || (InputForm.value <= 0)) && (InputForm !== inputFormN)){
                this.error = 'error';
                this.getErrorMessage();            
            }
            else{
                if((InputForm.value < 0) || (InputForm.value >= 1000)){
                    this.error = 'errorNumber';
                    this.getErrorMessage();
                    this.number = inputFormN.value;
                }else{
                    el.style.display = 'none';////////////////
                    switch (this.type) {
                        case 0:
                            this.number = `R${inputFormN.value}`;
                            break;
                        case 1:
                            this.number = `E${inputFormN.value}`;
                            break;
                    }
                                /* this.number = inputFormN.value; */
                                this.error = '';
                }
            }
            console.log(`this error =   ${this.error}`);
        }
    }

//-----------------Добавляем блоки из блокБар в blocks------------//

    blockHome.forEach((element, i) => {
        blocks[i] = new Block();
        blocks[i].rotate = 0;
        blocks[i].voltage = 0;
        blocks[i].resistance = 0;
        blocks[i].type = +element.id;
        blocks[i].id = element.id;
        blocks[i].element = element;
        console.log(blocks[i]);
    });
    
    
//-----------------Добавляем перетаскивание для блоков------------//
    

    const drake = dragula([blockBar, ...cell], {
        accepts: function (el, target) {
          return target !== blockBar;
        }
      });
 

    drake.containers.forEach(element => {
        copyDrakeContainers.push(element);
    });

    function LimitingByDragging() {
        container.addEventListener('mousedown', function(event) {
            const target = event.target;


            if(target && target.classList.contains('calculation__block')) {
                blocks.forEach(element => {
                    element.element.classList.remove('active');
                });
                getForm(target);
                drake.containers = [];
                copyDrakeContainers.forEach(element => {
                    drake.containers.push(element);
                });
                cell.forEach((element, i) => {
                    if((element.firstChild) && (element.firstChild != event.target)){
                        i = i + 1;
                        drake.containers.splice(i, 1, 0);
                        i = i - 1;
                    }                   
                });    
                }
            if(target && target.classList.contains('grid__cell')){
                blockSettings.style.display = 'none';
                blocks.forEach(element => {
                    element.element.classList.remove('active');
                });
            }
        });
    }

    function MobileLimitingByDragging() {
        container.addEventListener('touchstart', function(event) {
            const target = event.target;
            if(target && target.classList.contains('calculation__block')) {
                drake.containers = [];
                copyDrakeContainers.forEach(element => {
                    drake.containers.push(element);
                });
                cell.forEach((element, i) => {
                    if((element.firstChild) && (element.firstChild != event.target)){
                        i = i + 1;
                        drake.containers.splice(i, 1, 0);
                        i = i - 1;
                    }
                });    
                }  
        });
    }


    function GetNewBlock () {
        let classesBlock = 0;
        blockBar.addEventListener('mousedown', function(event) {
            const target = event.target;
            matchBlocks('calculation__block-R');
            if(target && target.classList.contains('calculation__block-R')) {
                classesBlock = 'calculation__block-R';
                render(classesBlock);    
                }
            matchBlocks('calculation__block-E');
            if(target && target.classList.contains('calculation__block-E')) {
                classesBlock = 'calculation__block-E';
                render(classesBlock);      
                }
            matchBlocks('calculation__block-K');
            if(target && target.classList.contains('calculation__block-K')) {
                classesBlock = 'calculation__block-K';
                render(classesBlock);      
                }
            matchBlocks('calculation__block-B');
            if(target && target.classList.contains('calculation__block-B')) {
                classesBlock = 'calculation__block-B';
                render(classesBlock);      
                }
            matchBlocks('calculation__block-Corner');
            if(target && target.classList.contains('calculation__block-Corner')) {
                classesBlock = 'calculation__block-Corner';
                render(classesBlock);      
                }
        });
    }

    function matchBlocks(classBlock){
        let x = 0;
        blockBar.children.forEach((element, i) => {
            if((element.classList == `calculation__block ${classBlock}`) || (element.classList == `calculation__block none ${classBlock}`)){
                x = x + 1;
                if(x > 1){
                blockBar.children[i].remove();
                }
            }
        });
    }

    
    function ShowBlock(classBlock){
        let x = 0;
        let hiddenBlock = 0;
        blockBar.children.forEach((element, i) => {
            if(element.classList == `calculation__block none ${classBlock}`){
                hiddenBlock = i;
            }
            if(element.classList == `calculation__block ${classBlock}`){
                x = x + 1;
            }
        });

        if(x == 0){
            blockBar.children[hiddenBlock].classList.remove('none');
        }
    }

    function ShowBlocks(){
        ShowBlock('calculation__block-R');
        ShowBlock('calculation__block-E');
        ShowBlock('calculation__block-K');
        ShowBlock('calculation__block-B');
        ShowBlock('calculation__block-Corner');
        console.log('Остановитесь!!');
    }
    

    function render(classesBlock){
        const newBlock = document.createElement('div');
        newBlock.classList.add('calculation__block');
        newBlock.classList.add('none');
        newBlock.classList.add(classesBlock);
        newBlock.setAttribute('id', numId);
        writeNewBlock(classesBlock, numId, newBlock);
        numId = numId + 1;
        blockBar.append(newBlock);     
    }
    
    function writeNewBlock(classesBlock, id, element){
        blocks[tx] = new Block();
        blocks[tx].id = id;
        blocks[tx].element = element;
        blocks[tx].rotate = 0;
        blocks[tx].voltage = 0;
        blocks[tx].resistance = 0;
        if (classesBlock == 'calculation__block-R'){
            blocks[tx].type = 0;
        }
        if (classesBlock == 'calculation__block-E'){
            blocks[tx].type = 1;
        }
        if (classesBlock == 'calculation__block-B'){
            blocks[tx].type = 2;
        }
        if (classesBlock == 'calculation__block-K'){
            blocks[tx].type = 3;
        }
        if (classesBlock == 'calculation__block-Corner'){
            blocks[tx].type = 4;
        }
        console.log(blocks[tx]);
        tx = tx + 1;
    }

//Forms

function getForm(target){
    if(target && target.classList.contains('calculation__block')) {
        blocks.forEach((elem, i) => {
            if(elem.element == target){
                elem.getParametrForm();
                elem.getErrorMessage();
            }
        });
        blockSettings.style.display = 'flex';
        target.classList.add('active');
    }
}

    function getValueFromForm(){
        blockSettings.addEventListener('input', (event) => {
            const target = event.target;
            if(target && target.id == inputFormR.id) {
                const dataForm = inputFormN.getAttribute('data-form');
                blocks.forEach((elem, i) => {
                    if(elem.id == dataForm){
                        elem.resistance = inputFormR.value;
                        elem.Validation(inputFormR, notifyR);
                    }
                }); 
            }   
            if(target && target.id == inputFormE.id) {
                const dataForm = inputFormN.getAttribute('data-form');
                blocks.forEach((elem, i) => {
                    if(elem.id == dataForm){
                        elem.voltage = inputFormE.value;
                        elem.Validation(inputFormE, notifyE);   
                    }
                }); 
            } 
            if(target && target.id == inputFormKnots.id) {
                const dataForm = inputFormN.getAttribute('data-form');
                blocks.forEach((elem, i) => {
                    if(elem.id == dataForm){
                        elem.number = inputFormKnots.value;
                        elem.element.textContent = inputFormKnots.value;   
                    }
                }); 
            } 
            if(target && target.id == inputFormN.id) {
                const dataForm = inputFormN.getAttribute('data-form');
                blocks.forEach((elem, i) => {
                    if(elem.id == dataForm){
                        elem.Validation(inputFormN, notifyN);
                            elem.element.textContent = elem.number;
                    }
                }); 
            }        
        });
    }

    function GetRemoveOrRotateBlock(){ 

        blockSettings.addEventListener('click', (event) => { 

            const target = event.target;
            if(target && target.classList.contains('btn__remove')) {             
                blocks.forEach(element => {
                    if(element.element.classList.contains('active')){
                        element.element.remove();                
                        blockSettings.style.display = 'none';
                    }
                });
            }
            if(target && target.classList.contains('btn__rotate')) {
                blocks.forEach(element => {
                    if(element.element.classList.contains('active')){
                        if(element.type == 0){
                            if(element.rotate == 0){
                                    element.element.classList.add('rotate-0');
                                    element.rotate = 1;                      
                            }else{
                                element.element.classList.remove('rotate-0');
                                element.rotate = 0;
                            }
                        }
                        else{
                            switch (element.rotate) {
                                case 0:
                                    element.element.classList.add(`rotate-${element.type}`);
                                    element.rotate = 1; 
                                    break;
                                case 1:
                                    element.element.classList.add(`rotate-${element.type}-180`);
                                    element.element.classList.remove(`rotate-${element.type}`);
                                    element.rotate = 2; 
                                    break;
                                case 2:
                                    element.element.classList.add(`rotate-${element.type}-270`);
                                    element.element.classList.remove(`rotate-${element.type}-180`);
                                    element.rotate = 3; 
                                    break;
                                case 3:
                                    element.element.classList.remove(`rotate-${element.type}-270`);
                                    element.rotate = 0; 
                                    break;
                            }
                        }
                    }
                });
            }
        });
    }
   

    console.log(formSettings);

    function GetFormSettings(){
        formSettings.addEventListener('click', (event) => { 
            event.preventDefault();
            const target = event.target;
            if(target && target.classList.contains('btn__calculate')) {      
                formData = new FormData(formSettings);      
                console.log(formData.get('choiceMethod'));
                getActiveBlocks();
            }
        });
    }

    function getActiveBlocks(){
        let ti = 0;
        cell.forEach((element, i) => {
            if(element.firstChild){
                blocks.forEach((el, x) => {
                    if(element.firstChild === el.element){
                        el.cell = element;
                        el.x = +(element.getAttribute('data-x'));
                        el.y = +(element.getAttribute('data-y'));
                        ActiveBlocks[ti] = el;
                        ti = ti + 1;
                    }
                });
            }       
        });
        /* console.log(ActiveBlocks); */
        ActiveBlocks.forEach((element, i) => {
            /* console.log(getValidations(element)); */
            console.log(getscheme(ActiveBlocks));
            /* branchs[i] =  *//* getValidationsPostions(element, i); */

            if(element.type === 3){
                if(element.rotate === 0 /* || ActiveBlock.rotate === 2 */){
                    branch[0] = element;
                    const x = +(element.x);
                    const y = +(element.y);
                    let j = 0; 
    
                    do{
                        j = j + 1;                    
                        branchs[i] = branch[j] = getBlockByData((x+j), y);
                        console.log(getBlockByData((x+j), y));
                    }while((getBlockByData((x+j), y).type != 3) && getBlockByData((x+j), y));  /////////////
                    /* branchs[i] = branch; */
                    
                }
            }
/*             console.log(branchs[i]); */
        });
        
    }

/*     function getValidations (ActiveBlock){
        let error = 0;
        if(ActiveBlock.error || (!ActiveBlock.number)){
            ActiveBlock.getErrorMessage();
            console.log(`Ошибка! Значения элемента: ${ActiveBlock.number}`);
            error = error + 1;          
        }
        else{
            ActiveBlocks.forEach((element, i) => {
            if((element.type === ActiveBlock.type) && (element.number === ActiveBlock.number)){
                if(element.number && (element.id != ActiveBlock.id)){
                    console.log(`Ошибка! Совпадают номера элементов: ${element.number}`);
                    error = error + 1;    
                    }
                }
            });              
        }
        return error;
    } */




    
    function getValidationsPostions (ActiveBlock,i){
        console.log(ActiveBlock);
        if(ActiveBlock.type === 3){
            if(ActiveBlock.rotate === 0 /* || ActiveBlock.rotate === 2 */){
                branch[0] = ActiveBlock;
                const x = +(ActiveBlock.x);
                const y = +(ActiveBlock.y);
                let j = 0; 

                do{
                    j = j + 1;                    
                    branch[j] = getBlockByData((x+j), y);
                }while((getBlockByData((x+j), y).type != 3) && getBlockByData((x+j), y));  /////////////
                branchs[i] = branch;
                console.log(branch);
            }
        }
        
/*         return branch; */
    }

    function getBlockByData(dataX, dataY){
        let returnBlock = 0;
        blocks.forEach(element => {
            if((+(element.x) == dataX) && (+(element.y) == dataY)){ 
                returnBlock = element;
            }
        });
        return returnBlock;
    }


    GetNewBlock();
    LimitingByDragging();
    MobileLimitingByDragging();
    setInterval( () => ShowBlocks(), 500);  //Не забыть остановить
    getValueFromForm();
    GetRemoveOrRotateBlock();
    GetFormSettings();





};

export default dragggrid;






/* Validation(InputForm, el){
            
    let tb = 0;
    if(((InputForm.value >= 1000) || (InputForm.value < 0)) && (InputForm !== inputFormN)){
        this.error = 'error';
        this.getErrorMessage();            
    }
    else{
        if((InputForm.value < 0) || (InputForm.value >= 1000)){
            this.error = 'errorNumber';
            this.getErrorMessage();
        }else{
            console.log(`InputForm.value11 =   ${InputForm.value}`);
                blocks.forEach((element, i) => {
                   
                    if((element.type === this.type) && (element.number === InputForm.value)){
                        if(this.number != InputForm.value){
                            console.log(`i =   ${i}`);
                            tb = 10;
                            console.log(`this.number = ${this.number}`);
                        }
                    }
                });
                console.log(`tb = ${tb}`);
                if(tb){                            
                    this.error = 'number';
                    this.getErrorMessage();
                    tb = 10;
                    console.log(`this error if =   ${this.error}`);
                }else{
                        el.style.display = 'none';
                        this.number = inputFormN.value;
                        this.error = '';
                    }
                    this.number = inputFormN.value;
        }
    }
    console.log(`this error =   ${this.error}`);
} */