/* Current script.js by Aidan Buffum and Fareya Ikram
 * 2019_05_10_KarenRoyer
 * 2019_05_13_ Trusting Inekwe
 *
 */

//########################## Various Regular Expression for input parsing #########################
//#################################################################################################

/** Regex for "Fabric w (name) [r,g,b]" where w is the variable representing the fabric, name is the name of the fabric, and r, g, and b are the RGB values for the fabric color */
var patternFabric = /FABRIC[ \t]+[a-z_][ \t]+\([ \t]*(\w+[ \t]*)+\)[ \t]+\[[ \t]*\d{1,3}[ \t]*(,[ \t]*\d{1,3}[ \t]*){2}\]/gi;
/** Regex for "Fabric w" where w is the variable representing the fabric */
var pFabVariable = /FABRIC[ \t]+[a-z_]/i;
/** Regex for "(name)" where name is the name of the fabric */
var pFabName = /\([ \t]*(\w+[ \t]*)+\)/;
/** Regex for "[r,g,b]" where r, g, and b are the RGB values for the fabric color */
var pFabRGB = /\[[ \t]*\d{1,3}[ \t]*(,[ \t]*\d{1,3}[ \t]*){2}\]/;
/** Regex for "XxY" where X is the number of blocks wide the quilt is and Y is the number of blocks high the quilt is */
var patternSize = /\d+x\d+/i;
/** Regex for a block in the format "[x,...]" where x is a patch in the format x/x, x\x, x-x, x|x, or x where x is a single character color variable name */
var patternBlock = /\[\s*(([a-z_][\/\\|-][a-z_])|[a-z_])(,\s*(([a-z_][\/\\|-][a-z_])|[a-z_]))*\s*\]/gi;
/** Regex for a patch in the format x/x, x\x, x-x, x|x, or x where x is a single character color variable name */
var patternSquare = /^[a-z_]([\/\\|-][a-z_])?$/i;
/** Regex for a comment in the data */
var patternComment = /#.*/g;
/** Regex that finds all of the seam symbols*/
var seamSymbols = /[\/\\\|\-\[\]]/;

/** Character for a diagonal downard seam */
var seam_d = '\\';
/** Character for a diagonal upward seam */
var seam_u = '/';
/** Character for a horizontal seam */
var seam_h = '-';
/** Character for a vertical seam */
var seam_v = '|';

//############################ Maximum or Initial Variable Values #################################
//#################################################################################################
/** The maximum pixels wide any quilt can be **/
/** This number affects the draw size of the quilt image and interface **/
/** It is also the initial size for any quilt. This can be changed by the user through the currentQuiltPixWide variable **/
var MAX_PIX_WIDE =  600;
var MAX_PIX_HIGH = 1500;

/** Maximum blocks wide any quilt can be **/
var MAX_BLOCKS_WIDE =  12 ;

/** The x coordinate to draw the quilt at */
var quiltDrawX = 20;
/** The y coordinate to draw the quilt at */
var quiltDrawY = 20;
/** Render the quilt to the current quilt width in pixels - initially set to the maximum value*/
var currentQuiltPixWide =  MAX_PIX_WIDE;

//##################################### Quilt Data ################################################
//#################################################################################################

/** The size of the quilt (blocks wide by high) */
var size = [1, 1];
/** The number of number of patches in the initial block */
var numPatches = (1+ Math.floor(Math.random() * 6));
numPatches = numPatches * numPatches;
//size[0] = (1+ Math.floor(Math.random() * 4));
// use the number of blocks wide as the base for how many blocks high
// so you will never get a really long and narrow random quilt.
//size[1] = (size[0] + Math.floor(Math.random() * 2));
//var randPatches = Math.floor(Math.random() * 6);
/** The array of fabric colors draw*/
var palette = [['_', 'null', [0, 0, 0]]]; //TODO: Reset to black - kept this way for bug testing
palette = [['R', 'rose', [185, 119, 128]], ['S', 'shell', [236, 185, 189]], ['P', 'pink', [245, 229, 231]], ['N', 'nautical', [060, 121, 177]], ['B', 'blue', [135, 187, 230]], ['I', 'ice blue', [190, 216, 236]], ['C', 'clover', [114, 173, 147]], ['G', 'green', [80, 131, 114]], ['M', 'mint', [201, 226, 214]], ['T', 'turquoise', [99, 177, 188]], ['O', 'ocean', [155, 212, 221]], ['W', 'water color', [225, 241, 239]]];

/** An initial palette array of only the letters used */
var initialPaletteLetters = [''];
for(var i = 0; i<palette.length; i++){
  initialPaletteLetters[i] = palette[i][0];
}//end for palette length

