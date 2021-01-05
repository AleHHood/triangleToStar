const getscheme = (blocks) => {
    let error = '',
    returnValue = 0;

    function getValidations (ActiveBlock){
        let error = 0;
        if(ActiveBlock.error || (!ActiveBlock.number)){
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


    console.log(blocks);
    blocks.forEach(element => {
        error = getValidations(element);
    });



    if(error === ''){
        returnValue = error;
    }else{
        returnValue = blocks;
    }

    return [returnValue];
};
export default getscheme;