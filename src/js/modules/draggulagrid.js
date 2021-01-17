import dragula from 'dragula';
import getscheme from './getScheme';
import getCalculation from './calculationMethod';


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
    blocks = []; // массив блоков
    let copyDrakeContainers = [],
    tx = 10,
    numId = 10,
    ActiveBlock = 0; // активный блок
    const formSettings = document.querySelector('.calculation__settings'),
    ActiveBlocks = []; //массив блоков в рабочей зоне
    let formData;
    let scheme = 0;

    

    class Block {
        constructor(
            rotate, type, voltage, resistance, cell, 
            id, element, number, error, x, y
            ) {
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
                    wrapperFormKnots.style.display = 'none';
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
                            /* inputFormR.classList.add('input__error'); *///////////////////////////
                            tNotify.textContent   = 
                            `Введите значение от 0 до 1000`;

                            this.element.style.backgroundColor = 
                            'pink';                         
                            break;

                        case 'errorNumber':
                            notifyN.style.display = 'block';
                            notifyN.textContent   = 
                            `Введите значение от 0 до 1000`;

                            this.element.style.backgroundColor = 
                            'pink';                      
                            break;

                        case 'number':
                            notifyN.style.display = 'block';
                            notifyN.textContent   = 
                            `Номера элементов совпадают`;

                            this.element.style.backgroundColor = 
                            'pink';                      
                            break;

                        case 'connection':{
                            this.element.style.backgroundColor = 'pink';
                            break;
                        }
                    
                        default:
                            break;
                    }
                     
        }
        Validation(InputForm, el){
            let tb = 0;
            if(
                ((InputForm.value >= 1000) || (InputForm.value <= 0)) && 
                (InputForm !== inputFormN)
            ) {
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
                    // удаляем класс ощибки с инпута
                    /* InputForm.classList.remove('input__error'); */
                    this.number = inputFormN.value;
                    /* this.number = inputFormN.value; */
                    this.error = '';
                    this.element.style.backgroundColor = '#fff';
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
                    if(
                        (element.firstChild) &&
                         (element.firstChild != event.target)
                    ) {
                        i = i + 1;
                        drake.containers.splice(i, 1, 0);
                        i = i - 1;
                    }                   
                });    
                }
            if(
                target && 
                target.classList.contains('grid__cell')
            ) {
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
                    if(
                        (element.firstChild) && 
                        (element.firstChild != event.target)
                    ) {
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
            if(
                target && 
                target.classList.contains('calculation__block-Corner')
            ) {
                classesBlock = 'calculation__block-Corner';
                render(classesBlock);      
                }
        });
    }

    function matchBlocks(classBlock){
        let x = 0;
        blockBar.children.forEach((element, i) => {
            if(
            (element.classList == `calculation__block ${classBlock}`) || 
            (element.classList == `calculation__block none ${classBlock}`)
            ) {
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
/*             if(target && target.id == inputFormKnots.id) {
                const dataForm = inputFormN.getAttribute('data-form');
                blocks.forEach((elem, i) => {
                    if(elem.id == dataForm){
                        elem.number = inputFormKnots.value;
                        elem.element.textContent = inputFormKnots.value;   
                    }
                }); 
            }  */
            if(target && target.id == inputFormN.id) {
                const dataForm = inputFormN.getAttribute('data-form');
                blocks.forEach((elem, i) => {
                    if(elem.id == dataForm){
                        elem.Validation(inputFormN, notifyN);
                        switch (elem.type) {
                            case 0:
                                elem.element.textContent = 
                                `R${elem.number}`;
                                break;

                            case 1:
                                elem.element.textContent = 
                                `E${elem.number}`;
                                break;
                        }
                    }
                }); 
            }        
        });
    }

    function GetRemoveOrRotateBlock(){ 

        blockSettings.addEventListener('click', (event) => { 

            const target = event.target;
            if(
                target &&
                 target.classList.contains('btn__remove')
            ) {             
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
                                    element.element.classList.add(
                                        `rotate-${element.type}`
                                        );
                                    element.rotate = 1; 
                                    break;
                                case 1:
                                    element.element.classList.add(
                                        `rotate-${element.type}-180`
                                        );
                                    element.element.classList.remove(
                                        `rotate-${element.type}`
                                        );
                                    element.rotate = 2; 
                                    break;
                                case 2:
                                    element.element.classList.add(
                                        `rotate-${element.type}-270`
                                        );
                                    element.element.classList.remove(
                                        `rotate-${element.type}-180`
                                        );
                                    element.rotate = 3; 
                                    break;
                                case 3:
                                    element.element.classList.remove(
                                        `rotate-${element.type}-270`
                                        );
                                    element.rotate = 0; 
                                    break;
                            }
                        }
                    }
                });
            }
        });
    }
   


    function GetFormSettings(target){
        if(target && target.classList.contains('btn__calculate')) {      
            formData = new FormData(formSettings);      
            console.log(formData.get('choiceMethod'));
        }
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
    }


    
    function SaveScheme(){
   
        let branchs = [{"elements":[{"rotate":2,"type":4,"voltage":0,"resistance":0,"cell":{},"id":20,"element":{},"x":0,"y":0},{"rotate":1,"type":3,"voltage":0,"resistance":0,"cell":{},"id":"3","element":{},"number":"A","x":0,"y":1},{"rotate":1,"type":4,"voltage":0,"resistance":0,"cell":{},"id":"4","element":{},"x":0,"y":2}]},{"elements":[{"rotate":3,"type":4,"voltage":0,"resistance":0,"cell":{},"id":19,"element":{},"x":4,"y":0},{"rotate":3,"type":3,"voltage":0,"resistance":0,"cell":{},"id":10,"element":{},"number":"B","x":4,"y":1},{"rotate":0,"type":4,"voltage":0,"resistance":0,"cell":{},"id":18,"element":{},"x":4,"y":2}]},{"elements":[{"rotate":2,"type":4,"voltage":0,"resistance":0,"cell":{},"id":20,"element":{},"x":0,"y":0},{"rotate":0,"type":0,"voltage":0,"resistance":"10","cell":{},"id":12,"element":{},"number":"1","error":"","x":1,"y":0},{"rotate":0,"type":1,"voltage":"10","resistance":0,"cell":{},"id":15,"element":{},"number":"1","error":"","x":2,"y":0},{"rotate":2,"type":1,"voltage":"20","resistance":0,"cell":{},"id":17,"element":{},"number":"2","error":"","x":3,"y":0},{"rotate":3,"type":4,"voltage":0,"resistance":0,"cell":{},"id":19,"element":{},"x":4,"y":0}]},{"elements":[{"rotate":1,"type":3,"voltage":0,"resistance":0,"cell":{},"id":"3","element":{},"number":"A","x":0,"y":1},{"rotate":0,"type":0,"voltage":0,"resistance":"15","cell":{},"id":"0","element":{},"number":"2","error":"","x":1,"y":1},{"rotate":0,"type":1,"voltage":"20","resistance":0,"cell":{},"id":"1","element":{},"number":"3","error":"","x":2,"y":1},{"rotate":0,"type":0,"voltage":0,"resistance":"10","cell":{},"id":14,"element":{},"number":"3","error":"","x":3,"y":1},{"rotate":3,"type":3,"voltage":0,"resistance":0,"cell":{},"id":10,"element":{},"number":"B","x":4,"y":1}]},{"elements":[{"rotate":1,"type":4,"voltage":0,"resistance":0,"cell":{},"id":"4","element":{},"x":0,"y":2},{"rotate":0,"type":0,"voltage":0,"resistance":"5","cell":{},"id":13,"element":{},"number":"4","error":"","x":1,"y":2},{"rotate":0,"type":0,"voltage":0,"resistance":"10","cell":{},"id":22,"element":{},"number":"5","error":"","x":3,"y":2},{"rotate":0,"type":4,"voltage":0,"resistance":0,"cell":{},"id":18,"element":{},"x":4,"y":2}]}];
        return branchs;
    }


    GetNewBlock();
    LimitingByDragging();
    MobileLimitingByDragging();
    setInterval( () => ShowBlocks(), 500);  //Не забыть остановить
    getValueFromForm();
    GetRemoveOrRotateBlock();
    formSettings.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target;
        if(target && target.classList.contains('btn__calculate')){
            GetFormSettings();

            //Удаялем старые ошибки (если они есть)
            const errorBlock = document.querySelectorAll('.Error__block');
            if(errorBlock){
                errorBlock.forEach(element => {
                    element.remove();
                });
            }

            
            const promise1 = new Promise((resolve, reject) => {
                getActiveBlocks();


                function Arrow(ActiveBlocks){
                    ActiveBlocks.forEach((element,i) => {
                        const span = document.createElement('span');
                        span.classList.add("top");
                        span.textContent = `I${i}`;
                        element.element.append(span);
                        element.element.style.cssText = 
                        `background: url(../img/svg/Arrow.SVG) -34% -1100% no-repeat;
                        background-size: 92px;`;
                        console.log(element.element);
                    });
                }

                Arrow(ActiveBlocks);



                resolve(ActiveBlocks);
              }).then(value => {
                  return new Promise((resolve, reject) => {
                    console.log(`Активные блоки ${value}`);
                    scheme = getscheme(ActiveBlocks);
    
                    if(scheme == 'error'){
                        reject();
                    }else{
                        resolve(scheme);
                    }
                  });
    
              }).then(scheme => {

                //Удаляем старый ответ (если он есть)
                const answerBlock = document.querySelectorAll('.Answer__block');
                if(answerBlock){
                    answerBlock.forEach(element => {
                        element.remove();
                    });
                }


                getCalculation(scheme);
                /* getCalculation( SaveScheme() ); */
              }).catch( () => {
                  console.log('reject');
              });
        }
    });
    
};

export default dragggrid;
