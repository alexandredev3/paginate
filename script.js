// Dados da aplicação.
const data = Array.from({ length: 100 })
  .map((_, i) => `Item ${(i + 1)}`);

// Paginas 
let perPage = 5;
const state = {
  page: 1,
  perPage,
  totalPage: Math.ceil(data.length / perPage),
  maxVisibleButtons: 5
};

// Pegando elementos da DOM
const html = {
  get(element) {
    return document.querySelector(element);
  }
};


// Logica dos controles
const controls = {
  next() {
    state.page++;

    // Se o page for maior que o total page, ele vai voltar
    const lastPage = state.page > state.totalPage;
    if (lastPage) {
      state.page--;
    };
  },

  prev() {
    state.page--;

    const firstPage = state.page < 1;
    if (firstPage) {
      state.page++;
    };
  },

  goTo(page) {
    // se for passado uma pagina menor que 1, ele vai cai nesse if.
    if (page < 1) {
      page = 1;
    }

    state.page = +page;
    // se você colocar apenas page, ele não vai ser um numero, quando você coloca um + ele vira um numero.

    // se for passado uma pagina maior que o total de pagina ele cai nesse if.
    if (page > state.totalPage) {
      state.page = state.totalPage;
    }

  },

  createListeners() {
    html.get('.first').addEventListener('click', () => {
      controls.goTo(1);
      update();
    });

    html.get('.last').addEventListener('click', () => {
      controls.goTo(state.totalPage);
      update();
    });

    html.get('.prev').addEventListener('click', () => {
      controls.prev();
      update();
    });

    html.get('.next').addEventListener('click', () => {
      controls.next();
      update();
    });
  }
};

const list = {
  create(item) {
    const div = document.createElement('div');
    div.classList.add('item');
    div.innerHTML = item;

    html.get('.list').appendChild(div);
  },
  update() {
    const { perPage } = state;

    // Quando eu entrar ele vai limpar a lista.
    html.get('.list').innerHTML = '';

    let page = state.page - 1;
      // estou tirando 1, porque o array começa em 0.
    let start = page * perPage;
    let end = start + perPage;

    const paginatedItems = data.slice(start, end);
    // O primeiro param do slice, e qual variavel eu quero cortar.
    // O segundo param do slice, e qual a quantidade que eu quero cortar. 

    paginatedItems.forEach(list.create);
    // para cada item, eu estou jogando no parametro item do create.
  }
};

const buttons = {
  element: html.get('.controls .numbers'),
  create(number) {
    const button = document.createElement('div');

    button.innerHTML = number;

    if (state.page == number) {
      button.classList.add('active');
    }

    button.addEventListener('click', (event) => {
      const page = event.target.innerText;

      controls.goTo(page);
      update();
    });

    buttons.element.appendChild(button);
  },
  update() {
    // zerando tudo que tem la dentro
    buttons.element.innerHTML = '';

    const { maxLeft, maxRight } = buttons.calculateMaxVisible();

    for(let page = maxLeft; page <= maxRight; page++) {
      buttons.create(page);
    };
  },
  calculateMaxVisible() {
    const { maxVisibleButtons, totalPage } = state;

    let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2));
    let maxRight = (state.page + Math.floor(maxVisibleButtons / 2));
    // Math.floor vai arrendondar para baixo.

    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = maxVisibleButtons;
    };

    if (maxRight > totalPage) {
      maxLeft = totalPage - (maxVisibleButtons - 1);
      maxRight = totalPage;

      if (maxLeft < 1) maxLeft = 1;
    };

    return {maxLeft, maxRight};
  }
};

function blockButtons() {
  const { page, totalPage } = state;

  const elements = {
    prev: html.get('.controls .prev'),
    next: html.get('.controls .next'),
    
    first: html.get('.controls .first'),
    last: html.get('.controls .last')
  };

  if (page == 1) {
    elements.prev.classList.add('disable');
    elements.first.classList.add('disable');
  } else {
    elements.prev.classList.remove('disable');
    elements.first.classList.remove('disable');
  };

  if (page == totalPage) {
    elements.next.classList.add('disable');
    elements.last.classList.add('disable');
  } else {
    elements.next.classList.remove('disable');
    elements.last.classList.remove('disable');
  };
}

function update() {
  list.update();
  buttons.update();
  controls.createListeners();
  blockButtons();
};

// Iniciando Aplicação
function init() {
  update();
};

window.addEventListener('load', init);