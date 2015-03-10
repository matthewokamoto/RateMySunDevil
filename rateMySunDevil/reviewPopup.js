$(document).ready(function(){
	$('#btnSearch').click(function(){
		var search = $('#txtSearchName').val();
		var searchUrl = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=arizona+state+university&queryoption=HEADER&query=" + search + "&facetSearch=true.html";
		chrome.tabs.create({url: searchUrl});
		return false;
	});
});