/** The random blocks of the quilt - fill the number of patches */
var blocks = "";
function generateRandomButton(){
  generateRandomSize();
  createRandomBlockStr();
  updateTextBoxes();
  currentQuiltPixWide = inputPixelsWide.value(); //Determine the size with which to draw the quilt
  if (palette && size && blocks) {
    drawQuilt(blocks, size[0], size[1], quiltDrawX, quiltDrawY, currentQuiltPixWide);
  }
}
function generateRandomSize(){
  size[0] = (1+ Math.floor(Math.random() * 4));
  // use the number of blocks wide as the base for how many blocks high
  // so you will never get a really long and narrow random quilt.
  size[1] = (size[0] + Math.floor(Math.random() * 2));
}
/** randomPatchFunction builds a string of characters that represents the random blocks*/
function createRandomBlockStr(){
  var holder = '[';
  for(var j = 0; j < (size[0]*size[1]); j++){
    if(j>0){
      holder += '[';
    }
  //holder = '[';
  for(var i = 0; i < numPatches; i++){
    blocks = randomPatchFunction();
    holder += blocks;
    if(i<(numPatches - 1)){
      holder += ', ';
    }
  }//end for number of patches
  holder += ']';
  }//end for
  blocks = holder;
  parseBlocks(blocks);
}//end createRandomBlockStr

function randomPatchFunction(){
   var symbols = [seam_u, seam_d,seam_h,seam_v,false];
   let tempStr = '';
   symbols = symbols[Math.floor(Math.random() * symbols.length)]
   if(!symbols){
     tempStr = initialPaletteLetters[Math.floor(Math.random() * initialPaletteLetters.length)];
     return tempStr;
   }
   else {
     // Math.floor(Math.random() * initialPaletteLetters.length) will provide a random integer(by way of math floor) from 0 value after *
  	 tempStr = initialPaletteLetters[Math.floor(Math.random() * initialPaletteLetters.length)] + symbols + initialPaletteLetters[Math.floor(Math.random() * initialPaletteLetters.length)];
  	 return tempStr;
   }

}//end randomPatchFunction

//########################## Quilt Size and related functions #####################################
//#################################################################################################

/** Determine the size of the quilt (blocks wide by high) based on the given body of text
 * @param {string} input_txt
 */
function parseSize(input_txt) {
  //size is equal to the group number 0 of the regex match with patternSize and split at the x
  //parseInt is a javascript function that grabs numbers as integers from strings
	size = input_txt.match(patternSize)[0].split(/x/i);
	size[0] = parseInt(size[0]);
	size[1] = parseInt(size[1]);
}

//######################### Quilt Blocks and related functions ####################################
//#################################################################################################

/** Set up the blocks array based on the given body of text
 * @param {string} input_txt
 */
function parseBlocks(input_txt) {
	blocks = [];
	var workingBlocks = input_txt.match(patternBlock);
	var tempBlockArray = ['_'];
	for (var i = 0; i < workingBlocks.length; i++) {
		tempBlockArray = [];
		workingBlocks[i] = workingBlocks[i].replace(/[\[\]\s]/g, '').split(','); //Split each block into an array of patch strings
		for (var j = 0; j < workingBlocks[i].length; j++) {
			if (workingBlocks[i][j].length > 0) tempBlockArray.push(workingBlocks[i][j]); //Only add non-empty patches
		}
		blocks.push(tempBlockArray);
	}
	while (blocks.length < size[0] * size[1]) {
		blocks.push(['_']);
	}
}

//########################## Fabric Color Palette and related functions ###########################
//#################################################################################################

/** Set up the palette array based on the given body of text
 * @param {string} input_txt
 */
function parsePalette(input_txt) {
  //Clear out the old palette
	palette = [];
  // Extract the palette from the input text
  // validate the input text and make sure it is not empty
	var fabrics = input_txt.match(patternFabric);
  //Helper variables for each loop
	var fVar, fName, fRGB;
	for (var i = 0; i < fabrics.length; i++) {
		fVar = fabrics[i].match(pFabVariable)[0]; //Get the chunk of text with the word FABRIC and the single character variable name
		fVar = fVar.match(/[ \t]+[a-z_]/i)[0].trim(); //Extract the single character variable name
		fName = fabrics[i].match(pFabName)[0]; //Get the chunk of text with the name in parentheses
		fName = fName.match(/[ \t]*(\w+[ \t]*)+/)[0].trim(); //Extract the trimmed version of the name without the parentheses
		fRGB = fabrics[i].match(pFabRGB)[0].replace(/[ \t\[\]]/g, '').split(','); //Extract the 3 RGB integers
		for (var j = 0; j < 3; j++) {
			fRGB[j] = Math.max(0, Math.min(255, parseInt(fRGB[j]))); //Convert the RGB integer to a value between 0 & 255
		}
		if (fVar && fName && fRGB) palette.push([fVar, fName, fRGB]); //If a valid fabric was parsed out, push it to the palette
		//Reset the variables for the next loop
		fVar = null;
		fName = null;
		fRGB = null;
	}
}

/** Get the appropriate color for a given variable name from the palette
 * @param {string} fVar
 */
