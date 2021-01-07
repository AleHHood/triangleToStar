const getscheme = (blocks) => {
    const branchs = [];
    let error = '',
    baseCorner = 0,
    baseRightCorner = 0,
    returnValue = 0;

    class Branch {
        constructor(name, ...elements) {
            this.elements = elements;
            this.name = name;
        }
    }




    function getValidations (ActiveBlock) {
        let error = 0;
        if(ActiveBlock.error || (!ActiveBlock.number)) {

            if(ActiveBlock.type != 4 && ActiveBlock.type != 2){
            ActiveBlock.getErrorMessage();
            console.log(`Ошибка! Значения элемента: ${ActiveBlock.number}`);
            error = error + 1;}
        }
        
        else{
            blocks.forEach((element, i) => {
            if((element.type === ActiveBlock.type) && (element.number === ActiveBlock.number)){
                if(element.number && (element.id != ActiveBlock.id)){
                    element.error = 'number';
                    console.log(`Ошибка! Совпадают номера элементов: ${element.number}`);
                    error = error + 1;    
                    }
                }
            });              
        }
        return error;
    }



    function getValidationsPostions (ActiveBlocks){
        let i = 1;
        ActiveBlocks.forEach(element => {
            if(element.type === 4 && element.rotate === 2){
                baseCorner = element;
            }
            if(element.type === 4 && element.rotate === 3){
                baseRightCorner = element;
            }
        });

        getLeftKnots();
        getRightKnots();

        ActiveBlocks.forEach(element => {
            if(element.type === 3){                
                if(element.rotate === 1){
                    i = i + 1;
                    if(getBranchLeftToRight(i, element) == 'error') {
                        console.log(`Ошибка`);
                        error = error + 1;
                    }  
                }
            }

            if(element.type === 4){                
                if(element.rotate === 1 || element.rotate === 2){
                    i = i + 1;
                    if(getBranchLeftToRight(i, element) == 'error') {
                        console.log(`Ошибка`);
                        error = error + 1;
                    }  
                }
            }
      });
    }


    function getLeftKnots() {
        branchs[0] = new Branch();
        branchs[0].elements[0] = baseCorner;
        const x = +(baseCorner.x);
        const y = +(baseCorner.y);

        if(!getBlock(x, (y+1)) || getBlock(x, (y+1)).type === 4){
            getErrorMessagePosition(baseCorner.number);
            return 'error';
        }
        
        for (let j = 1; (getBlock(x, (y+j)).type != 4) && getBlock(x, (y+j)); j++) {

            let jBlock = getBlock(x, (y+j)),
            nextBlock = getBlock(x, (y+j+1));

            if(jBlock.rotate == 0 || jBlock.rotate == 2){
                getErrorMessagePosition(jBlock.number);
                return 'error';
            }

            if(jBlock.rotate == 3 && jBlock.type == 3){
                getErrorMessagePosition(jBlock.number);
                return 'error';
            }

            if(nextBlock.type === 4){
                if(nextBlock.rotate === 1){
                    branchs[0].elements[j+1] = nextBlock;
                } else {
                    getErrorMessagePosition(nextBlock.number);
                    return 'error';
                }
            }

            if(nextBlock.type != 3 && nextBlock.type != 2 && nextBlock.type != 4){
                getErrorMessagePosition(nextBlock.number);
                return 'error';
            }

            if(!nextBlock){
                getErrorMessagePosition(nextBlock);
                return 'error';
            }

            branchs[0].elements[j] = getBlock(x, (y+j));
        }
        console.log(branchs[0].elements);
    }

    function getRightKnots() {
        branchs[1] = new Branch();
        branchs[1].elements[0] = baseRightCorner;
        const x = +(baseRightCorner.x);
        const y = +(baseRightCorner.y);

        if(!getBlock(x, (y+1)) || getBlock(x, (y+1)).type === 4){
            getErrorMessagePosition(baseRightCorner.number);
            return 'error';
        }
        
        for (let j = 1; (getBlock(x, (y+j)).type != 4) && getBlock(x, (y+j)); j++) {

            let jBlock = getBlock(x, (y+j)),
            nextBlock = getBlock(x, (y+j+1));

            if(jBlock.rotate == 2){
                getErrorMessagePosition(jBlock.number);
                return 'error';
            }

            if(jBlock.rotate == 0 && jBlock.type != 4){
                getErrorMessagePosition(jBlock.number);
                return 'error';
            }

            if(jBlock.rotate == 1 && jBlock.type == 3){
                getErrorMessagePosition(jBlock.number);
                return 'error';
            }

            if(nextBlock.type === 4){
                if(nextBlock.rotate === 0){
                    branchs[1].elements[j+1] = nextBlock;
                } else {
                    getErrorMessagePosition(nextBlock.number);
                    return 'error';
                }
            }

            if(nextBlock.type != 3 && nextBlock.type != 2 && nextBlock.type != 4){
                getErrorMessagePosition(nextBlock.number);
                return 'error';
            }

            if(!nextBlock){
                getErrorMessagePosition(nextBlock);
                return 'error';
            }

            branchs[1].elements[j] = getBlock(x, (y+j));
        }
        console.log(branchs[1].elements);
    }


    
    function getBranchLeftToRight(i, element) {
        
        branchs[i] = new Branch();
        branchs[i].elements[0] = element;
        const x = +(element.x);
        const y = +(element.y);

        if(!getBlock((x+1), y)){
            getErrorMessagePosition(element.number);
            return 'error';
        }
        
        
        for (let j = 1; (getBlock((x+j), y).type < 3) && getBlock((x+j), y); j++) {

            let jBlock = getBlock((x+j), y),
            nextBlock = getBlock((x+j+1), y);

            if(jBlock.rotate == 1 || jBlock.rotate == 3){
                getErrorMessagePosition(jBlock.number);
                return 'error';
            }


            if(nextBlock.type === 3 || nextBlock.type === 4){
                branchs[i].elements[j+1] = nextBlock;
            }
            if(!nextBlock){
/*                 jBlock.error = 'connection';
                jBlock.getErrorMessage(); */
                getErrorMessagePosition(jBlock.number);
                return 'error';
            }

            branchs[i].elements[j] = jBlock;
        }
        console.log(branchs[i].elements);

    }






    function getBlock(dataX, dataY) {
        let returnBlock = 0;
        blocks.forEach(element => {
            if((+(element.x) == dataX) && (+(element.y) == dataY)){ 
                returnBlock = element;
            }
        });
        return returnBlock;
    }

    function getErrorMessagePosition(nextBlock, customMessage){
        const defaultMessage = `Ошибка! Соедините все элементы или удалите неиспользуемые:`;
        if(customMessage){
            console.log(`${customMessage} ${nextBlock}`);
        }else{
            console.log(`${defaultMessage} ${nextBlock}`);
        }
        error = error + 1;
        return error;
    }




    blocks.forEach(element => {
        error = getValidations(element);
    });



    if(error === '') {        //if(error != ''){   игнор ошибок
        returnValue = error;
    } else {
        getValidationsPostions (blocks);
        returnValue = branchs;
    }
    return returnValue;
};
export default getscheme;