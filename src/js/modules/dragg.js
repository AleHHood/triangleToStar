import { push } from 'core-js/fn/array';
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


    function GetElement () {
        blockBar.addEventListener('click', function(event) { 
            const target = event.target;
            if(target && target.classList.contains('calculation__block')) {
                console.log(`NEWblock`);
                GetNewBlock();
                blocks.forEach((item, i) => {
                    if (target == item) {
                        const activeBlock = draggieBlocks[i];
                        draggieBlocks.forEach((item, i)=>{
                            const snapBlock = draggieBlocks[i];
                            const dx = activeBlock.position.x - snapBlock.position.x;
                            console.log(snapBlock.position.y);

                            if(((dx) < 400) && ((dx) > 70)){
                                console.log(1654111111);
                                activeBlock.setPosition( 50, (snapBlock.position.y + 70 ));
                                console.log(activeBlock.position);
                                console.log(snapBlock.position);
                            }
                        });

                    }
                });
            }
        });
    }



    function GetDraggable (block) {   
          // init Draggabillies
            let draggPush;
            draggPush = new Draggabilly( block, {
                // options...
              });
              draggieBlocks.push(draggPush);
              console.log(draggieBlocks);
              /* console.log(draggie.position.x); */
              draggieBlocks[0].on( 'eventName', function() {
                console.log('eventName happened just once');
              });
              draggieBlocks[0].on( 'dragStart', function() {
                console.log('dragStart');
              });
    }


    function render(){
        const newBlock = document.createElement('div');
        newBlock.classList.add('calculation__block');
        workTable.append(newBlock);
        GetDraggable(newBlock);
        
    }

    function GetNewBlock () {
        blockBar.addEventListener('click', function(event) {
            const target = event.target;
            if(target && target.classList.contains('calculation__btn')) {
                console.log(`NEWblock`);
                render();      
                }            
        });
    }

    function Snap(){
        
    }


    

  /*   GetDraggable(); */
/*     GetElement(); */
    GetNewBlock ();


};

export default dragg;