function parseColor(fVar) {
	if (fVar.length != 1) return [0, 0, 0]; //Expects a single character variable name
	for (var i = 0; i < palette.length; i++) {
		if (palette[i][0] == fVar) {
			return [palette[i][2][0], palette[i][2][1], palette[i][2][2]]; //If the current fabric has a matching variable name, return it
		}
	}
	return [0, 0, 0]; //If not, return black
}

/** Get a random color from the palette */
function randomColorFromPalette() { return palette[Math.floor(Math.random() * palette.length)][2]; }

/** Get a random color */
function randomColor() { return Array.from({ length: 3 }, () => Math.floor(Math.random() * 256)); }

//######################## Functions for drawing a quilt to the canvas ############################
//#################################################################################################

/** Draw the given patch on the canvas
 * @param {string} patch
 * @param {number} xCoord
 * @param {number} yCoord
 * @param {number} patchSize
 */
function drawPatch(patch, xCoord, yCoord, patchSize) {
  //This function is called every frame??

	var workingPatch = patch.replace(/\s/g, ''); //Clear whitespace from the patch string
  if (yourPatchIsEmpty(workingPatch)) {
      fill(0, 0, 0, 255);
		  rect(xCoord, yCoord, patchSize, patchSize);
		      return; //If the patch was just whitespace, draw black
  }
	var firstColor = parseColor(workingPatch.substring(0, 1)); //The character representing the first fabric variable
	var seam = ''; //The character representing the seam (\, /, |, or -)
	if (workingPatch.length > 1) seam = workingPatch.substring(1, 2);
	var secondColor = ''; //The character representing the second fabric variable
	if (workingPatch.length > 2) secondColor = parseColor(workingPatch.substring(2, 3));
	fill(firstColor[0], firstColor[1], firstColor[2], 255); //Set the Processing color to the second color at full opacity
	if (seam == seam_d) { //If the patch has a diagonal downward seam
		triangle(xCoord, yCoord, xCoord, yCoord + patchSize, xCoord + patchSize, yCoord + patchSize);
		fill(secondColor[0], secondColor[1], secondColor[2], 255); //Set the Processing color to the second color at full opacity
		triangle(xCoord, yCoord, xCoord + patchSize, yCoord, xCoord + patchSize, yCoord + patchSize);
	}
	else if (seam == seam_u) { //If the patch has a diagonal upward seam
		triangle(xCoord, yCoord, xCoord + patchSize, yCoord, xCoord, yCoord + patchSize);
		fill(secondColor[0], secondColor[1], secondColor[2], 255); //Set the Processing color to the second color at full opacity
		triangle(xCoord + patchSize, yCoord, xCoord + patchSize, yCoord + patchSize, xCoord, yCoord + patchSize);
	}
	else if (seam == seam_h) { //If the patch has a horizontal seam
		rect(xCoord, yCoord, patchSize, patchSize / 2);
		fill(secondColor[0], secondColor[1], secondColor[2], 255); //Set the Processing color to the second color at full opacity
		rect(xCoord, yCoord + patchSize / 2, patchSize, patchSize / 2);
	}
	else if (seam == seam_v) { //If the patch has a vertical seam
		rect(xCoord, yCoord, patchSize / 2, patchSize);
    //errorMessages.value('');
    //errorMessages.value("xCoord is " + xCoord + " and yCoord is " +yCoord yCoord + " AND SIZE IS " + patchSize);
		fill(secondColor[0], secondColor[1], secondColor[2], 255); //Set the Processing color to the second color at full opacity
		rect(xCoord + patchSize / 2, yCoord, patchSize / 2, patchSize);
	}
	else { //If the patch has no seam or an invalid seam character, draw it as a full patch
		rect(xCoord, yCoord, patchSize, patchSize);
    //errorMessages.value('');
    //errorMessages.value("xCoord is " + x + " and yCoord is " + yCoord + " and patchSize is " + patchSize);
	}
}

/** Draw the given block on the canvas
 * @param {string[]} patches
 * @param {number} x
 * @param {number} y
 * @param {number} size
 */

 //drawBlock requires the parameters: patches array at position row r and column c, x draw position given the blocks are
 // blockSize wide times the column number, the y draw position given the block size and row number, blockSize
function drawBlock(patches, x, y, blkSize) {
	var patchesWide = Math.floor(Math.sqrt(patches.length)); //Assumes a square number of patches and ignores any additional patches
	var patchSize = blkSize / patchesWide;
  var onePatch = '_';
  //var R is the row number and C is the column number.
  //patches[R * patchesWide + C] accesses the patch at row R and column C
	for (var R = 0; R < patchesWide; R++) {
		for (var C = 0; C < patchesWide; C++) {
      onePatch = patches[R * patchesWide + C];
			drawPatch(onePatch, x + patchSize * C, y + patchSize * R, patchSize);
      //errorMessages.value("the patch is " + patches[R * patchesWide + C]);
		}
	}
}

