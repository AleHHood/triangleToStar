
window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.nav'),
    menuItem = document.querySelectorAll('.menu-item'),
    btn = document.querySelector('.header__button'),
    hamburger = document.querySelector('.header__hamburger')
    const searchform = document.querySelector('.search__form-desctop'),
    btnSearch = document.querySelector('.header__search'),
    social = document.querySelector('.header__social');

    btn.addEventListener('click', () => {
        hamburger.classList.toggle('header__hamburger_active');
        menu.classList.toggle('nav_active');
    });

    btnSearch.addEventListener('click', () => {
        btnSearch.classList.toggle('header__search-nonactive');
        searchform.classList.toggle('search__form-desctop-active');
        social.classList.toggle('header__social-active');
    });


    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('header__hamburger_active');
            menu.classList.toggle('nav_active');
        })
    })
})


/* 

$(document).ready(function(){
    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
      $(this)
        .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
        .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
    });
    

    function ToggleSlide(item) {
      $(item).each(function(i) {
        $(this).on('click', function(e) {
          e.preventDefault();
          $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');  
          $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');  
        })
      });
    };

    ToggleSlide('.catalog-item__link');    
    ToggleSlide('.catalog-item__list_back');}); */