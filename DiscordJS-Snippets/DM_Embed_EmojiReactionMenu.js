//   Send a help menu RichEmbed in a DM with multiple pages        //
//   Allows the user to scroll through the pages with reactions    //
//                                                                 //
//   Typically this can be done in a channel with embed.edit       //
//     however, this requires Manage Messages permissions,         //
//     and because DM channels have no permissions, it             //
//     requires a workaround. The workaround is: delete            //
//     the last message sent, and send a new one.                  //
//                                                                 //
//     Trickier said than done without reusing                     //
//     reaction collectors...                                      //
//     Here is how that can be done.                               //
//                                                                 //
/////////////////////////////////////////////////////////////////////

'use-strict'
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class GuideCommand extends BaseCommand {
  constructor() {
    super('guide', 'DirectMessages', []);
  }

  async run(client, message, args) {

    let embedPage1 = new MessageEmbed()
    .setTitle('Page 1')

    let embedPage2 = new MessageEmbed()
    .setTitle('Page 2')

    let embedPage3 = new MessageEmbed()
    .setTitle('Page 3')

    let page = 1 // We need to track which page we're on, so first set it to 1

    let embedMsg1 = await message.author.send(embedPage1) // Send page 1
    reactListen(embedMsg1) // Initialize our reaction collector filter on it (see below)

        const reactListen = async function(msg){
            await msg.react('⬅️'); 
            await msg.react('🇽');         // First we react to the message
            await msg.react('➡️');

            const pageForward = (reaction, user) => {          // Then we create filters for the emojis
                return reaction.emoji.name === '➡️' && user.id === message.author.id;
              }
            const pageBack = (reaction, user) => {
                return reaction.emoji.name === '⬅️' && user.id === message.author.id;
            }
            const deleteEmbed = (reaction, user) => {
                return reaction.emoji.name === '🇽' && user.id === message.author.id;
            }

            const pageForwardCollector = msg.createReactionCollector(pageForward, { max: 1, time: 5 * 60 * 1000 }); // Then we initialize our reaction collectors using our filters
            const pageBackCollector = msg.createReactionCollector(pageBack, { max: 1, time: 5 * 60 * 1000 });
            const deleteEmbedCollector = msg.createReactionCollector(deleteEmbed, { max: 1, time: 5 * 60 * 1000 });
            
            pageForwardCollector.on('collect', (reaction, user) => { // Then we start our reaction collectors
                if (page === 3){ // We only have three pages, so do nothing if they try to advance past the third
                    return
                }

                else if(page === 2){ 
                    page = page+1 // Updating the value of our current page
                    msg.delete() // Delete the last embed and send the new one
                    message.author.send(embedPage3).then(embedMsg3 =>
                    reactListen(embedMsg3)) // Re-initialize our reaction collector for the newly sent embed
                }

                else if(page === 1){
                    page = page+1
                    msg.delete()
                    message.author.send(embedPage2).then(embedMsg2 =>
                    reactListen(embedMsg2))
                }
            })

            pageBackCollector.on('collect', (reaction, user) => { // We do the same things, but for the 'page back' reaction
                if (page === 1){
                  return
                }
                else if(page === 2){
                  page = page-1
                  msg.delete()
                  message.author.send(embedPage1).then(embedMsg1 =>
                  reactListen(embedMsg1))
                }
                else if(p === 3){
                  p = p-1
                  msg.delete()
                  message.author.send(embedPage2).then(embedMsg2 =>
                  reactListen(embedMsg2))
                }
              })

            del.on('collect', (reaction, user) => { // For the "delete" reaction, all we do is delete the message and cancel the process
                msg.delete()
                return
            })

        }
  }
}