const DataController = (function(){
    if(localStorage.getItem("foodData") === null){
        localStorage.setItem("foodData", "[]")
    }
    if(localStorage.getItem("calories")=== null){
        localStorage.setItem("calories", "[]")
    }
    if(localStorage.getItem("total") === null){
        localStorage.setItem("total", "0")
    }

    //push data to local storage
    const pushToLS = (object)=>{
      //get data structures form LS 
      let foodDataStr = localStorage.getItem("foodData");
      let caloriesStr = localStorage.getItem("calories");
      let totalStr = localStorage.getItem("total");
      //change to JS
      let foodData = JSON.parse(foodDataStr);
      let calories = JSON.parse(caloriesStr);
      let total = JSON.parse(totalStr);
      //update the structures
      foodData.push(object);
      calories.push(object.calories);
      total = calories.reduce((acc, curr)=>{
          return acc + curr;
      },0);
     console.log(foodData, calories, total);
     //put them back into strings and push back to localStorage
     localStorage.setItem("foodData", JSON.stringify(foodData));
     localStorage.setItem("calories", JSON.stringify(calories));
     localStorage.setItem("total", JSON.stringify(total));
     console.log(localStorage);
    }


    return{
        saveData: obj=>{
            pushToLS(obj);
        },
        editData: (obj, index)=>{
           //get data structures form LS 
            let foodDataStr = localStorage.getItem("foodData");
            let caloriesStr = localStorage.getItem("calories");
            let totalStr = localStorage.getItem("total");
           //change to JS
            let foodData = JSON.parse(foodDataStr);
            let calories = JSON.parse(caloriesStr);
            let total = JSON.parse(totalStr);
            //edit the data structures
            foodData.splice(index, 1, obj);
            calories.splice(index, 1, obj.calories);
            console.log(calories.length);
            total = calories.reduce((acc, curr)=>{
                return acc + curr;
            },0);
            //push data back to LS
            localStorage.setItem("foodData", JSON.stringify(foodData));
            localStorage.setItem("calories", JSON.stringify(calories));
            localStorage.setItem("total", JSON.stringify(total));
        },
        deleteData: (index)=>{ //this function is running multiple times
         console.log(index)
        //get data structures form LS 
        let foodDataStr = localStorage.getItem("foodData");
        let caloriesStr = localStorage.getItem("calories");
        let totalStr = localStorage.getItem("total"); 
        //change to JS
        let foodData = JSON.parse(foodDataStr);
        let calories = JSON.parse(caloriesStr);
        let total = JSON.parse(totalStr);
        //edit the structures
        // console.log(calories);
        if(foodData.length !== 1){
        foodData.splice(index, 1);
        }else{
            foodData = [];
        }
        if(calories.length !== 1){
        calories.splice(index, 1);
        }else{
            calories = []; 
        }
            total = calories.reduce((acc, curr)=>{
                return acc + curr;
            }, 0);

        console.log(total)
        //push data back to LS
        localStorage.setItem("foodData", JSON.stringify(foodData));
        localStorage.setItem("calories", JSON.stringify(calories));
        localStorage.setItem("total", JSON.stringify(total));
        }
    }


})();

