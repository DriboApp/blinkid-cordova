/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        var resultDiv = document.getElementById('resultDiv');

        var successfulImageDiv = document.getElementById('successfulImageDiv');
        var successfulImage = document.getElementById('successfulImage');

        var documentFrontImageDiv = document.getElementById('documentFrontImageDiv');
        var documentFrontImage = document.getElementById('documentFrontImage');

        var documentBackImageDiv = document.getElementById('documentBackImageDiv');
        var documentBackImage = document.getElementById('documentBackImage');

        var faceImageDiv = document.getElementById('faceImageDiv');
        var faceImage = document.getElementById('faceImage');

        successfulImageDiv.style.visibility = "hidden";
        documentFrontImageDiv.style.visibility = "hidden";
        documentBackImageDiv.style.visibility = "hidden";
        faceImageDiv.style.visibility = "hidden";

        // to scan any machine readable travel document (passports, visa's and IDs with 
        // machine readable zone), use MrtdRecognizer
//        var mrtdRecognizer = new cordova.plugins.BlinkID.MrtdRecognizer();
//        mrtdRecognizer.returnFullDocumentImage = true;
        // wrap recognizer with SuccessFrameGrabberRecognizer to obtain camera frame from the successful scan
//        var mrtdSuccessFrameGrabber = new cordova.plugins.BlinkID.SuccessFrameGrabberRecognizer(mrtdRecognizer);

        // BlinkIDCombinedRecognizer automatically classifies different document types and scans the data from
        // the supported document
        var blinkIdCombinedRecognizer = new cordova.plugins.BlinkID.BlinkIdCombinedRecognizer();
        blinkIdCombinedRecognizer.returnFullDocumentImage = true;
        blinkIdCombinedRecognizer.returnFaceImage = true;

        // there are lots of Recognizer objects in BlinkID - check blinkIdScanner.js for full reference

        var blinkidOverlaySettings = new cordova.plugins.BlinkID.BlinkIdOverlaySettings();

        // create RecognizerCollection from any number of recognizers that should perform recognition
        var recognizerCollection = new cordova.plugins.BlinkID.RecognizerCollection([blinkIdCombinedRecognizer /*, mrtdSuccessFrameGrabber */]);

        // package name/bundleID com.microblink.sample
        var licenseKeys = {
            android: 'sRwAAAAVY29tLm1pY3JvYmxpbmsuc2FtcGxlU9kJdZhZkGlTu9U3ORtDZCu0vFoxWJyF0dnv88NTiJO9pmEXPFZB9pVlO146QMSXVLAnYzACtQkatIeij7DU7ncIxLPulqRre/pOorG7HaWypuPGrotFAut0fJMJSckpf7QQC5N/97MV4Mdjk/JA6zeC83V0JqSEIMBisJRSeL4H1BqrcrDqhZpMjddPQQ+e8XVAmL2WxPsTubyqQDFvU6VSGE2nVIxbsXfpKApGRPSD7d+m46zsK6X86hMuMIu9sdtABD0AS0Bzm8HpaJZWkP51L6Ag9Dor9Iqluw0RTm+WgsQzycLBJ80iJwxryFiKOWtiPlvxQPAqn16CDT7J6h/z',
            ios: 'sRwAAAEVY29tLm1pY3JvYmxpbmsuc2FtcGxl1BIcP4FpSuS/38JVOWaLMUMW+4CSRlPH5nVsy5f+xFjYutJX80GcvEyclw+SM7cjBwSazdaGilBWPcwulKICq141a1XBnYLt5nSyhDrP+PNnId8bqFT1ic1A71TubT8iroMgkbLhW7lnjNgPDyuw/2aqsS8U/pkkk8YgekN0IZm5M/0q1CSLtAehIswt5CoFtYcG1DIuGnaTvVNoRGUu7+HaVXAmxGFENiITmrOpLXFSJXFRdyBQHd3rfLgBDzIEPvTIGoGVD0ZUFFziRMkk+om4QIQE8bYHx0L8WFNbkXf5WMw2hlf3cUJmDOI04Xx1FYrTYKlbam6Q+5OsEHXjTIt5'
        };

        function buildResult(result, key) {
            if (result && result != -1) {
                return key + ": " + result + "<br>";
            }
            return ""
        }

        function buildDateResult(result, key) {
            if (result) {
                return key + ": " +
                    result.day + "." + result.month + "." + result.year + "."
                    + "<br>";
            }
            return ""
        }

        scanButton.addEventListener('click', function() {
            cordova.plugins.BlinkID.scanWithCamera(

                // Register the callback handler
                function callback(cancelled) {

                    resultDiv.innerHTML = "";

                    successfulImageDiv.style.visibility = "hidden";
                    documentFrontImageDiv.style.visibility = "hidden";
                    documentBackImageDiv.style.visibility = "hidden";
                    faceImageDiv.style.visibility = "hidden";

                    // handle cancelled scanning
                    if (cancelled) {
                        resultDiv.innerHTML = "Cancelled!";
                        return;
                    }

                    // if not cancelled, every recognizer will have its result property updated

                    if (blinkIdCombinedRecognizer.result.resultState == cordova.plugins.BlinkID.RecognizerResultState.valid) {

                        var blinkIdResult = blinkIdCombinedRecognizer.result;
                        var resultString =
                            buildResult(blinkIdResult.firstName, "First name") +
                            buildResult(blinkIdResult.lastName, "Last name") +
                            buildResult(blinkIdResult.fullName, "Full name") +
                            buildResult(blinkIdResult.localizedName, "Localized name") +
                            buildResult(blinkIdResult.additionalNameInformation, "Additional name info") +
                            buildResult(blinkIdResult.address, "Address") +
                            buildResult(blinkIdResult.additionalAddressInformation, "Additional address info") +
                            buildResult(blinkIdResult.documentNumber, "Document number") +
                            buildResult(blinkIdResult.documentAdditionalNumber, "Additional document number") +
                            buildResult(blinkIdResult.sex, "Sex") +
                            buildResult(blinkIdResult.issuingAuthority, "Issuing authority") +
                            buildResult(blinkIdResult.nationality, "Nationality") +
                            buildDateResult(blinkIdResult.dateOfBirth, "Date of birth") +
                            buildResult(blinkIdResult.age, "Age") +
                            buildDateResult(blinkIdResult.dateOfIssue, "Date of issue") +
                            buildDateResult(blinkIdResult.dateOfExpiry, "Date of expiry") +
                            buildResult(blinkIdResult.dateOfExpiryPermanent, "Date of expiry permanent") +
                            buildResult(blinkIdResult.expired, "Expired") +
                            buildResult(blinkIdResult.maritalStatus, "Martial status") +
                            buildResult(blinkIdResult.personalIdNumber, "Personal id number") +
                            buildResult(blinkIdResult.profession, "Profession") +
                            buildResult(blinkIdResult.race, "Race") +
                            buildResult(blinkIdResult.religion, "Religion") +
                            buildResult(blinkIdResult.residentialStatus, "Residential status") +
                            buildResult(blinkIdResult.processingStatus, "Processing status") +
                            buildResult(blinkIdResult.recognitionMode, "Recognition mode")
                            ;

                        var licenceInfo = blinkIdResult.driverLicenseDetailedInfo;
                        if (licenceInfo) {
                            resultString +=
                                buildResult(licenceInfo.restrictions, "Restrictions") +
                                buildResult(licenceInfo.endorsements, "Endorsements") +
                                buildResult(licenceInfo.vehicleClass, "Vehicle class") +
                                buildResult(licenceInfo.conditions, "Conditions");
                        }

                        // there are other fields to extract - check blinkIdScanner.js for full reference
                        resultDiv.innerHTML = resultString;

                        var resultDocumentFrontImage = blinkIdCombinedRecognizer.result.fullDocumentFrontImage;
                        if (resultDocumentFrontImage) {
                            documentFrontImage.src = "data:image/jpg;base64, " + resultDocumentFrontImage;
                            documentFrontImageDiv.style.visibility = "visible";
                        }
                        var resultDocumentBackImage = blinkIdCombinedRecognizer.result.fullDocumentBackImage;
                        if (resultDocumentBackImage) {
                            documentBackImage.src = "data:image/jpg;base64, " + resultDocumentBackImage;
                            documentBackImageDiv.style.visibility = "visible";
                        }
                        var resultFaceImage = blinkIdCombinedRecognizer.result.faceImage;
                        if (resultFaceImage) {
                            faceImage.src = "data:image/jpg;base64, " + resultFaceImage;
                            faceImageDiv.style.visibility = "visible";
                        }
                    } else {
                        resultDiv.innerHTML = "Result is empty!";
                    }
                },

                // Register the error callback
                function errorHandler(err) {
                    alert('Error: ' + err);
                },

                blinkidOverlaySettings, recognizerCollection, licenseKeys
            );
        });

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }

};
