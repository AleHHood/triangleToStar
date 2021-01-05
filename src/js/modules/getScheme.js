const getscheme = (blocks) => {
    const branchs = [];
    let error = '',
    returnValue = 0;

    class Branch {
        constructor(...elements) {
            this.elements = elements;
        }
    }


    function getValidations (ActiveBlock) {
        let error = 0;
        if(ActiveBlock.error || (!ActiveBlock.number)) {
            ActiveBlock.getErrorMessage();
            console.log(`Ошибка! Значения элемента: ${ActiveBlock.number}`);
            error = error + 1;          
        }
        else{
            blocks.forEach((element, i) => {
            if((element.type === ActiveBlock.type) && (element.number === ActiveBlock.number)){
                if(element.number && (element.id != ActiveBlock.id)){
                    console.log(`Ошибка! Совпадают номера элементов: ${element.number}`);
                    error = error + 1;    
                    }
                }
            });              
        }
        return error;
    }

    function getValidationsPostions (ActiveBlocks){
        let i = -1;

        ActiveBlocks.forEach(element => {

            if(element.type === 3){                
                if(element.rotate === 0){

                    i = i + 1;
                    branchs[i] = new Branch();
                    branchs[i].elements[0] = element;
                    const x = +(element.x);
                    const y = +(element.y);
                    
                    for (let j = 1; (getBlockByData((x+j), y).type != 3) && getBlockByData((x+j), y); j++) {
                        branchs[i].elements[j] = getBlockByData((x+j), y);
                        if(getBlockByData((x+j+1), y).type === 3){
                            branchs[i].elements[j+1] = getBlockByData((x+j+1), y);
                        }
                    }
                    console.log(i);
                    console.log(branchs[i].elements);   
                }
            }
      });
    }

    function getBlockByData(dataX, dataY) {
        let returnBlock = 0;
        blocks.forEach(element => {
            if((+(element.x) == dataX) && (+(element.y) == dataY)){ 
                returnBlock = element;
            }
        });
        return returnBlock;
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