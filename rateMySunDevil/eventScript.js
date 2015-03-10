chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
		//Create xmlhttprequest
		xhr = new XMLHttpRequest();
		
		//Open request with search parms
		xhr.open("GET", request.rmpUrl, true);
		
		//When the DOM loads do this
		xhr.onreadystatechange = function() {
			//If it is complete and ready do this
			if (xhr.readyState==4 && xhr.status==200){
			
				//Get html from requested page
				var parsed  = xhr.responseText;
				sendResponse({overall: "23"});
				//Create "floating" div with innerhtml being the response
				var div = document.createElement('div');
				div.innerHTML = parsed;
				
				//Find all instances of class 'main', it is where rmp keeps the names
				var a = $(div).find(".main");
				
				//How the data is grabbed
				//alert(a[0].innerHTML.trim().toLowerCase());
				//Declare next link to go to
				var href = null;
				
				//Loop through all names retrieved from class 'main'
				for (var i = 0; i < a.length; i++) {
					//If the name in class 'main' is the same as the name searched do this
					if (a[i].innerHTML.trim().toLowerCase() == request.prof) {
						//Get closest a:link because it references the professors main page and append to domain
						href = "http://www.ratemyprofessors.com" + $(a[i]).closest('a').attr('href').toString();
						//Use first one found
						break;
					}
				}
				
				//If href was defined in previos loop do this
				if (href != null) {
					//Create another xmlhttprequest, with the new address
					xhr = new XMLHttpRequest();
					xhr.open("GET", href, true);
					
					//When it is ready do this
					xhr.onreadystatechange = function() {
						if (xhr.readyState==4 && xhr.status==200){
							//Get responseText from professor main page
							var parsed  = xhr.responseText;
							
							//Create another "floating" div and add its innerHTML
							var div = document.createElement('div');
							div.innerHTML = parsed;
							
							//Find the first div with class grade,  store in var
							var b = $(div).find(".grade:first");
							var vOverall = b[0].innerHTML;
							
							//Select the first 3 divs with class rating, store in vars
							var b = $(div).find(".rating:lt(3)");
							var vHelpfulness = b[0].innerHTML;
							var vClarity = b[1].innerHTML;
							var vEasiness = b[2].innerHTML;
							
							//Find the first div with class table-toggle, store in var
							var b = $(div).find(".table-toggle");
							var vNumberOfRatings = (b[0].innerHTML).trim();
							chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
								chrome.tabs.sendMessage(tabs[0].id, {succeed: true, overall: vOverall, helpfulness: vHelpfulness, clarity: vClarity, easiness: vEasiness, numberOfRatings: vNumberOfRatings, profUrl: href, pfn: request.pfn, pln: request.pln}, function(response) {
								});
							});
						}
					}
					xhr.send();
				}
			}
		};
		xhr.send();
		//Send the response with the values grabbed
		if (vOverall != null && vOverall != "") {
			sendResponse({overall: vOverall, helpfulness: vHelpfulness, clarity: vClarity, easiness: vEasiness, numberOfRatings: vNumberOfRatings});
		};
  });
  