/** Draw the given quilt on the canvas
 * @param {string[][]} quiltBlocks
 * @param {number} numBlocksWide
 * @param {number} numBlocksHigh
 * @param {number} xDrawPos
 * @param {number} yDrawPos
 * @param {number} quiltPixWidth
 */
function drawQuilt(quiltBlocks, numBlocksWide, numBlocksHigh, xDrawPos, yDrawPos, quiltPixWidth) {
	var blockSize = quiltPixWidth / numBlocksWide;
  var curPatch = '_';
  //errorMessages.value('');
  //errorMessages.value("quilt blocks length is " + quiltBlocks.length);
  // var r is the row number and var c is the column number
  // for as long as you have a row or column spot to fill, call drawBlock
	for (var r = 0; r < numBlocksHigh; r++) {
		for (var c = 0; c < numBlocksWide; c++) {
      // given the quiltBlocks array, extract the current patch you need to draw
      curPatch = quiltBlocks[r * numBlocksWide + c];
      // The following if statement is only run when the user tries to input a blank text area
      // if the quilt blocks length is less than or equal to the array index
			 if (quiltBlocks.length <= (r * numBlocksWide + c)){
              drawBlock(['_'], xDrawPos + blockSize * c, yDrawPos + blockSize * r, blockSize);
       }
			 else drawBlock(curPatch, xDrawPos + blockSize * c, yDrawPos + blockSize * r, blockSize);

      //drawBlock requires the parameters: patch at position row r and column c, x draw position given the blocks are
      // blockSize wide times the column number, the y draw position given the block size and row number, blockSize
    //  drawBlock(curPatch, xDrawPos + blockSize * c, yDrawPos + blockSize * r, blockSize);
		}
	}
}

/** Update the quilt based on the given body of text
 * @param {string} input_txt
 */
function updateQuilt(input_txt) {
	parsePalette(input_txt);
	parseSize(input_txt);
	parseBlocks(input_txt);
	inputBlocks.html('');
	inputPalette.html('');
	updateTextBoxes();
}

/** Update the quilt based on file input
 * @param {any} file
 */
function updateViaFile(file) {
	updateQuilt(file.data);
}

/** Update the quilt based on text box input */
function updateViaText() {
  //clear the error message box
  errorMessages.value('');
	var input_txt = '';
	input_txt += inputPalette.value() + '\n';
	input_txt += inputBlocksWide.value() + 'x' + inputBlocksHigh.value() + '\n\n';
    //**bl gets the returned boolean value(if the block is empty or not)
    var bl = isBlocksEmpty(inputBlocks.value());
    //**bk gets the returned string(could be empty or not) after it has been validated
    var bk = validateRuleBLOCKS(inputBlocks.value());
    if (bl == true){
    //**consent gets the user's "clicked" response
    var consent = confirm("Text blocks are empty, are you sure you want to continue?");
    if (consent == true){
            bk = validateRuleBLOCKS(inputBlocks.value());
    }
    else if (consent == false){
        if (bl == true){
            updateTextBoxes();
            bk = validateRuleBLOCKS(inputBlocks.value());
        }
    }
    }
        input_txt += bk;
        updateQuilt(input_txt);
}


/** Update the quilt based on any changes to the palette text area */
function updateViaPalette()
{
  // temPalette holds the original palette info before the update palette button is pressed
  var temPalette = palette;
  //palette is a global value that holds the palette information
  //when the apply palette change button is pressed, the palette is
  //updated by updateQuilt(input_txt)
  //the two values can be compared and when a difference is found that letter can be substituted
  //in the blocks text area.
  //clear the input_txt variable
  var input_txt = '';
  //get the data from the text area inputPalette and add it to input_txt
  //get the number data from inputBlocksWide and high
  //finally update the quilt with updateQuilt(input_txt)
	input_txt += inputPalette.value() + '\n';
	input_txt += inputBlocksWide.value() + 'x' + inputBlocksHigh.value() + '\n\n';
	input_txt += inputBlocks.value();
  updateQuilt(input_txt);
  //The following section is a test for any changed palette letters
  //**for as long as there are temPalette items to search through for changes
  //**test if the first array element (the palette letter) in the new palette list
  //**is different than the old letter in the same position.
  for(var i = 0; i<temPalette.length; i++)
  {
    if(palette[i][0] != temPalette[i][0])
    {
      var From = temPalette[i][0];
      var To = palette[i][0];
      //**if the letters are different then get the current array from
      //**the inputBlocks text area.
      var currentBlocksArrayState = inputBlocks.value();
      //**for as long as there are array elements in currentBlocksArrayState
      //**look for the letters that need to be replaced
      for(var j = 0; j < currentBlocksArrayState.length; j++ )
      {
        //**save the value of the current currentBlocksArrayState array element
        //**so it can be searched for the letter that needs replacing
        var tElement = currentBlocksArrayState[j];
        //**for as long as you are looking through the array element see if
        //**the character is the one that needs to be replaced
        while (currentBlocksArrayState.includes(From)) {
          currentBlocksArrayState = currentBlocksArrayState.replace(From, To);
        }//end while you can still find the from letter
      }//end for loop
    }//end if
    //else you have not found any changes just refresh the input blocks text area
    else{
      var currentBlocksArrayState = inputBlocks.value()
    }//end else
    inputBlocks.html(currentBlocksArrayState);
    input_txt = '';
    input_txt += inputPalette.value() + '\n';
    input_txt += inputBlocksWide.value() + 'x' + inputBlocksHigh.value() + '\n\n';
    input_txt += currentBlocksArrayState;
    updateQuilt(input_txt);
  }//end for
}//end function
//########################## Processing / Graphical Change Functions ##############################
//#################################################################################################

