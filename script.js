// Global variables and constants
const colorPicker = document.getElementById('colorPicker');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const size = params.get('size') <=16 ? params.get('size') : 8;
const URL = 'https://65f7649eb4f842e808858e6f.mockapi.io/colors/gallery';

// Event listener for color picker change
colorPicker.addEventListener('change', () => {
    document.documentElement.style.setProperty('--userColor', colorPicker.value);
});

// Function to fetch painting by ID
async function getPaintingByID(id) {
    const response = await $.ajax({
      url: `${URL}/${id}`,
      method: 'GET',
      dataType: 'json',
    });
    return response;
  }

// Function to update painting
async function updatePainting(id, colors) {
    const response = await $.ajax({
        url: `${URL}/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({colors})
        });
        
    
  return response;
}

// Square class
class Square {
    constructor(element, index) {
        this.element = element;
        this.index = index;
        this.color = '#929090';
    }
}

// Canvas class with single-click and click-and-drag functionality
class Canvas {
    constructor(colors) {
        this.grid = document.getElementById('grid');
        this.squares = [];
        this.isDrawing = false;
        //set size based on URL parameter or default to 100 (10x10 grid)
        let length = colors?.length || size * size || 100;
        document.documentElement.style.setProperty('--gridSize', Math.sqrt(length));
        // Creating squares
        for (let i = 0; i < length; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            this.grid.appendChild(square);
            this.squares.push(new Square(square, i));
        }

        // Event listeners for square click and drag
        this.grid.addEventListener('mousedown', (event) => {
            const target = event.target;
                const index = this.squares.findIndex(square => square.element === target);
                this.squares[index].color = colorPicker.value;
                this.squares[index].element.style.backgroundColor = colorPicker.value;
                this.isDrawing = true;
            
        });

        this.grid.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });

        this.grid.addEventListener('mouseleave', () => {
            this.isDrawing = false;
        });

        this.grid.addEventListener('mousemove', (event) => {
            if (this.isDrawing) {
                const target = event.target;
                if (target.classList.contains('square')) {
                    const index = this.squares.findIndex(square => square.element === target);
                    this.squares[index].color = colorPicker.value;
                    this.squares[index].element.style.backgroundColor = colorPicker.value;
                }
            }

        
        });

        // Set colors if provided
        if (colors) {
            this.squares.forEach((square, index) => {
                square.color = colors[index];
                square.element.style.backgroundColor = square.color;
            });
        }

        // Event listener for clear button
        this.clearButton = document.getElementById('clearButton');
        this.clearButton.addEventListener('click', () => {
            this.reset();
        });

        // Event listener for save button
        this.saveButton = document.getElementById('saveButton');
        this.saveButton.addEventListener('click', async () => {
            this.save()
                
            
        });

        // Event listener for download button
        this.downloadButton = document.getElementById('downloadButton');
        this.downloadButton.addEventListener('click', () => {
            downloadPainting();
        }); 

        // Event listener for size button
        const sizeInput = document.getElementById('gridSize');
        sizeInput.value = Math.sqrt(length);
        this.sizeButton = document.getElementById('setGridSize');
        this.sizeButton.addEventListener('click', () => {
            this.setSize(sizeInput.value);
        });
    }

    // refresh the page
    reset() {
        window.window.location.href = "index.html";
    }

    //set url to new size, reload page
    setSize(size){
        window.location.href = `index.html?size=${size}`;
    }

    // Function to save canvas
    async save() {
        const colors = this.squares.map(square => square.color);
        //update painting if we're looking at a saved painting
        if (id) {
            const pass = document.getElementById('pass').value;
            const painting = await getPaintingByID(id);
            if (pass == painting.pass) {
                updatePainting(id, colors).then(()=> {
                    window.window.location.href = `gallery.html`
                });
            } else {
                alert('Incorrect password');
            }
        } else {

        //save painting if it's unsaved
            const pass = document.getElementById('pass').value;
            const name = document.getElementById('title').value;
            if (pass && name) {
                await fetch(URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ colors, pass, name })
                }).then(()=> {
                    window.window.location.href = `gallery.html`
                });
            } else {
                alert('You must enter a password to save a painting');
            }
        }
    }
}

let canvas;
// Function to initialize canvas based on URL parameters
async function getURLPainting() {
    if (id) {
        const painting = await getPaintingByID(id);
        canvas = new Canvas(painting.colors);
        const titleInput = document.getElementById('title');
        titleInput.value = painting.name;
        titleInput.disabled = true;
    } else {
        canvas = new Canvas();
    }
}

// Call the initialization function
getURLPainting();

async function downloadPainting() {
    let painting;
    let gridSize // Define your grid size here
    if (id) {
        painting = await getPaintingByID(id);
        gridSize = Math.sqrt(painting.colors.length);
    } else {
        gridSize = Math.sqrt(canvas.squares.length);
        painting = {
            colors: canvas.squares.map(square => square.color),
            name: 'Untitled'
        };
    }
    const colors = painting.colors;
    const downloadCanvas = document.createElement('canvas');
    const size = parseInt(prompt('Please enter the size of the image in pixels (e.g. 500 for 500x500 pixels') || 500);
    downloadCanvas.width = size;
    downloadCanvas.height = size;
    const context = downloadCanvas.getContext('2d');
    for (let i = 0; i < gridSize * gridSize; i++) {
        const x = (i % gridSize) * size / gridSize;
        const y = Math.floor(i / gridSize) * size / gridSize;
        context.fillStyle = colors[i] || '#ffffff';
        context.fillRect(x, y, size / gridSize, size / gridSize);
    }
    const a = document.createElement('a');
    a.href = downloadCanvas.toDataURL();
    a.download = `${painting.name}.png`;
    a.click();
}