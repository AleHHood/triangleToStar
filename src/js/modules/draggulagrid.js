import dragula from 'dragula';

const dragggrid = () => {

    const blockBar = document.querySelector('.calculation__blockBar'),
    container = document.querySelector('.calculation__container'),
    workTable = document.querySelector('.calculation__workTable'),
    blockSettings = document.querySelector('.blocksettings__container'),
    cell = document.querySelectorAll('.grid__cell'),
    blocks = {}; // обЪект блоков
    let copyDrakeContainers = [],
    tx = 10,
    numId = 10;

    class Block {
        constructor(rotate, type, voltage, resistance, cell, id, element) {
            this.rotate = rotate; // 0 - горизонтальное пол. 1 - вертикальное
            this.type = type; // 0=R, 1=E, 2=B, 3=K;
            this.voltage = voltage;
            this.resistance = resistance;
            this.cell = cell;
            this.id = id;
            this.element = element;
/*             this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();  */
        }
    }

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

    function getForm(){
        workTable.addEventListener('click', function(event) {
            const target = event.target;
            if(target && target.classList.contains('calculation__block')) {
                console.log(11);
                console.log(event.target.id);
                blockSettings.style.display = 'flex';
            }
        });
    }
    
    function writeNewBlock(classesBlock, id, element){
        blocks[tx] = new Block();
        blocks[tx].id = id;
        blocks[tx].element = element;
        blocks[tx].rotate = 0;
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


    GetNewBlock();
    LimitingByDragging();
    MobileLimitingByDragging();
    setInterval( () => ShowBlocks(), 500);  //Не забыть остановить
    getForm();


};

export default dragggrid;

