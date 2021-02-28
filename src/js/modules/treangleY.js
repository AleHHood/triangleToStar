import getMath from './mathExpression';
const TreangleToY = () => {

    const inputName = document.querySelectorAll(".resist__input-small"),
          inputResistence = document.querySelectorAll(".resist__input-big"),
          form = document.querySelector(".resist__form"),
          btn = document.querySelector("#calculate"),
          answer = document.querySelector(".resist__answer"),
          name = document.querySelectorAll(".resist__name");
    let   textArr = [];

    const resistors = [];


    class Resistor {
        constructor(
            name, resistance
            ) {
            this.name = name;
            this.resistance = resistance;
            }
        }

    //Default значения блоков

    for (let i = 0; i < 6; i++) {
        resistors[i] = new Resistor();
        resistors[i].name = `${i+1}`;
        resistors[i].resistance = 0;
    }

    //Собираем Данные из первой формы
    form.addEventListener('input', (event) => {
        const target = event.target;

        if(target && target.classList.contains('resist__input-big')){
            //Валидация формы
            inputCheck(target);

            //По дата атрибуту определяем к какому элеиенту относится Input
            //и присваеваем сопротивление
            const data = target.getAttribute('data-R');
            resistors[data].resistance = target.value;
        }
        if(target && target.classList.contains('resist__input-small')){

            //перебираем все input для имени. номер класса элемента 
            //на схеме совпадает с номером input 1 = .R1
            inputName.forEach((element, i) => {
                if(target === element){
                    document.querySelector(`.R${i}`).textContent  = `R${target.value}`;
                    resistors[i].name = `${target.value}`;
                }
            });
        }
    });
    

    function inputCheck(input) {

        if(input.value.length > 9){
            input.value = input.value.substring(0, 9);
        }

        if(input.value < 0 || input.value.length > 9){
            input.classList.add('resist__input-error');
        }
        else{
            input.classList.remove('resist__input-error');
        }
    }


    btn.addEventListener('click', () => {
        calculate(0, 1);
        calculate(0, 2);
        calculate(1, 2);
        console.log(11111551);
        resistors.forEach(element => {
            console.log(element.name);
            console.log(element.resistance);
        });
    });


    function calculate(a, b){
        let numerator,
            denominator;

        numerator = `R${resistors[a].name}${resistors[b].name}`;
        if(a+b === 1){
            document.querySelector(`.R${3}`).textContent  = `${numerator}`;
        }else{
            if(a+b === 2){
                document.querySelector(`.R${4}`).textContent  = `${numerator}`;
            }else{
                document.querySelector(`.R${5}`).textContent  = `${numerator}`;
            }
        }
        

        denominator = `R${resistors[0].name} +`+
        ` R${resistors[1].name} + R${resistors[2].name}`;
        textArr.push(
            `tac ${numerator} = ~R${resistors[a].name} ` +
            `⋅ R${resistors[b].name}/${denominator}~`
        );
        getAnswerBlock(textArr);
        textArr = [];
    }


    function getAnswerBlock(textArr) {

        const answerP = document.createElement('p');
        answerP.classList.add('resist__answerP');
        answer.append(answerP);
        textArr.forEach(element => {
            getMath(element, answerP);
        });
    }

    function getNumberToSheme(){

    }



};

export default TreangleToY;