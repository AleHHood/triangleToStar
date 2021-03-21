const validForm  = (form) => {    
    /* console.log(form); */
    let x,
        num;
        
        x = form.value.length;
        x = x - 1;

        num = form.value;

        if(!(/^[0-9]{1,7}([,.][0-9]{0,4})?$/gm.test(form.value))){
                form.value = num.slice(0, x);
                /* console.log(num); */
        }
        /* /^[0-9]{1,9}([,.][0-9]{0,9})?$/gm */


        //  /^[-]{0,1}[0-9]{1,9}([,.][0-9]{0,9})?$/gm // с минусом
        //  /^[0-9]{1,9}([,.][0-9]{0,9})?$/gm // без минуса
};

export default validForm;