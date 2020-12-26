import Draggabilly from 'draggabilly';
const dragg = () =>{
    
    let btn = document.querySelectorAll('.calculation__btn'),
    workTable = document.querySelector('.calculation__workTable'),
    blockBar = document.querySelector('.calculation__blockBar');
    const draggieBlocks = [];

/*     blocks.forEach(element => {
        console.log(element.id);
        if(element.id == 'R'){
            console.log(4444);
        }
    }); */

    let tn = -1;

    function GetNewBlock () {
        let classesBlock = 0;
        blockBar.addEventListener('click', function(event) {
            const target = event.target;
            if(target && target.classList.contains('calculation__btn-R')) {
                classesBlock = 'calculation__block-R';
                ++tn;
                render(tn, classesBlock);      
                }
            if(target && target.classList.contains('calculation__btn-E')) {
                classesBlock = 'calculation__block-E';
                ++tn;
                render(tn, classesBlock);      
                }
            if(target && target.classList.contains('calculation__btn-K')) {
                classesBlock = 'calculation__block-K';
                ++tn;
                render(tn, classesBlock);      
                }
            if(target && target.classList.contains('calculation__btn-B')) {
                classesBlock = 'calculation__block-B';
                ++tn;
                render(tn, classesBlock);      
                }  
        });
    }
    function render(i, classesBlock){
        const newBlock = document.createElement('div');
        newBlock.classList.add('calculation__block');
        newBlock.classList.add(classesBlock);
        workTable.append(newBlock);
        GetDraggable(newBlock, i);
        
    }

    function GetDraggable (block, i) {   
        // init Draggabillies
          let draggPush;
          draggPush = new Draggabilly( block, {
              // options...
            });
            console.log(i);
            draggPush.setPosition(((draggPush.position.x)+i *10), ((draggPush.position.y)+i *10));
            draggieBlocks.push(draggPush);
            addEventBlock(draggPush);
  }

    function addEventBlock(draggBlock){
        draggBlock.on( 'dragEnd', function(event) {
            const target = event.target;
            if(target && target.classList.contains('calculation__block')) {
                console.log(this);}
            console.log('dragStart');
            snap(draggBlock);
          });        
    }

    function snap(activeBlock) {
        draggieBlocks.forEach((item, i)=>{
            const snapBlock = draggieBlocks[i];
            const dx = activeBlock.position.x - snapBlock.position.x;
            const dy = activeBlock.position.y - snapBlock.position.y;
            console.log(snapBlock.position.y);

            if((dx < 100) && (dx > 50) && (dy < 40) && (dy > -40)){
                activeBlock.setPosition( (snapBlock.position.x + 70), (snapBlock.position.y));
            }

            if((dx > -100) && ((dx) < -50) && (dy < 40) && (dy > -40)){
                activeBlock.setPosition( (snapBlock.position.x - 70), (snapBlock.position.y));
            }

            
        });
    }

  /*   GetDraggable(); */
/*     GetElement(); */
    GetNewBlock ();
    console.log(draggieBlocks);


};

export default dragg;