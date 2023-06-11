let {PythonShell} = require('python-shell');
const nodeMailer = require('nodemailer');
const dfd = require('danfojs-node');

async function doPrediction() {

    return new Promise((resolve, reject) =>{
        resolve(
            PythonShell.run('./lstm.py', null, function (err, res) {
            let list = [];
            let data = res.slice(-30, -1);
            data = data.map((item) => {
                item = item.slice(2, -1);
                list.push(item);
            });
            list.push(res.slice(-1)[0].slice(2, -2));
            
            let df = new dfd.Series(list);
            
            let htmlTable = '<table style="border-collapse: collapse; border: 1px solid black;">';
            htmlTable += '<tr style="border: 1px solid black;"><th style="border: 1px solid black;">Day(T)</th><th style="border: 1px solid black;">Predicted Price</th></tr>';
            
            df.values.forEach((value, index) => {
              htmlTable += `<tr style="border: 1px solid black;"><td>T+${index+1}</td><td style="border: 1px solid black;">${value}</td></tr>`;
            });
            
            htmlTable += '</table>';
            sendMail(htmlTable);
        }));
        reject("Error");
    });

     
};
    

async function sendMail(htmlTable) {

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'theo.flutter@gmail.com',
            pass: 'lgwgtsnzsljahfyr',
        },
    });

    transporter.sendMail({
        from: 'theo.flutter@gmail.com',
        to: ['theolpy@gmail.com', 'cathylilingwai@gmail.com'],
        subject: '0388',
        html: htmlTable,});

    console.log("Message sent");
}

doPrediction();
// doPrediction().then((message) => {
//     sendMail(message);
// });
