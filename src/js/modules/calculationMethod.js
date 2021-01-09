const getCalculation = (branchs) => {
    let parameters = [];
    class branchElements {
        constructor(numberBranch, nameR, resistance, nameE, voltage, ...elements) {
            this.numberBranch = numberBranch;
            this.resistance = resistance;
            this.nameR = nameR;
            this.voltage = voltage;
            this.nameE = nameE;
            this.elements = elements;
        }
    }



console.log(1561514);

    getValidationsBranch(branchs);

    function getValidationsBranch(branchs) {
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

    function GetValueResist(R, K, numberBranch){
        parameters[numberBranch] = new branchElements(numberBranch);

        if(K < 2){

            console.log(`Cопротивление для ветви №${numberBranch}`);
            console.log(`R${R[K].number} = ` + R[K].resistance);
            parameters[numberBranch].nameR = R[K].number;
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

            console.log(`Найдём сопротивление для ветви №${numberBranch}`);
            console.log(
                `1/R${Name} = ` + 
                `${expression}`.slice(2)
            );
            console.log(
                `1/R${Name} = ` + 
                `${expressionValue} = `.slice(2) + 
                value
            );
            
            parameters[numberBranch].nameR = `R${Name}`;
            parameters[numberBranch].resistance = +value;
        }
    }

    function GetValueVoltage(R, K, numberBranch){
        let voltage = 0;
        if(K === 0){

            console.log(`Эдс для ветви №${numberBranch}`);
            console.log(0);

            parameters[numberBranch].nameE = 0;
            parameters[numberBranch].voltage = 0;
            return;

        }
        if(K < 2){

            console.log(`Эдс для ветви №${numberBranch}`);
            voltage = +(R[K].voltage);
            if(R[K].rotate == 0){
                voltage = -voltage;
            }
            console.log(`E${R[K].number} = ` + voltage);

            parameters[numberBranch].nameE = `E${R[K].number}`;
            parameters[numberBranch].voltage = +voltage;

        } else {

            let Name = '',
            value = 0,
            expressionValue = '',
            expression = '';


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

            console.log(`Эдс для ветви №${numberBranch}`);
            console.log(
                `E${Name} = ` + 
                `${expression}`.slice(' +')
            );
            console.log(
                `E${Name} = ` + 
                `${expressionValue} = `.slice(' +') + 
                value
            );

            parameters[numberBranch].nameE = `E${Name}`;
            parameters[numberBranch].voltage = +value;
        }
    }

    function Arrow(branch){
        
    }
    
};


export default getCalculation;