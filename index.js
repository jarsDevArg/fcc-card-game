const cardObjectDefinitions = [
    {id:1, imagePath:'/images/card-KingHearts.png'},
    {id:2, imagePath:'/images/card-JackClubs.png'},
    {id:3, imagePath:'/images/card-QueenDiamonds.png'},
    {id:4, imagePath:'/images/card-AceSpades.png'}
];

const numCards = cardObjectDefinitions.length

const cardBackImgPath = '/images/card-back-Blue.png';

const cardContainerElem = document.querySelector('.card-container');

const playGameButtonElem = document.getElementById('playGame')

const collapsedGridAreaTemplate = '"a a" "a a"'
const cardCollectionCellClass = ".card-pos-a"

const aceId = 4
const cardPositions = []

const currentGameStatusElem = document.querySelector('.current-status')
const soreContainerElem = document.querySelector('.header-score-containter')
const soreElem = querySelector('.score')
const roundContainerElem = querySelector('.header-round-containter')
const roundElem = querySelector('.round')

const winColor = "green"
const loseColor = "red"
const primaryColor = "black"


let cards = [];

let gameInProgress = false
let shufflingInProgress = false
let cardsRevealed = false

let roundNum = 0
const maxRounds = 4
let score = 0


loadGame()


function chooseCard(card) {
    if(canChooseCard()){
        evaluateCardChoice(card)
    }
}


function calculateScoreToAdd(roundNum) {
    if(roundNum < 4){
        return 200 / Math.pow(2,roundNum)
    }
    else{
        return 10
    }
}

function calculateScore()
{
    const scoreToAdd = calculateScoreToAdd(roundNum)    
    score = score + scoreToAdd
}

function updateScore() 
{
    calculateScore()
}

function updateStatusElement(elem, display, color, innerHTML) 
{
    elem.style.display = display

    if(arguments.length > 2){
        elem.style.color = color
        elem.innerHTML = innerHTML
    }
}

function outputChoiceFeedBack(hit) {
    if (hit) {
        updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! Well Done!! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧")
    }
    else{
        updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!! (っ °Д °;)っ")
    }
}

function evaluateCardChoice(card) {
    if(card.id == aceId){
        updateScore()
        outputChoiceFeedBack(true)
    }
    else{
        outputChoiceFeedBack(false)
    }
}


function canChooseCard() {
    return gameInProgress = true && !shufflingInProgress && !cardsRevealed
}

function loadGame(){
    createCards()
    cards = document.querySelectorAll('.card');
    playGameButtonElem.addEventListener('click', () => startGame())

}

function startGame() {
    initializeNewGame()
    startRound()
}

function initializeNewGame() {
    score = 0
    roundNum = 0
    shufflingInProgress = false
}

function startRound(){
    initializeNewRound()
    collectCards()
    flipCards(true)
    shuffleCards()

}

function initializeNewRound() {
    roundNum++
    playGameButtonElem.disabled = true

    gameInProgress = true
    shufflingInProgress = true
    cardsRevealed = false

    updateStatusElement(currentGameStatusElem, "block", primaryColor, "Shuffling...")
}


function collectCards() {
    transformGridArea(collapsedGridAreaTemplate)
    addCardsToGridAreaCell(cardCollectionCellClass)
}

function transformGridArea(areas) {
    cardContainerElem.style.gridTemplateAreas = areas
}

function addCardsToGridAreaCell(cellPositionClassName){
    const cellPositionElem = document.querySelector(cellPositionClassName)

    cards.forEach((card, index) =>{
        addChildElement(cellPositionElem, card)
    })
}

function flipCard(card, flipToBack) {
    const innerCardElem = card.firstChild
    
    if(flipToBack && !innerCardElem.classList.contains('flip-it'))
    {
        innerCardElem.classList.add('flip-it')
    }
    else if(innerCardElem.classList.contains('flip-it'))
    {
        innerCardElem.classList.remove('flip-it')
    }

}

function flipCards(flipToBack) {
    cards.forEach((card, index) => {
        setTimeout(() => {
            flipCard(card, flipToBack)
        }, index * 100)
    })
}



