const ShowHideHeader = (headerClass) => {

    const header = document.querySelector(headerClass);
    let pageScrollBegin;
    
    window.addEventListener('scroll', function() {
        if(window.pageYOffset - pageScrollBegin < 0){
            header.classList.remove('hide');
        }
        else{
            if(
                window.pageYOffset > 200 &&
                pageScrollBegin
                ){
                    header.classList.add('hide');
            }
        }
        pageScrollBegin = window.pageYOffset;
        });

};

export default ShowHideHeader;