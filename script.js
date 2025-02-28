function uploadMedia() {
    const fileInput = document.getElementById("mediaInput");
    const captionInput = document.getElementById("mediaCaption");
    const galleryContainer = document.querySelector(".gallery-container");

    const file = fileInput.files[0];
    const caption = captionInput.value;

    if (!file) {
        alert("Please select an image or video to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const mediaContainer = document.createElement("div");
        mediaContainer.classList.add("media-container");

        let mediaElement;
        if (file.type.startsWith("image/")) {
            mediaElement = `<img src="${e.target.result}" class="media">`;
        } else if (file.type.startsWith("video/")) {
            mediaElement = `<video class="media" controls><source src="${e.target.result}" type="${file.type}"></video>`;
        }

        mediaContainer.innerHTML = `
            ${mediaElement}
            <p class="caption">${caption}</p>
            <button class="delete-btn" onclick="deleteMedia(this)">Delete</button>
        `;

        galleryContainer.appendChild(mediaContainer);
        fileInput.value = "";
        captionInput.value = "";
    };

    reader.readAsDataURL(file);
}

function deleteMedia(button) {
    button.parentElement.remove();
}
