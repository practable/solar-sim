var inactivityTime = function () {
    var t;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
	document.onload = resetTimer;
	document.onmousemove = resetTimer;
	document.onmousedown = resetTimer; // touchscreen presses
	document.ontouchstart = resetTimer;
	document.onclick = resetTimer;     // touchpad clicks
	document.onscroll = resetTimer;    // scrolling with arrow keys


    function logout() {
        alert("Rendering paused due to inactivity")
		doRender = false;
        //location.href = 'logout.php'
    }

    function resetTimer() {
        clearTimeout(t);
		doRender = true;
        t = setTimeout(logout, 180000) //3 mins
        // 1000 milisec = 1 sec
    }
};


$( document ).ready(function() {

	var foo = new inactivityTime;
});