const URL = 'https://65f7649eb4f842e808858e6f.mockapi.io/colors/gallery';
const gallery = document.getElementById('gallery');



async function getPaintings(){
    const response = await fetch(URL);
    const data = await response.json();
    return data;
}

class Painting{
    constructor(PaintingData){
        this.colors = PaintingData.colors
        this.id = PaintingData.id;
        this.name = PaintingData.name;
        this.pass = PaintingData.pass;
        this.paintingDiv = document.createElement('div');
        this.paintingDiv.classList.add('painting');
        this.paintingSquares = this.colors.map(color => {
            const square = document.createElement('div');
            square.classList.add('paintingSquare');
            square.style.backgroundColor = color;
            return square;
        });
        this.paintingSquares.forEach(square => {
            this.paintingDiv.appendChild(square);
        });
        this.paintingName = document.createElement('h1');
        this.paintingName.classList.add('mb-3');
        this.paintingName.innerText = this.name;

        this.deleteButton = document.createElement('button');
        this.deleteButton.classList.add('btn', 'btn-danger', 'mr-2');
        this.deleteButton.innerText = 'Delete';
        this.deleteButton.addEventListener('click', () => {
            deletePainting(this);
        });

        this.editButton = document.createElement('a');
        this.editButton.classList.add('btn', 'btn-primary', 'ml-2');
        this.editButton.innerText = 'Edit';
        this.editButton.href = `index.html?id=${this.id}`;

        this.buttonBar = document.createElement('div');
        this.buttonBar.classList.add('mt-3', 'px-5');
        this.buttonBar.appendChild(this.deleteButton);
        this.buttonBar.appendChild(this.editButton);
        
        this.paintingContainer = document.createElement('div');
        this.paintingContainer.classList.add('paintingContainer');


        this.paintingContainer.appendChild(this.paintingName);
        this.paintingContainer.appendChild(this.paintingDiv);
        this.paintingContainer.appendChild(this.buttonBar);
        gallery.appendChild(this.paintingContainer);

    }
}

async function displayPaintings(){
    const paintings = await getPaintings();
    paintings.forEach(paintingData => {
        new Painting(paintingData);
    });
}

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

displayPaintings();

