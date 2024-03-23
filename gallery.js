const URL = 'https://65f7649eb4f842e808858e6f.mockapi.io/colors/gallery';

//get the gallery div
const gallery = document.getElementById('gallery');


//fetch the paintings from the API
async function getPaintings(){
    const response = await fetch(URL);
    const data = await response.json();
    return data;
}

//class for each painting
class Painting{
    constructor(PaintingData){
        //extract data from painting
        this.colors = PaintingData.colors
        this.id = PaintingData.id;
        this.name = PaintingData.name;
        this.pass = PaintingData.pass;
        //create the painting div
        this.paintingDiv = document.createElement('div');
        this.paintingDiv.classList.add('painting');

        //set the grid size for this painting (all squares), and apply css grid
        const gridSize = Math.sqrt(this.colors.length);
        this.paintingDiv.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        this.paintingDiv.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        //for each 'pixel', create a div, set the background color, and append to the painting div
        this.paintingSquares = this.colors.map(color => {
            const square = document.createElement('div');
            square.classList.add('paintingSquare');
            square.style.backgroundColor = color;
            return square;
        });
        //add all processed squares to the painting div
        this.paintingSquares.forEach(square => {
            this.paintingDiv.appendChild(square);
        });
        //add title
        this.paintingName = document.createElement('h1');
        this.paintingName.classList.add('mb-3');
        this.paintingName.innerText = this.name;

        //create delete button
        this.deleteButton = document.createElement('button');
        this.deleteButton.classList.add('btn', 'btn-danger', 'mr-2');
        this.deleteButton.innerText = 'Delete';
        this.deleteButton.addEventListener('click', () => {
            deletePainting(this);
        });
        //create edit button
        this.editButton = document.createElement('a');
        this.editButton.classList.add('btn', 'btn-primary', 'ml-2');
        this.editButton.innerText = 'Edit';
        this.editButton.href = `index.html?id=${this.id}`;
        //create button bar
        this.buttonBar = document.createElement('div');
        this.buttonBar.classList.add('mt-3', 'px-5');
        this.buttonBar.appendChild(this.deleteButton);
        this.buttonBar.appendChild(this.editButton);
        //create container for painting
        this.paintingContainer = document.createElement('div');
        this.paintingContainer.classList.add('paintingContainer');

        //add everything to the container
        this.paintingContainer.appendChild(this.paintingName);
        this.paintingContainer.appendChild(this.paintingDiv);
        this.paintingContainer.appendChild(this.buttonBar);
        gallery.appendChild(this.paintingContainer);

    }
}

//function to display the paintings
async function displayPaintings(){
    //get from api
    const paintings = await getPaintings();
    //create a new painting object for each painting
    paintings.forEach(paintingData => {
        new Painting(paintingData);
    });
}

//function to delete a painting (takes password from user)
async function deletePainting(painting){
   const pass = prompt('Enter the password to delete this painting');
    if(pass === painting.pass){
        painting.paintingContainer.remove();
    const response = await fetch(`${URL}/${painting.id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data;

    

}
    else{
        alert('Incorrect password');
    }
}

//initial call to display paintings
displayPaintings();

