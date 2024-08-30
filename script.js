let title = document.createElement("div");
title.innerHTML = "<h1>Quiz Quest</h1>"
title.className = "title"
document.body.append(title)

let filter = document.createElement("div");
filter.className = "filter";

// Questions Input
let questions = document.createElement("div");
questions.innerHTML = `
    <label for="questions">No. of Questions</label><br>
    <input type="text" id="questions" name="questions" placeholder="No. of questions"><br>
`;
filter.appendChild(questions);

// Category Selection
let categoryDiv = document.createElement("div");
categoryDiv.innerHTML = `<br><label for="category">Select Category</label><br>`;
let categoryDropdown = document.createElement("select");
categoryDropdown.id = "category";
categoryDropdown.name = "category";
let categoryOption = document.createElement("option");
categoryOption.value = "";
categoryOption.textContent = "Any";
categoryDropdown.appendChild(categoryOption);
let category = [
    "General Knowledge", "Entertainment: Books", "Entertainment: Film", "Entertainment: Music",
    "Entertainment: Musicals & Theatres", "Entertainment: Television", "Entertainment: Video Games",
    "Entertainment: Board Games", "Science & Nature", "Science: Computers", "Science: Mathematics",
    "Mythology", "Sports", "Geography", "History", "Politics", "Art", "Celebrities", "Animals", "Vehicles",
    "Entertainment: Comics", "Science: Gadgets", "Entertainment: Japanese Anime & Manga",
    "Entertainment: Cartoon & Animations"
];
for (let j = 0; j < category.length; j++) {
    let option = document.createElement("option");
    option.value = (j + 9).toString();
    option.textContent = category[j];
    categoryDropdown.appendChild(option);
}
categoryDiv.appendChild(categoryDropdown);
filter.appendChild(categoryDiv);

// Difficulty Selection
let difficultyDiv = document.createElement("div");
difficultyDiv.innerHTML = `<br><label for="difficulty">Select Difficulty</label><br>`;
let difficultyDropdown = document.createElement("select");
difficultyDropdown.id = "difficulty";
difficultyDropdown.name = "difficulty";
let difficultyOption = document.createElement("option");
difficultyOption.value = "";
difficultyOption.textContent = "Any";
difficultyDropdown.appendChild(difficultyOption);
let difficulty = ["Easy", "Medium", "Hard"];
for (let j = 0; j < difficulty.length; j++) {
    let option = document.createElement("option");
    option.value = difficulty[j].toLowerCase();
    option.textContent = difficulty[j];
    difficultyDropdown.appendChild(option);
}
difficultyDiv.appendChild(difficultyDropdown);
filter.appendChild(difficultyDiv);

// Type Selection
let typeDiv = document.createElement("div");
typeDiv.innerHTML = `<br><label for="type">Select Type</label><br>`;
let typeDropdown = document.createElement("select");
typeDropdown.id = "type";
typeDropdown.name = "type";
let typeOption = document.createElement("option");
typeOption.value = "";
typeOption.textContent = "Any";
typeDropdown.appendChild(typeOption);
let type = ["Multiple Choice", "True/False"];
let typeValue = ["multiple", "boolean"];
for (let j = 0; j < type.length; j++) {
    let option = document.createElement("option");
    option.value = typeValue[j];
    option.textContent = type[j];
    typeDropdown.appendChild(option);
}
typeDiv.appendChild(typeDropdown);
filter.appendChild(typeDiv);

// Take Quiz Button
let button = document.createElement("div");
button.innerHTML = `<br><button type="button">Take Quiz</button>`;
button.addEventListener("click", generator);
filter.appendChild(button);

document.body.append(filter);

let cont = document.createElement("div");
cont.className = "cont";
document.body.append(cont);

let currentQuestionIndex = 0;
let correctAnswers = 0;

async function generator() {
    let n = document.getElementById("questions").value;
    let selectedCategory = document.getElementById("category").value;
    let selectedDifficulty = document.getElementById("difficulty").value;
    let selectedType = document.getElementById("type").value;

    if (n <= 0) {
        console.error("Please enter a valid number of questions.");
        return;
    }

    let api_url = `https://opentdb.com/api.php?amount=${n}&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=${selectedType}`;

    try {
        let info = await get_info(api_url);
        let questionsArray = info.results;
        displayQuestion(questionsArray, currentQuestionIndex);
    } catch (error) {
        console.error(`Failed to fetch quiz questions: ${error}`);
    }
}

function displayQuestion(questionsArray, index) {
    // Add 'loaded' class to apply effects once the data is loaded
    cont.classList.add('loaded');

    cont.innerHTML = '';

    if (index >= questionsArray.length) {
        cont.innerHTML = `<div>Quiz Completed! Correct Answers: ${correctAnswers} / ${questionsArray.length}</div>`;
        return;
    }

    let questionObj = questionsArray[index];
    let questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.innerHTML = `<p>${questionObj.question}</p>`;

    let optionGroupDiv = document.createElement("div");
    optionGroupDiv.className = "option-group";

    questionObj.incorrect_answers.push(questionObj.correct_answer);
    questionObj.incorrect_answers.sort();

    questionObj.incorrect_answers.forEach((option, i) => {
        let optionDiv = document.createElement("div");
        
        let optionInput = document.createElement("input");
        optionInput.type = "radio";
        optionInput.name = "option";
        optionInput.id = `option${i}`;
        optionInput.value = option;

        let optionLabel = document.createElement("label");
        optionLabel.htmlFor = `option${i}`;
        optionLabel.innerText = option;

        optionDiv.appendChild(optionInput);
        optionDiv.appendChild(optionLabel);
        optionGroupDiv.appendChild(optionDiv);
    });

    questionDiv.appendChild(optionGroupDiv);
    cont.appendChild(questionDiv);

    let arrowButton = document.createElement("button");
    arrowButton.className = "arrow-button";
    arrowButton.innerText = "→";
    arrowButton.onclick = () => {
        let selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption && selectedOption.value === questionObj.correct_answer) {
            correctAnswers++;
        }
        currentQuestionIndex++;
        displayQuestion(questionsArray, currentQuestionIndex);
    };
    cont.appendChild(arrowButton);

    if (index === questionsArray.length - 1) {
        let submitButton = document.createElement("button");
        submitButton.className = "submit-button";
        submitButton.innerText = "Submit";
        submitButton.onclick = () => {
            let selectedOption = document.querySelector('input[name="option"]:checked');
            if (selectedOption && selectedOption.value === questionObj.correct_answer) {
                correctAnswers++;
            }
            cont.innerHTML = `<div>Quiz Completed! Correct Answers: ${correctAnswers} / ${questionsArray.length}</div>`;
        };
        cont.appendChild(submitButton);
        arrowButton.style.display = "none";
    }
}



async function get_info(link) {
    let response = await fetch(link);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    return data;
}
