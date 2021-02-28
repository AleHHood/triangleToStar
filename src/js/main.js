import ShowHideHeader from './modules/showHeader';

window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.nav'),
    menuItem = document.querySelectorAll('.menu-item'),
    btn = document.querySelector('.header__button'),
    hamburger = document.querySelector('.header__hamburger'),
    searchform = document.querySelector('.search__form-desctop'),
    btnSearch = document.querySelector('.header__search'),
    social = document.querySelector('.header__social'),
    mainContainer = document.querySelector('.main-container');

    ShowHideHeader('header');


    btn.addEventListener('click', () => {
        hamburger.classList.toggle('header__hamburger_active');
        menu.classList.toggle('nav_active');
        mainContainer.addEventListener('click', () => {
            menu.classList.remove('nav_active');
            hamburger.classList.remove('header__hamburger_active');
        });
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
        });
    });
});