function setup() {

	createCanvas(MAX_PIX_WIDE + 40, MAX_PIX_HIGH);
	//Input for the width in pixels with which to render the quilt
	inputPixelsWide = createInput(currentQuiltPixWide, 'number');
	inputPixelsWide.attribute('min', '1');
	inputPixelsWide.attribute('max', 'MAX_PIX_WIDE');
	inputPixelsWide.size(50, inputPixelsWide.height);
	captionPixelsWide = createP('Pixels Wide:');
	//Input for the size of the quilt (blocks wide by high)
	inputBlocksWide = createInput('', 'number');
	inputBlocksWide.attribute('min', '1');
	inputBlocksWide.attribute('max', 'MAX_BLOCKS_WIDE');
	inputBlocksWide.size(50, inputBlocksWide.height);
	captionBlocksWideByHigh = createP('Blocks Wide by High:');
	inputBlocksHigh = createInput('', 'number');
	inputBlocksHigh.attribute('min', '1');
	inputBlocksHigh.attribute('max', 'MAX_BLOCKS_WIDE');
	inputBlocksHigh.size(50, inputBlocksHigh.height);
	captionBlocksX = createP('X');
	//Input for the Palette
	captionPalette = createP('Palette');
	inputPalette = createElement('textarea');
	inputPalette.id('inputPalette');
	inputPalette.attribute('style', 'resize:none');
	inputPalette.size(1, 157);
	//Input for the Blocks
	captionBlocks = createP('Blocks');
	inputBlocks = createElement('textarea');
	inputBlocks.id('inputBlocks');
	inputBlocks.attribute('style', 'resize:none');
	inputBlocks.size(1, 200);
  //Input for the error messages
	captionErrors = createP('Error Messages:');
	errorMessages = createElement('textarea');
	errorMessages.id('errorMessages');
	errorMessages.attribute('style', 'resize:none');
	errorMessages.size(600, 60);
	//Palette change submit button
	submitPaletteChange = createButton('Submit Palette');
  submitPaletteChange.mouseClicked(updateViaPalette);
	//Text box submit button
	submitTextboxes = createButton('Submit Blocks');
	submitTextboxes.mouseClicked(updateViaText);
  // random generate button
  randomGenerate = createButton('Generate Blocks');
  randomGenerate.mouseClicked(generateRandomButton);
  //File save button
	saveDynamicText = createButton('Save File');
	saveDynamicText.mouseClicked(saveDynamicDataToFile);
	//File upload button
	submitFile = createFileInput(updateViaFile);
	submitFile.attribute('accept', '.txt');
	//Input & Caption positioning
	captionPixelsWide.position(currentQuiltPixWide + 60, 8); //Pixels wide
	inputPixelsWide.position(currentQuiltPixWide + 150, 16);
	captionBlocksWideByHigh.position(currentQuiltPixWide + 60, 48); //Blocks wide by high
	inputBlocksWide.position(currentQuiltPixWide + 210, 56);
	captionBlocksX.position(currentQuiltPixWide + 270, 48);
	inputBlocksHigh.position(currentQuiltPixWide + 290, 56);
	captionPalette.position(currentQuiltPixWide + 60, 88); //Palette
	inputPalette.position(currentQuiltPixWide + 60, 128);
	submitPaletteChange.position(currentQuiltPixWide + 470, 270); //palette change button placement
	captionBlocks.position(currentQuiltPixWide + 60, 308); //Blocks
	inputBlocks.position(currentQuiltPixWide + 60, 348);
  captionErrors.position(currentQuiltPixWide + 60, 600);
  errorMessages.position(currentQuiltPixWide + 60, 640);
	submitTextboxes.position(currentQuiltPixWide + 470, 308); //Text box submit button
  randomGenerate.position(currentQuiltPixWide + 700, 308);
	submitFile.position(currentQuiltPixWide + 600, 270); //File upload button
  saveDynamicText.position(currentQuiltPixWide + 600, 308);


	//Replacement Rule Stuff
	ruleCaption = createP('Replacement rule before & after');
	ruleCaption.position(1120, 5);
	rule1From = createElement('textarea');
	rule1From.position(1120, 40);
	rule1From.size(150, 75);
	rule1From.value("[R\\S]");
	rule1Arrow = createP('>>');
	rule1Arrow.position(1280, 55);
	rule1To = createElement('textarea');
	rule1To.position(1300, 40);
	rule1To.size(150, 75);
	rule1To.value("[P-R]");
	rule1Apply = createButton('Apply');
	rule1Apply.position(1225, 130);
	rule1Apply.mouseClicked(applyReplacement);
generateRandomButton();
	//Set the appropriate values for the textboxes relevant to the default quilt
	updateTextBoxes();
}//end setup

