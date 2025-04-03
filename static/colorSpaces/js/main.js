const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const statusMessage = document.getElementById('status-message');
const errorMessage = document.getElementById('error-message');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const colorSpaceSelect = document.getElementById('color-space');
const convertBtn = document.getElementById('convert-btn');
const downloadBtn = document.getElementById('download-btn');

let image = new Image();
let convertedImageData = null;

// Drag & Drop
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('hover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('hover');
    const files = event.dataTransfer.files;

    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            image.src = e.target.result;
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0);
                statusMessage.textContent = "Image chargée avec succès.";
                errorMessage.textContent = "";
                convertBtn.style.display = "inline-block"; // Afficher le bouton de conversion
            };
        };
        reader.readAsDataURL(file);
    } else {
        errorMessage.textContent = "Aucun fichier détecté. Veuillez réessayer.";
    }
});

// Sélection de fichier via clic
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        image.src = e.target.result;
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            statusMessage.textContent = "Image chargée avec succès.";
            errorMessage.textContent = "";
            convertBtn.style.display = "inline-block"; // Afficher le bouton de conversion
        };
    };
    reader.readAsDataURL(file);
});

// Fonction pour convertir l'image dans un espace de couleur
function convertImage() {
    const colorSpace = colorSpaceSelect.value;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];     // Rouge
        const g = data[i + 1]; // Vert
        const b = data[i + 2]; // Bleu

        if (colorSpace === 'hsv') {
            const hsv = rgbToHsv(r, g, b);
            data[i] = hsv[0];     // H
            data[i + 1] = hsv[1]; // S
            data[i + 2] = hsv[2]; // V
        } else if (colorSpace === 'lab') {
            const lab = rgbToLab(r, g, b);
            data[i] = lab[0];     // L
            data[i + 1] = lab[1]; // A
            data[i + 2] = lab[2]; // B
        } else if (colorSpace === 'xyz') {
            const xyz = rgbToXyz(r, g, b);
            data[i] = xyz[0];     // X
            data[i + 1] = xyz[1]; // Y
            data[i + 2] = xyz[2]; // Z
        } else if (colorSpace === 'ycbcr') {
            const ycbcr = rgbToYcbcr(r, g, b);
            data[i] = ycbcr[0];   // Y
            data[i + 1] = ycbcr[1]; // Cb
            data[i + 2] = ycbcr[2]; // Cr
        } else if (colorSpace === 'gray') {
            const gray = rgbToGray(r, g, b);
            data[i] = gray;       // Gray
            data[i + 1] = gray;   // Gray
            data[i + 2] = gray;   // Gray
        }
    }

    context.putImageData(imageData, 0, 0);
    statusMessage.textContent = `Image convertie en ${colorSpace.toUpperCase()}.`;
    downloadBtn.style.display = "inline-block"; // Afficher le bouton de téléchargement
    convertedImageData = imageData;
}

// Fonction pour télécharger l'image convertie
function downloadImage() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL(); // Convertir l'image en base64
    link.download = 'image_convertie.png';
    link.click();
}

// Conversion RGB -> HSV
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    if (max === 0) s = 0;
    else s = d / max;

    if (max === min) h = 0;
    else {
        if (max === r) h = (g - b) / d;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
    }

    return [h, s, v];
}

// Conversion RGB -> LAB
function rgbToLab(r, g, b) {
    // Code pour convertir RGB en LAB (à implémenter)
    return [r, g, b]; // Placeholder
}

// Conversion RGB -> XYZ
function rgbToXyz(r, g, b) {
    // Code pour convertir RGB en XYZ (à implémenter)
    return [r, g, b]; // Placeholder
}

// Conversion RGB -> YCbCr
function rgbToYcbcr(r, g, b) {
    // Code pour convertir RGB en YCbCr (à implémenter)
    return [r, g, b]; // Placeholder
}

// Conversion RGB -> Grayscale
function rgbToGray(r, g, b) {
    return (r * 0.299 + g * 0.587 + b * 0.114);
}