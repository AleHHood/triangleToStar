import getMath from './mathExpression';
import toFixed3 from './toFixed';

const TreangleToY = () => {

    const inputName = document.querySelectorAll(".resist__input-small"),
          inputResistence = document.querySelectorAll(".resist__input-big"),
          form = document.querySelector(".resist__form-triangle"),
          formY = document.querySelector(".resist__form-star"),
          btn = document.querySelector("#calculate"),
          answer = document.querySelector(".resist__answer"),
          changeBtn = document.querySelector(".resist__change"),
          container = document.querySelector(".resist__container-small"),
          triangle = document.querySelector(".resist__triangle"),
          name = document.querySelectorAll(".resist__name");
          
    let   textArr = [],
          scrollY;
    const resistors = [];


    class Resistor {
        constructor(
            name, resistance, schemaName
            ) {
            this.name = name;
            this.resistance = resistance;
            this.schemaName = schemaName;
            }
        }

    //Default значения блоков

    for (let i = 0; i < 6; i++) {
        resistors[i] = new Resistor();

        if(i <= 2){
            resistors[i].name = `${i+1}`;
        }else{
            resistors[i].name = `${i-2}`;
        }

        resistors[i].name = `${i+1}`;
        resistors[i].resistance = 0;
        resistors[i].schemaName = document.querySelector(`.R${i}`);
    }

//Отслеживаем прокрутку страницы ждля фикс бага с 
//прокруткой блока при изменении порядка сортировки блоков

    window.addEventListener('scroll', function() {
        scrollY = window.pageYOffset;
        });


//----default значение рассчта для треугольника
    getDataForm(form);

//----------------Клик кнопка поменять---------------------//
//Выбор режима
    changeBtn.addEventListener('click', () => {
        
        clearAnswer()
        form.classList.toggle('resist__form-none');
        formY.classList.toggle('resist__form-none');
        container.classList.toggle('resist__container-small-revers');
        window.scrollTo({
            top: scrollY,
        });
        if(form.classList.contains('resist__form-none')){
            getDataForm(formY);
            console.log(`formY`);
            
            //Присваеваем не используемым значения default значения
            //Default значения блоков
            getResetName();

        }else{
            console.log(`form`);
            getDataForm(form);

            //Присваеваем не используемым значения default значения
            //Default значения блоков
            getResetName();
        }
    });



    //Собираем Данные из выбранной формы
    function getDataForm(form) {
        form.addEventListener('input', (event) => {
            const target = event.target;
    
            if(target && target.classList.contains('resist__input-big')){
                //Валидация формы
                inputCheck(target);
    
                //По дата атрибуту определяем к какому элементу относится Input
                //и присваеваем сопротивление
                const data = target.getAttribute('data-R');
                resistors[data].resistance = target.value;
            }
            if(target && target.classList.contains('resist__input-small')){
    
                //перебираем все input для имени. номер класса элемента 
                //на схеме совпадает с номером input 1 = .R1
                inputName.forEach((element, i) => {
                    if(target === element){
                        resistors[i].schemaName.textContent = `R${target.value}`;
                        resistors[i].name = `${target.value}`;
                    }
                });
            }
        });
    }


    function getResetName(){
        //Присваеваем не используемым значения default значения
        //Default значения блоков
        for (let i = 0; i < 6; i++) {
            if(i <= 2){
                resistors[i].name = `${i+1}`;
                inputName[i].value = i + 1;
            }else{
                resistors[i].name = `${i-2}`;
                inputName[i].value = i - 2;
            }
            resistors[i].schemaName.textContent = `R${inputName[i].value}`;
        }
    }
    

    function inputCheck(input) {

        if(input.value.length > 9){
            input.value = input.value.substring(0, 9);
        }

        if(input.value <= 0 || input.value.length > 9){
            input.classList.add('resist__input-error');
        }
        else{
            input.classList.remove('resist__input-error');
        }
    }


    // ---------------------------КЛИК РАССЧИТАТЬ------------------------//

    btn.addEventListener('click', () => {
        clearAnswer();
        if(form.classList.contains('resist__form-none')){
            calculateStar(3, 4);
            calculateStar(3, 5);
            calculateStar(4, 5);
        }else{
            calculate(0, 1);
            calculate(0, 2);
            calculate(1, 2);
        }

        
/*         console.log(11111551);
        resistors.forEach(element => {
            console.log(element.name);
            console.log(element.resistance);
        }); */
    });


    function calculate(a, b){
        let numeratorExp,
            denominatorExp,
            denominator,
            result;

        numeratorExp = `R${resistors[a].name}${resistors[b].name}`;
        if(a+b === 1){
            resistors[3].schemaName.textContent  = `${numeratorExp}`;
        }else{
            if(a+b === 2){
                resistors[4].schemaName.textContent  = `${numeratorExp}`;
            }else{
                resistors[5].schemaName.textContent  = `${numeratorExp}`;
            }
        }
        
        //Составляем выражение
        denominatorExp = `R${resistors[0].name} +`+
        ` R${resistors[1].name} + R${resistors[2].name}`;
        textArr.push(
            `tac ${numeratorExp} = ~R${resistors[a].name} ` +
            `⋅ R${resistors[b].name}/${denominatorExp}~`
        );
        
        // Переводим значения сопротивления из string to Num
        resistors[0].resistance = +resistors[0].resistance;
        resistors[1].resistance = +resistors[1].resistance;
        resistors[2].resistance = +resistors[2].resistance;


        //Подставляем значения в выражение
        denominator  = `${resistors[0].resistance} +`+
        ` ${resistors[1].resistance} + ${resistors[2].resistance}`;

        result = resistors[a].resistance * resistors[b].resistance;
        result = result / (resistors[0].resistance + 
        resistors[1].resistance + resistors[2].resistance);
        result = toFixed3(result);

        textArr.push(
            `tac ${numeratorExp} = ~${resistors[a].resistance} ` +
            `⋅ ${resistors[b].resistance}/${denominator}~` + 
            ` = ${result} Ом`
        );
        getAnswerBlock(textArr);
        textArr = [];
    }



// Расчет звезда в треугольник
    function calculateStar(a, b){
        let numeratorExp,
            denominatorExp,
            denominator,
            sum,
            result;

        numeratorExp = `R${resistors[a].name}${resistors[b].name}`;
        if(a+b === 7){
            resistors[0].schemaName.textContent  = `${numeratorExp}`;
        }else{
            if(a+b === 8){
                resistors[1].schemaName.textContent  = `${numeratorExp}`;
            }else{
                resistors[2].schemaName.textContent  = `${numeratorExp}`;
            }
        }
        
        //Составляем выражение
        denominatorExp = `R${resistors[12 - a - b].name}`;
        sum = `R${resistors[a].name} + ` + `R${resistors[b].name}`;
        textArr.push(
            `tac ${numeratorExp} = ${sum} + ~R${resistors[a].name} ` +
            `⋅ R${resistors[b].name}/${denominatorExp}~`
        );
        
        // Переводим значения сопротивления из string to Num
        resistors[3].resistance = +resistors[3].resistance;
        resistors[4].resistance = +resistors[4].resistance;
        resistors[5].resistance = +resistors[5].resistance;

        //Подставляем значения в выражение
        denominator  = `${resistors[12 - a - b].resistance}`;

        result = resistors[a].resistance + resistors[b].resistance;
        result = result + ((resistors[a].resistance * 
        resistors[b].resistance) / denominator);
        result = toFixed3(result);

        textArr.push(
            `tac ${numeratorExp} = ${resistors[a].resistance} +` +
            ` ${resistors[b].resistance} ~${resistors[a].resistance} ` +
            `⋅ ${resistors[b].resistance}/${denominator}~` + 
            ` = ${result} Ом`
        );
        getAnswerBlock(textArr);
        textArr = [];
    }


    //Отправляем мвссив textArr из строк для вывода <p> в answer
    function getAnswerBlock(textArr) {

        const answerP = document.createElement('p');
        answerP.classList.add('resist__answerP');
        answer.append(answerP);
        textArr.forEach(element => {
            getMath(element, answerP);
        });
    }

    //Функция удаления старых ответов из div answer
    function clearAnswer() {
        const answerP = document.querySelectorAll('.resist__answerP');
        answerP.forEach(element => {
            element.remove();
        });
    }


};

export default TreangleToY;