const cart = document.querySelector(".cart");
const cartIcon = document.getElementById("cart-icon");
const closeIcon = document.getElementById("close-icon");

cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});

closeIcon.addEventListener("click", () => {
  cart.classList.remove("active");
});

// Function to calculate the total price
function calculateTotalPrice() {
  const cartItems = document.querySelectorAll(".cart-item");
  let total = 0;

  cartItems.forEach((item) => {
    const priceText = item.querySelector(".cart-price").textContent.trim();
    const pprice = parseFloat(priceText.replace(/[^\d.]/g, "")); // 

    const quantity = parseInt(item.querySelector(".cart-number").value)  +1;

    total += pprice * quantity;
  });

  document.querySelector(".cart-total").textContent = `Total: $${total.toFixed(2)}`;
}


function updateCounter() {
  const counter = document.querySelector('.counter');
  let counterNum = parseInt(counter.textContent);
  counterNum += 1;
  counter.textContent = counterNum;
  counter.classList.add('counter-show');
}


// add item to cart
const pluses = document.querySelectorAll("#plus");
pluses.forEach((plus) => {
  plus.addEventListener("click", () => {
    // Add the class for the pop effect
    plus.classList.add('click-effect');

    // Remove it after animation duration
    setTimeout(() => {
      plus.classList.remove('click-effect');
    }, 200); // matches CSS transition duration

    // Your existing add-to-cart logic goes here
  });
});

pluses.forEach((plus) => {
  plus.addEventListener("click", () => {
    
    //counter();

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const meal = plus.closest(".meal");
    const img = meal.querySelector(".meal-img").src;
    const title = meal.querySelector(".meal-title").textContent;
    const price = meal.querySelector(".price").textContent;

    cartItem.innerHTML = `
        <img src="${img}" alt="" class="cart-img">
        <div class="cart-info">
          <h3 class="cart-title">${title}</h3>
          <h4 class="cart-price">${price}</h4>
          <input type="number" class="cart-number" value="1">
        </div>
        <i class='bx bx-trash-alt' id="trash-icon" style='color:#e91a1a'  ></i>
        `;
    cart.appendChild(cartItem);
    const hrElement = cart.querySelector("hr");
    if (hrElement) {
      cart.insertBefore(cartItem, hrElement);
    } else {
      // If no <hr> found, simply append the cart item to the cart
      cart.appendChild(cartItem);
    }

    const trashIcon = cartItem.querySelector("#trash-icon");
    trashIcon.addEventListener("click", () => {
      cartItem.remove();
      calculateTotalPrice();
    });

    // Add event listener to update the total price when quantity changes
    const quantityInput = cartItem.querySelector(".cart-number");
    quantityInput.addEventListener("input", () => {
      if (quantityInput.value < 1) {
        quantityInput.value = 1; // Ensure quantity is not less than 1
      }
      calculateTotalPrice(); // Recalculate total price after changing quantity
    });

    // Initial calculation after adding item
    calculateTotalPrice();
  });
});

const cartBtn = document.querySelector('.cart-btn');
cartBtn.addEventListener('click', () => {
  const cartItems = cart.querySelectorAll('.cart-item');
  cartItems.forEach((item) => item.remove());
  document.querySelector('.cart-total').textContent = 'Total: $ 0';
  alert('Thank you for your purchase. Have a good lunch');
  cart.classList.remove('active');
});

const boxes = document.querySelectorAll('.box');

// HOVER EFFECT – add this
boxes.forEach(box => {
  box.addEventListener('mouseover', () => {
    box.style.transform = 'scale(1.1)';
    box.style.boxShadow = '0 8px 15px rgba(0,0,0,0.3)';
  });
  box.addEventListener('mouseout', () => {
    box.style.transform = 'scale(1)';
    box.style.boxShadow = 'none';
  });
});

boxes.forEach(box => {
  box.addEventListener('click', () => {
    // Get the menu title (category) from the clicked box
    const menuName = box.querySelector('.menu-title').textContent.trim();

    // Get all the meals
        const meals = document.querySelectorAll('.meal');

    meals.forEach(meal => {
      // Check if the meal's title contains the menuName as a class
      if (meal.querySelector('.meal-title').classList.contains(menuName)) {
        meal.style.display = 'block'; // Show the meal if it matches the category
      } else {
        meal.style.display = 'none'; // Hide the meal if it doesn't match the category
      }
    });
  });
});

const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
  searchBtn.classList.remove('pulse');
  void searchBtn.offsetWidth;
  searchBtn.classList.add('pulse');
});



searchBtn.addEventListener('click', () => {
  const searchItem = document.querySelector('.search').value.toLowerCase();
  const meals = document.querySelectorAll('.meal');

  meals.forEach(meal => {
    const mealTitle = meal.querySelector('.meal-title').textContent.trim().toLowerCase();

    if (mealTitle.includes(searchItem) || searchItem === '') {
      meal.style.display = 'block';
    } else {
      meal.style.display = 'none';
    }
  });
});

// reload page
const logo = document.querySelector('.logo');

logo.addEventListener('click', () => {
  location.reload();
});
