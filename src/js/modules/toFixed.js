const toFixed3 = function toFixed3(num){ 
    let x = 0;
    for (let n = 5; n >= 0; --n) {
        num = +num;
        num = num.toFixed(n);
        x = num.length;
        x = x - 1;

        //Исправляем ошибку с округлением 5
        if(n > 3){
            if(num.slice(-1) == '5'){
                num = num.slice(0, x) + `6`;
            }
            continue;
        }

        if(num.slice(-1) == '0'){
            num = num.slice(0, x);
            if(num.slice(-1) == '0'){
                continue;
            } else {
                num = +num;
                return num;
            }
        } else {
            num = +num;
            return num;
        }
    }
}

export default toFixed3;