//Function To Get the whole question object
let allQuestion = [];

//variable to get 10 from 30-randomized object.
let tenQuestion = [];

//Setting index for object
let currentInd = 0;

//Setting number of right answers
let rightAnswers = 0;

//Create collector array to get all answers.
let collectAnswers = [];

//Setting interval variable as global scope.
let countdowInterval;

function getAllQuestions() {
  let allRequest = new XMLHttpRequest();

  allRequest.onreadystatechange = function () {
    if (allRequest.readyState == 4 && allRequest.status == 200) {
      //Get the questions Data from Json Object Into JS Object.
      allQuestion = JSON.parse(allRequest.responseText);

      //Run the ranomizing function.
      randomizeAll(allQuestion);

      //Get The First 10 elements from The ranmoized object.
      tenQuestion = allQuestion.slice(0, 10);

      //Run Bullets function to get number of bullets corresponding to questions length.
      let QuestionsCount = tenQuestion.length;
      addBullets(QuestionsCount);
      getQuestionData(tenQuestion[currentInd]);
      countdownCounter();

      document.querySelector(".Submit-button").onclick = function () {
        if (currentInd < 9) {
          let rightAnswer = tenQuestion[currentInd]["right_answer"];
          currentInd++;
          checkAnswer(rightAnswer);
          removePastQuestion();
          getQuestionData(tenQuestion[currentInd]);
          clearInterval(countdowInterval);
          countdownCounter();
          bulletsTransform();
        } else {
          clearInterval(countdowInterval);
          showResult();
        }
      };
    }
  };

  allRequest.open("GET", "./questions.json", true);

  allRequest.send();
}

//Function To Get random 30 question objects.

function randomizeAll(arr) {
  var ctr = arr.length,
    index;

  while (ctr > 0) {
    //get random index below the ctr value
    index = Math.floor(Math.random() * ctr);

    //Decrease Ctr By 1 to get new non-repeated length as index.
    ctr--;

    //shuffling array with temporary value.
    [arr[ctr], arr[index]] = [arr[index], arr[ctr]];
  }
}

//Add function That make spans depending on questions number.

//Setting Bullets container Variable.
let bulletContainer = document.querySelector(".bullets");

//Add function That make spans depending on questions number.
function addBullets(num) {
  for (var i = 0; i < num; i++) {
    let newSpan = document.createElement("span");
    //Craeting new bullet for each question element.
    bulletContainer.appendChild(newSpan);

    //Mark The first bullet as completed first.
    if (i == 0) {
      newSpan.classList.add("complete");
    }

    //Append the span to the container.
    bulletContainer.appendChild(newSpan);
  }
}

//Function to get question data.

function getQuestionData(obj) {
  let ansContainer = document.createElement("div");
  ansContainer.classList.add("answers-area");
  document.querySelector(".question-area").appendChild(ansContainer);

  //Create header for question.
  let questionTitle = document.createElement("h2");

  //Create Text Node to hold the the question content
  let questionContent = document.createTextNode(obj.title);

  //Appens the text to header.
  questionTitle.appendChild(questionContent);

  //Append the header to main question area div.
  document
    .querySelector(".question-area")
    .insertBefore(questionTitle, document.querySelector(".answers-area"));

  //Loop on answers to create selection foe each.
  for (let y = 1; y <= 4; y++) {
    //create new div to contain each answer box
    let answerDiv = document.createElement("div");

    //Add some class on div.
    answerDiv.classList.add("answer");

    //Create Input For each Answer.
    let newInputRadio = document.createElement("input");

    //Adding Type+Id+Name+custom-data to each input.
    newInputRadio.type = "radio";
    newInputRadio.name = "question";
    newInputRadio.dataset.answer = obj[`answer_${y}`];
    newInputRadio.id = `answer_${y}`;

    //Keep the first answer checked as default.

    //Create new label for each answer
    let newLabel = document.createElement("label");

    //Adding For Attribute for each label to refer to the answer.
    newLabel.setAttribute("for", `answer_${y}`);

    //Create New Label text.
    newLabelText = document.createTextNode(obj[`answer_${y}`]);

    //Append text to label.
    newLabel.appendChild(newLabelText);

    //Append the input to answerDiv.
    answerDiv.appendChild(newInputRadio);
    answerDiv.appendChild(newLabel);
    //Collect all answer made in an array.

    collectAnswers.push(answerDiv);
  }

  //Shuffling answers divs.
  randomizeAll(collectAnswers);

  //Append the main answerdiv to the answers-area div.
  collectAnswers.forEach(function (ans, index) {
    document.querySelector(".answers-area").appendChild(ans);
    if (index == 1) {
      document.querySelector(".answer input").setAttribute("checked", true);
    }
  });
}

