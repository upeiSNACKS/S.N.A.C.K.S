/**
 * Script that creates modals
 * Created by: Alec Metcalfe
 */
$(document).ready(function () {
    document.getElementById("ModalHelp").innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h2 class="modal-title" id="ModalHelpTitle">Help</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    <h4>What is this website?</h4>
                    <p>This website is SNACKS(Sensor Network Around Charlottetown's Key Surrondings). Here you can view data such as temperature and humidity from sensors all around Charlottetown</p>
                    <p>Check out the <a href="about.html">about page</a> to learn more.</p>

                    <div class="line"></div>

                    <h4>How do I read the data?</h4>
                    <p>On the map there is a colored square divided into regions(Voronoi diagram). Each region is created so that every point within that region is closer to the sensor within that region than to a sensor in another region. Each region is color coded according to its value. You can click on a region to see more detailed data from that sensor. On the top right of the map there is a text field, if you click on the text field you can change the time range that is shown on the map.</p>
                    <p>To get raw data check out the <a href="api.html">API page</a>.</p>

                    <div class="line"></div>

                    <h4>How can I participate?</h4>
                    <p>Check out the <a href="signup.html">signup page</a> for details.</p>

                    <div class="line"></div>

                    <h4>Hotkeys</h4>
                    <ul>
                        <li>alt+h - Open menu containing help</li>
                        <li>alt+q - Open/Close sidebar</li>
                        <li>alt+t - Open the time picker on the map</li>
                    </ul>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;

    if(document.body.contains(document.getElementById("ModalTime"))) {
        document.getElementById("ModalTime").innerHTML = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                    <h2 class="modal-title" id="ModalTimeTitle">Query Editor</h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div class="modal-body">
                        <h4>Choose your time range</h4>
                        <input type="text" name="datetimes" id="timepicker"/>

                        <div class="line"></div>

                        <h4>Select Data Type</h4>
                        <ul>
                            <li><a href="#mapid" onclick="selectedMetric='Temperature'">Temperature</a></li>
                            <li><a href="#mapid" onclick="selectedMetric='Humidity'">Humidity</a></li>
                        </ul>

                        <div class="line"></div>

                        <h4>Selection Aggregation</h4>
                        <ul>
                            <li><a href="#mapid" onclick="selectedAggregate='Average'">Average</a></li>
                            <li><a href="#mapid" onclick="selectedAggregate='Maximum'">Maximum</a></li>
                            <li><a href="#mapid" onclick="selectedAggregate='Minimum'">Minimum</a></li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
    }
});