function createContentElement(record) {
    let element = document.createElement('div');
    element.classList.add('item-content');
    element.innerHTML = record.text;
    return element;
}

function createAuthorElement(record){
    let element = document.createElement('div');
    let user = record.user || {'name': {'first': '', 'last': ''}}
    element.classList.add('author-name');
    element.innerHTML = user.name.first + ' ' + user.name.last;
    return element;
}

function createUpvotesElement(record){
    let element = document.createElement('div');
    element.classList.add('upvotes');
    element.innerHTML = record.upvotes;
    return element;
}

function createFooterElement(record){
    let element = document.createElement('div');
    element.classList.add('item-footer');
    element.append(createAuthorElement(record));
    element.append(createUpvotesElement(record));
    return element;
}

function createFactsListElement(record){ 
    let element = document.createElement('div');
    element.classList.add('fact-list-item');
    element.append(createContentElement(record));
    element.append(createFooterElement(record));
    return element;
}

function renderRecords(records){
    let factsList = document.querySelector('.facts-list');
    factsList.innerHTML = '';
    for (i = 0; i < records.length; i++){
        factsList.append(createFactsListElement(records[i]));
    }
}

function pageBtnHandler (event) {
    if (event.taget.dataset.page) {
        downloadData(event.taget.dataset.page);
        window.scrollTo(0, 0);
    }
}

function createPageBtn(page, classes = []) {
    let btn = document.createElement('button');
    classes.push('btn');
    for (cls of classes) {
        btn.classList.add(cls);
    }
    btn.dataset.page = page;
    btn.innerHTML = page;
    return btn;
}

function renderPaginationElement(info){
    let btn;
    let paginationCotainer = document.querySelector('.pagination');
    paginationCotainer.innerHTML = '';

    btn = createPageBtn(1, ['page-first-btn']);
    btn.innerHTML = 'Первая страница';
    if (info.current_page == 1) btn.style.visibility = 'hidden';
    paginationCotainer.add(btn);

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('page-btn');
    paginationCotainer.append(btn);

    let start = Math.max(info.current_page - 2, 1);
    let end = Math.min(info.current_page + 2, info.total_pages);
    for (let i  = start; i <= end; i++){
        buttonsContainer.append(createPageBtn(i, i == info.current_page ? ['active'] : []));
    }

    btn = createPageBtn(info.total_pages, ['page-last-btn']);
    btn.innerHTML = 'Последняя страница';
    if (info.current_page == info.total_pages) btn.style.visibility = 'hidden';
    paginationCotainer.add(btn);
}

function pagePerPageBtnHandler(event){
    downloadData(1);
}

function setPaginationInfo(info){
    document.querySelector('.total-count').innerHTML = info.total_count;
    let start = info.total_count > 0 ? (info.current_page - 1) * info.per_page + 1 : 0;
    document.querySelector('.current-interval-start').innerHTML = start;
    let end = Math.min(info.total_count, start + info.per_page - 1);
    document.querySelector('.current-interval-end').innerHTML = end;
}

function downloadData(page = 1){
    let factsList = document.querySelector('.facts-list');
    let url = new URL(factsList.dataset.url);
    let perPage = document.querySelector('.per-page-btn').value;
    url.searchParams.append('page', page);
    url.searchParams.append('per-page', perPage);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = "json";
    xhr.onload = function(){
        renderRecords(this.response.records);
        setPaginationInfo(this.response['_pagination']);
        renderPaginationElement(this.response['_pagination']);
    }
    xhr.send();
}


window.onload = function(){
    downloadData();
    document.querySelector('.pagination').onclick = pageBtnHandler;
    document.querySelector('.per-page-btn').onclick = pagePerPageBtnHandler;
}