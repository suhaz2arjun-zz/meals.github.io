const mealsEl = document.getElementById("meals");
const favContainer = document.getElementById("fav-meals");

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

const mealPopup = document.getElementById('meal-popup');
const popupClose = document.getElementById("close-popup");
getRandomMeal();
fetchFavMeals();
async function getRandomMeal(){
    const resp=await fetch(" https://www.themealdb.com/api/json/v1/1/random.php")

    const respData = await resp.json();
    const randomMeal =respData.meals[0];

    addMeal(randomMeal,true);
}

async function getMealById(id){
    const resp =await fetch(" https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);
    const respData = await resp.json();
    const meal =respData.meals[0];
    return meal;
}

async function getMealBySearch(term){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term);

    const respData = await resp.json();
    const meals =  respData.meals;

    return meals;

}

function addMeal(mealData, random =false){
    const meal =document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
    <div class="meal-header">
        ${random?`
        <span class="random">Random Recipe</span>` : ''}
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <butn class="fav-btn "><i class="fa fa-heart" aria-hidden="true"></i></butn>
    </div>
`;

const btn = meal.querySelector('.meal-body .fav-btn');
    btn.addEventListener("click",()=>{
        console.log(mealData)
        if(btn.classList.contains('active')){
            removeMealLS(mealData.idMeal);
            btn.classList.remove('active');
        }else{
            addMealLS(mealData.idMeal);
            btn.classList.add('active');
        }

        fetchFavMeals();
});

mealsEl.appendChild(meal);

}

function addMealLS(mealID){
    const mealIDs = getMealLS();

    localStorage.setItem('mealIDs',JSON.stringify([...mealIDs,mealID]));

}

function removeMealLS(mealID){
    const mealIDs = getMealLS();

    localStorage.setItem('mealIDs',JSON.stringify(mealIDs.filter((id)=>id!==mealID))
    );

}

function getMealLS(){
   
    const mealIDs = JSON.parse(localStorage.getItem('mealIDs'));
    return mealIDs === null ? [] :mealIDs;
}


async function fetchFavMeals(){
    favContainer.innerHTML='';
    const mealIDs = getMealLS();

    for(let i=0;i<mealIDs.length;i++){
        const mealID = mealIDs[i];
        meal =await getMealById(mealID);
        addMealFav(meal);
    }


} 

function addMealFav(mealData){

    const favmeal =document.createElement('li');
    favmeal.innerHTML = `
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
    <span class="txt">${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-minus-circle"></i></button>
`;
const btn = favmeal.querySelector('.clear');
btn.addEventListener('click',()=>{
    removeMealLS(mealData.idMeal);
    fetchFavMeals();
})
favContainer.appendChild(favmeal);
}

searchBtn.addEventListener('click',async()=>{
    mealsEl.innerHTML=" ";
    const search = searchTerm.value;

    const meals = await getMealBySearch(search);
    if(meals){
    meals.forEach((meal)=>{
        addMeal(meal);
    })
    }
})


popupClose.addEventListener('click',()=>{
    mealPopup.classList.add('hidden');
});