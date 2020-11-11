let desc = "Javascript";
let loc = "";
let isFullTime=false;

const searchInputField = document.querySelector("#desc-bar");
const locationInputField = document.querySelector("#loc-bar");
const fullTimeInputField = document.querySelector('#full-time');
const searchBtn = document.querySelector('#submit-btn');
const theme = document.querySelector('#theme');
const bodyDiv = document.querySelector('.body-container');
const modal = document.querySelector(".modal");
let modalDisplay = false;
let apiData;


const elapsedTimeCal = (createdAt) => {

    let currDate = new Date();

    let jobDate = new Date(createdAt);

    let diffDays;
    let diffHours;

    diffDays = Math.floor((currDate.getTime() - jobDate.getTime())/(1000*60*60*24));

    diffHours = Math.abs(currDate.getHours() - jobDate.getHours());

    
    if(diffDays)
        return `${diffDays} d `;
    else
        return `${diffHours} hrs `;

}



const fetchData = async () => {
    
    //https://cors-anywhere.herokuapp.com
    apiData = await axios.get("https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json",{
        params:{
            description:desc,
            location:loc,
            full_time:isFullTime
        }
    });

    //console.log(apiData);
    apiData = apiData.data;
    renderCards(apiData);

}

const renderCards = (data) => {

    let view="";

    data.forEach((item) => {
        view+=createCard(item);
    })

    bodyDiv.innerHTML = view;


}


const createCard = (data) => {



    const card = `<div class="card">
                    <div class="card-header">
                        <p> ${elapsedTimeCal(data.created_at)}ago</p>
                        <p class="separator">.</p>
                        <p>${data.type}</p>
                    </div>
                
                    <div class="card-body">
                    <div class="card-title">
                        <h1 class="job-role">${data.company}</h1>
                        <p class="company">${data.title}</p>
                    </div>
                
                    <div class="card-footer">
                        <p>${data.location}</p>
                    </div>
                    </div>

                    <div class="view-details">
                        <button class="btn" onclick="renderModal('${data.id}')">View Details</button>
                    </div>
                
                </div>`;

              
                
    return card;

}

const renderModal = (data) => {

  
    const div = document.querySelector(".modal-body");
    const modalHeader = document.querySelector(".modal-header");
    const modalJobDetails = document.querySelector(".modal-job-details");
    const modalJobLoc = document.querySelector(".modal-job-loc");
    const modalFooter = document.querySelector(".modal-footer");
    
    for(let item of apiData)
    {
        if(item.id == data)
        {
            div.innerHTML = item.description;
            modalHeader.innerHTML = 
                                    ` 
                                        <p>${elapsedTimeCal(item.created_at)} ago</p>
                                        <p class="separator">.</p>
                                        <p>${item.type}</p>`;

            modalJobDetails.innerHTML = 
                                            `<div class="card-title">
                                                    <h1 class="job-role">${item.title}</h1>
                                                    <p class="company">${item.company}</p>
                                                </div>
                                                <div>
                                                    <a href="${item.company_url}" target="_blank"><button class="apply btn">Apply Now</button></a>
                                                </div>`;
                                                
            modalJobLoc.innerHTML = 
                                    `<p>${item.location}</p>`;  
                                    
                                    
            modalFooter.innerHTML = `<h1>How to Apply</h1>
                                    ${item.how_to_apply}`;
          
        }
    }

   
    setTimeout(() => {
    
    modal.style.display="block";
    modalDisplay = true;
    document.querySelector("main").classList.toggle("opaque");
    document.querySelector("nav").classList.toggle("opaque");
        
    }, 300);

}

const onSubmitHandler = (event) => {

    event.preventDefault();

    desc = searchInputField.value;
    loc = locationInputField.value;
    isFullTime = fullTimeInputField.checked?true:false;
    
  
    
    fetchData();
}



fetchData();

theme.addEventListener('change', () => {
    document.body.classList.toggle('dark'); 
})

document.addEventListener('click', (event) => {

   
    if(!modal.contains(event.target))
    {
        
        if(modalDisplay){ 
       
        modal.style.display = "none";
        modalDisplay = false;
        document.querySelector("main").classList.toggle("opaque");
    document.querySelector("nav").classList.toggle("opaque");
    
       }
   
    }
   
})