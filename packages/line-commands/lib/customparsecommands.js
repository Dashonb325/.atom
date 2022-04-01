'use babel';
//
// Matthew Guidry 2018
// parser to sperate command from arguments
//

export default class CustomParseCommands {
  constructor(commandString) {
    this.commandList = commandString.split(" ");
    this.command = this.commandList[0];
    this.args = this.commandList.slice(1,this.commandList.length)
    console.log(this.args)
  }

  serialize() {}

  getCommand() {
    return this.command
  }

  getArgList() {
    return this.args
  }
}
