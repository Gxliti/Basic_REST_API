const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let patients = new Object();
patients["999991234"] = ["Jensen", "Watkins", "453-666-1234"];
patients["999993455"] = ["Patrick", "John", "453-666-5678"];

let records = new Object();
records["999991234"] = "Status: Healthy";
records["999993455"] = "Status: Sick";


// Get patient medical records
app.get("/records", (req,res) => {
    

    // Verify patient exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return;
    }

    // Verify SSN matches First and Last Name
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
        if (req.body.reasonforvisit === "medicalrecords") {
            res.status(200).send(records[req.headers.ssn])
            return;
        }
        else {
            res.status(502).send({"msg":"Unable to complete request at this time: " + req.body.reasonforvisit})
            return;
        }
    }
    else {
        res.status(401).send({"msg":"First or Last Name do not match SSN"});
        return;
    }

    // Return correct record
    res.status(200).send({"msg": "HTTP GET - SUCCESS!" });
});

// Create a new patient
app.post("/", (req,res) => {
    
    // Create patient in database
    patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.headers.phone]

    res.status(200).send(patients);
});

// Update existing patient phone number
app.put("/", (req,res) => {

    //Verify Patient Exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return;
    };

    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
       // Update the Phone number and return the patient info
       patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.body.phonenumber];
       res.status(200).send(patients[req.headers.ssn]);
       return;


    }
    else {
        res.status(401).send({"msg":"First or Last Name do not match SSN. (Trying to update Phone number)"});
        return;
    }

    res.status(200).send({"msg": "HTTP PUT - SUCCESS!" })
});


// Delete patient records
app.delete("/", (req,res) => {

    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg":"Patient not found"})
        return;
    }

    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
       // Delete patient and medical records from database

        delete patients[req.headers.ssn]
        delete records[req.headers.ssn]

        res.status(200).send({"msg":"Successfully deleted!"})
        return;

    }
    else {
        res.status(401).send({"msg":"First or Last Name do not match SSN. (Trying to delete patient)"});
        return;
    }
    res.status(200).send({"msg": "HTTP DELETE - SUCCESS!" })
});


app.listen(3000);