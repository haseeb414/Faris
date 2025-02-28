eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaGp3dmhzYWR4eXN5Z2Z1cGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTk4NjIsImV4cCI6MjA1NjMzNTg2Mn0.K65KPOQYYi-8BNwjHCAK81VNC660Cxjbf15EqXpKiCsfunction uploadMedia() {
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
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("upload-btn").addEventListener("click", async () => {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("Please select a file!");

    const filePath = `uploads/${Date.now()}_${file.name}`; // Unique file name
    const { data, error } = await supabase.storage.from("uploads").upload(filePath, file);

    if (error) {
        console.error("Upload failed:", error.message);
        return alert("Upload failed!");
    }

    // Get file URL
    const { publicURL } = supabase.storage.from("uploads").getPublicUrl(filePath);
    document.getElementById("gallery").innerHTML += `<img src="${publicURL}" width="200px">`;

    alert("Uploaded successfully!");
});
async function loadGallery() {
    const { data, error } = await supabase.storage.from("uploads").list();
    if (error) return console.error("Error loading images:", error.message);

    const gallery = document.getElementById("gallery");
    data.forEach(file => {
        const fileURL = `${SUPABASE_URL}/storage/v1/object/public/uploads/${file.name}`;
        gallery.innerHTML += `<img src="${fileURL}" width="200px">`;
    });
}

loadGallery();
