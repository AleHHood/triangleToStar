import getMath from './mathExpression';


const getCalculation = (branchs) => {
    console.log(branchs); ///////////////
    const formSettings = document.querySelector('.calculation__settings');

    let parameters = [],
    U = 0,
    I = [],
    textArr = [],
    answer;
    class branchElements {
        constructor(numberBranch, nameG, resistance, nameE, voltage, ...elements) {
            this.numberBranch = numberBranch;
            this.resistance = resistance;
            this.nameG = nameG;
            this.voltage = voltage;
            this.nameE = nameE;
            this.elements = elements;
        }
    }

        


    function getParametrsBranch(branchs) {
        let numberBranch = 0;

        //Перебор ветвей
        branchs.forEach((branch, i) => {
            if (i < 2){
                return;
            }

            let R = [],
            K = 0,
            E =  [],
            N = 0;

            //Перебор элементов ветви
            branch.elements.forEach(block => {

                //Правильная нумерация
                branchs[0].elements.forEach((knot, number) => {
                    if(knot.y === block.y){
                        numberBranch = number + 1;
                    }
                });
                
                if(block.type === 0){
                    K = K + 1;
                    R[K] = block;
                }

                if(block.type === 1){
                    N = N + 1;
                    E[N] = block;
                }

            });
        
            GetValueResist(R, K, numberBranch);
            GetValueVoltage(E, N, numberBranch);
        });
    }


    function getAnswerBlock(textArr) {
        answer = document.createElement('div');
        answer.classList.add('Answer__block');
        formSettings.append(answer);
        textArr.forEach(element => {
            getMath(element, answer);
        });
    }



    function GetValueResist(R, K, numberBranch){
        parameters[numberBranch] = new branchElements(numberBranch);

        if(K < 2){
            
            textArr.push(`Найдём проводимость ветви №${numberBranch}`);
            textArr.push(`g${R[K].number} =~1/r${R[K].number}`);
            textArr.push(`g${R[K].number} =~1/${R[K].resistance}~= ${1 / +R[K].resistance} См`);
            getAnswerBlock(textArr);
            textArr = [];


            parameters[numberBranch].nameG = `g${R[K].number}`;
            parameters[numberBranch].resistance = 1 / +R[K].resistance;

        } else {

            let Name = '',
            value = 0,
            sum = 0,
            expressionValue = '',
            expression = '';

            R.forEach(resist => {
                Name = `${Name}` + `${resist.number}`;
                expression += `+ R${resist.number} `;
                expressionValue += `+ ${resist.resistance} `;
                sum = +resist.resistance;
                value = value + sum;
                
            });

            value = 1 / +value;
            expression = `${expression}`.slice(2);
            expressionValue = `${expressionValue}`.slice(2);

            parameters[numberBranch].nameG = `g${Name}`;
            parameters[numberBranch].resistance = +value;

            //Округляем число для вывода
            value = toFixed2(+value);
            
            
            textArr.push(`Найдём проводимость ветви №${numberBranch}`);
            textArr.push(`g${Name} =~1/${expression}`);
            textArr.push(`g${Name} =~1/${expressionValue}~= ${value} См`);
            getAnswerBlock(textArr);
            textArr = [];

        }
    }

    function GetValueVoltage(R, K, numberBranch){
        let voltage = 0;
        let Name = '';

        if(K === 0){

            textArr.push(`Эдс для ветви №${numberBranch}`);
            textArr.push(`0 В`);
            getAnswerBlock(textArr);
            textArr = [];


            parameters[numberBranch].nameE = ` + 0`;
            parameters[numberBranch].voltage = 0;
            return;

        }
        if(K < 2){

            voltage = +(R[K].voltage);
            if(R[K].rotate == 0){
                voltage = -voltage;
            }
                
            textArr.push(`Эдс для ветви №${numberBranch}`);
            textArr.push(`E${R[K].number} = ${voltage} В`);
            getAnswerBlock(textArr);
            textArr = [];

            Name = ` + E${R[K].number}`;
            if(R[K].rotate == 0){
                Name = ` - E${R[K].number}`;
            }

            parameters[numberBranch].nameE = `${Name}`;
            parameters[numberBranch].voltage = +voltage;

        } else {

            let value = 0,
            expressionValue = '',
            expression = '';

            Name = '';
            
            R.forEach(EDS => {
                let EDSname = '+ E',
                plus = '+';
                

                Name = `${Name}` + `${EDS.number}`;

                voltage = +EDS.voltage;
                console.log(EDS.rotate);
                if(EDS.rotate == 0){
                    voltage = -voltage;
                    EDSname = '- E';
                    plus = '-';
                }

                expression += `${EDSname}${EDS.number} `;
                expressionValue += `${plus} ${EDS.voltage} `;

                value = value + voltage;
            });

                expression = SliceElement(`${expression}`, '+ ');
                expressionValue = SliceElement(`${expressionValue}`, '+ ');


            textArr.push(`Эдс для ветви №${numberBranch}`);
            textArr.push(`E${Name} = ${expression}`);
            textArr.push(`E${Name} = ${expressionValue} = ${value} В`);
            getAnswerBlock(textArr);
            textArr = [];

            
            if(value < 0){  
                Name = ` - E${Name}`;
            } else{
                Name = ` + E${Name}`;
            }
            parameters[numberBranch].nameE = `${Name}`;
            parameters[numberBranch].voltage = +value;
        }
    }

    function Arrow(branch){
        
    }


    function toFixed2(num){ 
        num = num.toFixed(2);
        let x = 0;
        x = num.length;
        if(num.slice(-1) == '0'){
            x = x - 1;
            num = num.slice(0, x);
            if(num.slice(-1) == '0'){
                x = x - 2;
                num = num.slice(0, x);
                return num;
            } else {
                return num;
            }
        } else {
            return num;
        }
    }


    function SliceElement(str, element){
        if(str.substr(0, 2) == element){
            return str.slice(2);
        } else{
            return str;
        }
    } 

    

    function GetVoltageSсheme() {
        let sumEG = 0,
        sumG = 0,
        expressionEG = '',
        expressionG = '',
        a = '',
        b = '',
        plus = '+';

    parameters.forEach(element => {

        sumEG = sumEG + element.resistance * element.voltage;

        if(element.voltage < 0) { 
            plus = '';
        }else{
            plus = ' + ';
        }

        expressionEG = expressionEG + 
        `${plus} ${element.voltage}` +  
        `⋅${ toFixed2(element.resistance) }`;

        a = a + `${element.nameE}` +  `⋅${element.nameG}`;

        sumG = sumG + element.resistance;
        expressionG = expressionG + ` + ${ toFixed2(element.resistance) }`;
        b = b + ` + ${element.nameG}`;

    });

        U = sumEG / sumG;

        a = SliceElement(a, ' +');
        b = SliceElement(b, ' +');
        expressionG = SliceElement(expressionG, ' +');
        expressionEG = SliceElement(expressionEG, ' +');

        textArr.push(`Напряжение между узлами А-В равно:`);
        textArr.push(`Uab =~${a}/${b}~=~${expressionEG}/${expressionG}~= ${toFixed2(U)} В`);
        getAnswerBlock(textArr);
        textArr = [];
    }
    



    function FindCurrent() {
        let sumEU = 0,
        sumG = 0,
        expressionEU = '',
        expressionG = '',
        a = '',
        b = '',
        plus = '+'; 
        parameters.forEach((element, i) => {
            I[i] = (element.voltage - U) * element.resistance;
            I[i] = toFixed2(I[i]);

            if(U < 0) { 
                plus = ' +';
            }else{
                plus = ' -';
            }
    
            expressionEU =  `${element.voltage}` + `${plus} ${toFixed2(U)}`;

            a = `${element.nameE}` + `${plus} U`;
            b = `${element.nameG}`;

            a = SliceElement(a, ' +');

        console.log(textArr); ///////////////
        textArr.push(`Найдём ток в ветви №:${i}`);
        textArr.push(`I${i} = ${a}⋅${b} = (${expressionEU})⋅${toFixed2(element.resistance)} = ${I[i]} А`);
        getAnswerBlock(textArr);
        textArr = [];
        });
    }


    

    getParametrsBranch (branchs);
    GetVoltageSсheme();
    FindCurrent();

    let sumEI = 0,
        sumRII = 0;

    parameters.forEach((element, i) => {
        sumEI = sumEI + element.voltage * I[i];
        sumRII = sumRII + (I[i] * I[i]) / element.resistance;
    });

    console.log(sumEI);
    console.log(sumRII);

    
    
    getMath('1/I1~=~1/5~+~1/6', formSettings);
};




export default getCalculation;