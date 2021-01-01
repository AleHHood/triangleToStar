import dragula from 'dragula';

const dragggrid = () => {

    const blockBar = document.querySelector('.calculation__blockBar'),
    blockHome = document.querySelectorAll('.calculation__block'),
    container = document.querySelector('.calculation__container'),
    workTable = document.querySelector('.calculation__workTable'),
    blockSettings = document.querySelector('.blocksettings__container'),
    cell = document.querySelectorAll('.grid__cell'),
    wrapperFormR = document.querySelector('.blocksettings__wrapper-R'),
    wrapperFormE = document.querySelector('.blocksettings__wrapper-E'),
    inputFormR = document.querySelector('#rblock'),
    inputFormE = document.querySelector('#eblock'),
    inputFormN = document.querySelector('#nblock'),
    notifyR = document.querySelector('#notifyR'),
    notifyE = document.querySelector('#notifyE'),
    notifyN = document.querySelector('#notifyN'),
    blocks = [], // массив блоков
    ActiveBlocks = []; //массив блоков в рабочей зоне  
    let copyDrakeContainers = [],
    tx = 10,
    numId = 10,
    ActiveBlock = 0; // активный блок

    class Block {
        constructor(rotate, type, voltage, resistance, cell, id, element, number, error) {
            this.rotate = rotate; // 0 - горизонтальное пол. 1 - вертикальное
            this.type = type; // 0=R, 1=E, 2=B, 3=K;
            this.voltage = voltage;
            this.resistance = resistance;
            this.cell = cell;
            this.id = id;
            this.element = element;
            this.number = number;
            this.error = error;
        }
        getParametrForm(){
            switch(this.type){
                case 0:
                    wrapperFormR.style.display = 'block';
                    wrapperFormE.style.display = 'none';
                    inputFormR.value = this.resistance;
                    break;
                case 1:
                    wrapperFormE.style.display = 'block';
                    wrapperFormR.style.display = 'none';
                    inputFormE.value = this.voltage;
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
                    el.style.display = 'none';
                                this.number = inputFormN.value;
                                this.error = '';
                }
            }
            console.log(`this error =   ${this.error}`);
        }
    }

    blockHome.forEach((element, i) => {
        blocks[i] = new Block();
        blocks[i].rotate = 0;
        blocks[i].voltage = 0;
        blocks[i].resistance = 0;
        blocks[i].type = +element.id;
        blocks[i].id = element.id;
        blocks[i].element = element;
    });
    
    

    

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
                /* getForm(target); */
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
            if(target && target.id == inputFormN.id) {
                const dataForm = inputFormN.getAttribute('data-form');
                blocks.forEach((elem, i) => {
                    if(elem.id == dataForm){
                        elem.Validation(inputFormN, notifyN);
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
                        if(element.rotate == 0){
                            element.element.classList.add('rotate');
                            element.rotate = 1;
                        }else{
                            element.element.classList.remove('rotate');
                            element.rotate = 0;
                        }
                    }
                });
            }
        });
    }
   



    GetNewBlock();
    LimitingByDragging();
    MobileLimitingByDragging();
    setInterval( () => ShowBlocks(), 500);  //Не забыть остановить
 /*    workTable.addEventListener('mousedown', function(event) {
        const target = event.target;
        getForm(target);
    }); */
    getValueFromForm();
    GetRemoveOrRotateBlock();




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