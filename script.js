// Fonction pour charger les images CBZ
function loadCBZ(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const zip = new JSZip();
    zip.loadAsync(e.target.result).then(function(zip) {
      const images = [];
      zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir && /\.(jpg|jpeg|png)$/i.test(relativePath)) {
          images.push(zipEntry.async('blob').then(blob => URL.createObjectURL(blob)));
        }
      });
      Promise.all(images).then(urls => {
        displayImages(urls);
      });
    });
  };
  reader.readAsArrayBuffer(file);
}

// Fonction pour afficher les images avec OpenSeadragon
function displayImages(imageUrls) {
  const viewer = document.getElementById('viewer');
  viewer.innerHTML = '';

  // Créer une div pour OpenSeadragon
  const osdDiv = document.createElement('div');
  osdDiv.id = 'osd-viewer';
  viewer.appendChild(osdDiv);

  // Créer une div pour les miniatures
  const thumbsDiv = document.createElement('div');
  thumbsDiv.id = 'thumbs';
  viewer.appendChild(thumbsDiv);

  // Initialiser OpenSeadragon avec la première image
  const osdViewer = OpenSeadragon({
    id: 'osd-viewer',
    tileSources: imageUrls[0],
    prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/', // Chemin vers les icônes d'OpenSeadragon
    showNavigator: true,
    navigatorPosition: 'BOTTOM_RIGHT',
    navigatorSizeRatio: 0.15,
    gestureSettingsMouse: {
      scrollToZoom: true,
    },
    gestureSettingsTouch: {
      scrollToZoom: true,
    },
  });

  // Ajouter les miniatures
  imageUrls.forEach((url, index) => {
    const thumbImg = document.createElement('img');
    thumbImg.src = url;
    thumbImg.addEventListener('click', function() {
      osdViewer.open(url);
    });
    thumbsDiv.appendChild(thumbImg);
  });
}

// Charger le fichier CBZ lorsque l'utilisateur le sélectionne
document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    loadCBZ(file);
  }
});
