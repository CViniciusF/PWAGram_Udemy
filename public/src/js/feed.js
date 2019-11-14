let shareImageButton = document.querySelector("#share-image-button")
let createPostArea = document.querySelector("#create-post")
let sharedMomentsArea = document.querySelector("#shared-moments")
let closeCreatePostModalButton = document.querySelector(
  "#close-create-post-modal-btn"
)

function openCreatePostModal() {
  createPostArea.style.display = "block"
  if (defferredPrompt) {
    defferredPrompt.prompt()
    defferredPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome)
      if (choiceResult.outcome === "dismissed") {
        console.log("User canceled installation")
      } else {
        console.log("User added to home screen")
      }
    })
    /*If the user refused one time we cant ask for it anymore */
    defferredPrompt = null
  }
  //code for unregister all service workers
  //if you unregister, the cache is cleared too
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let i = 0; i < registrations.length; i++) {
        // registrations[i].unregister()
      }
    })
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = "none"
}

shareImageButton.addEventListener("click", openCreatePostModal)

closeCreatePostModalButton.addEventListener("click", closeCreatePostModal)

//not using, but it caches on demand (by button click)
function onSaveButtonClicked(event) {
  console.log("clicked")
  if ("caches" in window) {
    caches.open("user-requested").then((cache) => {
      cache.add("https://httpbin.org/get")
      cache.add("/src/images/sf-boat.jpg")
    })
  }
}

function clearCards() {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
  }
}

function createCard(data) {
  let cardWrapper = document.createElement("div")
  cardWrapper.className = "shared-moment-card mdl-card mdl-shadow--2dp"
  let cardTitle = document.createElement("div")
  cardTitle.className = "mdl-card__title"
  cardTitle.style.backgroundImage = "url(" + data.image + ")"
  cardTitle.style.backgroundSize = "cover"
  cardTitle.style.height = "180px"
  cardWrapper.appendChild(cardTitle)
  let cardTitleTextElement = document.createElement("h2")
  cardTitleTextElement.className = "mdl-card__title-text"
  cardTitleTextElement.textContent = data.title
  cardTitle.appendChild(cardTitleTextElement)
  let cardSupportingText = document.createElement("div")
  cardSupportingText.className = "mdl-card__supporting-text"
  cardSupportingText.textContent = data.location
  cardSupportingText.style.textAlign = "center"
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText)
  componentHandler.upgradeElement(cardWrapper)
  sharedMomentsArea.appendChild(cardWrapper)
}

function updateUI(data) {
  clearCards()
  console.log('data', data)

  for (let index = 0; index < data.length; index++) {
    createCard(data[index])
  }
}

let url = "https://pwagram-776e4.firebaseio.com/posts.json"
let networkDataReceived = false

fetch(url)
  .then(function (res) {
    return res.json()
  })
  .then(function (data) {
    networkDataReceived = true
    console.log("From web", data)
    let dataArray = []
    //transforming data object in array
    for (const key in data) {
      dataArray.push(data[key])
    }
    updateUI(dataArray)
  })

if ("caches" in window) {
  caches
    .match(url)
    .then(function (response) {
      if (response) {
        return response.json()
      }
    })
    .then(function (data) {
      console.log("From cache", data)
      if (!networkDataReceived) {
        //transforming data object in array
        let dataArray = []
        for (const key in data) {
          dataArray.push(data[key])
        }
        updateUI(dataArray)
      }
    })
}
