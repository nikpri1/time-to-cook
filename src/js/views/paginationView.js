import View from './View';

//import icons from '../img/icons.svg' // parcel 1
import icons from 'url:../../img/icons.svg'; // parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // page 1 and there are more pages
    if (curPage === 1 && numPages > 1) {
      return this._buttonNext(curPage);
    }

    //page last
    if (curPage === numPages && numPages > 1) {
      return this._buttonBack(curPage);
    }
    //other page (middle)
    if (curPage < numPages) {
      return [this._buttonNext(curPage), this._buttonBack(curPage)];
    }

    // page 1 and no other pages
    return '';
  }

  _buttonNext(curPage) {
    return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button> 
    `;
  }

  _buttonBack(curPage) {
    return ` 
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
<svg class="search__icon">
  <use href="${icons}#icon-arrow-left"></use>
</svg>
<span>Page ${curPage - 1}</span>
</button>
`;
  }
}

export default new PaginationView();
