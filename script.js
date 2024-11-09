




const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const OPENAI_API_KEYS = "sk-2ojt9Lp4UC8WsIARx_pKaKeVzcufYN5uocmBLgVJv7T3BlbkFJmsmyYfqGEmY7l-WZ004OdrpfZ_I9n0zcaWKlB-sVwA";

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadButton = imgCard.querySelector(".download-btn");

    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64._json}`;
    imgElement.src = aiGeneratedImg;

    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadButton.setAttribute("href", aiGeneratedImg);
      downloadButton.setAttribute("download", `${new Date().getTime()}.jpg`);
    };
  });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method:'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEYS}`
      },
      body: JSON.stringify({
        prompt: userPrompt,
        n: parseInt(userImgQuantity),
        size: "512x512",
        response_format: "b64_json"
      })
    });

    if (!response.ok) throw new Error("Failed to generate images. Try again.");
    const { data } = await response.json();
    console.log(data);
    updateImageCard([...data]);
  } catch (error) {
    alert(error.message);
  }
};

const handleFormSubmission=(e)=>{
  e.preventDefault();
  const userPrompt=e.srcElement[0].value;
  const userImgQuantity=e.srcElement[1].value;
  const imgCardMarkup=Array.from({length:userImgQuantity},()=>
   ` <div class="img-card loading">
            <img src="loading.svg" alt="image">
            <a href="#" class="download-btn">
                <i class="fa-regular fa-circle-down"></i>
            </a>

        </div>`
   
  ).join("");
  imageGallery.innerHTML=imgCardMarkup;
  generateAiImages(userPrompt,userImgQuantity);
  
}

generateForm.addEventListener("submit",handleFormSubmission)
