// Archive a file in a .ZIP, encrypt it, generate a password, and send it on discord.
// Steps:
//        1. Generate a file to archive
//        2. Generate a password
//        3. Generate the .zip 
//        4. Send the password in the text channel, and DM the encrypted folder
//           (File security best practice is to send the encrypted folder and password in two different locations. Ideally, both routes are private.)
//           (Therefore, this code is not appropriate for highly sensitive information transfers)



const BaseCommand = require('../../utils/structures/BaseCommand');
const fs = require('fs');
var archiver = require('archiver');
const { MessageEmbed } = require('discord.js');
archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"));

module.exports = class GameunbanCommand extends BaseCommand {
    constructor() {
      super('archive', 'category', []);
    }

async run(client, message, args) {

    fs.writeFile('./newfile.txt', `This is the encrypted message we're going to send. You could of course copy the contents from a different file.`, (err) => { // Appending some text and copying
        if (err) console.log(err);
        })

    let password = makeid(5); // Calling our password generation function from below
    var output = fs.createWriteStream('EncryptedZip.zip'); // Initializing Archiver
    let archive = archiver.create('zip-encrypted', {zlib: {level: 8}, encryptionMethod: 'zip20', password: `${password}`}); // We generate the encrypted Zip

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    archive.on('error', function(err){
        throw err;
    });
    archive.pipe(output);


    var file1 = './newfile.txt'; // The file to encrypt from before 
    archive
    .append(fs.createReadStream(file1), {name: 'newfile.txt'})
    .finalize(); // Archive the file


    message.reply("\n `" + `${password}` + "`"); // Reply to the author of the command with our password
    setTimeout(function(){
        message.author.send('Attached is an encrypted file.\n You will be prompted to enter a password when you try to open the .txt file inside. \n The password was supplied to you ', {files: ['./EncryptedZip.zip']});
    }, 2500); // We DM the author of the command with the encrypted archive

    setTimeout(function(){
        fs.unlinkSync('./banlist.txt');
        fs.unlinkSync('./EncryptedZip.zip');
    }, 5000); // We then delete the temp .txt file and encrypted archive off the machine

    // Function to generate random password
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
    }
}