//Function to check the right answer to be chosen.
function checkAnswer() {
  collectAnswers.forEach((answer) => {
    if (answer.children[0].dataset.answer == rightAnswer) {
      rightAnswers++;
      console.log("Good One");
    }
  });
}

//Function to check the right answer
function checkAnswer(rightAns) {
  collectAnswers.forEach((answer) => {
    if (answer.children[0].checked == true) {
      if (answer.children[0].dataset.answer == rightAns) {
        //Increase the right answer counter by 1
        rightAnswers++;
        console.log("Good One");
      }
    }
  });
}

//Function to reset the past question data
function removePastQuestion() {
  collectAnswers.forEach((ans) => {
    ans.remove();
  });
  collectAnswers = [];
  document.querySelector(".answers-area").remove();
  let questionName = document.querySelector("h2");
  questionName.remove();
}

//function to handle the bullets
function bulletsTransform() {
  let bullets = document.querySelectorAll(".bullets span");
  let bulletArray = Array.from(bullets);

  //Loop on bullets to add complete class on one in turn
  bulletArray.forEach((bullet, ind) => {
    if (currentInd === ind) {
      bullet.classList.add("complete");
    }
  });
}

let seconds = document.querySelector(".seconds");

//Function of count down counter.
function countdownCounter() {
  let startSeconds = 15;

  seconds.innerHTML = startSeconds;
  countdowInterval = setInterval(function () {
    startSeconds--;
    startSeconds = ("0" + startSeconds).slice(-2);

    let seconds = document.querySelector(".seconds");
    seconds.innerHTML = startSeconds;

    if (startSeconds == 0) {
      clearInterval(countdowInterval);
      if (currentInd < 9) {
        let rightAnswer = tenQuestion[currentInd]["right_answer"];
        currentInd++;
        checkAnswer(rightAnswer);
        removePastQuestion();
        getQuestionData(tenQuestion[currentInd]);
        countdownCounter();
        bulletsTransform();
      } else {
        clearInterval(countdowInterval);
        showResult();
      }
    }
  }, 1000);
}

//Function to show result at end
function showResult() {
  document.querySelector(".overlay").classList.remove("hidden");
  document.querySelector(".right-no").textContent = `${rightAnswers} `;
}

//function to restart on clicking
function restartQuiz() {
  window.location.reload();
}

//Add restart function to restart button
document.querySelector(".restart").addEventListener("click", restartQuiz);

let newObject = {
  firstname: "mero",
  age: "Thirteen",
  getFullName: function () {
    return `fullname is ${newObject.firstname} ${this.age}`;
  },
  adresses: {
    KSA: "Riyad",
    Egypt: "Tanta",
    USA: "LA",
    getCurrent: (_) => `Now I Live In ${newObject.adresses.USA}`,
  },
};
console.log(newObject["adresses"].getCurrent());
window.onload = getAllQuestions;
var letterCollector;
var repeater = 0;
var letters = {
  1: "g",
  2: "o",
  3: "l",
  4: "e",
};

function numToGoogle(arr) {
  arr.forEach((r) => {});
}

function lettersConverter(r) {
  for (let property in letters) {
    if (r.includes(property)) {
      console.log(letters[property]);
      let newr = r.replace(property, letters[property]);
      return newr;
    }
  }
}

function repeatOn(r) {
  if (r.includes("0")) {
    let repeatvalue = r.slice(r.lastIndexOf("0") + 1);
    console.log(repeatvalue);
    repeater = parseInt(repeatvalue);
    let newR = r.slice(r.lastIndexOf("0"));
    console.log(repeater);
    console.log(newR);
    console.log(r.slice(0, r.indexOf("0")));
  }
}
