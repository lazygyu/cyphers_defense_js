function ContentManager(){
	var ondownloadcompleted;
	var canMp3, canOgg;
	var audioExtension = ".none";
	
	var myAudio = document.createElement("audio");

	if( myAudio.canPlayType){
		canMp3 = !!myAudio.canPlayType && "" != myAudio.canPlayType("audio/mpeg");
		canOgg = !!myAudio.canPlayType && "" != myAudio.canPlayType("audio/ogg; codecs='vorbis'");
	}

	if( canMp3){
		audioExtension = ".mp3";
	}else if(canOgg){
		audioExtension = ".ogg";


	}

	var NUM_ELEMENTS_TO_DOWNLOAD = 12;

	this.SetDownloadComplated = function(cb){
		ondownloadcompleted = cb;
	}

	this.imgDimus = new Image();
	this.imgDimus_thumb = new Image();
	this.imgRin = new Image();
	this.imgRin_thumb = new Image();
	this.imgMapChip = new Image();
	this.imgCloud = new Image();
	this.imgCain = new Image();
	this.imgCain_thumb = new Image();
	this.imgSentinel = new Image();
	this.imgIcons = new Image();
	this.imgBaloon = new Image();
	this.imgRin_ef_attack = new Image();
	this.imgDimus_ef_attack = new Image();

	this.rinVoices = {};
	this.rinVoices.kill = new Audio();
	this.rinVoices.select = new Audio();
	this.rinVoices.attack = new Audio();
	this.dimusVoices = {};
	this.dimusVoices.kill = new Audio();
	this.dimusVoices.select = new Audio();
	this.dimusVoices.attack = new Audio();
	this.cainVoices = {};
	this.cainVoices.select = new Audio();
	this.cainVoices.kill = new Audio();

	this.bgm = new Audio();
	

	var numImagesLoaded = 0;

	this.StartDownload = function(){
		SetDownloadParameters(this.imgDimus, 'images/dimus.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgDimus_thumb, 'images/dimus_thumb.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgMapChip, 'images/town01_a.gif', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgCloud, 'images/cloud.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgRin, 'images/rin.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgRin_thumb, 'images/rin_thumb.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgCain, 'images/cain.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgCain_thumb, 'images/cain_thumb.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgSentinel, 'images/sentinel.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgIcons, 'images/actionicon.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgBaloon, 'images/balloon.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgRin_ef_attack, 'images/rin_attack_effect.png', handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgDimus_ef_attack, 'images/dimus_attack_effect.png', handleImageLoad, handleImageError);
		if( audioExtension !== ".none" ){
			SetAudioDownloadParameters(this.rinVoices.kill, 'sounds/rin_kill' + audioExtension);
			SetAudioDownloadParameters(this.dimusVoices.kill, 'sounds/deimus_kill' + audioExtension);
			SetAudioDownloadParameters(this.rinVoices.select, 'sounds/rin_select' + audioExtension);
			SetAudioDownloadParameters(this.cainVoices.select, 'sounds/cain_select' + audioExtension);
			SetAudioDownloadParameters(this.cainVoices.kill, 'sounds/cain_kill' + audioExtension);
			SetAudioDownloadParameters(this.dimusVoices.attack, 'sounds/deimus_attack' + audioExtension);
			SetAudioDownloadParameters(this.rinVoices.attack, 'sounds/rin_attack' + audioExtension);
			SetAudioDownloadParameters(this.bgm, 'sounds/bgm1' + audioExtension);
		}
	}

	function SetAudioDownloadParameters(el, url){
		el.src = url;
		el.load();
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


