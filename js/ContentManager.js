function ContentManager(){
	var ondownloadcompleted;
	var NUM_ELEMENTS_TO_DOWNLOAD = 5;

	this.SetDownloadComplated = function(cb){
		ondownloadcompleted = cb;
	}

	this.imgDimus = new Image();
	this.imgDimus_thumb = new Image();
	this.imgRin = new Image();
	this.imgMapChip = new Image();
	this.imgCloud = new Image();

	var numImagesLoaded = 0;

	this.StartDownload = function(){
		SetDownloadParameters(this.imgDimus, 'images/dimus.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgDimus_thumb, 'images/dimus_thumb.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgMapChip, 'images/town01_a.gif', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgCloud, 'images/cloud.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgRin, 'images/rin.png', handleImageLoad, handleImageError);
	}

	function SetDownloadParameters(imgElement, url, loadedHandler, errorHandler){
		imgElement.src = url;
		imgElement.onload = loadedHandler;
		imgElement.onerror = errorHandler;
	}

	function handleImageLoad(e){
		numImagesLoaded++;
		if( numImagesLoaded == NUM_ELEMENTS_TO_DOWNLOAD ){
			ondownloadcompleted();
		}
	}

	function handleImageError(e){
		console.log("Error loading image : " + e.target.src);
	}
}


