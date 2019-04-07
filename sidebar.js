/**
 * Script to create sidebar and its functionality
 * Created by: Alec Metcalfe
 */
$(document).ready(function () {
    var page = window.location.pathname;
    page = page.substring(page.lastIndexOf('/') + 1);

    document.getElementById("sidebar").innerHTML = `
        <div id="dismiss">
            <i class="fas fa-arrow-left"></i>
        </div>

        <div class="sidebar-header">
            <img src="sarahs_mix_no_background.png" class="col">
        </div>

        <ul class="list-unstyled components" id="links">
    `;

    if(page == "index.html") {
        document.getElementById("links").innerHTML += `
            <li class="active">
                <a href="index.html">Home</a>
            </li>
        `;
    } else
    {
        document.getElementById("links").innerHTML += `
            <li>
                <a href="index.html">Home</a>
            </li>
        `;
    }

    if(page == "api.html") {
        document.getElementById("links").innerHTML += `
            <li class="active">
                <a href="api.html">Get Raw Data</a>
            </li>
        `;
    } else
    {
        document.getElementById("links").innerHTML += `
            <li>
                <a href="api.html">Get Raw Data</a>
            </li>
        `;
    }

    if(page == "signup.html") {
        document.getElementById("links").innerHTML += `
            <li class="active">
                <a href="signup.html">Sign Up</a>
            </li>
        `;
    } else
    {
        document.getElementById("links").innerHTML += `
            <li>
                <a href="signup.html">Sign Up</a>
            </li>
        `;
    }

    if(page == "contact.html") {
        document.getElementById("links").innerHTML += `
            <li class="active">
                <a href="contact.html">Contact Us</a>
            </li>
        `;
    } else
    {
        document.getElementById("links").innerHTML += `
            <li>
                <a href="contact.html">Contact Us</a>
            </li>
        `;
    }

    if(page == "about.html") {
        document.getElementById("links").innerHTML += `
            <li class="active">
                <a href="about.html">About SNACKS</a>
            </li>
        `;
    } else
    {
        document.getElementById("links").innerHTML += `
            <li>
                <a href="about.html">About SNACKS</a>
            </li>
        `;
    }

    if(page == "prototype.html") {
        document.getElementById("links").innerHTML += `
            <li class="active">
                <a href="prototype.html">Prototype Device</a>
            </li>
        `;
    } else
    {
        document.getElementById("links").innerHTML += `
            <li>
                <a href="prototype.html">Prototype Device</a>
            </li>
        `;
    }
    
    /*
        Navbar
        Example code taken and modified from Bootstrapious
    */
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('.overlay').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});
