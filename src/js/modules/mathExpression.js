const getMath = (expression, appendBlock) => {

    function GetExpression (expression, appendBlock){
        let split;
        split = expression.split('~');
        const newBlock = document.createElement('p');

        split.forEach(element => {
            if(!GetFrac(element, newBlock)){
                newBlock.innerHTML += element;
            }
            newBlock.innerHTML += ' ';
        });        
        newBlock.classList.add('Math');
        appendBlock.append(newBlock);
    }


    function GetFrac (expression, newBlock){
        let split;
        split = expression.split('/');

        if(split.length == 2){
            newBlock.innerHTML += 
            `<span class="fraction" ><span class="fraction__top">` + 
            `${split[0]}` + 
            `</span><span class="fraction__bottom">` + 
            `${split[1]}</span></span>`;

            return true;
        }
        return false;
    }

    GetExpression (expression, appendBlock);
};

export default getMath;