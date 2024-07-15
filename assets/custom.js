

class ProductPopup {
    constructor() {
        this.productJSON = null;
        this.optionObj = {};
        this.variantId = 0;
        this.colorVariantIndex = null;
    }

    initalize() {

        // Attch Event Listener for Product grid

        document.querySelectorAll('.task_quick-add').forEach((item) => {
            item.addEventListener('click', async (evt) => {
                this.productJSON = item.dataset.json;
                this.productJSON = JSON.parse(this.productJSON);
                this.showPopup(this.productJSON);
                document.querySelector(".product_price").innerText = item.dataset.price;
            })
        });

        document.body.addEventListener('click', (event) => {

            if (event.target.closest(".variant-wrapper") == null) return;

            let data_index = event.target.dataset.index;
            console.log(event.target);
            console.log("colorIndex", this.colorVariantIndex, event.target.classList.contains(`option_${this.colorVariantIndex}`))
            if (event.target.classList.contains(`option_${this.colorVariantIndex}`)) {
                this.optionObj[`option_${this.colorVariantIndex}`] = event.target.value;
                this.findSelectedVariantId(this.productJSON.variants, this.optionObj);
            } else if (event.target.classList.contains(`option_${data_index}`)) {
                this.optionObj[`option_${data_index}`] = event.target.dataset.value;
                this.findSelectedVariantId(this.productJSON.variants, this.optionObj);
                document.querySelector(`.select-dropdown__list.option_${data_index}`).classList.toggle("active");
                document.querySelector(`.select-dropdown__button.option_${data_index} span`).innerText = event.target.dataset.value;
            }
        })


    }
    showPopup(productJSON) {
        document.querySelector(".variant-wrapper").innerHTML = "";
        document.querySelector(".addToCart").disabled = true;
        document.querySelector(".product-image").src = productJSON.featured_image;
        document.querySelector(".product_title").innerText = productJSON.title;
        document.querySelector(".product_description").innerHTML = productJSON.description;
        document.querySelector('.popup').style.display = "grid";
        if(productJSON.options.length == 1){
            this.checkVariantAvailability(productJSON.variants[0]);
        }
        this.createOptionElements(productJSON.options);
        this.createVariantElements(productJSON.variants);
    }

    createOptionElements(optionsArray) {
        optionsArray.forEach((item, index) => {
            if (document.getElementById(`option_${index + 1}`)) document.getElementById(`option_${index + 1}`).remove();
            const optionWrapper = document.createElement('div');
            optionWrapper.id = `option_${index + 1}`;
            optionWrapper.dataset.name = item;
            optionWrapper.classList.add(`option_${item}`);
            optionWrapper.innerHTML = `<h3>${item}</h3>`;
            document.querySelector(".variant-wrapper").appendChild(optionWrapper);
        })
    }

    createVariantElements(variants) {

        // fetch the option value and create the unique object form variant json

        const options = [new Set(), new Set(), new Set()];

        variants.forEach(item => {
            if (item.option1) options[0].add(item.option1);
            if (item.option2) options[1].add(item.option2);
            if (item.option3) options[2].add(item.option3);
        })
        options.forEach((item, index) => this.parsingVariantHTML(item, index));
        console.log(options);
    }

    parsingVariantHTML(optionValue, index) {
        if (optionValue.size === 0) return;

        let optionName = document.getElementById(`option_${index + 1}`);
        let variantWrapper, selectDropdown;

        if (optionName.classList.contains("option_Color") == true || optionName.classList.contains("option_color") == true) {
            variantWrapper = document.createElement('div');
            variantWrapper.id = `variant_${index}`;
            this.colorVariantIndex = index + 1;
            variantWrapper.classList.add("variant_color-option");
        } else {
            selectDropdown = document.createElement('div');
            selectDropdown.classList.add("select-dropdown");
            variantWrapper = document.createElement("ul");
            variantWrapper.classList.add(`option_${index + 1}`);
            variantWrapper.classList.add("select-dropdown__list");
            variantWrapper.id = `variant_${index}`;

            selectDropdown.innerHTML = `<button data-index="${index + 1}" data-value="Choose your ${optionName.dataset.name}" class="option_${index + 1} select-dropdown__button"><span>Choose your ${optionName.dataset.name}</span>
            <svg fill="#000000"width="20px" height="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M78.466,35.559L50.15,63.633L22.078,35.317c-0.777-0.785-2.044-0.789-2.828-0.012s-0.789,2.044-0.012,2.827L48.432,67.58 c0.365,0.368,0.835,0.563,1.312,0.589c0.139,0.008,0.278-0.001,0.415-0.021c0.054,0.008,0.106,0.021,0.16,0.022 c0.544,0.029,1.099-0.162,1.515-0.576l29.447-29.196c0.785-0.777,0.79-2.043,0.012-2.828S79.249,34.781,78.466,35.559z"></path> </g> </g></svg>
            </button>`
        }
        let optionValueCount = 1;
        optionValue.forEach(value => {
            if (optionName.classList.contains("option_Color") == true || optionName.classList.contains("option_color") == true) {
                variantWrapper.innerHTML += `
                    <input type="radio" name="${optionName.dataset.name}"
                           data-id="tabs-${optionValueCount}"
                           id="${value}_${index}"
                           class="option_${index + 1} variant hidden"
                           value="${value}" />
                    <label for="${value}_${index}">${value}</label>`;
            } else {
                let optionElement = document.createElement("li");
                optionElement.textContent = value;
                optionElement.dataset.value = value;
                optionElement.dataset.index = index + 1;
                optionElement.classList.add(`option_${index + 1}`);
                variantWrapper.appendChild(optionElement);
            }
            optionValueCount++;
        })

        if (optionName.classList.contains("option_Color") == true || optionName.classList.contains("option_color") == true) {
            let glider = document.createElement('div');
            glider.classList.add("glider");
            variantWrapper.appendChild(glider);
            optionName.appendChild(variantWrapper);
        } else {
            selectDropdown.appendChild(variantWrapper);
            optionName.appendChild(selectDropdown);
        }
        console.log(selectDropdown)
    }

    findSelectedVariantId(variantObj, selectedVariandObj) {
        console.log(variantObj, selectedVariandObj);
        for (let i = 0; i < variantObj.length; i++) {
            if (variantObj[i].option1 === selectedVariandObj.option_1 && variantObj[i].option2 === selectedVariandObj.option_2 && variantObj[i].option3 === selectedVariandObj.option_3) {
                this.checkVariantAvailability(variantObj[i]);
            } else if (variantObj[i].option1 === selectedVariandObj.option_1 && variantObj[i].option2 === selectedVariandObj.option_2 && variantObj[i].option3 === null) {
                this.checkVariantAvailability(variantObj[i]);
            }
        }
    }
    checkVariantAvailability(variant) {
        if (variant.available) {
            document.getElementById("product-variant-id").value = variant.id;
            document.querySelector(".addToCart").disabled = false;
            document.querySelector(".error").classList.add("hidden");
        } else {
            document.querySelector(".addToCart").disabled = true;
            document.querySelector(".error").classList.remove("hidden");
        }
    }
}

const productPopup = new ProductPopup();
productPopup.initalize();

function hidePopup() {
    document.querySelector('.popup').style.display = "none";
}