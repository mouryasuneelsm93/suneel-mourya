
let productBlockBtn = document.querySelectorAll('.task_quick-add');
productBlockBtn.forEach((item,index)=>{
    item.addEventListener('click',function(evt){
        let productJSON = this.dataset.json;
        productJSON = JSON.parse(productJSON);
        showPopup(productJSON);
        document.querySelector(".product_price").innerText = this.dataset.price;
    })
})

function showPopup(productJSON){
    document.querySelector(".product-image").src = productJSON.featured_image;
    document.querySelector(".product_title").innerText = productJSON.title;
    document.querySelector(".product_description").innerHTML = productJSON.description;
    document.querySelector('.popup').style.display = "block";
}

function hidePopup(){
    document.querySelector('.popup').style.display = "none";
}