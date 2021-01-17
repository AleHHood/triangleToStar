import getMath from './mathExpression';


const getCalculation = (branchs) => {
    console.log(branchs); ///////////////
    const formSettings = document.querySelector('.calculation__settings');
    const answerSection = document.querySelector('.answer');

    let parameters = [],
    U = 0,
    I = [],
    textArr = [],
    answer;
    class branchElements {
        constructor(numberBranch, nameR, resistance, nameG, conductance, nameE, voltage, ...elements) {
            this.numberBranch = numberBranch;
            this.conductance = conductance;
            this.nameG = nameG;
            this.resistance = resistance;
            this.nameR = nameR;
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
        answerSection.append(answer);
        textArr.forEach(element => {
            getMath(element, answer);
        });
    }



    function GetValueResist(R, K, numberBranch){
        parameters[numberBranch] = new branchElements(numberBranch);

        if(K < 2){
            
            textArr.push(`Найдём проводимость ветви №${numberBranch}`);
            textArr.push(`g${R[K].number} =~1/r${R[K].number}`);
            textArr.push(`g${R[K].number} =~1/${R[K].resistance}~=`+
            ` ${1 / +R[K].resistance} См`);
            getAnswerBlock(textArr);
            textArr = [];


            parameters[numberBranch].nameG = `g${R[K].number}`;
            parameters[numberBranch].conductance = 1 / +R[K].resistance;
            parameters[numberBranch].nameR = `r${R[K].number}`;
            parameters[numberBranch].resistance = +R[K].resistance;

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

            
            expression = `${expression}`.slice(2);
            expressionValue = `${expressionValue}`.slice(2);

            parameters[numberBranch].nameR = `r${Name}`;
            parameters[numberBranch].resistance = +value;

            value = 1 / +value;

            parameters[numberBranch].nameG = `g${Name}`;
            parameters[numberBranch].conductance = +value;


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

/*     function Arrow(branchs){
        branchs[0].elements.forEach(element => {
            element.style.background = 'url(../img/svg/Arrow.SVG) -34% -1100% no-repeat;';
            console.log(478547);
        });
    }

    Arrow(branchs); */


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

        sumEG = sumEG + element.conductance * element.voltage;

        if(element.voltage < 0) { 
            plus = '';
        }else{
            plus = ' + ';
        }

        expressionEG = expressionEG + 
        `${plus} ${element.voltage}` +  
        `⋅${ toFixed2(element.conductance) }`;

        a = a + `${element.nameE}` +  `⋅${element.nameG}`;

        sumG = sumG + element.conductance;
        expressionG = expressionG + ` + ${ toFixed2(element.conductance) }`;
        b = b + ` + ${element.nameG}`;

    });

        U = sumEG / sumG;

        a = SliceElement(a, ' +');
        b = SliceElement(b, ' +');
        expressionG = SliceElement(expressionG, ' +');
        expressionEG = SliceElement(expressionEG, ' +');

        textArr.push(`Напряжение между узлами А-В равно:`);
        textArr.push(`Uab =~${a}/${b}~=~${expressionEG}/${expressionG}~= `+
        `${toFixed2(U)} В`);
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
            I[i] = (element.voltage - U) * element.conductance;
            I[i] = toFixed2(I[i]);

            if(U < 0) { 
                plus = ' +';
            }else{
                plus = ' -';
            }
    
            expressionEU =  `${element.voltage}` + `${plus} ${Math.abs(toFixed2(U))}`;

            a = `${element.nameE}` + ` - U`;
            b = `${element.nameG}`;

            a = SliceElement(a, ' +');

        textArr.push(`Найдём ток в ветви №${i}`);
        textArr.push(`I${i} = ${a}⋅${b} = `+
        `(${expressionEU})⋅${toFixed2(element.conductance)} = ${I[i]} А`);
        getAnswerBlock(textArr);
        textArr = [];
        });
    }


    function getBalance(parameters){
        let sumEI = 0,
        sumRII = 0,
        expressionEI = '',
        expressionRII = '',
        a = '',
        b = '',
        plus = '+';

        parameters.forEach((element, i) => {

            
            sumEI = sumEI + element.voltage * I[i];
            sumRII = sumRII + (I[i] * I[i]) * element.resistance;
        
            
            // добавляем скобки к отрицательным токам
            if(I[i] < 0) { 
                I[i] = `(${I[i]})`;
            }

            a = a + `${element.nameE} ⋅ I${i}`;
            expressionEI = expressionEI + ` + ${element.resistance} ⋅ ${I[i]}`;

            b = b + ` + I${i}<sup>2</sup> ⋅ ${element.nameR}`;
            expressionRII = expressionRII + ` + ${I[i]}<sup>2</sup> ⋅ ${element.resistance}`;
        });

        a = SliceElement(a, ' +');
        b = SliceElement(b, ' +');
        expressionEI = SliceElement(expressionEI, ' +');
        expressionRII = SliceElement(expressionRII, ' +');

        textArr.push(`Для проверки правильности решения составим баланс мощностей.`);
        textArr.push(`${a} = ${b}`);
        textArr.push(`${expressionEI} = ${expressionRII}`);
        textArr.push(`${toFixed2(sumEI)} = ${toFixed2(sumRII)}`);
        if(Math.abs(((sumEI - sumRII)/ sumEI)) < 0.03){
            textArr.push(`Баланс сошелся.`);
        }else{
            textArr.push(`ОШИБКА.`);
        }
        getAnswerBlock(textArr);
        textArr = [];
    }




    

    getParametrsBranch (branchs);
    GetVoltageSсheme();
    FindCurrent();
    getBalance(parameters);





};




export default getCalculation;