function draw() {
	background(221); //Clear the previously drawn frame from the canvas

	enforceTextboxLimits(); //Ensure none of the numerical textboxes have an invalid input in them

	currentQuiltPixWide = inputPixelsWide.value(); //Determine the size with which to draw the quilt

	if (palette && size && blocks) {
		drawQuilt(blocks, size[0], size[1], quiltDrawX, quiltDrawY, currentQuiltPixWide);
	}
	resizeTextArea(document.getElementById('inputPalette'), 400);
	resizeTextArea(document.getElementById('inputBlocks'), 600);
}//end draw

function resizeTextArea(txt, minimumSize) {
	var html = txt.value;
	var lines = html.split('\n');
	var longestLine = 0;
	var lineLength = 0;
	for (var i = 0; i < lines.length; i++) {
		lineLength = lines[i].length + lines[i].split('\t').length - 1;
		if (lineLength > longestLine) longestLine = lineLength;
	}
	if (longestLine * 9 < minimumSize) txt.style.width = minimumSize + 'px';
	else txt.style.width = (longestLine * 9) + 'px';
}

//############################# Functions on the input text boxes #################################
//#################################################################################################

/** Enforce the minimum and maximum values on the numerical text box inputs */
function enforceTextboxLimits() {
	if (inputPixelsWide.value() < 1) inputPixelsWide.value(1); //Pixels Wide
	else if (inputPixelsWide.value() > MAX_PIX_WIDE) inputPixelsWide.value(MAX_PIX_WIDE);
	if (inputBlocksWide.value() < 1) inputBlocksWide.value(1); //Blocks Wide
	if (inputBlocksWide.value() > MAX_BLOCKS_WIDE) inputBlocksWide.value(MAX_BLOCKS_WIDE);
	if (inputBlocksHigh.value() < 1) inputBlocksHigh.value(1); //Blocks High
	if (inputBlocksHigh.value() > MAX_BLOCKS_WIDE) inputBlocksHigh.value(MAX_BLOCKS_WIDE);
}

/** Update the contents of the textboxes based on the quilt */
function updateTextBoxes() {
  //errorMessages.value('');
	//Update Blocks wide by high
	inputBlocksWide.value(size[0]);
	inputBlocksHigh.value(size[1]);
	//Update Palette
	inputPalette.html('');
	for (var i = 0; i < palette.length; i++) {
		inputPalette.html('Fabric ' + palette[i][0] + ' (' + palette[i][1] + ') [' + palette[i][2][0] + ', ' + palette[i][2][1] + ', ' + palette[i][2][2] + ']\n', true)
	}
	//Update Blocks
	inputBlocks.html('');
	var blockString = '';
	/* NOTE:
	 * This whole loop is a convoluted way of attempting to print out the blocks in a way that makes sense.
	 * Unfortunately, that totally doesn't work that well right now. I imagine a more complicated system is
	 * needed to guarantee the updated text box for the blocks will actually make sense to look at.
	 */
	let ctr = 0;
  //for (var i = 0; i < blocks.length; i++) {

	for (var i = 0; i < blocks.length; i++) {
		blockString = '[';
		for (var j = 0; j < blocks[i].length; j++) {

			blockString += blocks[i][j];
			if (j < blocks[i].length - 1) blockString += ', ';
		}
		blockString += ']';
		if (ctr == size[0] - 1) {
			blockString += '\n';
			ctr = 0;
		}
		else {
			blockString += '\t';
			ctr++;
		}
		inputBlocks.html(blockString, true);
	}
	inputBlocks.value(inputBlocks.html());

}

// Save Dynamic Data To File is a function called when the user clicks on the Save File button on the interface
// This function relies on the included file /js/FileSaver.js
function saveDynamicDataToFile() {
  // Set up a variable to hold all of the text you need to include in your file - palette, size of your blocks wide and high, and blocks
  var output_txt = '';
  output_txt += '#Add your palette list here:'+ '\n\n';
	output_txt += inputPalette.value() + '\n\n';
  output_txt += '#Add your block size here:'+ '\n\n';
	output_txt += inputBlocksWide.value() + 'x' + inputBlocksHigh.value() + '\n\n';
  output_txt += '#block definition here:'+ '\n\n';
	output_txt += inputBlocks.value();
  // Create a Blob object to output your file.
  // Call saveAs from the /js/FileSaver.js script.
  var blob = new Blob([output_txt], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "dynamic.txt");
}//end save dynamic data

