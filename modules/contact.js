var org = require('./auth').org,

    CONTACT_TOKEN = process.env.CONTACT_TOKEN;

function execute(req, res) {

    if (req.body.token != CONTACT_TOKEN) {
        res.send("Invalid token");
        return;
    }

    var q = "SELECT Id, Name, All_Phone_Numbers__c, Phone, MobilePhone, Email FROM Contact WHERE Name LIKE '%" + req.body.text + "%' LIMIT 5";
    org.query({query: q}, function(err, resp) {
        if (err) {
            console.error(err);
            res.send("An error as occurred");
            return;
        }
        if (resp.records && resp.records.length>0) {
            var contacts = resp.records;
            var attachments = [];
            contacts.forEach(function(contact) {
                var fields = [];
                fields.push({title: "Name", value: contact.get("Name"), short:true});
                fields.push({title: "Phone", value: contact.get("Phone"), short:true});
                fields.push({title: "Email", value: contact.get("Email"), short:true});
                attachments.push({color: "#009cdb", fields: fields});
            });
            res.json({text: "Contacts matching '" + req.body.text + "':", attachments: attachments});
        } else {
            res.send("No records");
        }
    });
}

exports.execute = execute;