function shuffleCards() {
    const id = setInterval(shuffle, 12)
    let shuffleCount = 0

    function shuffle() {
        randomizeCardPositions()
        
        if (shuffleCount == 500){
            clearInterval(id);
            dealCards();
        }
        else{
            shuffleCount++;
        }
    }

    function randomizeCardPositions(){
        const random1 = Math.floor(Math.random()*numCards) + 1
        const random2 = Math.floor(Math.random()*numCards) + 1

        const temp = cardPositions[random1 - 1]
        cardPositions[random1 - 1] = cardPositions[random2 - 1]
        cardPositions[random2 - 1] = temp
    }
}

function dealCards() 
{
    addCardsToAppropriateCell()
    const areasTemplate = returnGridAreasMappedToCardPos()
    transformGridArea(areasTemplate)
}

function returnGridAreasMappedToCardPos()
{
    let firstPart = ""
    let secondPart = ""
    let areas = ""

    cards.forEach((card, index) => {
        if (cardPositions[index] == 1) {
            areas = areas + "a "
        }
        else if (cardPositions[index] == 2) {
            areas = areas + "b "
        }
        else if (cardPositions[index] == 3) {
            areas = areas + "c "
        }
        else if (cardPositions[index] == 4) {
            areas = areas + "d "
        }

        if (index == 1) {
            firstPart = areas.substring(0, areas.length -1)
            areas = ""
        } 
        else if (index == 3)
        {
            secondPart = areas.substring(0, areas.length -1)
        }
              

    })

    return `"${firstPart}" "${secondPart}"`

}

function addCardsToAppropriateCell() 
{
    cards.forEach((card) => {
        addCardToGridCell(card)
    })
}



function createCards(){
    
    cardObjectDefinitions.forEach((cardItem)=>{
        createCard(cardItem)
    })
}

function createCard(cardItem){
    //create div elements that make up a card
    const cardElem = createElement('div');
    const cardInnerElem = createElement('div');
    const cardFrontElem = createElement('div');
    const cardBackElem = createElement('div');

    //create front and back images for the card
    const cardFrontImg = createElement('img');
    const cardBackImg = createElement('img');

    //add class and id to card element
    addClassToElement(cardElem, 'card');
    addIdToElement(cardElem, cardItem.id);

    //add class to inner card element
    addClassToElement(cardInnerElem, 'card-inner'),

    //add class to front card element
    addClassToElement(cardFrontElem, 'card-front');

    //add class to back card element
    addClassToElement(cardBackElem, 'card-back');

    //add src attribute and class to card back image element
    addSrcToImageElem(cardBackImg, cardBackImgPath);
    addClassToElement(cardBackImg, 'card-img')

    //add src attribute to card image element
    addSrcToImageElem(cardFrontImg, cardItem.imagePath)
    addClassToElement(cardFrontImg, 'card-img')

    //add front img to front element as a child
    addChildElement(cardFrontElem, cardFrontImg)

    //add back img to back element as a child
    addChildElement(cardBackElem, cardBackImg)

    //add front and back elements to inner card element
    addChildElement(cardInnerElem, cardFrontElem )
    addChildElement(cardInnerElem, cardBackElem)

    //add inner-card element to card element
    addChildElement(cardElem, cardInnerElem)

    //add cards to grid
    addCardToGridCell(cardElem)

    initializeCardPositions(cardElem)
}   

function initializeCardPositions(card) {
    cardPositions.push(card.id)
}

function createElement(elemType){
    return document.createElement(elemType)
}

function addClassToElement(elem, className){
    elem.classList.add(className)
}

function addIdToElement(elem, id){
    elem.id = id;
}

function addSrcToImageElem(imgElem, src){
    
    imgElem.src = src;
}

function addChildElement(parentElem, childElem){
    
    parentElem.appendChild(childElem)
}

function addCardToGridCell(card){
     

    const cardPositionClassName = mapCardIdToGridCell(card);
    

    const cardPosElem = document.querySelector(cardPositionClassName);
   

    addChildElement(cardPosElem, card)

}

function mapCardIdToGridCell(card){
    


    switch (card.id) {
        case "1":
            return '.card-pos-a'
            break;
        case "2":
            return '.card-pos-b'
            break;
        case "3":
            return '.card-pos-c'
            break;
        case "4":
            return '.card-pos-d'
            break;    
    
        default:
            break;
    }
}