//######################### Validation functions ##################################################
//#################################################################################################
//Helper function to validate the format of a rule. Would recommend consolidating this into the rule replacement function honestly
//Replacement rules for replacing patches and blocks

//Replacement rules for replacing patches and blocks
// * is a wild card character that means replace all of something
// Condition one - From patch is a single letter
//      To patch is a single letter - remind user that this will only change the solid blocks.
//      To patch is a split patch - remind user that this will only replace the solid blocks.
//      To patch is a single letter with a * - warn the user that this will change all of the patches with that color solid and split.
//      To patch is a split patch with a * - warn the user that all of the solid blocks will be changed but none of the split blocks.(asterix not necessary)
//      To patch contains more than one patch - warn the user that to is not formatted properly and do nothing

// Condition two - From patch has an *
//      warn the user that the from patch is formatted incorrectly and do nothing.

// Condition three - From patch is a split patch.
//      To patch is a single letter - remind user that this will only change the split blocks to a solid.
//      To patch is a split patch - remind user that this will replace the split blocks with a split block.
//      To patch is a single letter with a *  - remind user that this will only change the split blocks to a solid. (asterix not necessary)
//      To patch is a split patch with a * - this will replace all the split blocks with split blocks (asterix not necessary).
//      To patch contains more than one patch - warn the user that to is not formatted properly.

// Condition four - From patch has more than one patch.
//      warn the user that there is a different format for changing more than one block at a time.
//      work on the multi replacement rules.

