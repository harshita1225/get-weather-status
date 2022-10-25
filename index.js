const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

//const apiKey = "b78c4b5cbf9921ae49e185f48f94ed7f";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityname = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";

      if (cityname.includes(",")) {
        if (cityname.split(",")[1].length > 2) {
          cityname = cityname.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == cityname.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>



        <div class="min-max">min ${main.temp_min}<sup>°C</sup>  
      </div>
      <div class="min-max">max ${main.temp_max}<sup>°C</sup></div>
        
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>

        <div class="sun">Sunrise ☀️  ${new Date(sys.sunrise * 1000)
          .toISOString()
          .slice(11, 16)}</div>
        <div class="sun">Sunset 🌅 ${new Date(sys.sunset * 1000)
          .toISOString()
          .slice(11, 16)}</div>`;

      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});

/* window.addEventListener("load", () => {
  let long;
  let lat;
  let cityname = "berlin";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      //  const proxy = "https://cors-anywhere.herokuapp.com/";
      //   console.log(position);

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=b78c4b5cbf9921ae49e185f48f94ed7f`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
        });
    });
  }
}); */
