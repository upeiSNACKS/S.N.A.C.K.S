/**
 * Script that creates the navbar
 * Made by Alec Metcalfe
 */
$(document).ready(function () {
    var page = window.location.pathname;
    page = page.substring(page.lastIndexOf('/') + 1);
    
    // On the main page we want an extra button
    if(page == "index.html") {
        document.getElementById("nav").innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-primary">
                <div class="container-fluid">
                    <button type="button" id="sidebarCollapse" class="btn btn-info" accesskey="q">
                        <i class="fas fa-align-left"></i>
                        <span>Toggle Sidebar</span>
                    </button>

                    <button type="button" id="help" class="btn btn-info" data-toggle="modal" data-target="#ModalTime" accesskey="t">
                        <i class="fas fa-clock"></i>
                        <span>Time Range</span>
                    </button>

                    <button type="button" id="help" class="btn btn-info" data-toggle="modal" data-target="#ModalLong" accesskey="h">
                        <i class="fas fa-question"></i>
                        <span>Help</span>
                    </button>
                </div>
            </nav>
        `;
    } else
    {
        document.getElementById("nav").innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-primary">
                <div class="container-fluid">
                    <button type="button" id="sidebarCollapse" class="btn btn-info" accesskey="q">
                        <i class="fas fa-align-left"></i>
                        <span>Toggle Sidebar</span>
                    </button>
                    
                    <button type="button" id="help" class="btn btn-info" data-toggle="modal" data-target="#ModalLong" accesskey="h">
                        <i class="fas fa-question"></i>
                        <span>Help</span>
                    </button>
                </div>
            </nav>
        `;
    }
})