const UIController = (function(){
    const name = document.getElementById("item-name");
    const calories = document.getElementById("item-calories");
    let list = document.querySelector("#item-list");
    let totalCal = document.querySelector(".total-calories");
    const inputs = document.querySelectorAll("input");

    return{
        getValues: ()=>{
            return {
                name: name.value,
                calories: parseInt(calories.value)
            }   
        },

        addToUI: (obj)=>{
            list.insertAdjacentHTML("beforeend", `
            <li class="collection-item">
            <strong>${obj.name}: </strong> <em>${obj.calories} Calories</em>
            <a href="#" class="secondary-content edit-link">
              <i class="fa fa-pencil"></i>
            </a>
            `)
        },
        pushTotal: ()=>{
            let totalStr = localStorage.getItem("total");
            let total = JSON.parse(totalStr);
            totalCal.textContent = total;
        },
        editItem: (index)=>{     
            let name = UIController.getValues().name;
            let calories = UIController.getValues().calories;
            document.querySelectorAll(".collection-item")[index].children[0].textContent = name;
            document.querySelectorAll(".collection-item")[index].children[1].textContent = `${calories} Calories`;
            return UIController.getValues();
        },

        deleteItem: (index)=>{
            let elements = document.querySelectorAll(".collection-item");
            if(elements.length !== 1){
                let element = elements[index];
                console.log(element)
                try{
                    list.removeChild(element);
                }catch{
                    console.log("something's up")
                }
            
            }else{
                list.innerHTML = "";
            }

        },
        clearInp: ()=>{
            inputs.forEach(element=>{
                element.value = "";
            })
        }


    }
    
})();


const AppController = (function(dataCtrl, UICtrl){
    const editStateBtns = document.querySelectorAll(".editState");
    const addBtn = document.querySelector(".add-btn");
    const clearBtn = document.querySelector(".clear-btn");
    let editIndex;

    // this is the initial state
    const initState = ()=>{
        //only the add meal button should show. romove irrelevant buttons/ui in this state
        editStateBtns.forEach(btn=>{
            btn.style.display = "none"
        })
        addBtn.style.display = "inline-block"
    }


     // this is the edit state
    const editState = ()=>{
        //make the edit buttons visible, but the add meal button invisible
        editStateBtns.forEach(btn=>{
            btn.style.display = "inline-block"
        })
        //clear the inputs
        UICtrl.clearInp();
        addBtn.style.display = "none";
    };
            //add event listener for editing item
            let updateBtn = document.querySelector(".update-btn");
            let deleteBtn = document.querySelector(".delete-btn");
            let backBtn = document.querySelector(".back-btn");
            //go back to intital state
            backBtn.addEventListener("click", initState);
            //update data
            updateBtn.addEventListener("click",event=>{
                event.preventDefault();
                //update the UI
                let foodObj = UICtrl.editItem(editIndex);
                // update the localStorage
                dataCtrl.editData(foodObj, editIndex);
                //update the total
                UICtrl.pushTotal();
            });
            //delete data
            deleteBtn.addEventListener("click", event=>{
                // window.location.reload();
                event.stopPropagation();
                initState();
                //from UI
                UICtrl.deleteItem(editIndex);
                //from the LS
                dataCtrl.deleteData(editIndex);
                //update total
                UICtrl.pushTotal();
            })

    //event listener for edit function
    const editListener = ()=>{
        document.querySelectorAll(".edit-link").forEach((element, index)=>{
            element.addEventListener("click", event=>{
                editIndex = index;
                event.preventDefault();
                editState();
                console.log(index, editIndex);            
            })
        })
    }


    //create varibles and assign values to variables
    const addItem = ()=>{
       let foodObject = UICtrl.getValues();
        //add calories to the data controller
        dataCtrl.saveData(foodObject);
        //add item to the UI
        UICtrl.addToUI(foodObject);
        //add to the total
        UICtrl.pushTotal();
        //add eventlistener for edit state
        editListener();
    }

     // event listeners go here
    const listeners = ()=>{
        //trigger the addition of a value
        addBtn.addEventListener("click", event =>{
            event.preventDefault()
            addItem();
        })
        //clear the local storage
        clearBtn.addEventListener("click", ()=>{
            localStorage.clear();
            // window.location.reload();
            UICtrl.clearInp(); 
        })

    }

    const defaultUI = ()=>{
        let foodDataStr = localStorage.getItem("foodData");
        let foodData = JSON.parse(foodDataStr);
        foodData.forEach(element=>{
            UICtrl.addToUI(element);
        });
        editListener();
    }

   
    return{
        init: ()=>{
            initState();
            listeners();
            defaultUI();
            UICtrl.pushTotal();
        }
    }

    
})(DataController ,UIController);

//initialize
AppController.init();