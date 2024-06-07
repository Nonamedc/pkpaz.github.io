// Fonction pour scanner un dossier et charger toutes les images
async function scanAndLoadFolder() {
  try {
    const dirHandle = await window.showDirectoryPicker();
    const imageFiles = [];
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && entry.name.match(/\.(jpg|jpeg|png)$/i)) {
        const file = await entry.getFile();
        imageFiles.push(URL.createObjectURL(file));
      }
    }
    if (imageFiles.length > 0) {
      displayImages(imageFiles);
    } else {
      alert('Aucune image trouvée dans le dossier.');
    }
  } catch (error) {
    console.error('Erreur lors du scan du dossier :', error);
  }
}

// Ajouter un événement pour déclencher le scan du dossier
document.getElementById('scanFolderButton').addEventListener('click', scanAndLoadFolder);
