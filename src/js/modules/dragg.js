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

    function GetNewBlock () {
        blockBar.addEventListener('click', function(event) {
            const target = event.target;
            if(target && target.classList.contains('calculation__btn')) {
                console.log(`NEWblock`);
                render();      
                }            
        });
    }

    function render(){
        const newBlock = document.createElement('div');
        newBlock.classList.add('calculation__block');
        workTable.append(newBlock);
        GetDraggable(newBlock);
        
    }

    function GetDraggable (block) {   
        // init Draggabillies
          let draggPush;
          draggPush = new Draggabilly( block, {
              // options...
            });
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
            console.log(snapBlock.position.y);

            if(((dx) < 100) && ((dx) > 70)){
                console.log(1654111111);
                activeBlock.setPosition( (snapBlock.position.x + 70), (snapBlock.position.y));
                console.log(activeBlock.position);
                console.log(snapBlock.position);
            }

            if(((dx) > -100) && ((dx) < -70)){
                console.log(1654111111);
                activeBlock.setPosition( (snapBlock.position.x - 70), (snapBlock.position.y));
                console.log(activeBlock.position);
                console.log(snapBlock.position);
            }
        });
    }

  /*   GetDraggable(); */
/*     GetElement(); */
    GetNewBlock ();
    console.log(draggieBlocks);


};

export default dragg;