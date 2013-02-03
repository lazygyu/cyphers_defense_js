function ContentManager(){
	var ondownloadcompleted;
	var NUM_ELEMENTS_TO_DOWNLOAD = 2;

	this.SetDownloadComplated = function(cb){
		ondownloadcompleted = cb;
	}

	this.imgDimus = new Image();
	this.imgMapChip = new Image();

	var numImagesLoaded = 0;

	this.StartDownload = function(){
		SetDownloadParameters(this.imgDimus, 'images/dimus.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgMapChip, 'images/town01_a.gif', handleImageLoad, handleImageError);
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


