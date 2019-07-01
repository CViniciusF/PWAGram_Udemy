var shareImageButton = document.querySelector('#share-image-button')
var createPostArea = document.querySelector('#create-post')
var closeCreatePostModalButton = document.querySelector(
  '#close-create-post-modal-btn'
)

function openCreatePostModal() {
  createPostArea.style.display = 'block'
  if (defferredPrompt) {
    defferredPrompt.prompt()
    defferredPrompt.userChoice.then(function(choiseResult) {
      console.log(choiseResult.outcome)
      if (choiseResult.outcome === 'dismissed') {
        console.log('User canceled installation')
      } else {
        console.log('User added to home screen')
      }
    })
    /*If the user refused one time we cant ask for it anymore */
    defferredPrompt = null
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none'
}

shareImageButton.addEventListener('click', openCreatePostModal)

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal)