function applyReplacement() {
  errorMessages.value('');
  // Get the text that is currently displayed in the inputBlocks text area.
  file_txt = inputBlocks.value();
  updateViaText();
  //Get the text from the rule1From text area
  var From = rule1From.value();
  //Get the text from the rule1To text area
  var To = rule1To.value();
  //Strip off any whitespace or newlines
  From = From.replace(/\s\n/g, '');
  To = To.replace(/\s\n/g, '');

  //*******Replace this with the blocks validation function eventually TEST HERE TO SEE IF THE BLOCKS BOX IS FORMATTED CORRECTLY
  if (file_txt == '') {
      errorMessages.value('');
      errorMessages.value("Please click the submit button to rebuild your quilt and try again.");
      updateTextBoxes();
  }
  //*******Replace above with Blocks validation function eventually*******//

  //If the ruleFrom and ruleTo text areas are empty warn the user then drop out of this function
  if (areToAndFromEmpty(From, To)) {
        //areToAndFromEmpty returns if true, then skips over the next else and drops out of the function.
  }//end else if to is empty
  //Otherwise validate the form of the text boxes and if the format is off
  //warn the user.
	else {
    // From and to are not empty - check if they have brackets. Remove them if they do and warn
    // the user if they are not present.
    From = removeBracketsFromString(rule1From.value());
    To = removeBracketsFromString(rule1To.value());
    //now that you have removed the brackets check if From and To are empty
    if (areToAndFromEmpty(From, To)) {
      //areToAndFromEmpty returns if true, then skips over the next else and drops out of the function.
    }//end else if to is empty
    //If to and from are not empty then check to see if the replacement is from single to multiple
    else {
      if(isColorInPalette(From, To)){
        print("Your to and from colors are in the palette");
      }else{
        errorMessages.value("");
        errorMessages.value("One of your colors is not in the palette and may cause unexpected results.");
      }

      // If they are then use a local temporary value to hold the text from the block text box area.
      var trimmedTXT = file_txt.replace(/\s/g, '');
      if((From.length == 1)&&(To.length > 1)){
        var blockHolder = trimmedTXT.match(patternBlock);
        trimmedTXT = [];
        for(var i = 0; i < blockHolder.length; i++){
          blockHolder[i] = blockHolder[i].split(',');
        }//end for
        for(var i = 0; i < blockHolder.length; i++){
          for ( var j = 0; j < blockHolder[i].length; j++){
            var fromFrontTemp = '[' + From;
            var fromBackTemp = From + ']';
            if( blockHolder[i][j] == fromFrontTemp ){
              blockHolder[i][j] = '[' + To;
            }
            if( blockHolder[i][j] == fromBackTemp ){
              blockHolder[i][j] = To + ']';
            }
            if( blockHolder[i][j] == From ){
              blockHolder[i][j] = To;
            }
          }//end for j
        }//end for i
        trimmedTXT = blockHolder;
  			inputBlocks.html(trimmedTXT);
  			var input_txt = '';
  			input_txt += inputPalette.value() + '\n';
  		  input_txt += inputBlocksWide.value() + 'x' + inputBlocksHigh.value() + '\n\n';
  			input_txt += trimmedTXT;
  			updateQuilt(input_txt);
      }//end if from is only one letter and to is more than one
      else{
        while (trimmedTXT.includes(From)) {
          trimmedTXT = trimmedTXT.replace(From, To);
  			}//end while
        trimmedTXT = trimmedTXT.replace(/\[/g, "\n[").trim();
  			inputBlocks.html(trimmedTXT);
  			var input_txt = '';
  			input_txt += inputPalette.value() + '\n';
  		  input_txt += inputBlocksWide.value() + 'x' + inputBlocksHigh.value() + '\n\n';
  			input_txt += trimmedTXT;
  			updateQuilt(input_txt);
      }//end else
    }//end else
	}//end else
}//end applyReplacement

//Following function removes the exclamation mark from the string
function removeBracketsFromString(str) {
	var workingString = str.replace(/\s/g, '');
	if (!/(\[(([a-zA-Z_][\/\\|-][a-zA-Z_])|[a-zA-Z_])\])/.test(workingString)){
    errorMessages.value("Your patches must be formatted with square brackets");
    return '';
  }
	else {
        workingString = workingString.replace(/\s/, '').replace(/\[*/g, '').replace(/\]*/g, '');
        return workingString;
      }
}

// If I type the following into the text box [G/*] I need an alert that the text box isn't formatted properly. If you replace the character improperly twice
// you crash hard and get the wrong alerts.
// If the user tries to use a letter in the blocks text box that is not in the palette, I want an alert that tells me what I did and then resets
// the text box back if the user selects cancel.
// when the strb is empty return the empty string.
function isBlocksEmpty(stringBlock){
    if (!stringBlock)
        return true;
    else
        return false;
}

function validateRuleBLOCKS(strb) {
	var workingStringb = strb.replace(/\s/g, '');
    var neWworkingString = workingStringb;
    var temp = /(\[([a-zA-z*]([\\/|-][a-zA-Z*])?)(,\s*[a-zA-z*]([\\/|-][a-zA-Z*])?)*\])+/;
    //if (/(\[([a-zA-z*]([\\/|-][a-zA-Z*])?)(,\s*[a-zA-z*]([\\/|-][a-zA-Z*])?)*\])+/.workingStringb){
      //  alert("does not match");
        //updateTextBoxes();
    //}
    //for ();
    //temp[];
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
	if (!/(\[([a-zA-z*]([\\/|-][a-zA-Z*])?)(,\s*[a-zA-z*]([\\/|-][a-zA-Z*])?)*\])+/.test(workingStringb)) {
        errorMessages.value("Blocks text box is not in the proper format");
        //updateTextBoxes();
        return '';
  }
	else
        return workingStringb;
}

//check if the to and from boxes are empty pass in values from and to
function areToAndFromEmpty(frm, t){
  //If the ruleFrom and ruleTo text areas are empty warn the user then drop out of this function
  if (frm == '' && t == '') {
    errorMessages.value("Both parts of the rule are formatted incorrectly");
    return true;
  }//end if replacement text boxes are empty
  //Otherwise if From text box is empty warn the user and drop out of function
	else if (frm == ''){
    errorMessages.value("Before rule is formatted incorrectly" + "\n" + "Is it empty or missing [ or ]?" );
    return true;
  }//end else if from is empty
  //Otherwise if the To box is empty warn the user and drop out of function
	else if (t == ''){
    errorMessages.value("After rule is formatted incorrectly");
    return true;
  }//end else if to is empty
  else{
    return false;
  }
}
function fromPermutations (frm, t){
  //test if from has a star
  doesYourStrHaveWildCrd(frm);
  //test if from is a single letter.
  //test if from is a seamed patch.
  //test if from has more than one patch
}//
function doesYourStrHaveWildCrd(strW){
  if(/([*])+/.test(strW)){
    errorMessages.value("Your string has a *") ;
    return true;
  }
  else{
    return false;
  }
}

function yourPatchIsEmpty(ptch){
  if(ptch.length<1){
    return true;
  }
  else{
    return false;
  }
}

//function checks to see if the string contains proper palette colors
function isColorInPalette(strF, strT){
  errorMessages.value("");
  let tempStrF = strF.match(/[a-z_]/gi);
  let tempStrT = strT.match(/[a-z_]/gi);
  let tempPalette = [];
  let testStr = true;
  for(let j = 0; j< palette.length; j++){
    tempPalette[j] = palette[j][0];
  }
  for(let i = 0; i <tempStrF.length; i++ ){
    if(tempPalette.includes(tempStrF[i])){
      // Do not set test string to true here as it may be the last letter that is checked.
      // if the state machine is ever set to false that is what we need to know.
      // print("The color is in the palette");
    }
    else {
      testStr = false;
        //print("One of the colors is not in the palette");
    }
  }
  for(let k = 0; k <tempStrT.length; k++ ){
    if(tempPalette.includes(tempStrT[k])){
      // Do not set test string to true here as it may be the last letter that is checked.
      // if the state machine is ever set to false that is what we need to know.
      // print("The color is in the palette");
    }
    else {
      testStr = false;
        //print("One of the colors is not in the palette");
    }
  }
  return testStr;
}
