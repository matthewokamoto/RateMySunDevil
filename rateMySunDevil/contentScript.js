$(document).ready(function(){
	$("body").append("<div id='ratingDiv'><table id='tblRating'><tr><td colspan='2' style='border-bottom: thin solid black'><strong>RateMySunDevil</strong></td></tr><tr><td colspan='2'><strong><a id='lnkRmp' href='' target='_blank'><span id='professorName'></span></a></strong></td></tr><tr><td style='text-align:right; width:40px'>Overall:</td><td><strong><span id='overall'></span></strong></td></tr><tr><td style='text-align:right; width:40px'>Helpfulness:</td><td><strong><span id='helpfulness'></span></strong></td></tr><tr><td style='text-align:right; width:40px'>Clarity:</td><td><strong><span id='clarity'></span></strong></td></tr><tr><td style='text-align:right; width:40px'>Easiness:</td><td><strong><span id='easiness'></span></strong></td></tr><tr><td colspan='2'><span id='numberOfRatings'></span></td></tr><tr><td colspan='2'><button id='btnHide'>Hide</button></td></tr></table></div>");
	
	//Hide div on hidebtn click
	$('#btnHide').click(function() {
		$('#ratingDiv').animate({right: '-120px'}, 300, function(){});
	});
	
	//$('#ratingDiv').click(function (e) {
    //    $(this).hide();
    //    $(document.elementFromPoint(e.clientX, e.clientY)).trigger('click');
    //    $(this).show();
	//});
	
	//var count = $('td.instructorListColumnValue').size();
	//alert(count);
});

$('td.instructorListColumnValue span span span span a span').mouseenter(function(){
	//Get FIRST name of professor
	//Get href from closest a link
	var href = $(this).closest('a').attr('href').toString();
	var startFirstName = (SecondLastIndexOf('&sp=S',href)+5);
	var endFirstName = href.lastIndexOf('&sp=S');
	//Set first name as variable
	var professorFirstName = href.substring(startFirstName, endFirstName);
	professorFirstName = professorFirstName.trim();
	
	//Get LAST name from inner html of span tag
	var professorLastName = $(this).html();
	//Set last name as variable
	professorLastName = professorLastName.trim();
	if (professorLastName.indexOf(",") != -1) {
		professorLastName = professorLastName.substring(0, professorLastName.length -1);
	}
	
	//Set full name of professor to send to event page
	professor = professorLastName.toLowerCase() + ", " + professorFirstName.toLowerCase();
	
	//Set searchUrl variable to send
	searchUrl = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=arizona+state+university&queryoption=HEADER&query=" + professorLastName + "&facetSearch=true.html",
	
	//Send the message
	chrome.runtime.sendMessage({rmpUrl: searchUrl, prof: professor, pfn: professorFirstName, pln: professorLastName}, function(response) {
	});
	
	//Create listener for messages received from event page
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		//Set innerhtml of spans in static div
		if(request.succeed){
			$('#professorName').html(request.pfn + " " + request.pln);
			$('#overall').html(request.overall);
			$('#helpfulness').html(request.helpfulness);
			$('#clarity').html(request.clarity);
			$('#easiness').html(request.easiness);
			$('#numberOfRatings').html(request.numberOfRatings);
			$('#lnkRmp').attr('href', request.profUrl);
			$('#ratingDiv').animate({right: '-10px'}, 300, function(){});
		} else {
			$('#ratingDiv').animate({right: '-120px'}, 300, function(){});
		}
	});
	
});

//Find second to last index of to search for name params in href
 function SecondLastIndexOf(Val, Str) {  
   var Fst = Str.lastIndexOf(Val);  
   var Snd = Str.lastIndexOf(Val, Fst-1)  
   return Snd  
 } 
 






