import dragula from 'dragula';

const dragggrid = () => {

    const blockBar = document.querySelector('.calculation__blockBar'),
    container = document.querySelector('.calculation__container'),
    cell = document.querySelectorAll('.grid__cell');
    let copyDrakeContainers = [];

    const drake = dragula([blockBar, ...cell]);
    
    /* console.log(drake.containers); */
    drake.containers.forEach(element => {
        copyDrakeContainers.push(element);
    });
    /* console.log(copyDrakeContainers); */


    cell.forEach(element => {
/*         console.log(element.firstChild); */
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


    function GetNewBlock () {
        let classesBlock = 0;
        container.addEventListener('mouseup', function(event) {
            const target = event.target;
            if(target && target.classList.contains('calculation__block-R')) {
                classesBlock = 'calculation__block-R';
                render(classesBlock);
                /* console.log(11111);  */     
                }
            if(target && target.classList.contains('calculation__block-E')) {
                classesBlock = 'calculation__block-E';
                render(classesBlock);      
                }
            if(target && target.classList.contains('calculation__block-K')) {
                classesBlock = 'calculation__block-K';
                render(classesBlock);      
                }
            if(target && target.classList.contains('calculation__block-B')) {
                classesBlock = 'calculation__block-B';
                render(classesBlock);      
                }  
        });
    }
    function render(classesBlock){
        const newBlock = document.createElement('div');
        newBlock.classList.add('calculation__block');
        newBlock.classList.add(classesBlock);
        blockBar.append(newBlock);        
    }


    /* GetNewBlock(); */
    LimitingByDragging();


};

export default dragggrid;

