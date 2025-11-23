// ======= Toggle Side Nav =======
const navToggle = document.getElementById('navToggle');
const sideNav = document.getElementById('sideNav');
const mainContent = document.querySelector('.main-content');

navToggle.addEventListener('click', () => {
  sideNav.classList.toggle('show');
  mainContent.classList.toggle('shift');
});

// ======= Links =======
const searchLink = document.getElementById('search-link');
const categoriesLink = document.getElementById('categories-link');
const areaLink = document.getElementById('area-link');
const ingredientsLink = document.getElementById('ingredients-link');
const contactLink = document.getElementById('contact-link');

const content = document.getElementById('content');

// ======= API FETCH FUNCTIONS =======
async function fetchMealsByName(name = '') {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
  const data = await res.json();
  return data.meals;
}

async function fetchMealsByLetter(letter) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  const data = await res.json();
  return data.meals;
}

async function fetchCategories() {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  const data = await res.json();
  return data.categories;
}

async function fetchMealsByCategory(category) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  const data = await res.json();
  return data.meals;
}

async function fetchAreas() {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  const data = await res.json();
  return data.meals;
}

async function fetchMealsByArea(area) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  const data = await res.json();
  return data.meals;
}

async function fetchIngredients() {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
  const data = await res.json();
  return data.meals;
}

async function fetchMealsByIngredient(ingredient) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const data = await res.json();
  return data.meals;
}

// ======= DISPLAY FUNCTIONS =======
function displayMeals(meals) {
  content.innerHTML = '';
  if (!meals) {
    content.innerHTML = '<p class="text-center">No meals found.</p>';
    return;
  }
  meals.slice(0, 20).forEach(meal => {
    const card = document.createElement('div');
    card.className = 'col-md-3';
    card.innerHTML = `
      <div class="card h-100">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
        </div>
      </div>
    `;
    content.appendChild(card);

    card.addEventListener('click', () => showMealDetails(meal));
  });
}

function showMealDetails(meal) {
  content.innerHTML = `
    <div class="col-12">
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" class="img-fluid mb-3">
      <p><strong>Category:</strong> ${meal.strCategory || '-'}</p>
      <p><strong>Area:</strong> ${meal.strArea || '-'}</p>
      <p><strong>Instructions:</strong> ${meal.strInstructions || '-'}</p>
      <p><strong>Recipes:</strong> ${[...Array(20)].map((_,i)=>meal[`strIngredient${i+1}`] ? meal[`strIngredient${i+1}`] : '').filter(Boolean).join(', ')}</p>
      <p><strong>Tags:</strong> ${meal.strTags || '-'}</p>
      <p><strong>Source:</strong> <a href="${meal.strSource}" target="_blank">${meal.strSource || '-'}</a></p>
      <p><strong>Youtube:</strong> <a href="${meal.strYoutube}" target="_blank">${meal.strYoutube || '-'}</a></p>
    </div>
  `;
}

// ======= SIDE NAV EVENTS =======

// --- Search ---
searchLink.addEventListener('click', async () => {
  content.innerHTML = `
    <div class="col-12 mb-3">
      <input type="text" id="nameSearch" placeholder="Search by meal name" class="form-control mb-2">
      <input type="text" id="letterSearch" placeholder="Search by first letter" maxlength="1" class="form-control">
    </div>
  `;

  const nameInput = document.getElementById('nameSearch');
  const letterInput = document.getElementById('letterSearch');

  nameInput.addEventListener('input', async () => {
    const meals = await fetchMealsByName(nameInput.value);
    displayMeals(meals);
  });

  letterInput.addEventListener('input', async () => {
    if (letterInput.value.length === 1) {
      const meals = await fetchMealsByLetter(letterInput.value);
      displayMeals(meals);
    }
  });
});

// --- Categories ---
categoriesLink.addEventListener('click', async () => {
  const categories = await fetchCategories();
  content.innerHTML = '';
  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-3';
    card.innerHTML = `
      <div class="card h-100">
        <img src="${cat.strCategoryThumb}" class="card-img-top" alt="${cat.strCategory}">
        <div class="card-body">
          <h5 class="card-title text-center">${cat.strCategory}</h5>
        </div>
      </div>
    `;
    content.appendChild(card);

    card.addEventListener('click', async () => {
      const meals = await fetchMealsByCategory(cat.strCategory);
      displayMeals(meals);
    });
  });
});

// --- Area ---
areaLink.addEventListener('click', async () => {
  const areas = await fetchAreas();
  content.innerHTML = '';
  areas.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary m-2';
    btn.textContent = a.strArea;
    content.appendChild(btn);

    btn.addEventListener('click', async () => {
      const meals = await fetchMealsByArea(a.strArea);
      displayMeals(meals);
    });
  });
});

// --- Ingredients ---
ingredientsLink.addEventListener('click', async () => {
  const ingredients = await fetchIngredients();
  content.innerHTML = '';
  ingredients.slice(0, 20).forEach(i => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-success m-2';
    btn.textContent = i.strIngredient;
    content.appendChild(btn);

    btn.addEventListener('click', async () => {
      const meals = await fetchMealsByIngredient(i.strIngredient);
      displayMeals(meals);
    });
  });
});

// --- Contact Form ---
contactLink.addEventListener('click', () => {
  content.innerHTML = `
    <div class="col-12">
      <form id="contactForm">
        <input type="text" placeholder="Name" class="form-control mb-2" id="name" required pattern="^[A-Za-z ]+$">
        <input type="email" placeholder="Email" class="form-control mb-2" id="email" required>
        <input type="text" placeholder="Phone" class="form-control mb-2" id="phone" required pattern="^\\d{10,15}$">
        <input type="password" placeholder="Password" class="form-control mb-2" id="password" required pattern=".{6,}">
        <button type="submit" class="btn btn-primary" id="submitBtn" disabled>Submit</button>
      </form>
    </div>
  `;

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const inputs = form.querySlectorAll('input');

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const allValid = Array.from(inputs).every(i => i.checkValidity());
      submitBtn.disabled = !allValid;
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('Form submitted successfully!');
    form.reset();
    submitBtn.disabled = true;
  });
});

// ======= INITIAL LOAD =======
fetchMealsByName().then(meals => displayMeals(meals));
